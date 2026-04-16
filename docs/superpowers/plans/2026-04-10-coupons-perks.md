# 卡券与权益 (Coupons & Perks) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建“卡券与权益”双轨制抽屉页面，实现平台非财务虚拟资产（如续签卡）与 Shopify 财务折扣券的隔离展示和智能推荐架构。

**Architecture:** 
在现有的 `GlobalDrawer` 体系下，新增 `CouponsDrawer` 组件。该组件通过双 Tab 结构隔离“购物折扣 (Shopify Coupons)”和“平台权益 (Platform Perks)”。设计采用高保真 UI，区分出“打孔票据样式”和“实体黑金卡片样式”两种视觉语言，并建立完善的 Empty State 引导链路。

**Tech Stack:** React, Tailwind CSS, Framer Motion, Lucide Icons

---

### Task 1: 定义并挂载 CouponsDrawer 到全局抽屉系统

**Files:**
- Create: `frontend/src/components/VCC/Drawer/CouponsDrawer.tsx`
- Modify: `frontend/src/components/VCC/AppContext.tsx`
- Modify: `frontend/src/components/VCC/Drawer/GlobalDrawer.tsx`
- Modify: `frontend/src/components/VCC/Drawer/MeDrawer.tsx`

- [ ] **Step 1: 更新 AppContext.tsx 添加抽屉类型**
  
在 `DrawerType` 联合类型中增加 `'coupons'`。

```typescript
export type DrawerType = 
  | 'none' 
  | 'product_detail' 
  // ... other types ...
  | 'coupons'
  | 'settings';
```

- [ ] **Step 2: 创建 CouponsDrawer 的基础骨架**

在 `frontend/src/components/VCC/Drawer/CouponsDrawer.tsx` 创建一个空组件：

```tsx
import React, { useState } from 'react';
import { Ticket, Crown } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const CouponsDrawer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'platform'>('store');
  const { pushDrawer } = useAppContext();

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden">
      {/* Tabs */}
      <div className="flex px-4 py-3 bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-white/5 sticky top-0 z-10">
        <button 
          onClick={() => setActiveTab('store')}
          className={`flex-1 flex justify-center items-center gap-2 py-2 text-[14px] font-bold rounded-xl transition-colors ${
            activeTab === 'store' ? 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Store Coupons
        </button>
        <button 
          onClick={() => setActiveTab('platform')}
          className={`flex-1 flex justify-center items-center gap-2 py-2 text-[14px] font-bold rounded-xl transition-colors ${
            activeTab === 'platform' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          <Crown className="w-4 h-4" />
          Platform Perks
        </button>
      </div>

      {/* Content Area placeholder */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="text-center text-gray-500 mt-10">
          Content for {activeTab} goes here
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: 在 GlobalDrawer 中注册 CouponsDrawer**

在 `frontend/src/components/VCC/Drawer/GlobalDrawer.tsx` 的顶部导入：
```tsx
import { CouponsDrawer } from './CouponsDrawer';
```

在 `titles` 对象中添加标题：
```tsx
const titles: Record<DrawerType, string> = {
  // ...
  coupons: '卡券与权益',
  // ...
};
```

在 `renderContent` 函数中添加路由分支：
```tsx
switch (activeDrawer) {
  // ...
  case 'coupons':
    return <CouponsDrawer />;
  // ...
}
```

- [ ] **Step 4: 在 MeDrawer 中接通入口**

在 `frontend/src/components/VCC/Drawer/MeDrawer.tsx` 找到“卡券与权益”按钮，修改其 `onClick` 事件：

```tsx
<button 
  onClick={() => pushDrawer('coupons')}
  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 group"
>
  {/* Existing content */}
</button>
```

---

### Task 2: 实现“购物折扣卡” (Store Coupons) 的 UI 渲染与 Mock 数据

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/CouponsDrawer.tsx`

- [ ] **Step 1: 添加 Store Coupons 的 Mock 数据**

在 `CouponsDrawer.tsx` 顶部添加数据：

```tsx
const MOCK_STORE_COUPONS = [
  {
    id: 'c1',
    value: '$10',
    type: 'Cash OFF',
    title: 'New User Bonus',
    condition: 'Min. spend $50',
    validUntil: 'Oct 31, 2026',
    status: 'available',
    code: 'WELCOME10'
  },
  {
    id: 'c2',
    value: '20%',
    type: 'Discount',
    title: 'Geek Week Special',
    condition: 'Applicable to Electronics',
    validUntil: 'Expiring in 2 days',
    status: 'expiring_soon',
    code: 'GEEK20'
  },
  {
    id: 'c3',
    value: 'Free',
    type: 'Shipping',
    title: 'Free Shipping Voucher',
    condition: 'No minimum spend',
    validUntil: 'Oct 15, 2026',
    status: 'used',
    code: 'FREESHIP'
  }
];
```

- [ ] **Step 2: 渲染打孔票据风格的 Store Coupons**

在 `CouponsDrawer` 中实现渲染逻辑：

```tsx
const renderStoreCoupons = () => {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_STORE_COUPONS.map(coupon => (
        <div 
          key={coupon.id} 
          className={`relative rounded-2xl overflow-hidden flex shadow-sm border ${
            coupon.status === 'used' 
              ? 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-60' 
              : 'bg-white dark:bg-[#1C1C1E] border-orange-100 dark:border-orange-500/20'
          }`}
        >
          {/* Left Value Area (Ticket stub) */}
          <div className={`w-[100px] flex flex-col items-center justify-center p-4 border-r-2 border-dashed ${
            coupon.status === 'used' 
              ? 'bg-gray-200 dark:bg-white/10 border-gray-300 dark:border-white/20' 
              : 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30'
          } relative`}>
            {/* Top and Bottom cutouts for ticket effect */}
            <div className={`absolute -top-3 -right-3 w-6 h-6 rounded-full ${coupon.status === 'used' ? 'bg-gray-50 dark:bg-black' : 'bg-gray-50 dark:bg-black'}`}></div>
            <div className={`absolute -bottom-3 -right-3 w-6 h-6 rounded-full ${coupon.status === 'used' ? 'bg-gray-50 dark:bg-black' : 'bg-gray-50 dark:bg-black'}`}></div>
            
            <span className={`text-[28px] font-black leading-none ${coupon.status === 'used' ? 'text-gray-400 dark:text-gray-500' : 'text-orange-600 dark:text-orange-500'}`}>{coupon.value}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${coupon.status === 'used' ? 'text-gray-400 dark:text-gray-500' : 'text-orange-500/80 dark:text-orange-400/80'}`}>{coupon.type}</span>
          </div>

          {/* Right Details Area */}
          <div className="flex-1 p-4 flex flex-col justify-between relative">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-[15px] font-black tracking-tight ${coupon.status === 'used' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{coupon.title}</h3>
                {coupon.status === 'expiring_soon' && (
                  <span className="text-[9px] font-bold bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Expiring</span>
                )}
              </div>
              <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-3">{coupon.condition}</p>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-[11px] font-medium ${coupon.status === 'expiring_soon' ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {coupon.validUntil}
              </span>
              {coupon.status !== 'used' && (
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold px-4 py-1.5 rounded-lg transition-colors active:scale-95 shadow-sm">
                  去使用
                </button>
              )}
              {coupon.status === 'used' && (
                <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500">已失效</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 3: 替换 Content Area**

在 `CouponsDrawer` 的 `return` 中，将 Content Area placeholder 替换为：
```tsx
{/* Content Area */}
<div className="flex-1 overflow-y-auto p-4 pb-24">
  {activeTab === 'store' ? renderStoreCoupons() : <div className="text-center text-gray-500 mt-10">Platform Perks Content</div>}
</div>
```

---

### Task 3: 实现“平台权益” (Platform Perks) 的 UI 渲染与 Mock 数据

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/CouponsDrawer.tsx`

- [ ] **Step 1: 添加 Platform Perks 的 Mock 数据**

在文件顶部添加数据，并导入所需图标：
```tsx
import { Ticket, Crown, ShieldCheck, Zap, ArrowRight, CalendarClock, Cpu } from 'lucide-react';

const MOCK_PLATFORM_PERKS = [
  {
    id: 'p1',
    icon: <CalendarClock className="w-8 h-8 text-indigo-400" />,
    title: '1-Day Renewal Card',
    subtitle: 'Save your broken check-in streak',
    desc: '挽救断签记录，仅限当期使用 1 次。',
    bg: 'bg-gradient-to-br from-indigo-900 to-slate-900',
    border: 'border-indigo-500/30',
    actionText: '去签到中心查看'
  },
  {
    id: 'p2',
    icon: <Crown className="w-8 h-8 text-yellow-400" />,
    title: 'KOL Verification Badge',
    subtitle: 'Exclusive influencer status',
    desc: '达人专属标识，解锁更高分销奖励比例。',
    bg: 'bg-gradient-to-br from-yellow-900 to-slate-900',
    border: 'border-yellow-500/30',
    actionText: '查看达人权益'
  },
  {
    id: 'p3',
    icon: <Cpu className="w-8 h-8 text-emerald-400" />,
    title: 'AI Compute Token (1M)',
    subtitle: '1,000,000 PTS balance',
    desc: '大模型算力积分，用于免费调用平台高级 AI 模型。',
    bg: 'bg-gradient-to-br from-emerald-900 to-slate-900',
    border: 'border-emerald-500/30',
    actionText: '去充值中心'
  }
];
```

- [ ] **Step 2: 渲染黑金实体卡片风格的 Platform Perks**

在 `CouponsDrawer` 中实现渲染逻辑：

```tsx
const renderPlatformPerks = () => {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_PLATFORM_PERKS.map(perk => (
        <div 
          key={perk.id} 
          className={`relative rounded-2xl overflow-hidden shadow-lg border ${perk.border} ${perk.bg} text-white p-5 group cursor-pointer hover:scale-[1.01] transition-transform duration-300`}
        >
          {/* Holographic accent effect */}
          <div className="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 rotate-45 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              {perk.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-black tracking-tight leading-tight mb-0.5">{perk.title}</h3>
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-2">{perk.subtitle}</p>
              <p className="text-[13px] font-medium text-white/80 leading-snug mb-4">{perk.desc}</p>
              
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-white/90 group-hover:text-white transition-colors">
                {perk.actionText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 3: 更新 Content Area 路由**

修改 `return` 中的内容区：
```tsx
{/* Content Area */}
<div className="flex-1 overflow-y-auto p-4 pb-24">
  {activeTab === 'store' ? renderStoreCoupons() : renderPlatformPerks()}
</div>
```

---

### Task 4: 实现高转化的 Empty State (空状态引导)

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/CouponsDrawer.tsx`

- [ ] **Step 1: 添加 Empty State 组件逻辑**

在 `CouponsDrawer` 中添加控制空状态的逻辑（这里为了演示，假设 `MOCK_STORE_COUPONS` 或 `MOCK_PLATFORM_PERKS` 长度为 0 时触发，我们可以通过手动清空数组来测试，或者直接写死一个条件渲染）：

```tsx
// 在 renderStoreCoupons 开头添加
if (MOCK_STORE_COUPONS.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-orange-100 dark:border-orange-500/20">
        <Ticket className="w-10 h-10 text-orange-400 dark:text-orange-500" />
      </div>
      <h3 className="text-[18px] font-black text-gray-900 dark:text-white mb-2 tracking-tight">暂无可用购物折扣</h3>
      <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
        前往活动中心领取海量无门槛折扣券，结账时系统将为您自动匹配最优优惠！
      </p>
      <button className="bg-orange-500 hover:bg-orange-600 text-white text-[15px] font-black px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-transform active:scale-95 w-full max-w-[240px]">
        去拿券 (Get Coupons)
      </button>
    </div>
  );
}

// 在 renderPlatformPerks 开头添加
if (MOCK_PLATFORM_PERKS.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-indigo-100 dark:border-indigo-500/20">
        <Crown className="w-10 h-10 text-indigo-400 dark:text-indigo-500" />
      </div>
      <h3 className="text-[18px] font-black text-gray-900 dark:text-white mb-2 tracking-tight">暂无平台特权</h3>
      <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
        您可以使用积分兑换续签卡、解锁高级会员标识，享受更多平台专属权益。
      </p>
      <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-[15px] font-black px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 w-full max-w-[240px]">
        去积分商城兑换
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 测试与提交**

运行测试，确保在 MeDrawer 点击“卡券与权益”后能正常弹出，并且 Tab 切换顺滑，UI 渲染符合预期。

```bash
# Verify no build errors
npm run build
```