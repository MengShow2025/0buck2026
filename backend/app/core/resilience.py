from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass
from typing import Awaitable, Callable, Optional, TypeVar


class CircuitBreakerOpen(RuntimeError):
    pass


T = TypeVar("T")


@dataclass
class _State:
    failures: int = 0
    opened_at: Optional[float] = None


class CircuitBreaker:
    def __init__(
        self,
        name: str,
        failure_threshold: int = 5,
        reset_timeout_seconds: float = 30.0,
    ):
        self.name = name
        self.failure_threshold = max(1, int(failure_threshold))
        self.reset_timeout_seconds = float(reset_timeout_seconds)
        self._state = _State()
        self._lock = asyncio.Lock()

    @property
    def is_open(self) -> bool:
        opened_at = self._state.opened_at
        if opened_at is None:
            return False
        return (time.time() - opened_at) < self.reset_timeout_seconds

    async def call(self, fn: Callable[[], Awaitable[T]]) -> T:
        async with self._lock:
            if self.is_open:
                raise CircuitBreakerOpen(self.name)

        try:
            result = await fn()
        except Exception:
            async with self._lock:
                self._state.failures += 1
                if self._state.failures >= self.failure_threshold:
                    self._state.opened_at = time.time()
            raise

        async with self._lock:
            self._state.failures = 0
            self._state.opened_at = None
        return result

