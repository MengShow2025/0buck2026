# i18n（CSV → JSON）设计说明

## 目标

- `0Buck_i18n_Translation_Table.csv` 是唯一可编辑源；只使用 `Current_ZH` / `Current_EN`（为空时回退到 `Original_ZH` / `Original_EN`）
- 前端不再把翻译内容写进大文件（如 `AppContext.tsx` 内的巨型字典）；改为生成独立的 locale 文件
- 开发时修改 CSV 后，前端翻译自动更新（无需重启）
- 英文是最终模板与权威兜底：任意语言缺 key 时，回退到英文；英文缺 key 时回退到 `key` 本身

## 非目标

- 不在本次引入第三种及以上语言（当前 `Language` 仅 `en/zh`）
- 不在本次强制补齐所有缺失 key（仍以 CSV 为准，缺失时按兜底策略展示）
- 不在本次做自动翻译（仅同步与兜底）

## 现状问题

- `frontend/src/components/VCC/AppContext.tsx` 内置了巨型 `translations`，维护成本高且容易出现“页面直接显示 key”
- 同步脚本当前会把 CSV 的内容直接写回 `AppContext.tsx`，导致文件持续膨胀且不利于你后续只改一个地方

## 方案（选定：A）

### 总体流程

1. 同步脚本读取 `0Buck_i18n_Translation_Table.csv`
2. 产出 JSON：
   - `frontend/src/i18n/locales/en.json`
   - `frontend/src/i18n/locales/zh.json`
3. 前端运行时 `t(key)`：
   - 若 `language=zh`：`zh[key] ?? en[key] ?? key`
   - 若 `language=en`：`en[key] ?? key`
4. `npm run dev` 期间监听 CSV 变化，自动重跑同步脚本，Vite HMR 自动刷新

### 生成规则

- 输入：`0Buck_i18n_Translation_Table.csv`
- 对每行：
  - `en_val = Current_EN || Original_EN`
  - `zh_val = Current_ZH || Original_ZH`
- 仅当 `key` 与对应 value 非空时写入 JSON
- JSON 内容按 key 字典序输出，保证 diff 稳定

### 文件与职责

- `frontend/scripts/sync_i18n.py`
  - 只负责：CSV → `en.json`/`zh.json`
  - 不再修改 `AppContext.tsx`

- `frontend/src/i18n/index.ts`
  - 负责：加载 locales 并提供 `translate(language, key)`

- `frontend/src/components/VCC/AppContext.tsx`
  - 保留对外 `t(key)` 接口形态不变
  - 内部改为调用 `translate(language, key)`
  - 删除/移除内置巨型 `translations`（避免你需要在这个大文件里维护翻译）

- `frontend/scripts/dev.mjs`
  - 继续保留 watcher：监听 CSV 变化自动执行 `sync_i18n.py`

## 验收标准

- 修改 CSV 的 `Current_EN/Current_ZH` 任一值，前端对应文案在开发环境能自动更新
- 页面不再因为同步缺失而大面积显示 key（缺失 key 时至少回退到英文或 key）
- `AppContext.tsx` 不再包含大体积翻译字典

## 风险与处理

- CSV 行内含逗号导致解析错位：继续使用当前的行级解析策略（避免依赖标准 CSV reader 对未转义逗号的敏感性）
- JSON 输出包含特殊字符：使用标准 JSON 序列化转义

