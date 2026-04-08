# 0Buck Master Blueprint v2.0 (Final Confirmed - 2026-04-02)

## 1. 核心定位 (Core Positioning)
AI 驱动的"供应无感化"跨境社交无头电商 (Headless E-commerce)。
将复杂的供应链（1688/Alibaba）包装为用户透明的"供应库"。

### 1.1 四大技术与业务铁律 (The Four Iron Rules)
1. **Shopify 的“绝对工具人”定位 (Headless Bridge & Draft Order Dictatorship)**:
   - **前端引流**：完全在 `0buck.com`，利用 Liquid 脚本强制跳转，拦截所有访问默认店铺的自然流量。
   - **资源剥削**：仅白嫖 Shopify 的全球 CDN（存图文视频）和 Checkout 收银台（解决最核心的支付安全合规）。
   - **运费与定价剥夺权**：结账瞬间，0Buck 后端合并 1688 多商家的运费并计入 0.5% 汇率对冲，直接调用 Shopify **Draft Order API (草稿订单)**。强行把算好的总价硬塞进 Shopify，生成一个不可更改的 `checkout_url` 甩给用户。Shopify 彻底沦为一个无情的刷卡机。
   - **后端同步 (防掉单)**：通过 Webhook 异步防掉单队列，将支付信号转化为平台内部的返现计划与分销分润。
2. **VCC (Vortex Chat Container) 架构 —— “对话即系统”**:
   - 摒弃传统“货架式”页面跳转，所有交互通过 GetStream 聊天流完成。
   - 后端下发 BAP (Business Attachment Protocol) 结构化 JSON，前端渲染为交互卡片（商品矩阵、返现雷达、物流地图）。
3. **AI 的“双模触发”与算力精益学 (Token Diet)**:
   - **明线 (Pro 模型)**：用户显式 `@管家` 或触发意图词时，AI 介入并使用“九点心理狙击法”推荐商品。
   - **气氛组截胡 (The Wingman AI)**：在公共群聊中，若 AI 监测到高热度从众讨论（如某用户刚晒出爆款单品），AI 适时冒泡制造 FOMO（错失恐惧症）：“刚好这款供应商还在搞活动，目前还有 5 个免单拼团名额没用完哦~”，实现群聊带货。
   - **暗线 (Flash 模型)**：每日凌晨异步静默提取群聊记录（脱水 Dehydration），生成用户画像标签存入 PostgreSQL，实现“不聊也懂你”。
4. **数据的“三层防串台”隔离 (Security & Privacy)**:
   - **群聊私有投影**：公共群聊中的敏感 BAP 卡片（如金钱进度）通过 Targeted Message 机制仅本人可见。
   - **影子隔离**：AI 执行任务时仅接触脱敏后的“影子 ID”和标签，核心账本库 (Zone 1) 与 AI 交互区 (Zone 3) 物理阻断。

---

## 2. AI 管家协议 (AI Butler Protocol)
> 详见：[0Buck_AI_Butler_Master_Protocol.md](0Buck_AI_Butler_Master_Protocol.md)

- **人格设定**: 默认执事风格，用户可自定义性格。
- **AI 谈判官**: 负责 C2M 众筹与预定进展同步。
- **影子数据**: AI 仅访问脱敏后的影子数据，Zone 1/2/3 物理隔离。

---

## 3. 500天/20期 阶梯返现协议 (Sign-in Rewards)
> 详见：[0Buck_Master_Rewards_Spec.md](0Buck_Master_Rewards_Spec.md)

- **结构**: P1-P2 固定，P3-P20 爆点概率先小后大（分段隔离算法）。
- **众筹溢价**: 参与 C2M 众筹的"创始会员"享有比常规商品更高的返现比例。

---

## 4. 优先级奖励引擎 (Rewards & Priority Engine)
1. 达人分销 (8%-20%) > 2. 用户分销 (3%-5%) > 3. 拼团免单 (3人免费) > 4. 达人粉丝 (3%-8%) > 5. 用户粉丝 (1.5%-3%)。

---

## 5. 积分与选品合伙人 (Points & Sourcing)
- **选品激励**: 提交愿望 +50 Pts，建议采纳 +200 Pts 伯乐奖。
- **需求大厅**: [用户提议] -> [热度众筹] -> [工厂定制] -> [0Buck 首发]。

---

## 6. 运营与供应链全链路流程 (Supply Chain Workflow)
> 详见：[0Buck_Supply_Chain_Workflow.md](0Buck_Supply_Chain_Workflow.md)

- **物流锚点**: 自动匹配商家发货地与最近的"合作货代仓"。前端隐藏国内段细节。
- **地理围栏**: 基于 IP 的禁售地区限制（Restricted_Sales_Zones）。
- **内容脱敏**: AI 重写商品标题/详情，全局隐藏 1688/Alibaba 等源头痕迹。
- **Shopify CDN 存储**: 所有商品图片、视频及商家媒体一律上传至 Shopify 云端，实现全球访问加速并节约本地存储成本。
- **利润红线**: 仅上架利润率 > 300% 的源头商。

---

## 7. 商家生态与 C2M 引擎 (Merchant Ecosystem & C2M)

### 7.1 商家生态 (S2B2C)
- **工厂勋章**: 认证源头工厂展示。
- **商家卡片**: 整合工厂视频、证书、描述等全量商家资产。

### 7.2 阶梯定价模式 (Ladder Pricing)
- **人多价更低**: 10人/100人/1000人阶梯自动调价（后台配置系数）。

### 7.3 众筹定制 (Dream Sourcing - C2M)
- **创始会员**: 参与众筹获得专属勋章及更高返现倍率。
- **资金托管**: 众筹资金进入平台 Escrow 监管。

---

## 8. 安全与数据架构 (Security & Architecture)
> 详见：[0Buck_Security_Architecture_v1.0.md](0Buck_Security_Architecture_v1.0.md) 与 [0Buck_Database_Technical_Spec.md](0Buck_Database_Technical_Spec.md)

- **堡垒式架构**: VPC 子网隔离，影子数据网关。
- **AES-256 加密**: 对私有 Key、收货地址等敏感 PII 进行静态加密存储。
- **多币种本地化**: 基于地区自动切换币种，汇率强制应用 **+0.5%** 对冲层。
