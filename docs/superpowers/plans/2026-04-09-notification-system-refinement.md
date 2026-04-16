# Notification System Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Service Notification page to be more compact, feature more notification types, and align with the iOS 26 glassmorphism aesthetic.

**Architecture:** Use a component-based approach within `NotificationDrawer.tsx` to handle different notification types. Each type will have a unique icon, color scheme, and data structure, all wrapped in a compact, highly polished iOS-style card.

**Tech Stack:** React, Tailwind CSS, Lucide React, Framer Motion.

---

### Task 1: Refactor NotificationDrawer Layout and Data

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/NotificationDrawer.tsx`

- [ ] **Step 1: Define expanded notification types and mock data.**

```typescript
const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'payment_success',
    title: '支付成功通知',
    time: '10:42',
    details: [
      { label: '订单金额', value: '$29.99' },
      { label: '支付方式', value: 'Credit Card (Visa)' },
      { label: '订单编号', value: 'ORD-20260409-77X' }
    ],
    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    color: 'bg-green-500/10',
    hasDetail: true
  },
  {
    id: 'n2',
    type: 'order_status',
    title: '订单状态变更',
    time: '09:15',
    details: [
      { label: '最新状态', value: '卖家已发货' },
      { label: '物流公司', value: '云途物流 (YunExpress)' },
      { label: '运单号', value: 'YT9988776655' }
    ],
    icon: <Truck className="w-5 h-5 text-blue-500" />,
    color: 'bg-blue-500/10',
    hasDetail: true
  },
  {
    id: 'n3',
    type: 'activity',
    title: '平台限时活动',
    time: '昨天',
    details: [
      { label: '活动名称', value: '0Buck 极客周' },
      { label: '优惠力度', value: '全场 100% BACK + 额外积分' }
    ],
    footer: '点击查看详情，抢先预约！',
    icon: <Zap className="w-5 h-5 text-purple-500" />,
    color: 'bg-purple-500/10',
    hasDetail: true
  },
  {
    id: 'n4',
    type: 'wishlist',
    title: '心愿清单更新',
    time: '昨天',
    details: [
      { label: '商品名称', value: 'Minimalist Titanium Mechanical Watch' },
      { label: '当前进度', value: '已集齐 85% 心愿，即将启动生产' }
    ],
    icon: <Heart className="w-5 h-5 text-pink-500" />,
    color: 'bg-pink-500/10',
    hasDetail: true
  },
  {
    id: 'n5',
    type: 'restock',
    title: '到货提醒',
    time: '04-08',
    details: [
      { label: '到货商品', value: 'Ergonomic Aluminum Laptop Stand' },
      { label: '库存数量', value: '极少量到货，手慢无' }
    ],
    icon: <ShoppingBag className="w-5 h-5 text-orange-500" />,
    color: 'bg-orange-500/10',
    hasDetail: true
  },
  {
    id: 'n6',
    type: 'reply',
    title: '客服回复通知',
    time: '04-07',
    details: [
      { label: '咨询问题', value: '关于签到返现卡的使用规则' },
      { label: '回复内容', value: '亲爱的用户，签到卡可以在断签 5 天内补救...' }
    ],
    icon: <MessageSquare className="w-5 h-5 text-teal-500" />,
    color: 'bg-teal-500/10',
    hasDetail: true
  }
];
```

- [ ] **Step 2: Update the JSX to be more compact and align with iOS 26 style.**
- Reduce vertical padding in `px-5 py-4` to `px-4 py-3`.
- Use tighter gaps in `space-y-6` to `space-y-4`.
- Refine the card border and background for better glassmorphism.

- [ ] **Step 3: Implement conditional rendering for different notification type layouts.**
- Ensure that "invite" type (from previous iteration) is still handled correctly.
- Add specific styling for "payment_success" (green accent) and "activity" (glow effect).

- [ ] **Step 4: Commit the changes.**

```bash
git add frontend/src/components/VCC/Drawer/NotificationDrawer.tsx
git commit -m "feat: refine notification system with compact iOS 26 cards and multiple types"
```

---
