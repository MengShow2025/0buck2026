# 0Buck 终极技术手册 v3.4 (VCC Edition)

## 1. 核心愿景：Vortex Chat Container (VCC)
0Buck v3.4 彻底实现了“对话即系统” (Conversational OS) 的设计理念。所有功能模块（商城、订单、资产、社交）均作为聊天流中的交互式卡片 (BAP Cards) 存在。

### 核心特性：
- **脑嘴分离架构 (Brain-Mouth Split)**: 后端 (Brain) 处理逻辑与意图提取，前端 (Mouth/VCC) 仅负责渲染流式对话与功能卡片。
- **BAP 业务卡片协议 (Business Attachment Protocol)**: 标准化 JSON Schema 定义功能组件，支持实时交互。
- **意图锚点 (Intent Anchors)**: 利用 Stream Webhooks 捕捉用户意图，自动触发业务流程。

## 2. 核心逻辑架构

### A. 双轨存储模型 (Dual-Track Storage)
- **心智层 (0Buck DB)**: 存储结构化事实、用户画像、订单状态。
- **日志层 (GetStream Cloud)**: 存储原始聊天记录、媒体文件与上下文。

### B. 20期全额返现 (The Golden Pack)
- **Phase 1-2**: 固定阶段，快速建立信任。
- **Phase 3-20**: 随机组合阶段，包含 8% & 10% 的“爆点单元”。
- **补偿机制**: 积分兑换“续签卡”可补救断签，但单期仅限一次。

## 3. 供应端选品逻辑 (IDS v3.1)
- **4.0x 利润红线**: 售价必须满足 `售价 >= 成本 * 4.0` 以覆盖 100% 返现成本与分销。
- **多规格同步**: 穿透同步 1688 的变体 (Color/Size/Spec) 至 Shopify。
- **AI 详情注入**: 自动生成美式英语 SEO 优化的 HTML 详情页。

## 4. 安全与隔离
- **物理隔离**: 所有查询强制绑定 `user_id`。
- **私有投影 (Private Projection)**: 群聊中涉及个人的敏感卡片（如返现进度）仅对该用户可见。
- **BYOK (Bring Your Own Key)**: 支持用户配置自定义 Gemini/MiniMax API Key。

## 9. 0Buck IM 智理网关 (v5.5 - The Sensory Extension)
 
 0Buck AI 大脑通过统一 IM 网关 (Unified IM Gateway) 延伸至第三方通讯平台（如 WhatsApp, Telegram, 飞书），实现“对话即商业”的跨平台闭环。管家不再被局限于 0Buck App 内，而是像触手一样伸向用户最常用的聊天工具。
 
 ### 9.1 架构设计：OpenClaw 模式的触角化
 - **多端适配器 (Adapters)**: 针对各大 IM 平台提供标准化 Webhook 接入。前端的 IM 仅作为展示 UI，真正的“大脑”和“手脚”全在 0Buck 的 LangGraph Agent 核心。
 - **身份隧道 (Identity Bridge)**: 通过 `UserIMBinding` 表，建立 `platform_uid` (如 WhatsApp 手机号) 与 0Buck 核心 `customer_id` 的 1:1 物理级映射。
 - **大脑代理 (IMBrainProxy)**: 将 IM 的上下文（消息 ID、图片、语音）透明转发给 0Buck 后端，后端执行工具调用（查单、推荐、退款）后，再将纯文本或富媒体链接推回给 IM。
 
 ### 9.2 核心能力与商业降维打击
 - **个性化共生**: 管家在 WhatsApp 里的性格、记忆、好感度，与 0Buck App 内 100% 实时同步。
 - **主动式脉冲 (Push Notification)**: 当用户的某笔订单物流异常，或其收藏的商品即将售罄时，管家不再发冰冷的邮件，而是直接在 WhatsApp 里弹出一句：“船长，我刚查到您的那个包裹卡在海关了，我已经帮您提交了加急申请，别担心~”
 - **无感化工具调用**: 用户在 Telegram 里发一句：“帮我查下上次买的狗粮到哪了”，管家直接调用 `get_order_status`，并在聊天里回复物流卡片。真正做到“系统即聊天”。

---
*Last Updated: 2026-04-05*
