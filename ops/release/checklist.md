# 发布检查清单（Backend）

## 0. 版本信息

- `APP_VERSION` 与 `GIT_SHA` 已注入环境变量
- `GET /api/v1/system/version` 返回环境与版本信息

## 1. 配置与密钥

- `ENVIRONMENT=production`
- `SECRET_KEY` 与 `MASTER_SECRET_KEY` 已配置（生产强制）
- `DATABASE_URL` / `REDIS_URL` 可连通
- `GEMINI_API_KEY` 已配置（或确认 BYOK 仅走前端）
- 外部依赖（Shopify/YunExpress 等）密钥已配置且不写入日志

## 2. 观测与告警

- `GET /metrics` 可抓取
- Prometheus 已加载告警规则 `ops/prometheus/0buck-alerts.yml`
- 外部依赖指标 `external_http_requests_total` / `external_http_breaker_open_total` 可观测

## 3. 回归验收（脚本）

- `ops/release/verify_release_gate.sh`（统一门禁：compileall + pytest 关键套件〔含 key APIs smoke / IM dedup / 结账安全〕+ frontend build）
- `backend/scripts/test_system_version_endpoint.py`
- `backend/scripts/test_api_not_found_status_code.py`
- `backend/scripts/test_external_breaker_metric.py`
- `backend/scripts/chaos_validate_metrics_and_alerts.py`
- `backend/scripts/validate_feature_flags_registry.py`
