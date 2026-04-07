# 0Buck Project Memory (Long-term Knowledge)

## 1. 项目核心愿景 (Core Vision)
0Buck 是一款 AI 驱动的“供应无感化”跨境社交电商平台。其核心商业模式是通过 AI 管家包装上游 1688/Alibaba 供应链，通过 **“20期签到全返” (20-Phase Full Refund)** 与分销激励构建极致留存，最终进化为社区驱动的 C2M 众筹定制平台。

## 2. 核心逻辑架构 (Core Architecture)

### A. 奖励系统 (Incentive Engine) - v3.2 里程碑架构
- **20期/100%全返 (Shopping Check-in Full Return)**: 将原 500 天周期拆解为 20 个阶段（期），通过分段奖励降低用户心理压力。
- **单元包配置 (The Golden Pack)**: 
    - **P1-P2 (固定启动)**: P1 (5d, 4%) / P2 (10d, 6%)。快速反馈增强初次信任。
    - **P3-P20 (18个单元随机池)**: 
        - **30天组 (5个)**: `{ r: 5%, d: 30 } * 5`
        - **25天组 (11个)**: `{ r: 5%, d: 25 } * 4`, `{ r: 3%, d: 25 } * 1`, `{ r: 4%, d: 25 } * 6`
        - **爆点组 (2个)**: `{ r: 8%, d: 30 }`, `{ r: 10%, d: 30 }`。
- **随机相控执行**: 
    - **爆点分布**: 8% 和 10% 单元执行“先难后易”策略，在 P11-P20 出现的权重显著高于前期，以锁定后期留存。
- **连续性要求**: 必须连续签到。断签超过 5 天且未在 5 天内使用续签卡补救，则当前阶段进度归零。历史已结清阶段不受影响。
- **Vortex 预判发现 (Predictive Discovery)**: 基于 LTM (长期记忆) 在前端“发现”频道通过 2x5 矩阵进行个性化推荐，首位商品强制为 `[TRAFFIC]` 类目作为“管家人情礼”。

### B. 分销与激励体系 (Growth & Social)
- **权益对齐原则**: 无论是 **普通用户** 还是 **达人 (KOL)**，均享有 **20期全返** 和 **3人拼团免单** 核心基础权益。
- **3人拼团免单 (Group-Buy Free Order)**: 
    - **Boss 逻辑**: 1 (发起者) + 3 (受邀者) = 4 人总单量。
    - **执行细节**: 发起者 A 购买后分享链接，在 P1 (首个 5 天) 签到期内，必须拉入 3 名以上新订单。
    - **结果**: 发起者 A 获得全额退款 (免单)，且不再享受该单后续签到返现。
- **分销分红 (Distribution Dividend)**: 
    - **身份分层**: Silver (1.5%) / Gold (2.0%) / Platinum (3.0%)。
    - **达人合伙人 (KOL/Partner)**: 8% - 20%。在入驻申请阶段由 Boss 手动设定。
    - **冲突规则**: 无论对方是否为粉丝，通过此单次分享链接购买即触发。
- **粉丝购物奖励 (Fan Shopping Reward)**: 
    - **机制**: 专属邀请注册链接绑定，有效期 2 年。
    - **比例**: 普通用户 1% - 1.5% (按等级)；达人合伙人 3% - 8% (手动设定)。
    - **冲突规则**: 分销分红 > 粉丝奖励。若粉丝被他人分享链接“截胡”，该单粉丝奖不发放给原推荐人。
- **购物签到返现 (Shopping Cashback)**: 全员基础权益，分 20 期，总计 500 天完成。售价锁定 4.0x 成本红线覆盖支出。
- **优惠券发放 (AI Issuance)**: 
    - **权限分级**: `LOW (自动)` / `MEDIUM (需确认)` / `HIGH (Admin 专供)`。
    - **审计指纹**: 每次发券生成 16 位唯一指纹，记录理由、时间、上下文快照，用于争议申诉。

### C. 供应端选品与同步逻辑 (IDS v3.2 - Dual-Engine)
- **Following Mode (追随模式)**: 抓取 TikTok/IG 等社交媒体爆点信号，负责爆发力。
- **Spy Mode (间谍模式)**: 定点监控大牌/竞品店铺（Anker, Ugreen等）新品与价格变动，负责稳定性。
- **定价红线**: 
    - **PROFIT (返现款)**: 售价 >= 成本 * 4.0。
    - **TRAFFIC (引流款)**: 售价在 1.2x - 3.9x 之间，不参加返现，贡献现金流。
- **v3.1.5 专业元数据同步**: 穿透同步规格、重量、材质及 CE/FCC 证书至 Shopify Metafields。
- **影子化 (Shadowing)**: 
    - **Shadow ID**: AI 仅处理 `SH_PROD_XXXX` 格式虚拟 ID。
    - **Shadow Tracking**: 物流单号进入 AI 前经过脱敏映射。
    - **影子 Alt**: 图片上传至 Shopify CDN 后自动重命名，消除 `alicdn` 痕迹。

### G. 智理中控架构 (Brain-Hub Mode v5.0 - 降维打击架构)
- **核心逻辑 (Anchor Mode)**: 彻底放弃自研 1688 底层爬虫，采用 “第三方搬运工 (DSers/妙手) + 0Buck AI 智理” 架构。Shopify 成为 0Buck 的 “媒体资产锚点” 与 “Single Source of Truth”。
- **选品情报主权 (Intelligence-First)**: 坚持 “热点 (Hotspot) -> 话题 (Topic) -> 商品 (Product) -> 痛点 (Pain Point)” 的原始选品逻辑。0Buck 负责“选什么”，搬运工负责“搬什么”。
- **全自动闭环流水线**:
    1. **探测 (Scout)**: 0Buck 探测热点话题并匹配 1688/Alibaba 货源，计算利润率、套利空间及返现可行性，进入 `CandidateProduct` 待选池。
    2. **比价与价值感知引擎 (Global Comparison Engine)**: 
        - **采购套利**: 1688 vs Alibaba (RTS) 自动比价，寻找最优成本。
        - **价值锚点**: **Amazon/eBay 实时比价**。自动抓取全球主流平台零售价，作为 0Buck 标价的“心理降维”参照。
        - **套利阈值**: 默认 15%，根据 Amazon/eBay 溢价空间动态调整。
    3. **定价逻辑 (Pricing Logic)**: 保持 **20期签到全返 (20-Phase Full Rebate)** 模型。0Buck 根据成本价及 Amazon/eBay 锚点价格，自动算出既具竞争力又能覆盖返现成本的“最优定价”。
    4. **审批 (Approve)**: 管理员在 0Buck 后台审核“热点+全球比价+商品+痛点”组合，点击同意。
    4. **调度 (Trigger)**: 0Buck 触发 DSers (Alibaba) 或 妙手 (1688) 的 API，将原始商品铺货到 Shopify。
    5. **感应 (Listen)**: Shopify 通过 `Product Created` Webhook 通知 0Buck 商品已到。
    6. **润色 (Enrich)**: 0Buck 立即拉取 Shopify 数据（图片 URL、成本价、变体），AI Desire Engine 自动注入基于热点的 Hook 标题、欲望文案。
    7. **覆盖 (Publish)**: 0Buck 根据成本价与 20 期返现公式自动重新计算售价，调用 Shopify API (PUT) 反向覆盖文案与价格，正式发布上架。
- **技术优势**: 避开 1688 封禁与图片镜像难题，利用第三方工具维护 SKU 映射与 CDN 资产，0Buck 专注 AI 营销、套利决策与比价分析。

### 4. 关键文件索引
- `docs/0Buck_Master_Blueprint_v2.0.md` (母体总纲)
- `docs/0Buck_Master_Rewards_Spec.md` (财务与奖励)
- `0Buck AI 管家操作系统 (v3.2).md` (管家协议)
- `0Buck_终极技术手册_v3.1.md` (技术标准)
