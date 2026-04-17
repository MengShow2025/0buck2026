import asyncio
import os
import re
import sys


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


def _get_counter_value(metrics_text: str, metric_name: str, labels: dict) -> float:
    label_parts = [f'{k}="{v}"' for k, v in sorted(labels.items())]
    matcher = re.compile(rf"^{re.escape(metric_name)}\{{{','.join(label_parts)}\}}\s+([0-9eE+\-.]+)$")
    for line in metrics_text.splitlines():
        m = matcher.match(line.strip())
        if m:
            return float(m.group(1))
    return 0.0


async def _trigger_external_breaker_open():
    import httpx

    from app.core.http_client import ResilientAsyncClient

    def handler(request: httpx.Request):
        return httpx.Response(500, json={"error": "boom"})

    transport = httpx.MockTransport(handler)
    client = ResilientAsyncClient(
        name="exa",
        retries=0,
        failure_threshold=1,
        reset_timeout_seconds=60.0,
        transport=transport,
    )

    try:
        await client.request("GET", "https://example.com/")
    except Exception:
        pass

    try:
        await client.request("GET", "https://example.com/")
    except Exception:
        pass


def main():
    from fastapi.testclient import TestClient

    from app.main import app

    client = TestClient(app)
    before = client.get("/metrics")
    assert before.status_code == 200
    before_text = before.text

    before_open = _get_counter_value(before_text, "external_http_breaker_open_total", {"name": "exa"})
    before_error = _get_counter_value(
        before_text,
        "external_http_requests_total",
        {"name": "exa", "method": "GET", "status": "error"},
    )

    asyncio.run(_trigger_external_breaker_open())

    after = client.get("/metrics")
    assert after.status_code == 200
    after_text = after.text

    after_open = _get_counter_value(after_text, "external_http_breaker_open_total", {"name": "exa"})
    after_error = _get_counter_value(
        after_text,
        "external_http_requests_total",
        {"name": "exa", "method": "GET", "status": "error"},
    )

    assert after_open >= before_open + 1, (before_open, after_open)
    assert after_error >= before_error + 1, (before_error, after_error)

    print(
        "ok | breaker_open_delta=%.0f | external_error_delta=%.0f (would trigger ExternalCircuitBreakerOpen / ExternalDependencyErrorBurst)"
        % (after_open - before_open, after_error - before_error)
    )


if __name__ == "__main__":
    main()

