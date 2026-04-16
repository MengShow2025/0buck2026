# 商品详情页布局与交互优化计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 优化商品详情页布局，实现规格选择联动大图和价格，并统一品牌风格。

**Architecture:** 
- 使用 React `useState` 管理规格索引和数量。
- 采用 `var(--wa-teal)` 品牌色。
- 调整布局顺序：大图 -> 缩略图滑块 -> 标题 -> 规格 -> 价格栏 -> 运费/数量。

**Tech Stack:** React, Tailwind CSS, Lucide-React.

---

### Task 1: 数据模型升级与状态管理

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/ProductDetailDrawer.tsx`

- [ ] **Step 1: 升级 Mock 数据结构**
在 `product` 对象中添加具体的 `variations` 数组，每个规格包含名称、价格和对应图片。

```tsx
  const product = {
    // ... 其他数据
    variations: [
      { name: 'Natural Bamboo', price: '29.99', image: `https://picsum.photos/seed/vcc1/800/800` },
      { name: 'Obsidian Black', price: '34.99', image: `https://picsum.photos/seed/vcc2/800/800` },
      { name: 'Arctic White', price: '32.99', image: `https://picsum.photos/seed/vcc3/800/800` },
      { name: 'Cyber Teal', price: '39.99', image: `https://picsum.photos/seed/vcc4/800/800` },
    ],
    // ... 其他数据
  };
```

- [ ] **Step 2: 添加状态变量**
添加 `selectedVariationIndex` 用于追踪用户选择的规格。

```tsx
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const currentPrice = parseFloat(product.variations[selectedVarIndex].price);
  const totalPrice = (currentPrice * quantity).toFixed(2);
```

### Task 2: 顶部大图与缩略图滑块布局

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/ProductDetailDrawer.tsx`

- [ ] **Step 1: 实现顶部大图联动**
大图展示 `product.variations[selectedVarIndex].image`。

- [ ] **Step 2: 添加缩略图滑块 (下方)**
在大图下方增加一个水平滑动的 `div`，展示所有规格图片。

```tsx
      {/* 1. Main Product Featured Image */}
      <div className="relative w-full aspect-square bg-gray-200 dark:bg-white/5 overflow-hidden">
        <button onClick={() => setActiveDrawer('prime')} className="...">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <img src={product.variations[selectedVarIndex].image} alt="Featured" className="w-full h-full object-cover transition-all duration-500" />
      </div>

      {/* 2. Horizontal Gallery Slider */}
      <div className="flex gap-3 px-5 py-4 overflow-x-auto no-scrollbar bg-white dark:bg-[#1C1C1E]">
        {product.variations.map((v, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedVarIndex(idx)}
            className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
              selectedVarIndex === idx ? 'border-[var(--wa-teal)] scale-105 shadow-lg' : 'border-transparent opacity-60'
            }`}
          >
            <img src={v.image} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
```

### Task 3: 规格选择与价格栏位置调整

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/ProductDetailDrawer.tsx`

- [ ] **Step 1: 渲染规格选择区域**
在标题下方显示规格选择按钮。

- [ ] **Step 2: 移动价格栏到规格下方**
将价格展示（单价、总价、100% BACK 标签）移动到规格选择区域之后。

```tsx
      {/* 3. Product Title & Info */}
      <div className="bg-white dark:bg-[#1C1C1E] px-5 py-4 border-t border-gray-50 dark:border-white/5">
        <h1 className="text-[16px] font-black text-gray-900 dark:text-white leading-tight italic">{product.title}</h1>
        {/* Rating... */}
      </div>

      {/* 4. Variations Selection */}
      <div className="mt-2 bg-white dark:bg-[#1C1C1E] p-5">
        <h3 className="text-[14px] font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Select Variation</h3>
        <div className="flex flex-wrap gap-2">
          {product.variations.map((v, idx) => (
            <button 
              key={idx}
              onClick={() => setSelectedVarIndex(idx)}
              className={`px-4 py-2 rounded-xl text-[13px] font-black border-2 transition-all ${
                selectedVarIndex === idx 
                ? 'bg-[var(--wa-teal)] border-[var(--wa-teal)] text-white shadow-md' 
                : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Price Bar (Now below Variations) */}
      <div className="mt-2 bg-white dark:bg-[#1C1C1E] p-5 border-t border-gray-50 dark:border-white/5">
        <div className="flex items-baseline gap-3">
          <span className="text-[32px] font-black text-gray-900 dark:text-white tracking-tighter">${currentPrice}</span>
          <span className="text-[16px] text-gray-400 line-through font-bold opacity-60">${product.originalPrice}</span>
          <div className="ml-auto flex flex-col items-end">
            <span className="text-[12px] text-gray-400 font-bold uppercase">Total</span>
            <span className="text-[18px] font-black text-[var(--wa-teal)]">${totalPrice}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-[var(--wa-teal)]/10 text-[var(--wa-teal)] text-[10px] font-black px-2.5 py-1 rounded-full border border-[var(--wa-teal)]/20">
            100% BACK
          </div>
          <span className="text-[12px] text-gray-400 font-bold">In 20 Phases</span>
        </div>
      </div>
```

### Task 4: 底部按钮风格统一与最终校验

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/ProductDetailDrawer.tsx`

- [ ] **Step 1: 统一按钮风格**
使用 `var(--wa-teal)` 品牌色，采用 32px 圆角和磨砂效果。

```tsx
      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-3xl border-t border-white/40 dark:border-white/10 p-6 pb-12 flex gap-4 z-40">
        <button className="flex-1 h-16 rounded-[32px] border-2 border-[var(--wa-teal)] text-[var(--wa-teal)] font-black text-[16px] active:scale-95 transition-all">
          加入购物车
        </button>
        <button className="flex-1 h-16 rounded-[32px] bg-[var(--wa-teal)] text-white font-black text-[16px] active:scale-95 transition-all shadow-[0_15px_30px_-10px_rgba(var(--wa-teal-rgb),0.6)]">
          立即购买
        </button>
      </div>
```

- [ ] **Step 2: 验证交互**
确认：
1. 选择规格后，大图切换为对应图片。
2. 选择规格后，单价更新。
3. 修改数量后，总价（Total）实时更新。
4. 页面滚动流畅，无样式错位。
