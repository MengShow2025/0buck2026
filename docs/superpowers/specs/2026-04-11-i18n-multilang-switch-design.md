# i18n 多语言“可切换”设计（不改 CSV）

## 背景

当前 i18n 的单一来源是 `0Buck_i18n_Translation_Table.csv`，并且只维护 `Current_EN/Current_ZH` 两套文案。前端运行时通过 `t(key)` 做“当前语言 → 英文 → key”兜底。<mccoremem id="03fxe1z96ut2kdb4eygrclqug" />

用户需求：

- 允许在 UI 中切换更多语言（`ja/ko/es/fr/de/ar`）
- 不修改 CSV 结构（不新增 `Current_JA/...` 等列）
- 新语言阶段先稳定展示英文兜底即可

## 目标

- 在设置页（以及系统动作）支持切换 `en/zh/ja/ko/es/fr/de/ar`
- 新增语言不要求 CSV 提供翻译：显示英文兜底（缺失再回退到 key）
- 阿拉伯语切换时设置页面方向为 RTL（`dir=rtl`），其它语言 `ltr`
- 不修改 `0Buck_i18n_Translation_Table.csv` 的列结构

## 非目标

- 不引入第三方 i18n 库
- 不实现真正的日语/韩语/西语/法语/德语/阿语翻译文本（仍以英文兜底）
- 不做语言选择持久化（当前刷新后按 `navigator.language` 推断；如要持久化另开需求）

## 方案（选定）

### 1) 语言枚举扩展

- 将前端语言类型由 `en/zh` 扩展为：`en | zh | ja | ko | es | fr | de | ar`
- 设置页语言选择下拉补齐上述语言选项

### 2) 翻译兜底

- 维持现有运行时兜底策略：
  - `language === 'zh'`：`zh[key] ?? en[key] ?? key`
  - 其它语言：`en[key] ?? key`
- 解释：由于 CSV 仅维护中英，新语言只作为“切换能力”存在，默认回退英文保证稳定。

### 3) 语言显示名（不依赖 CSV）

- 设置页语言选项的 label 使用固定字面量，不新增/依赖 `settings.lang_xx` 的翻译 key：
  - `zh`：中文
  - `en`：English
  - `ja`：日本語
  - `ko`：한국어
  - `es`：Español
  - `fr`：Français
  - `de`：Deutsch
  - `ar`：العربية

### 4) RTL 支持（仅阿语）

- 当语言为 `ar` 时：`document.documentElement.dir = 'rtl'`
- 其余语言：`document.documentElement.dir = 'ltr'`

## 影响范围

- `AppContext.tsx`
  - `Language` 类型扩展
  - 初始化语言：根据 `navigator.language` 尝试映射到扩展语言（例如 `de-* -> de`）
  - 新增 effect 维护 `dir`（ar=rtl，否则 ltr）
- `SettingsDrawer.tsx`
  - 语言下拉 options 扩展
- `CustomMessageUI.tsx` / `App.tsx`
  - `SET_LANGUAGE` 的 payload 允许新语言值（运行时校验并忽略未知值）

## 验收标准

- 设置页可切换到 `ja/ko/es/fr/de/ar`
- 切换到新语言时页面文案不出现大面积 key 泄露（默认显示英文兜底）
- 切换到 `ar` 时页面 `dir` 变为 `rtl`，切回其它语言变为 `ltr`
- 不需要改动 CSV 文件列结构

## 风险

- 由于没有真正的翻译文本，新语言展示与英文相同是预期行为；后续若要真翻译，需要新增 CSV 列或另建翻译来源。

