from __future__ import annotations

import asyncio
import random
import threading
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional

import httpx
from prometheus_client import Counter, Histogram

from app.core.request_context import request_id_var, traceparent_var
from app.core.resilience import CircuitBreaker, CircuitBreakerOpen


EXTERNAL_HTTP_REQUESTS_TOTAL = Counter(
    "external_http_requests_total",
    "Total external HTTP requests",
    ["name", "method", "status"],
)
EXTERNAL_HTTP_REQUEST_DURATION_SECONDS = Histogram(
    "external_http_request_duration_seconds",
    "External HTTP request duration in seconds",
    ["name", "method"],
)

EXTERNAL_HTTP_BREAKER_OPEN_TOTAL = Counter(
    "external_http_breaker_open_total",
    "Total times external circuit breaker rejected a request",
    ["name"],
)


@dataclass
class ResilientSyncClient:
    name: str
    retries: int = 1
    failure_threshold: int = 3
    reset_timeout_seconds: float = 30.0
    timeout_seconds: float = 10.0
    connect_timeout_seconds: float = 5.0
    transport: Optional[httpx.BaseTransport] = None
    client_kwargs: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        self._lock = threading.Lock()
        self._failures = 0
        self._opened_at: Optional[float] = None

    def _is_open(self) -> bool:
        if self._opened_at is None:
            return False
        return (time.time() - self._opened_at) < self.reset_timeout_seconds

    def request(
        self,
        method: str,
        url: str,
        *,
        headers: Optional[Dict[str, str]] = None,
        params: Optional[Dict[str, Any]] = None,
        json: Any = None,
        data: Any = None,
        retry_on_status: tuple[int, ...] = (429,),
    ) -> httpx.Response:
        with self._lock:
            if self._is_open():
                EXTERNAL_HTTP_BREAKER_OPEN_TOTAL.labels(name=self.name).inc()
                raise CircuitBreakerOpen(self.name)

        req_headers: Dict[str, str] = dict(headers or {})
        rid = request_id_var.get()
        if rid and "x-request-id" not in {k.lower(): v for k, v in req_headers.items()}:
            req_headers["x-request-id"] = rid

        tp = traceparent_var.get()
        if tp and "traceparent" not in {k.lower(): v for k, v in req_headers.items()}:
            req_headers["traceparent"] = tp

        timeout = httpx.Timeout(self.timeout_seconds, connect=self.connect_timeout_seconds)
        max_attempts = max(0, int(self.retries)) + 1
        last_exc: Optional[BaseException] = None

        opts = dict(self.client_kwargs or {})
        with httpx.Client(timeout=timeout, transport=self.transport, **opts) as client:
            for attempt in range(max_attempts):
                start = time.perf_counter()
                try:
                    response = client.request(
                        method,
                        url,
                        headers=req_headers,
                        params=params,
                        json=json,
                        data=data,
                    )

                    if response.status_code in retry_on_status or response.status_code >= 500:
                        raise httpx.HTTPStatusError(
                            f"{self.name} error status {response.status_code}",
                            request=response.request,
                            response=response,
                        )

                    response.raise_for_status()

                    duration = max(0.0, time.perf_counter() - start)
                    EXTERNAL_HTTP_REQUESTS_TOTAL.labels(
                        name=self.name, method=method.upper(), status=str(response.status_code)
                    ).inc()
                    EXTERNAL_HTTP_REQUEST_DURATION_SECONDS.labels(
                        name=self.name, method=method.upper()
                    ).observe(duration)

                    with self._lock:
                        self._failures = 0
                        self._opened_at = None
                    return response
                except CircuitBreakerOpen:
                    raise
                except Exception as e:
                    last_exc = e
                    EXTERNAL_HTTP_REQUESTS_TOTAL.labels(
                        name=self.name, method=method.upper(), status="error"
                    ).inc()

                    with self._lock:
                        self._failures += 1
                        if self._failures >= self.failure_threshold:
                            self._opened_at = time.time()

                    if attempt >= max_attempts - 1:
                        break

                    backoff = min(2.0 ** attempt, 8.0) + random.random() * 0.1
                    time.sleep(backoff)

        if last_exc:
            raise last_exc
        raise RuntimeError(f"{self.name} request failed")


@dataclass
class ResilientAsyncClient:
    name: str
    retries: int = 1
    failure_threshold: int = 3
    reset_timeout_seconds: float = 30.0
    timeout_seconds: float = 10.0
    connect_timeout_seconds: float = 5.0
    transport: Optional[httpx.AsyncBaseTransport] = None
    client_kwargs: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        self._breaker = CircuitBreaker(
            name=self.name,
            failure_threshold=self.failure_threshold,
            reset_timeout_seconds=self.reset_timeout_seconds,
        )

    async def request(
        self,
        method: str,
        url: str,
        *,
        headers: Optional[Dict[str, str]] = None,
        params: Optional[Dict[str, Any]] = None,
        json: Any = None,
        data: Any = None,
        retry_on_status: tuple[int, ...] = (429,),
    ) -> httpx.Response:
        if self._breaker.is_open:
            EXTERNAL_HTTP_BREAKER_OPEN_TOTAL.labels(name=self.name).inc()
            raise CircuitBreakerOpen(self.name)

        req_headers: Dict[str, str] = dict(headers or {})
        rid = request_id_var.get()
        if rid and "x-request-id" not in {k.lower(): v for k, v in req_headers.items()}:
            req_headers["x-request-id"] = rid

        tp = traceparent_var.get()
        if tp and "traceparent" not in {k.lower(): v for k, v in req_headers.items()}:
            req_headers["traceparent"] = tp

        timeout = httpx.Timeout(self.timeout_seconds, connect=self.connect_timeout_seconds)
        max_attempts = max(0, int(self.retries)) + 1
        last_exc: Optional[BaseException] = None

        opts = dict(self.client_kwargs or {})
        async with httpx.AsyncClient(timeout=timeout, transport=self.transport, **opts) as client:
            for attempt in range(max_attempts):
                try:
                    start = asyncio.get_event_loop().time()
                    async def op():
                        response = await client.request(
                            method,
                            url,
                            headers=req_headers,
                            params=params,
                            json=json,
                            data=data,
                        )

                        if response.status_code in retry_on_status or response.status_code >= 500:
                            raise httpx.HTTPStatusError(
                                f"{self.name} error status {response.status_code}",
                                request=response.request,
                                response=response,
                            )

                        response.raise_for_status()
                        return response

                    response = await self._breaker.call(op)
                    duration = max(0.0, asyncio.get_event_loop().time() - start)
                    EXTERNAL_HTTP_REQUESTS_TOTAL.labels(
                        name=self.name, method=method.upper(), status=str(response.status_code)
                    ).inc()
                    EXTERNAL_HTTP_REQUEST_DURATION_SECONDS.labels(
                        name=self.name, method=method.upper()
                    ).observe(duration)
                    return response
                except CircuitBreakerOpen:
                    EXTERNAL_HTTP_BREAKER_OPEN_TOTAL.labels(name=self.name).inc()
                    raise
                except Exception as e:
                    last_exc = e
                    EXTERNAL_HTTP_REQUESTS_TOTAL.labels(
                        name=self.name, method=method.upper(), status="error"
                    ).inc()
                    if attempt >= max_attempts - 1:
                        break

                    backoff = min(2.0 ** attempt, 8.0) + random.random() * 0.1
                    await asyncio.sleep(backoff)

        if last_exc:
            raise last_exc
        raise RuntimeError(f"{self.name} request failed")
