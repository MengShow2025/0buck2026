# 0Buck v3.4 Vortex Chat Container (VCC) 架构白皮书

## 1. 核心愿景 (Vision)
将 0Buck 从“货架电商”彻底转型为 **“对话即系统 (CUI)”** 的智能终端。通过 **Stream Chat SDK** 作为底层通讯总线，将业务逻辑解耦为可交互的聊天卡片，实现“脑嘴分离”的工业级架构。

---

## 2. 数据架构：三层隔离模型 (Triple-Layer Model)

### 2.1 交互层 (Mouth - GetStream Cloud)
- **职责**：实时通讯、消息排序、离线持久化、媒体存储。
- **优势**：0Buck 后端不存储原始对话流，极大降低存储成本与隐私合规压力。

### 2.2 心智层 (Brain - 0Buck LTM)
- **职责**：通过 Webhook 异步监听对话，利用 `ReflectionService` 提取原子化事实（Facts）。
- **持久化**：存储于 0Buck 数据库的 `user_memory_facts` 表。
- **价值**：确保 AI 的认知独立于聊天记录，实现跨会话的持续进化。

### 2.3 业务层 (Logic - 0Buck Core)
- **职责**：处理订单、全返、众筹、供应链匹配等强逻辑。
- **投影**：通过 **BAP (Business Attachment Protocol)** 协议将业务状态“投影”到聊天框。

---

## 3. 交互协议：BAP (Business Attachment Protocol)

### 3.1 卡片化组件 (Message-as-Component)
所有业务入口封装为 Stream 的 `Custom Attachment`：
- **[0B_PRODUCT_GRID]**：3D 悬浮商品发现矩阵。
- **[0B_WISH_WELL]**：带 48h 倒计时的众筹卡片。
- **[0B_CASHBACK_RADAR]**：20期返现进度监控。
- **[0B_LOGISTICS_3D]**：实时包裹雷达。

### 3.2 隐私保护：私有投影 (Private Projection)
- 在公共群聊中，涉及隐私的卡片采用 **Targeted Message**（仅对特定用户可见），解决公共空间的业务操作焦虑。

---

## 4. 支付闭环：Shopify Headless Bridge

### 4.1 安全隔离
- 点击卡片 `[ 立即购买 ]` 触发 **Secure Overlay**。
- 前端弹出 Shopify 托管的收银台浮层。
- 用户直接在 Shopify 安全环境下输入敏感信息。

### 4.2 状态同步
- 监听 Shopify Webhook -> 更新 0Buck 订单状态 -> 自动在聊天频道追发支付成功确认卡片。

---

## 5. 前端重构：双轨制与频道驱动 (Dual-Track & Channel UI)

### 5.1 消息双轨制 (Dual-Track Messaging)
为兼顾极速响应、隐私安全与运营成本，系统采用两条平行轨道：
- **轨道 A：AI Butler (核心管家)** —— [私有轨道 / 直连]
  - **协议**：前端 <——> 后端 FastAPI (MiniMax Proxy)。
  - **优势**：零延迟、不计入 Stream API 调用费用、本地持久化聊天记录。
- **轨道 B：Social & Circle (社交广场)** —— [Stream 驱动]
  - **协议**：Stream SDK 云端通讯。
  - **职责**：处理群聊、好友私聊、全球广播。

### 5.3 延迟初始化与连接锁 (Lazy Init & Guards)
- **策略**：仅在用户进入 `Square` 或 `Lounge` 时初始化 Stream Chat SDK。
- **StreamGuard**：自定义高阶组件，负责在 SDK 连接期间展示“神经链路同步”动画，并锁定 UI 交互，防止过早调用。
- **Guest 自动化**：未登录用户自动分配 `0buck_guest_[hash]` 格式 ID，并同步 0Buck 临时昵称到 Stream Profile。

---

## 6. 社交生态：朋友圈与小红书 (Social Ecosystem)

### 6.1 动态 (Moments)
- **定位**：类微信朋友圈。
- **功能**：发布即时动态、图片分享、点赞交互。
- **持久化**：本地缓存 + 异步同步。

### 6.2 笔记 (Notes)
- **定位**：类小红书/公众号图文笔记。
- **功能**：长文编辑器、封面设置、知识分享、选品心得。
- **价值**：通过高质量内容驱动节点间的信任传递与 C2M 众筹转化。

---

## 7. 工业级奖励系统 (Industrial Reward System)

### 7.1 四维奖励矩阵 (4-Dimensional Reward Matrix)
系统集成了四种相互补充的激励逻辑，确保用户留存与裂变效率：

1.  **购物签到返现 (Shopping Check-in Cashback)**
    - **定位**：核心基础福利。
    - **机制**：分 20 期（共 500 天）完成 100% 返现。
    - **成本**：由 4.0x 成本红线定价策略物理覆盖。

2.  **拼团免单 (Group-Buy Free Order)**
    - **逻辑**：**1 (发起者) + 3 (受邀者) = 4 人成团**。
    - **时效**：发起后 5 天（P1 签到期）内达成。
    - **结果**：发起者获得全额退款（免单），后续不再享受该单签到返现。

3.  **分销分红 (Distribution Dividend)**
    - **触发**：通过商品/商家分享链接产生的单次购买。
    - **身份分层**：
        - 普通用户：Silver (1.5%) / Gold (2.0%) / Platinum (3.0%)。
        - 达人合伙人 (KOL/Partner)：8% - 20%（手动设定）。

4.  **粉丝购物奖励 (Fan Shopping Reward)**
    - **触发**：通过专属注册链接绑定的粉丝在 2 年内的所有有效订单。
    - **身份分层**：
        - 普通用户：1% - 1.5% (按等级)。
        - 达人合伙人 (KOL/Partner)：3% - 8%（手动设定）。
    - **冲突规则**：**分销分红 > 粉丝奖励**。若粉丝通过他人分销链接购买，则原推荐人不享有该单粉丝奖。

---
*Status: Updated v3.4.2 with Industrial Reward Matrix*
*Date: 2026-04-05*
