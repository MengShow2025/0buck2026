# H. 运行时与依赖生产化（方案 A）设计

## 背景与目标

当前后端存在两类生产风险：

- Python 3.9 已 EOL，安全与依赖生态会持续恶化。
- 依赖未锁定 + 部分 GenAI SDK 处于 deprecated 路径，升级不可控。

本轮目标（DoD）：

- 运行时统一到 Python 3.11（Docker 与本地开发一致）。
- 依赖可复现（lock 文件可从 `.in` 生成）。
- 代码层面移除 `google.generativeai` 的直接使用，迁移到新 SDK（`google-genai`）。
- 有自动验收：禁止 deprecated import、版本与 lock 完整性校验、最小回归脚本集。

非目标（本轮不做）：

- 全面切换到 Poetry/uv 工具链。
- 一次性重构所有 AI/LLM 相关服务边界（只做必要迁移）。

## 变更范围

### 1) 运行时

- `backend/Dockerfile`：基础镜像升级到 `python:3.11-slim`（或等价 3.11 版本）。
- 增加 `.python-version`（固定 3.11.x，用于本地 pyenv/asdf 对齐）。
- 文档补充：如何在 CI/部署注入 `APP_VERSION`/`GIT_SHA` 与 Python 版本约束。

### 2) 依赖锁定（pip-tools）

- 引入 `pip-tools`。
- 新增 `backend/requirements.in`：只保留直接依赖（顶层依赖）。
- 由 `pip-compile` 生成 `backend/requirements.txt`（含 transitive 版本锁定与 hash 视情况启用）。
- 明确约束：生产/CI 安装必须使用锁定后的 `requirements.txt`。

策略：

- 先把现有 `requirements.txt` 反推为 `requirements.in`（只保留顶层，避免把 transitive 混进来）。
- 逐步收敛重复项（当前文件存在重复 `redis` 等）。

### 3) GenAI SDK 迁移（`google.generativeai` → `google-genai`）

目标：移除代码中 `import google.generativeai as genai`。

受影响文件（已定位）：

- `backend/app/services/reflection_service.py`
- `backend/app/services/butler_service.py`
- `backend/app/services/personalized_matrix_service.py`

迁移策略：

- 抽出一个极小的 `app/core/genai_client.py`（单一职责：创建 client + 发送生成请求）。
- 在上述 3 个 service 内改用该 client。
- 保持既有模型选择/降级策略语义不变（例如 reflection 的 flash→pro failover）。

约束：

- 不引入第二套“自己的 LLM 框架”。只提供薄封装，避免屎山。
- 不把 prompt/业务逻辑迁移出当前 service（本轮只替换 SDK 调用层）。

### 4) LangChain 兼容

当前仓库存在 `langchain_google_genai` 相关依赖与 deprecated warning。

策略：

- 依赖锁定时选择与 Python 3.11 兼容且不引入破坏性升级的版本。
- 若 `langchain_google_genai` 强依赖 deprecated SDK：
  - 优先升级到兼容新 Google SDK 的版本。
  - 若短期无法升级：仅在需要的模块内隔离使用，并确保我们核心服务不直接 import deprecated SDK。

## 验收与回归（TDD/脚本）

新增/调整脚本：

- `backend/scripts/validate_python_version.py`：确保运行时为 Python 3.11.x。
- `backend/scripts/validate_no_deprecated_genai_imports.py`：扫描 `app/` 禁止出现 `google.generativeai`。
- `backend/scripts/validate_requirements_locked.py`：确保 `requirements.txt` 是由 `requirements.in` 生成（例如包含 pip-compile header），并且无明显重复/空行异常。

回归集（已有）：

- `python3 -m compileall -q app`
- 现有验收脚本：外部依赖降级、鉴权守门、Celery 指标等。

## 风险与回滚

- 风险：Python 3.11 升级带来依赖版本变化（尤其是 `langchain_*`、`google-*`）。
- 回滚：
  - Dockerfile 可回退到旧镜像。
  - 依赖锁定可回退到上一版 `requirements.txt`。
  - GenAI SDK 迁移可通过 feature flag 或兼容层临时双栈（默认不做双栈，除非被依赖阻塞）。

## 交付物清单

- Dockerfile 升级到 Python 3.11
- `.python-version`
- `requirements.in` + 锁定后的 `requirements.txt`
- GenAI 调用迁移（3 个 service 文件）
- 3 个验收脚本 + 回归通过

