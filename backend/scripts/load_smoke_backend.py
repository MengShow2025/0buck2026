import statistics
import time
import urllib.request


def _get(url: str, timeout: float = 5.0) -> float:
    start = time.perf_counter()
    with urllib.request.urlopen(url, timeout=timeout) as resp:
        resp.read(1)
        if resp.status >= 500:
            raise RuntimeError(f"5xx from {url}: {resp.status}")
    return (time.perf_counter() - start) * 1000.0


def main():
    base = "http://localhost:8000"
    urls = [f"{base}/healthz", f"{base}/metrics"]

    samples = []
    for i in range(50):
        for u in urls:
            ms = _get(u)
            samples.append(ms)
        time.sleep(0.02)

    p50 = statistics.quantiles(samples, n=100)[49]
    p95 = statistics.quantiles(samples, n=100)[94]
    p99 = statistics.quantiles(samples, n=100)[98]
    print(f"ok samples={len(samples)} p50_ms={p50:.1f} p95_ms={p95:.1f} p99_ms={p99:.1f}")


if __name__ == "__main__":
    main()

