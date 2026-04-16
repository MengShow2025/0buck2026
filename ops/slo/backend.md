# Backend SLO（最小版）

## 范围

- API：`/api/v1/*`（不含前端静态资源）
- 指标来源：`/metrics`

## SLO

### 可用性

- 目标：过去 30 天，`/api/v1/*` 5xx 比例 < 0.5%

### 延迟

- 目标：过去 30 天，`p95` < 1.5s（`http_request_duration_seconds`）

### 外部依赖

- 目标：过去 30 天，外部依赖 `status="error"` 比例 < 2%
- 目标：熔断拒绝 `external_http_breaker_open_total` 在 5 分钟窗口内为 0（正常情况下）

## 烟囱压测（本地）

见 `backend/scripts/load_smoke_backend.py`，用于发布前快速检查：

- `/healthz` 可达
- `/metrics` 可达
- 输出请求耗时分位数

