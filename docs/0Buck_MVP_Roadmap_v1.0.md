# 0Buck MVP 第一阶段：核心骨架开发路线图 (The Core Skeleton)

本路线图旨在通过 2-4 周的开发，跑通从"用户进入"到"订单奖励激活"的核心闭环。

## 1. 目标 (Milestones)
- **M1**: 基础底座建设（DB + 安全 + Shopify Webhook）。
- **M2**: 核心业务逻辑（20期签到算法 + AI 命名仪式）。
- **M3**: UI 交互原型（AI 侧边栏 + 商家卡片）。
- **M4**: 自动化回归（全链路模拟测试 + 安全注入测试）。

---

## 2. 详细工作流 (Workstreams)

### [Workstream A] 后端与安全基础设施
> **负责人**: Backend / Security Engineer
- **数据库表结构实现**: 基于 `Database_Technical_Spec` 落实主表。
- **AES-256 加密中间件**: 确立 BYOK 密钥与用户收货隐私的动态加密解密。
- **Shopify 代理网关**: 编写后端 API，代理所有 Storefront/Admin API 请求。
- **地理围栏网关**: 基于 `Restricted_Sales_Zones` 的全局 IP 过滤器。

### [Workstream B] 奖励引擎与逻辑开发
> **负责人**: Backend Engineer
- **20 期状态机**: 每一个订单关联一个 20 期的奖励记录。
- **分段隔离爆点算法**: 实现 P3-P10 与 P11-P20 的概率池逻辑。
- **断签策略执行器**: 实现断签 > 5天、未用续签卡情况下的跳期逻辑。
- **积分系统**: 实现每日 150 Pts 封顶逻辑与兑换功能。

### [Workstream C] AI 矩阵与管家协议
> **负责人**: AI / Prompt Engineer
- **双层隔离 Prompt**: 确保"军师"只处理逻辑，"管家"只处理话术，严禁逻辑穿透。
- **影子数据脱敏层**: 编写数据转换器，将 Zone 1 原始数据转换为 Zone 3 影子 JSON。
- **命名与性格持久化**: 实现对话中的命名流程，并确立 `affinity_score` 的初步计算权重。
- **脱水学习逻辑**: 编写异步脚本，在每 5 轮对话后触发见解提取。

### [Workstream D] 前端与 AI 交互体验
> **负责人**: Frontend / UX Engineer
- **AI 侧边栏 (Floating Chat)**: 实现流式输出（Streaming）与 AI 推荐商品的展示卡片。
- **命名互动界面**: 用户输入名字时的仪式感动画。
- **商家/工厂主页原型**: 展示勋章、视频及"供应基地"描述。
- **本地化定价引擎**: 实现基于 IP 的自动汇率转换（含 +0.5% 对冲）。

---

## 3. 技术红线 (Technical Redlines)
1. **No Hard-coding**: 严禁将 1688/Alibaba 链接或供应商名硬编码在前端。
2. **No Raw PII to AI**: 严禁向任何第三方 LLM API 传递用户真实手机号或详细地址。
3. **Webhook Verification**: 没有签名校验的 Webhook 请求严禁操作数据库余额。
4. **Hard Limit**: 单个用户每日消耗 AI 费用严禁超过 $1 USD。

---

## 4. 下一阶段展望 (Phase 2 Preview)
- 启动 **C2M 众筹实验室**（The Lab）。
- 开启 **KOL 达人分销系统**。
- 实现 **自动化招商邀约系统**。
