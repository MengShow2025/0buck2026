# 0Buck v3.4 详细开发规划 (Vortex Chat Container Implementation)

## Phase 1: 基础通讯总线集成 (Base Infrastructure)
- **Backend (Token Auth)**: 
  - 实现 `StreamChatService.generate_user_token` 对接现有 User 模型。
  - 创建 `stream_chat.py` 路由，分发 JWT。
- **Frontend (Lazy VCC)**: 
  - 实现 `useStreamVCC` 钩子，支持 Scene A (Member) / Scene B (Guest) 自动转换。
  - 在 `App.tsx` 实现延迟初始化逻辑，非社交页面不激活 SDK。
  - 开发 `StreamGuard` 组件提供加载锁与 Cyberpunk 动画。

## Phase 2: BAP 渲染引擎与卡片库 (BAP Engine & Card Library)
- **Protocol Definition**: 定义 `0B_CARD_V3` 的 JSON 格式。
- **Component Migration**: 
  - 将 `VortexDiscovery.tsx` 封装为 `VortexGridAttachment`。
  - 将 `WishingWellProgressBar.tsx` 封装为 `WishingWellAttachment`。
  - 开发 `CashbackTrackerAttachment` (20期全返看板)。
- **Renderer**: 开发 `CustomAttachmentRenderer`，根据 `attachment.type` 动态路由到相应组件。

## Phase 3: AI 意图识别与 Webhook 反射 (AI Reflection Loop)
- **Webhook Handler**: 后端开发 `/api/v1/stream/webhook`。
- **Signal Filtering**: 过滤非业务对话，仅提取意图信号（Wish, Buy, Track）。
- **LTM Persistence**: 提取事实并存入 `user_memory_facts`，实现 AI 的持续进化。

## Phase 4: 隐私保护与社交生态 (Privacy & Social Ecosystem)
- **Targeted Messaging**: 开发后端逻辑，在群聊中针对隐私业务（如返现进度）仅向特定用户 ID 发送消息。
- **Moments (动态)**: 
  - 实现 Lounge 中的动态发布 UI 与点赞逻辑。
  - 增加本地持久化与异步备份。
- **Notes (笔记)**: 
  - 实现类小红书的图文/视频笔记发布系统。
  - 集成 Markdown/RichText 编辑器。

## Phase 5: Shopify 支付桥接与状态回传 (Payment & Checkout)
- **Checkout Link Generator**: 后端对接 Shopify Storefront API 生成订单链接。
- **Secure Overlay**: 前端开发基于 Modal 的支付浮层，集成 Shopify 托管收银台。
- **Completion Loop**: 监听 Shopify 支付成功 Webhook，自动在聊天频道回传“锁定全返”确认消息。

## Phase 6: 广场全局分发 (Square Global Distribution)
- **Broadcast System**: 后端预建 `global_square`, `global_commerce` 等频道。
- **Promotion Loop**: 实现平台活动卡片在 Square 的定时分发逻辑。
- **Admin Tools**: 增加管理员在 Square 发布置顶动态的功能。

---
*Target Completion: 2026-04-15*
*Status: Updated v3.4.1*
