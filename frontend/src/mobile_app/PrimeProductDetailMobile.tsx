import React from 'react';

export default function PrimeProductDetailMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  IM Mode Header: Persistent Ticker  */}
<header className="fixed top-0 w-full z-50 flex flex-col w-full">
<div className="bg-primary-container text-on-primary-container px-4 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest overflow-hidden">
<div className="flex gap-8 animate-infinite-scroll whitespace-nowrap">
<span>NEW DROP: TITANIUM X-SERIES • 142 SALES IN LAST HOUR • GLOBAL SHIPPING ACTIVE • PRIME MEMBER EXCLUSIVE</span>
<span>NEW DROP: TITANIUM X-SERIES • 142 SALES IN LAST HOUR • GLOBAL SHIPPING ACTIVE • PRIME MEMBER EXCLUSIVE</span>
</div>
</div>
{/*  Shared Component: TopAppBar  */}
<nav className="bg-zinc-950/80 backdrop-blur-xl text-orange-600 fixed top-0 w-full z-50 flex flex-col w-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] mt-[26px]">
<div className="flex items-center justify-between px-4 py-3">
<div className="flex items-center gap-3">
<button className="text-white material-symbols-outlined">arrow_back</button>
<h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-white uppercase tracking-tighter text-lg">Supplier Marketplace</h1>
</div>
<div className="flex items-center gap-4">
<button className="text-white material-symbols-outlined">share</button>
<div className="relative">
<span className="material-symbols-outlined text-white">shopping_cart</span>
<span className="absolute -top-2 -right-2 bg-primary-container text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-zinc-950">3</span>
</div>
</div>
</div>
</nav>
</header>
<main className="mt-[84px] px-0">
{/*  Frosted Image Gallery  */}
<section className="relative w-full aspect-square bg-zinc-900 overflow-hidden">
<div className="absolute inset-0 flex items-center justify-center p-6">
<img className="w-full h-full object-contain rounded-3xl" data-alt="Premium sleek minimalist black smart watch on a reflective dark surface with sharp neon orange light streaks" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9OjVYrP2gmxdiRpRuxj2FgKOwxvsFNTqmIElV0zpGTclI-gunP-MvQkuu5M4z6hKATe2ndOru92RHC-SiX8vIekHRnUXVy0cB--P4hNXlTwslgtjfMclQQkHnCszOL-WjPQ_1ZKSewqO6gqtLv6TaC9qBUDWVYMeuCVzENYAgvcZCA_2W7fyNZJrnVhzipepXLxWlYO__ulOKATOSZRc8hKYSRwOCZq_CpTjpfAIgjKHCL53c1KAdwcLIbJpzx7O96IyqC2FUHMyI"/>
</div>
{/*  Glass Overlay Pagers  */}
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 glass-panel bg-white/10 px-3 py-2 rounded-full">
<div className="w-6 h-1 rounded-full bg-primary-container"></div>
<div className="w-2 h-1 rounded-full bg-white/20"></div>
<div className="w-2 h-1 rounded-full bg-white/20"></div>
<div className="w-2 h-1 rounded-full bg-white/20"></div>
</div>
</section>
{/*  Product Core Info  */}
<section className="px-5 pt-8 bg-[#0a0a0a]">
<div className="flex items-baseline gap-3 mb-2">
<span className="text-4xl font-headline font-extrabold text-white tracking-tighter">$249.00</span>
<span className="text-lg text-zinc-500 line-through font-medium">$399.00</span>
<span className="bg-primary/20 text-primary-container text-[11px] font-black px-2 py-0.5 rounded uppercase tracking-wider">38% OFF</span>
</div>
<h2 className="text-2xl font-headline font-bold text-white leading-tight mb-4">Titanium X-Series Quantum Performance Ledger</h2>
<div className="flex flex-col gap-3 mb-8">
<div className="bg-zinc-900 p-4 rounded-2xl flex items-center justify-between group">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-orange-500">local_shipping</span>
<div>
<p className="text-sm font-bold text-white">Standard Logistics</p>
<p className="text-xs text-zinc-400">Delivered by Oct 24 - Oct 26</p>
</div>
</div>
<span className="text-xs font-bold text-orange-500">FREE</span>
</div>
<div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-zinc-500">eco</span>
<div>
<p className="text-sm font-bold text-zinc-300">Slow &amp; Sustainable</p>
<p className="text-xs text-zinc-500">Delivered in 12-14 days</p>
</div>
</div>
<span className="text-xs font-bold text-green-500">-$15.00 CREDIT</span>
</div>
</div>
{/*  Specs Asymmetric Grid  */}
<div className="grid grid-cols-2 gap-3 mb-8">
<div className="bg-zinc-900 p-4 rounded-2xl">
<p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Architecture</p>
<p className="text-white font-bold">44mm Obsidian</p>
</div>
<div className="bg-zinc-900 p-4 rounded-2xl">
<p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Finish</p>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-600"></div>
<p className="text-white font-bold">Matte Stealth</p>
</div>
</div>
</div>
{/*  Description  */}
<div className="mb-10">
<h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">The Prototype</h3>
<p className="text-zinc-400 leading-relaxed text-sm">
                    Engineered for high-frequency transactions and biometric precision. The Titanium X-Series features a proprietary 0Buck neural chip, allowing sub-second validation of marketplace contracts. Forged from grade-5 titanium with a vapor-deposited carbon coating for ultimate durability in extreme operational environments.
                </p>
</div>
{/*  Merchant Info  */}
<div className="bg-zinc-900 p-6 rounded-3xl mb-10 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-14 h-14 rounded-2xl bg-orange-600/20 flex items-center justify-center">
<span className="material-symbols-outlined text-orange-500 text-3xl">hub</span>
</div>
<div>
<h4 className="text-white font-bold">Prime Nexus Corp</h4>
<div className="flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-orange-500 text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs font-bold text-white">4.9</span>
<span className="text-xs text-zinc-500 ml-1">(12k+ Reviews)</span>
</div>
</div>
</div>
<div className="bg-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
<span className="material-symbols-outlined text-blue-400 text-sm">verified</span>
<span className="text-[10px] font-black text-white">CERTIFIED</span>
</div>
</div>
{/*  Review List  */}
<div className="mb-12">
<div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-headline font-bold text-white">Intelligence Log</h3>
<button className="text-orange-500 text-xs font-bold">View All</button>
</div>
<div className="space-y-6">
<div className="flex flex-col gap-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="text-sm font-bold text-white">user_8829</span>
<span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded">Verified</span>
</div>
<div className="flex gap-0.5">
<span className="material-symbols-outlined text-orange-500 text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-orange-500 text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-orange-500 text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-orange-500 text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-orange-500 text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
</div>
</div>
<p className="text-sm text-zinc-400 italic">"The build quality is insane. Feels like military tech. Transaction speeds are exactly as advertised."</p>
</div>
</div>
</div>
{/*  Recommended Bento  */}
<div className="mb-20">
<h3 className="text-lg font-headline font-bold text-white mb-6">Related Assets</h3>
<div className="grid grid-cols-2 gap-4">
<div className="bg-zinc-900 rounded-3xl p-4 aspect-[4/5] flex flex-col justify-between">
<img className="w-full h-24 object-cover rounded-2xl mb-2" data-alt="Minimalist wrist gadget with glowing orange details on a dark tech background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYpWHOebg8CLJcu_RGBZ58acLdXF5Xbd3yQUyF66anrbsfokFnQNi6cifYLCSVBzaE9IvydzbKO_OPU4GrsFCGDbwf507j1hJjQgpcMIQLuctGt-_D5qzZ9Gx-HAVaeN-4yc2kS1L_vSScRmzVB2IZGGG4ZjfgwF-yMX2T6UwOAEYHsS4S96f2bvLIEUoNmcNOQXXdSuSzXKVxN3t0FfsSbS8um4BwVU9yLf4MW0UAxcUK2g7g_JhbpiXg_iTcGhyj18jZ-Bpb06EJ"/>
<div>
<p className="text-xs font-bold text-white truncate">Onyx Link V2</p>
<p className="text-sm font-black text-orange-500">$89.00</p>
</div>
</div>
<div className="bg-zinc-900 rounded-3xl p-4 aspect-[4/5] flex flex-col justify-between">
<img className="w-full h-24 object-cover rounded-2xl mb-2" data-alt="Futuristic black portable hardware wallet with neon orange interface highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNZlZbWfXg2o5jJvJf1pUlCXh54Vc82_y738qsM4blkIz7fNbY7OcreWzX6UBh1n-ZhwaGYpJxM2x177IodooAaHNpfvLVt_36CYS1WbZJ9JcCTmDckWXFoUK6_ah71qBtOkWLManQMzW1hYAxPLqTwv5LrP9Dwaj2QuROVP9yUxf9XDBqNLZFFSj4736qVvwfKpKnxHPhMDau6BlwvheIaPsAlSxco65o1vNoL4h1ew7bCPhoRc3w3ZPgEOCuriIFEnCZqLgp7klZ"/>
<div>
<p className="text-xs font-bold text-white truncate">Vault Key Gen-4</p>
<p className="text-sm font-black text-orange-500">$120.00</p>
</div>
</div>
</div>
</div>
</section>
</main>
{/*  Floating AI Butler  */}
<div className="fixed right-6 bottom-32 z-50">
<div className="relative group">
<div className="absolute -inset-2 bg-orange-600 rounded-full blur-lg opacity-40 animate-pulse"></div>
<button className="relative w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center border border-orange-500/30">
<span className="material-symbols-outlined text-orange-500 text-3xl">smart_toy</span>
</button>
<div className="absolute right-0 -top-12 bg-white px-3 py-1 rounded-xl text-[10px] font-bold text-black whitespace-nowrap shadow-xl">
                Ask about specs?
            </div>
</div>
</div>
{/*  Sticky Bottom Bar  */}
<div className="fixed bottom-0 left-0 w-full z-50">
{/*  Shared Component: BottomNavBar (Background Logic)  */}
<div className="bg-zinc-950/90 backdrop-blur-2xl px-5 pb-8 pt-4 border-t border-white/5 flex gap-4 items-center">
<button className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 active:scale-95 transition-transform">
<span className="material-symbols-outlined">favorite</span>
</button>
<button className="flex-1 h-14 bg-zinc-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl active:scale-95 transition-transform">
                Add to Cart
            </button>
<button className="flex-[1.5] h-14 bg-gradient-to-br from-primary to-primary-container text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-orange-900/40 active:scale-95 transition-transform">
                Buy Now
            </button>
</div>
</div>
{/*  Navigation Shadow Element (Required by UI)  */}
<div className="hidden">
{/*  Mapping to BottomNavBar for Contextual Suppression Rules  */}
<div className="style_active_navigation">flex flex-col items-center justify-center bg-orange-600/20 text-orange-500 rounded-2xl px-4 py-1.5</div>
<div className="style_inactive_navigation">flex flex-col items-center justify-center text-zinc-500</div>
</div>

    </div>
  );
}
