# 商品卡片布局细化与商城比例优化计划 (Card Layout Refinement & Prime Ratio Optimization)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按照用户要求，对调 100% BACK 标签与价格位置，优化折扣角标位置，并统一商城页面的图片比例为 1:1。

**Architecture:** 
- 修改通用 BAP 卡片组件 `ProductGridCard.tsx` 的布局。
- 修改商城组件 `PrimeDrawer.tsx` 的布局与图片比例。
- 确保所有位置（商城、聊天、详情页）的商品信息层级和样式完全一致。
- 针对 Unsplash 图片加载报错 (ERR_BLOCKED_BY_ORB) 进行修复，尝试添加 `crossOrigin` 或优化 URL 参数。

**Tech Stack:** React, Tailwind CSS, Lucide Icons, Framer Motion.

---

### Task 1: 调整 ProductGridCard 布局 (Adjust BAP Card Layout)

**Files:**
- Modify: `frontend/src/components/VCC/BAPCards/ProductGridCard.tsx`

- [ ] **Step 1: 对调 100% BACK 与价格位置，并将折扣标签移到原价旁**

```tsx
        {/* Pricing & 100% BACK Row */}
        <div className="flex justify-between items-end pt-1">
          {/* 100% BACK on the LEFT */}
          <div className="text-[11px] text-orange-600 dark:text-orange-400 font-black bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 uppercase tracking-wider shadow-sm">
            100% BACK
          </div>
          
          {/* Price & Discount on the RIGHT */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] font-black text-[var(--wa-teal)] leading-none tracking-tighter">${data.price.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[14px] text-gray-400 line-through font-bold opacity-60">${data.original_price.toFixed(2)}</span>
              <div className="bg-red-500/10 text-red-500 text-[10px] font-black px-1.5 py-0.5 rounded border border-red-500/10 uppercase tracking-tighter">
                -{discount}% OFF
              </div>
            </div>
          </div>
        </div>
```

- [ ] **Step 2: 验证布局是否对齐且符合“100% back 必须一行”的要求**

### Task 2: 调整 PrimeDrawer 商城列表布局 (Adjust Prime Mall List Layout)

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/PrimeDrawer.tsx`

- [ ] **Step 1: 将图片比例修改为 1:1 (Square)**

```tsx
            {/* Image */}
            <div className="relative bg-gray-100 dark:bg-gray-800 overflow-hidden aspect-square">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
```

- [ ] **Step 2: 对调 100% BACK 与价格位置，同步 ProductGridCard 的样式**

```tsx
              <div className="flex items-end justify-between pt-1">
                {/* 100% BACK on the LEFT */}
                <div className="text-[9px] font-black text-orange-600 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/20 uppercase tracking-tight">
                  100% BACK
                </div>

                {/* Price & Discount on the RIGHT */}
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[var(--wa-teal)] font-black text-[18px] leading-none tracking-tighter">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-gray-400 text-[10px] line-through font-bold opacity-60">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-1 py-0.5 rounded border border-red-500/10">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
```

### Task 3: 修复 Unsplash 图片加载报错 (Fix Unsplash Image Error)

**Files:**
- Modify: `frontend/src/components/VCC/BAPCards/ProductGridCard.tsx`
- Modify: `frontend/src/components/VCC/Drawer/PrimeDrawer.tsx`
- Modify: `frontend/src/components/VCC/Drawer/ProductDetailDrawer.tsx`

- [ ] **Step 1: 为所有 <img> 标签添加 crossOrigin="anonymous" 和 referrerPolicy="no-referrer"**
- [ ] **Step 2: 优化 Unsplash URL 参数，确保 fm=jpg 等参数明确资源类型**

```tsx
// 示例修改
const cleanUnsplashUrl = (url: string) => {
  if (url.includes('unsplash.com')) {
    return `${url}&fm=jpg&q=80`;
  }
  return url;
};
```

- [ ] **Step 3: 检查控制台是否仍有 ERR_BLOCKED_BY_ORB 报错**

### Task 4: 最终核对与视觉对齐 (Final Audit & Visual Alignment)

- [ ] **Step 1: 检查聊天中的 BAP 卡片是否对齐**
- [ ] **Step 2: 检查商城列表卡片是否对齐**
- [ ] **Step 3: 检查商品详情页头部的价格展示是否逻辑一致**

---
