# 0Buck Master Blueprint v2.0 (Final Confirmed - 2026-04-02)

## 1. 核心定位 (Core Positioning)
AI 驱动的"供应无感化"跨境社交电商。将复杂的供应链（1688/Alibaba）包装为用户透明的"供应库"。

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
