# 0Buck v3.4 VCC 架构白皮书

## 1. VCC (Vortex Chat Container) 定义
0Buck v3.4 将聊天框从辅助工具提升为系统的全能容器 (Conversational OS)。用户不再通过传统的“页面切换”来操作，而是通过“频道切换”和“功能卡片”来完成所有交互。

### 1.1 核心组件
- **Lounge (社交频道)**: 全球用户共享，展示购买动态与商品发现。
- **Butler (专属管家频道)**: 用户的 1:1 私人助理，处理订单、资产、推荐。
- **Square (系统广播)**: 活动、物流与系统通知。
- **Prime (商品发现流)**: 算法驱动的、以聊天形式呈现的商品信息流。

## 2. BAP (Business Attachment Protocol)
BAP 是 VCC 的核心协议。它将复杂的业务逻辑（如 2x5 矩阵、返现进度条、众筹进度、物流雷达）封装为标准化的 JSON 附件，并通过 Stream Chat 进行分发。

### 2.1 BAP 组件类型
- `0B_PRODUCT_GRID`: 2x5 矩阵，支持直接购买。
- `0B_CASHBACK_RADAR`: 20期返现进度实时追踪。
- `0B_WISH_WELL`: 众筹许愿池，支持点赞投票。
- `0B_LOGISTICS_RADAR`: 实时物流地图与状态。

## 3. 后端逻辑反射 (Brain Logic)
后端监听 Stream Webhooks。当用户输入特定文本或点击卡片操作时，后端反射器执行业务逻辑：
1. **意图解析 (Intent Parsing)**: 提取心智事实（如“我想要黑色的太阳能摄像头”）。
2. **状态同步 (State Sync)**: 自动更新 0Buck DB 与 Shopify 订单状态。
3. **响应分发 (Response Dispatch)**: 在相应的频道内推送新的 BAP 卡片。

## 4. 移动端策略
VCC 天然支持移动端。通过统一的聊天 UI，实现了移动端与 Web 端的 100% 对等体验。
- **Portal Peek**: 点击卡片详情时滑出半屏雾面抽屉，不中断当前对话。

---
*Last Updated: 2026-04-05*
