# 0Buck 统一身份认证与欢迎体系 (Unified Auth & Splash Design)

## 1. 核心理念 (Core Concept)
本系统遵循 0Buck 的 **"VCC (Vortex Chat Container) 对话即系统"** 架构与 **"无头电商 (Headless E-commerce)"** 理念。
放弃传统的 `/login` 独立页面跳转，采用“按需触发 (Lazy Auth / 游客模式)” + “沉浸式抽屉 (Drawer) 拦截”，结合全新的动态欢迎页，打造极简、高转化的身份流转体验。

## 2. 动态欢迎页 (Dynamic Splash Screen)
在用户首次打开应用或完全重新加载时，展示一个简短而惊艳的动态引导页。

### 2.1 视觉与交互
*   **全屏沉浸**：占据整个视口，背景采用品牌标志性的暗纹或流光渐变（适配系统的 Light/Dark 模式）。
*   **动态 Logo 呈现**：0Buck 的品牌 Logo 带有从模糊到清晰、或轻微缩放的呼吸感动画。
*   **Slogan 渐显**：Logo 下方优雅地浮现核心价值主张（如："Chat. Shop. Earn 100% Back."）。
*   **持续时间与退出**：
    *   动画总时长控制在 1.5 - 2.5 秒内，绝不拖沓。
    *   动画结束后，Splash Screen 通过 `fade-out`（淡出）或 `slide-up`（向上揭开）的过渡效果平滑消失，无缝露出底层的 AI 管家聊天界面。

### 2.2 逻辑意义
*   **掩盖加载状态**：在 Splash Screen 播放期间，应用在后台静默完成 Token 验证、本地用户状态（`user_memory_facts`）预热、以及必要的 API 预检。
*   **心智建设**：为首次进入的用户建立“高端、智能”的品牌第一印象。

## 3. 身份认证抽屉 (Auth Drawer) 架构

### 3.1 触发机制 (Trigger Mechanism)
*   **按需拦截**：用户可作为游客自由浏览商城、商品、动态，甚至与 AI 进行基础交互。
*   **动作缓存 (Action Caching)**：当用户点击需要鉴权的按钮（如：加购物车、结算、签到、领取算力）时，系统弹出 `AuthDrawer`，并将用户的**目标动作存入上下文中**。
*   **无缝衔接**：登录成功后抽屉自动关闭，并立即执行刚才缓存的目标动作（例如：直接将商品加入购物车并弹出成功 Toast），不让用户重新操作一次。

### 3.2 交互流程 (The Flow) - 单一入口设计
为了最高转化率，我们将注册和登录合并为一个流程（类似于 Shopify 的 Shop Pay 体验）：

**Step 1: 账号识别 (Identifier Input)**
*   **界面**：居中的 `AuthDrawer`。顶部醒目的品牌 Logo。
*   **输入区**：一个大号的邮箱输入框 (`Email Address`) + `Continue` 按钮。
*   **第三方快捷登录 (Social Auth)**：底部提供 Google, Apple, Facebook 的一键授权按钮。
*   **逻辑**：输入邮箱点击继续，后端判断该邮箱是“新用户”还是“老用户”。

**Step 2A: 新用户注册 (New User - OTP & Password)**
1.  **邮箱验证**：界面切换，要求输入发送至该邮箱的 6 位 OTP（一次性验证码）。
2.  **设置密码**：OTP 验证通过后，要求设置一个登录密码（未来可直接使用密码登录）。
3.  **智能邀请码 (Smart Referral)**：
    *   密码框下方提供一个折叠的 `[+ Have a referral code?]` 按钮。
    *   **自动溯源**：若 URL 携带了 `ref` 参数，此项自动展开并锁定显示推荐人，同时向后端提交分销绑定关系。
4.  **完成**：注册并登录成功。

**Step 2B: 老用户登录 (Existing User - Password)**
1.  **密码验证**：界面切换，要求输入密码。
2.  **找回密码**：提供 `Forgot Password?` 链接，点击后进入 OTP 重置密码流程。
3.  **完成**：验证通过，登录成功。

### 3.3 第三方授权登录 (Social Login)
*   点击第三方按钮后，调用对应的 OAuth 弹窗。
*   授权成功返回 Token 后，后端检查邮箱：
    *   如果是首次出现：自动创建 0Buck 账号并绑定，直接视为注册+登录成功。
    *   如果邮箱已存在：直接视为登录成功。

## 4. 前端状态与安全 (State & Security)
*   **全局状态**：在 `AppContext.tsx` 中增加 `user` (用户信息对象), `isAuthenticated` (布尔值) 等状态。
*   **Token 管理**：JWT Token 必须安全地存储（建议使用 `localStorage` 配合后端的短期 Access Token + 长期 Refresh Token 策略，或使用 HttpOnly Cookies）。
*   **API 拦截器 (Interceptor)**：Axios 或 Fetch 的全局配置中，拦截所有的 `401 Unauthorized` 响应，自动触发打开 `AuthDrawer`。