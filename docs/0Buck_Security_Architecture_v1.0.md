# 0Buck 堡垒式安全与部署架构规范 (Security & Fortress Architecture) V1.0

## 1. 核心安全原则：三层信任区 (Trust Zones)

我们将系统划分为三个互不信任的区域，确保即便 AI 被"攻破"，核心资产依然安全。采用 **VPC 子网隔离 (Logical Air-gap)** 实现物理级解耦。

| 区域 | 包含内容 | 安全等级 | 访问规则 | 部署建议 |
|:---:|:---|:---:|:---|:---|
| **Zone 1: 核心堡垒 (Vault)** | Shopify Admin Keys, 支付 Token, 用户真实 PII (姓名/手机), 余额账本 | **最高 (L5)** | **禁绝 AI 直接访问**。仅允许后端受信任的代码逻辑访问。 | RDS 实例 A (Private Subnet 1) |
| **Zone 2: 业务中枢 (Orchestrator)** | AI 调度逻辑, 权限过滤器, 1U/10U 计费引擎, **影子数据网关** | **高 (L4)** | 负责在 AI 与数据之间传递"脱敏"后的信息。 | 业务 Docker 集群 |
| **Zone 3: AI 交互区 (Butler)** | LLM API 调用, **向量记忆 (软资产)**, 对话历史, 用户画像标签 | **中 (L3)** | AI 仅能看到脱敏后的 #标签 和 影子 ID。 | 向量 DB 实例 B (Private Subnet 2) |

---

## 2. 关键隔离机制：影子数据网关 (Shadow Data Gateway)

严禁 AI 直接执行 SQL 查询或访问原始 API。AI 与数据之间必须经过 Zone 2 的安全代理。

### 2.1 请求拦截与脱敏流程
1.  **AI 发出请求**：例如调用工具 `get_order_status(order_id="123")`。
2.  **网关拦截 (Zone 2)**：
    *   **鉴权**：校验该 `order_id` 是否确实属于当前会话的 `user_id`。
    *   **取值**：从 Zone 1 的 PostgreSQL 中取回原始 JSON 订单数据。
3.  **强制脱敏转换**：网关按照预设规则剔除敏感字段。
    *   *原始数据*：`{"name": "张三", "phone": "13800138000", "address": "上海市浦东新区xxx", "price": 100.0}`
    *   *影子数据*：`{"masked_name": "张*", "location_city": "上海", "logistics_status": "已发货", "currency": "CNY"}`
4.  **返回 AI**：AI 仅根据影子数据生成回复，无法触碰到真实 PII。

### 2.2 物理隔离：资产分类存储
*   **硬资产 (Zone 1)**：订单、资金、权限。存储在主 PostgreSQL 实例。
*   **软资产 (Zone 3)**：AI 记忆、画像。存储在独立的向量数据库实例。
*   **物理隔绝点**：两套数据库位于不同的 Subnet。即便 Zone 3 的向量库被攻击，黑客也无法通过该连接跳转到 Zone 1 的核心账本。

---

## 3. 密钥安全：防止 Key 泄露 (Key Hardening)
*   **加密算法**：AES-256-GCM 对称加密。
*   **密钥管理**：使用云厂商托管的 Secret Manager (如 AWS KMS) 管理主加密密钥。
*   **运行时**：密文仅在内存中运行时解密，严禁进入 Logs、环境变量或监控指标。
*   **BYOK 安全**：用户输入的 Key 在后端加密后存储哈希或加密密文，解密过程仅在调用 LLM 接口时发生。

### 2.2 用户隐私脱敏 (Data Masking)
*   **脱水过程**：在灵犀 Agent 进行画像学习前，后端 API 网关必须自动识别并剔除真实姓名、电话、具体地址等敏感信息。
*   **向量记忆安全**：向量库中的语义片段不包含原始订单 ID 或用户真实 ID，统一使用关联 UUID。

---

## 3. AI 调用与成本安全 (The "Shield" - 护盾)

### 3.1 防范 Prompt 注入 (Injection Protection)
*   **双重 Prompt 结构**：将系统指令 (System Instructions) 与用户输入 (User Input) 严格物理分离，防止用户通过输入操控 AI 逻辑。
*   **输出审查**：AI 生成的回复在展示给用户前，经过一套敏感词过滤器，防止泄露内部供应链关键词（如 1688、Alibaba、淘宝、供应商原名）。

### 3.2 算力成本控制 (Quota Hardening)
*   **硬限额逻辑**：在后端拦截器层实现 Quota 检查。
    *   单日限额：$1 USD。
    *   月度限额：$10 USD。
*   **拦截机制**：一旦触达限额，直接从物理层面拒绝转发请求给 LLM，防止费用超支。

---

## 4. 支付与 Webhook 安全 (The "Gateway" - 网关)

### 4.1 Shopify Webhook 验证
*   **HMAC 校验**：所有接收来自 Shopify 的 Webhook（如 `orders/paid`、`orders/fulfilled`）必须进行 `X-Shopify-Hmac-Sha256` 签名校验，防止伪造支付成功信号触发奖励。
*   **幂等性检查**：通过 `Webhook-ID` 确保同一条信号只处理一次，防止重放攻击导致奖励重复发放。

### 4.2 支付数据 PCI 规范
*   **不存储信用卡**：0Buck 数据库严禁存储任何信用卡卡号、有效期或 CVV。
*   **Tokenization**：通过 Stripe/Shopify Pay SDK，前端直接与支付网关交互，后端仅接收唯一的 Payment Token。

---

## 5. 部署方案 (The "Fortress" - 堡垒)

采用容器化 (Docker) + 云原生架构部署：

| 组件 | 环境 | 角色 |
|:---:|:---:|:---|
| **API 网关** | Cloudflare / Nginx | 防 DDoS、SSL 卸载、IP 黑名单 |
| **应用后端** | Docker (Node.js/Next.js) | 业务逻辑、奖励引擎、AI 调度 |
| **数据库** | PostgreSQL (RDS) | 结构化资产、向量记忆 |
| **缓存层** | Redis (Managed) | 签到并发锁、配额计数器、会话快照 |
| **密钥库** | Secret Manager | 环境变量、第三方 API Keys |

---

## 6. 防欺诈与合规：地理围栏 (Geo-fencing)

针对 0Buck 跨境业务的合规性与物流可达性，实施严密的地理拦截策略。

*   **IP 定位与禁售黑名单 (Restricted_Sales_Zones)**：
    *   **iso_code**：国家代码 (如: 'RU', 'KP')。
    *   **自动化拦截**：若用户 IP 处于禁售表或商家的 `allow_export_countries` 之外，前端自动屏蔽相关商品。
    *   **管家解释**：AI 管家针对该地区的礼貌回绝文案："抱歉，我们目前尚未开通您所在地区的供应服务。"

*   **物流锚点与影子发货 (Shadow Logistics)**：
    *   **货代仓锚点**：将商家发货地与离其最近的合作货代仓库关联，屏蔽国内段物流。
    *   **履约验证**：在 Checkout 结算页，系统强制检查收货国家是否在货代线路覆盖范围内。

---

## 7. 审计与内容脱敏策略 (Content Sanitization)

*   **源头隐藏**：前端所有商品详情、商家展示、介绍文字严禁出现 "1688"、"Alibaba"、"淘宝" 或原始厂家联系方式。
*   **AI 重构层**：所有展示给用户的商品内容均为 AI 重构版本，脱敏后的影子内容存储在 `products.optimized_content`。
*   **货币对冲**：汇率转换函数读取 `User.currency_context` 并强制应用 **+0.5%** 的汇率损耗/对冲。
