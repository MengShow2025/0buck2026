# 0Buck VCC Frontend UI/UX Spec (WhatsApp + WeChat Hybrid)

**Date**: 2026-04-08
**Status**: Approved
**Target**: `frontend/src/components/VCC/`

## 1. 核心设计哲学 (Core Design Philosophy)
0Buck 的前端 VCC (Vortex Chat Container) 抛弃了传统电商 App 的“货架式”展示，采用 **“对话即系统 (System as Chat)”**。
为了最大限度降低用户的防御心理和学习成本，UI 采用 **“WhatsApp Business 消息流” + “WeChat 公众号底部菜单”** 的混合架构。

## 2. 界面结构 (Interface Architecture)

### 2.1 整体色调与布局 (Color & Layout)
*   **视觉对标**: WhatsApp / 微信小店
*   **核心色彩**:
    *   **亮色模式 (Light Mode)**: 
        *   主色调采用 **0Buck 活力橙 (Orange: #F35B25)**，替代 WhatsApp 原本的绿色。
        *   辅色采用 **高级灰 (Grey: #7A7A7A)**，用于文字和次要边框。
        *   背景采用浅色干净底纹。
    *   **暗色模式 (Dark Mode)**: 
        *   参考 **微信 (WeChat) 暗黑模式**。深灰色背景 (#111111) 与柔和的纯黑组件框。
        *   0Buck 活力橙在暗色下自动降低饱和度，保证视觉舒适。
*   **主题切换 (Theme & i18n)**:
    *   系统支持**自动跟随系统 (Auto-detect)** 与**手动设置**亮/暗模式。
    *   支持**多语言 (Multi-language)**，初始包含英语和中文。

### 2.2 顶部导航栏 (Header)
*   **视觉对标**: WhatsApp 聊天头部
*   **左侧**: 后退按钮 + AI管家 Dumbo 头像与在线状态 (显示为 "Verified Artisan Assistant")
*   **右侧**: 移除音视频通话按钮，替换为 **核心资产入口**:
    *   💰 **Wallet (钱包)**: 点击侧滑弹出 Drawer，展示当前余额、积分与续签卡。
    *   📦 **Orders (订单)**: 点击侧滑弹出 Drawer，展示历史订单、拼团状态和物流追踪。

### 2.3 核心聊天流 (Vortex Stream)
*   **视觉对标**: WhatsApp 原生聊天气泡
*   **背景**: 浅米色背景 (`#ECE5DD`) 配合暗色涂鸦底纹。
*   **普通消息**:
    *   User (右侧): 浅绿色气泡 (`#DCF8C6`)
    *   AI Butler (左侧): 纯白色气泡 (`#FFFFFF`)
*   **BAP 结构化卡片 (Business Attachment Protocol)**:
    *   采用 **Catalog Style (目录流卡片)**。
    *   打破常规气泡宽度，采用稍宽的卡片 (占屏幕宽度 80%-85%)，卡片左上角紧贴左侧头像。

### 2.4 底部交互区 (Bottom Input & Quick Replies)
*   **视觉对标**: 现代 AI APP (如 ChatGPT / Claude) 的输入框设计
*   **核心逻辑**: 永远保持输入框常驻，鼓励用户随时打字聊天；同时在输入框上方提供横向滑动的快捷胶囊，降低电商操作门槛。
*   **布局**:
    *   **快捷胶囊区 (Floating Quick Replies)**: 悬浮在输入框正上方。可横向滑动的胶囊按钮，如 `[⚡️ 0Buck 严选]`、`[💸 我的返现]`、`[📦 查物流]`。点击胶囊等同于发送一条快捷指令给 AI。
    *   **传统输入框区 (Always-on Input Bar)**: 
        *   左侧: 原生 `[+]` 按钮 (魔法口袋：点击弹出类似微信底部扩展面板，包含上传图片、呼叫人工、修改地址、以及**类似微信小店/小程序的 0Buck 完整商店主页入口**)。
        *   中间: 宽大的文本输入框，提示语 "Message Dumbo..."。
        *   右侧: 发送按钮。

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

## 4. BAP 交互协议与"System as Chat" (系统即聊天)

### 4.1 传统业务卡片渲染
当 AI 通过 Stream 发送带有 `attachments` 的消息时，前端 `MessageInterceptor` 将捕获并渲染为自定义 BAP 卡片：
1.  **ProductGridCard (`0B_PRODUCT_GRID`)**: WhatsApp Catalog Style 呈现商品。
2.  **CashbackRadarCard (`0B_CASHBACK_RADAR`)**: 呈现用户当前的返现漏斗进度。

### 4.2 "System as Chat" 隐藏动作指令 (Hidden Actions)
这是 0Buck 独创的交互模式。用户不必去汉堡菜单里寻找设置项。
用户输入: "太亮了，换成黑色模式" 或 "Change to dark mode"
AI 响应: 
```json
{
  "text": "已经为您切换到暗黑模式啦！🌙",
  "attachments": [{
    "type": "0B_SYSTEM_ACTION",
    "action": "SET_THEME",
    "value": "dark"
  }]
}
```
**前端拦截逻辑**:
前端解析到 `0B_SYSTEM_ACTION` 时，不会渲染这张卡片（它是隐藏的），而是直接调用 `AppContext.setTheme('dark')` 修改整个系统的 CSS 变量。
**支持的系统指令**:
*   `SET_THEME`: "dark" | "light" | "system"
*   `SET_LANGUAGE`: "en" | "zh" | "es"
*   `NAVIGATE`: "orders" | "wallet" | "community" (触发底端或侧边抽屉弹窗)

## 5. 前端技术栈实现建议
1.  **框架**: React + TailwindCSS (快速复刻 WhatsApp/WeChat UI 细节)。
2.  **聊天引擎**: Stream Chat React SDK (`stream-chat-react`)。
3.  **BAP 渲染器**: 通过重写 Stream 的 `Message` UI 组件，当 `message.attachments` 包含 `0B_CARD_V3` 类型时，拦截并渲染自定义的 React 组件 (如 `<CatalogCard />`)。
4.  **Drawer 抽屉**: 使用 Radix UI 或 Framer Motion 实现丝滑的侧边/底部抽屉弹出动画，用于承载结账和钱包页面，确保用户始终不会离开聊天流 (Stay in the Vortex)。