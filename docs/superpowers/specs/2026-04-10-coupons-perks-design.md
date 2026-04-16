# 卡券与权益 (Coupons & Perks) 设计规范

## 1. 业务边界与核心逻辑
本页面采用 **“账本分离与双轨制”** 策略，将平台虚拟权益与真实财务折扣进行物理和逻辑隔离：

*   **平台权益 (Platform Perks)**：
    *   **发行方**：0Buck 平台。
    *   **类型**：续签卡 (Renewal Card)、会员等级卡、AI 算力 Token 券、优先发货特权等非财务类虚拟资产。
    *   **使用场景**：仅在 0Buck 平台内部业务流转（如：签到中心使用续签卡补签）。
    *   **结算影响**：**绝对不影响** Shopify 的订单最终支付金额。

*   **购物卡券 (Store Coupons)**：
    *   **发行方**：Shopify (底层通过 Price Rules/Discounts API 生成)。
    *   **类型**：满减券 ($10 OFF)、折扣券 (20% OFF)、免邮券等真实财务资产。
    *   **使用场景**：用户在 0Buck 平台加购并点击 Checkout 时。
    *   **智能结算**：系统自动计算用户拥有的最优 Shopify 折扣码，并在跳转 Shopify 结账页时**静默挂载**到 URL 中，实现无缝抵扣。

## 2. UI 架构设计
页面入口：从 `MeDrawer.tsx` (我的页面) -> 点击“卡券与权益” -> 弹出 `CouponsDrawer.tsx`。

### 2.1 顶部导航与分类 (Tabs)
*   提供平滑切换的两个主 Tab：
    1.  `Store Coupons` (购物折扣)：默认选中。
    2.  `Platform Perks` (平台权益)。

### 2.2 卡片视觉规范 (Card Design)

**A. Store Coupons (购物折扣卡)**
*   **造型**：复古票根/登机牌样式（带边缘半圆打孔和虚线分割）。
*   **左侧 (价值区)**：高对比度展示面值（如巨大的 `$10` 或 `20%`），底色根据状态变化（可用为品牌橙/蓝，过期为置灰）。
*   **右侧 (详情区)**：
    *   主标题：如 `New User Bonus`。
    *   门槛：如 `Min. spend $50`。
    *   有效期：`Valid until Oct 31, 2026`。
*   **操作区**：
    *   可用状态：`Shop Now` 按钮。
    *   快过期状态：增加红色的 `Expiring Soon` 警示标签。

**B. Platform Perks (平台权益卡)**
*   **造型**：高级实体卡片质感（黑金、镭射、渐变纹理），彰显特权身份。
*   **左侧 (图标区)**：展示该权益对应的精美 Icon（如皇冠、魔法棒、芯片）。
*   **右侧 (详情区)**：
    *   主标题：如 `1-Day Renewal Card` (1天续签卡)。
    *   描述：`Save your broken check-in streak` (挽救断签记录)。
*   **操作区**：
    *   按钮：指向具体的业务模块（如 `Go to Check-in`）。

### 2.3 空状态引导 (Empty State)
当某个 Tab 下没有可用卡券时，不能只显示空白，必须提供明确的转化路径：
*   **购物折扣为空**：展示“当前无可用折扣”，按钮引导 -> `View Ongoing Events` (去拿券)。
*   **平台权益为空**：展示“当前无可用权益”，按钮引导 -> `Go to Points Center` (去积分商城兑换)。

## 3. 交互与状态管理
*   该抽屉应由 `GlobalDrawer.tsx` 统一管理弹出。
*   内部使用 `useState` 管理 Tab 切换。
*   静态 Mock 数据需严格区分 `type: 'coupon'` 和 `type: 'perk'` 以验证双轨 UI 的渲染正确性。