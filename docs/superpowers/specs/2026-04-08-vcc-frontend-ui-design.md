# 0Buck VCC Frontend UI/UX Spec (WhatsApp + WeChat Hybrid)

**Date**: 2026-04-08
**Status**: Approved
**Target**: `frontend/src/components/VCC/`

## 1. 核心设计哲学 (Core Design Philosophy)
0Buck 的前端 VCC (Vortex Chat Container) 抛弃了传统电商 App 的“货架式”展示，采用 **“对话即系统 (System as Chat)”**。
为了最大限度降低用户的防御心理和学习成本，UI 采用 **“WhatsApp Business 消息流” + “WeChat 公众号底部菜单”** 的混合架构。

## 2. 界面结构 (Interface Architecture)

### 2.1 顶部导航栏 (Header)
*   **视觉对标**: WhatsApp 聊天头部
*   **左侧**: 后退按钮 + AI管家 Dumbo 头像与在线状态 (显示为 "Verified Artisan Assistant")
*   **右侧**: 移除音视频通话按钮，替换为 **核心资产入口**:
    *   💰 **Wallet (钱包)**: 点击侧滑弹出 Drawer，展示当前余额、积分与续签卡。
    *   📦 **Orders (订单)**: 点击侧滑弹出 Drawer，展示历史订单、拼团状态和物流追踪。

### 2.2 核心聊天流 (Vortex Stream)
*   **视觉对标**: WhatsApp 原生聊天气泡
*   **背景**: 浅米色背景 (`#ECE5DD`) 配合暗色涂鸦底纹。
*   **普通消息**:
    *   User (右侧): 浅绿色气泡 (`#DCF8C6`)
    *   AI Butler (左侧): 纯白色气泡 (`#FFFFFF`)
*   **BAP 结构化卡片 (Business Attachment Protocol)**:
    *   采用 **Catalog Style (目录流卡片)**。
    *   打破常规气泡宽度，采用稍宽的卡片 (占屏幕宽度 80%-85%)，卡片左上角紧贴左侧头像。

### 2.3 底部交互区 (Bottom Input & Menu Bar)
*   **视觉对标**: 微信公众号 / 小程序底部菜单
*   **核心逻辑**: 提供明确的结构化业务入口，避免用户在空白输入框前“不知道说什么”。
*   **布局**:
    *   **最左侧**: 键盘切换按钮 (⌨️)，点击可在“传统聊天输入框”与“快捷菜单”间切换。
    *   **快捷菜单 (默认展示)**: 将底部划分为 3 个等宽的固定按钮。
        *   `[⚡️ 0Buck 严选]` -> 点击弹出上拉子菜单 (今日爆款 / 免单拼团 / 众筹新品)。点击后触发 AI 推送对应的 BAP_ProductGrid 卡片。
        *   `[💸 我的返现]` -> 点击后，AI 下发当前用户的 BAP_CashbackRadar 卡片。
        *   `[🙋‍♂️ 呼叫管家]` -> 点击立即切换回键盘模式，焦点聚焦输入框，允许用户自由提问或发图找同款。

## 3. BAP 卡片 UI 规范 (BAP Card Specs)

### 3.1 BAP_ProductGrid (商品推荐卡片)
*   **头部大图**: 占据卡片上半部分，16:9 或 1:1 比例。
*   **物理指纹角标**: 图片左上角悬浮黑色半透明毛玻璃角标，显示物理属性 (例: `⚖️ 0.12kg Verified`)。
*   **信息区**:
    *   **标题**: 粗体，黑色。
    *   **工匠背书**: 灰色小字，显示 `⚙️ OEM: 深圳精密制造 | 📦 15x8x4cm`。
    *   **价格行**: 巨大的现价 (黑色)，右侧划线价 (灰色)。
*   **行动按钮 (CTA)**: 底部浅绿色全宽按钮 `[Check out & Get 100% Back]`，点击呼出 Shopify Headless 结账抽屉 (Half-screen Drawer)。

### 3.2 BAP_CashbackRadar (返现进度卡片)
*   **标题**: Cashback Radar (右侧显示 `当前已返 / 总额`)
*   **进度条**: 橙色主色调，显示当前的返现期数 (如 Phase 7 of 20)。

## 4. 前端技术栈实现建议
1.  **框架**: React + TailwindCSS (快速复刻 WhatsApp/WeChat UI 细节)。
2.  **聊天引擎**: Stream Chat React SDK (`stream-chat-react`)。
3.  **BAP 渲染器**: 通过重写 Stream 的 `Message` UI 组件，当 `message.attachments` 包含 `0B_CARD_V3` 类型时，拦截并渲染自定义的 React 组件 (如 `<CatalogCard />`)。
4.  **Drawer 抽屉**: 使用 Radix UI 或 Framer Motion 实现丝滑的侧边/底部抽屉弹出动画，用于承载结账和钱包页面，确保用户始终不会离开聊天流 (Stay in the Vortex)。