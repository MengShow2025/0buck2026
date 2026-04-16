# 数据库迁移（Alembic）

## 目标

- 版本化 schema 变更
- 可回滚、可灰度、可复现

## 采用方式（从“无迁移”迁入）

仓库已加入 Alembic 骨架，并提供 `0001_baseline` 作为“迁移系统起点”。

### 现有生产库（已有表）

1. 部署同一版本代码
2. 在生产库执行：`alembic -c alembic.ini stamp head`
   - 含义：把当前库标记为已在 `0001_baseline`
3. 之后每次 schema 变更：
   - 生成迁移：`alembic -c alembic.ini revision -m "..." --autogenerate`
   - 应用迁移：`alembic -c alembic.ini upgrade head`

### 全新环境（空库）

1. 执行：`alembic -c alembic.ini upgrade head`
2. 之后同上

## 验收

- `backend/scripts/test_alembic_config_loads.py`
- `backend/scripts/test_alembic_metadata_has_tables.py`

