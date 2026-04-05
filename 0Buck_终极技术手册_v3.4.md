# 0Buck 终极技术手册 v3.4 (Vortex Chat Container)
## 核心架构与对话式系统 (VCC) 协议

---

### 1. 核心架构：双轨存储 (Brain & Mouth Separation)
- **交互层 (Mouth - GetStream Cloud)**: 
  - 存储全量对话流（文本、图片、消息顺序）。
  - 利用本地持久化实现离线访问。
  - 0Buck 后端不存储原始对话记录，磁盘 IO 降低 90%。
- **心智层 (Brain - 0Buck LTM & Logic)**: 
  - **LTM (长期记忆)**: 通过 Webhook 异步提取对话事实，存入 `user_memory_facts`。
  - **业务逻辑**: 订单、返现、众筹进度等硬数据存储于 0Buck 生产库。

---

### 2. 交互协议：BAP (Business Attachment Protocol)
- **JSON Schema**: 所有的业务入口均封装为 `custom_attachments`。
- **0B_PRODUCT_GRID**: 3D 悬浮商品矩阵，支持 2x5 交互布局。
- **0B_WISH_WELL**: 带 48h 倒计时与实时支持人数的动态卡片。
- **0B_CASHBACK_RADAR**: 20期返现进度监控，支持分期详情展开。

---

### 3. 隐私与安全：私有投影 (Private Projection)
- **Targeted Message**: 在公共群聊中，隐私业务卡片仅对特定用户 ID 可见（利用 Stream 的 `silent` 或 `Targeted Message` 机制）。
- **Secure Overlay**: 支付环节弹出 Shopify 托管收银台浮层，PCI-DSS 环境隔离。

---

### 4. 路由与分流逻辑
- **App Tabs 映射**: 底层导航切换不再跳转 Page，而是切换 Stream 频道过滤器。
- **意图锚点 (Intent Anchors)**: 仅在检测到关键词（如“想要”、“查单”）时触发后端反射，节省算力。

---

### 5. 身份映射 (Identity Protocol)
- **Dynamic Mapping**: 实时同步用户的 `butler_name` 到 Stream 的 AI 代理头像和昵称。
- **JWT Auth**: 0Buck 后端分发基于 User-ID 的 Stream Token。

---
*Last Updated: 2026-04-05 (v3.4 VCC Upgrade)*
