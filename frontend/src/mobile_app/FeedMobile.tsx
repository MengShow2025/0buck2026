import React from 'react';

export default function FeedMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  TopAppBar  */}
<header className="bg-zinc-950/80 backdrop-blur-xl font-['Plus_Jakarta_Sans'] font-bold tracking-tight docked full-width top-0 sticky shadow-[0_8px_32px_rgba(175,48,0,0.15)] z-50 flex justify-between items-center px-6 py-4 w-full">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-2xl" data-icon="bubble_chart">bubble_chart</span>
<h1 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-orange-700 to-orange-400">0Buck</h1>
</div>
<div className="flex items-center gap-4">
<button className="hover:bg-orange-500/10 hover:text-orange-400 transition-colors scale-95 active:duration-150 p-2 rounded-full">
<span className="material-symbols-outlined text-orange-500" data-icon="support_agent">support_agent</span>
</button>
</div>
</header>
<main className="pb-32">
{/*  IM Style Product Scroller  */}
<section className="mt-2 px-4">
<div className="flex overflow-x-auto gap-4 py-4 no-scrollbar">
{/*  Product Items  */}
<div className="flex-shrink-0 flex flex-col items-center gap-2">
<div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center p-1 relative ring-2 ring-primary/20">
<img alt="" className="w-full h-full object-cover rounded-xl" data-alt="sleek red high-performance running shoe on a minimalist dark background with neon orange accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDS3zNFvYOy7Yh-YFy6zojWS2YE7IUvaaHQV2SmOZhESwpbLQn2zOgnwoyE1zlcZGqYF7MWkk98OXTsiCrWgWuZGSfDj45U59cGVxPvJVQnGdvcwoOKyP5R7o7pd960fca1w2QZtMUxnLkHKSvg0oYEObNPH3m-O66w8H3rEoDY1V8QZlsFde8yk7LpWtrbfCl3e6jLhUmY4U_tS73IoxfIH8Eic4cqdtT6N8QAvmC5Q1Mv4xZ-WtCxRyVCEGBGOTQc8rSDMmXofle"/>
<span className="absolute -bottom-1 -right-1 bg-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white">$0.00</span>
</div>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2">
<div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center p-1 relative ring-1 ring-white/5">
<img alt="" className="w-full h-full object-cover rounded-xl" data-alt="premium silver metallic watch with sapphire glass face lying on dark velvet surface with soft rim lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDprE4XWkMsLxfF2rtZpmRkH-C0zym5xAGGQmI5kJB7xzzKWMLiHgXlbaZsoo8Ne9Dw94REGqDE3o-3UYc8a-9Wh75Gf5_8g7-kNLHiPHeUJf_6tq2rYtrZ4P86dG0fwb7xKsBYO_9PUElWRn6VcqlCUB5jfmBQOP_XiJJFMJWeb03Tvh575FZtpAyq9B42jKmcK47MIGj_KtWNvZmSs72UYDY0LFfAF_9-cUH45iu2ukGoPhpc4FK4mQuW_20Wez1FANvyMgA7dwAI"/>
<span className="absolute -bottom-1 -right-1 bg-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white">$0.00</span>
</div>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2">
<div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center p-1 relative ring-1 ring-white/5">
<img alt="" className="w-full h-full object-cover rounded-xl" data-alt="professional matte black noise cancelling headphones on a clean studio background with orange ambient light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHYZ-_IdeME5u2a42ANOzitaHGPtx0vOzlcbQnvYQWhrRsJdir1hD9DT_13h84s54-SV4_BYL1xMuzpd35sWfUZZlv61RI56uT4u55A1lhownr19DY8Y5T8Z2oV3AntPomgXet1yG4LFXkj-zrr0bLx69A2MW5qWwuSgCoU58V9pMhXuYiwqNJSdXNs6zzIWPO-hPfuAOEDCEYrkpkIUKnOd31xd6jfE4575fmHPQUYtZKV1OOU_-om26Mm4gTTGlF5IJUO0YBL-Lg"/>
<span className="absolute -bottom-1 -right-1 bg-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white">$0.00</span>
</div>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2">
<div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center p-1 relative ring-1 ring-white/5">
<img alt="" className="w-full h-full object-cover rounded-xl" data-alt="vintage style orange instant camera on textured concrete surface with soft dramatic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2_S4qpBq8sebAyNN0wFWL5Fzs9oVcIbYv97guktlPGaX8e-7DlpdKilsr9yU9pqkRY5yGZdonmo1AyD7t6VIXmFda2FLxizebi3JfgrwT8WYxrEB4EAF_v6cRA9kGrDr8z_hZSW9E4bb-iNBUMv0Gt1JlPFcC-Yz73rKytp9CMQObqFLwuTu6GRw7hpeaEgvXy66YloHkNJDrLW4QD2gfQtD0NBDx1rXB2NRfxSXe0w-YCLpgsjCrcisvtD7E4YDQMClEkZqowO3n"/>
<span className="absolute -bottom-1 -right-1 bg-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white">$0.00</span>
</div>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2">
<div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center p-1 relative ring-1 ring-white/5">
<img alt="" className="w-full h-full object-cover rounded-xl" data-alt="luxury designer sunglasses with orange tinted lenses on black reflective surface with sharp lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg1TItwAbfqONnxpKRzmHDJRQ4srEYeJ5gCXO5W7R_fuF34ANTHRPUG25cPryFhMpNal9kGRSkV8NUiL9-NfIpO8ZzodqnXVog97-APihA1MPskgbP62x4TxanTdlRRSKD5NXKBWkxsUGv0Siq8KhaDjafYUDUCDtGwK-4xfyJjgyuxBJ5PXWiT6NbjWL_sm1YdUfxpktaKK_YjKvCERfkQQJme-hL23n_M1hinY-5Is_gn_vp0dWmu_D8BN7vWPXb3Crd19HfBK7x"/>
<span className="absolute -bottom-1 -right-1 bg-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white">$0.00</span>
</div>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2">
<div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center p-1 relative ring-1 ring-white/5">
<img alt="" className="w-full h-full object-cover rounded-xl" data-alt="sleek modern ergonomic wireless mouse in graphite grey with orange scroll wheel accent" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVopaB6cC1Dtfmehot6U_BAu5v4YkDhh5FaX6IIHDqVtvBWNpomSbQK448qOUSKB0lffy9E5E8b8-NmG5UepsHpvTq-Z9ZdR6CVTOH3jrgADO-3uB8UybV2OAbfeacjfnkDCXzVGrvzSwqlKCpcjWcH3MR62RozBFn_9-BIx_iZE6WmQhobt9SxbSivGOuL5P3aqWnZ9V-zbq3VzEgAq8IdJAJkSBkxJn4NpW0p6epUZQg9ggmDJ6oePD9ybwFQ_42XGOuFXxmvXmF"/>
<span className="absolute -bottom-1 -right-1 bg-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white">$0.00</span>
</div>
</div>
</div>
</section>
{/*  New Drops Banner  */}
<section className="px-4 mt-2">
<div className="relative overflow-hidden rounded-3xl h-32 bg-gradient-to-br from-orange-950 to-zinc-950 flex items-center px-8">
<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&amp;fit=crop&amp;q=80&amp;w=800')] opacity-20 mix-blend-overlay" data-alt="abstract flowing orange and black silk texture with deep shadows and soft highlights"></div>
<div className="relative z-10 space-y-1">
<div className="inline-flex items-center gap-2 bg-primary/20 text-primary-container text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        Live Now
                    </div>
<h2 className="text-2xl font-black font-headline text-white leading-none">New Drops</h2>
<p className="text-on-secondary-container text-xs font-medium">Flash releases every 15 minutes</p>
</div>
<div className="ml-auto relative z-10 flex -space-x-4">
<div className="w-12 h-12 rounded-full border-4 border-zinc-950 overflow-hidden">
<img alt="" className="w-full h-full object-cover" data-alt="minimalist white headphones studio shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEnaNVrv_FZMo5DuJE0HanNzrVi757PTg2St2hak_vB6JVlztgV221ZeE4EBFOdXlSBffBbOPE4DAvaJhb7YvqODCOp3OgWUDt0B5-Up9N0UftbQON6OQQMYNI-juIPNICf-rtko84x4AGdh9-l_BvXU4QUurjaknRrjKwm0j8ogXX3OIZUlcknS83eIM1I7hVa1Aw4iQUB0_SSfYwtkdgYKHPVn5qTZW3S79MCzg7GS1G49Sg_QAwHu6yIzsqDsIPIfijh3CimgSR"/>
</div>
<div className="w-12 h-12 rounded-full border-4 border-zinc-950 overflow-hidden bg-orange-600 flex items-center justify-center text-white text-xs font-black">
                        +24
                    </div>
</div>
</div>
</section>
{/*  Feed Content  */}
<section className="mt-8 px-4 space-y-4">
{/*  Logistic Tracking (Bento Item)  */}
<div className="bg-surface-container-high rounded-3xl p-6 relative overflow-hidden group">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
<span className="material-symbols-outlined" data-icon="local_shipping">local_shipping</span>
</div>
<div>
<h3 className="font-bold text-sm">Logistics Update</h3>
<p className="text-[10px] text-on-secondary-container uppercase tracking-wider">Order #882910</p>
</div>
</div>
<span className="text-[10px] text-on-secondary-container">2m ago</span>
</div>
<div className="space-y-4">
<div className="flex items-center gap-4">
<div className="flex flex-col items-center">
<div className="w-2 h-2 rounded-full bg-blue-400"></div>
<div className="w-0.5 h-8 bg-outline-variant/30"></div>
<div className="w-2 h-2 rounded-full bg-outline-variant"></div>
</div>
<div className="space-y-3">
<div>
<p className="text-xs font-semibold text-blue-400">Arrived at sorting center</p>
<p className="text-[10px] text-on-secondary-container">Los Angeles, CA Gateway</p>
</div>
<div>
<p className="text-xs font-medium text-on-secondary-container">Out for delivery</p>
<p className="text-[10px] text-zinc-600 italic">Estimated: Tomorrow, 10:00 AM</p>
</div>
</div>
</div>
</div>
<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-8xl" data-icon="package_2">package_2</span>
</div>
</div>
{/*  Crowd-funding Status (Glassmorphism)  */}
<div className="bg-surface-container-high rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
<div className="flex items-center gap-3 mb-6">
<div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
<span className="material-symbols-outlined" data-icon="groups_2">groups_2</span>
</div>
<div>
<h3 className="font-bold text-sm">Crowd-funding Status</h3>
<p className="text-[10px] text-on-secondary-container uppercase tracking-wider">Vault Project #04</p>
</div>
</div>
<div className="space-y-4">
<div className="flex justify-between items-end mb-2">
<span className="text-2xl font-black font-headline text-white">88%</span>
<span className="text-[10px] text-on-secondary-container uppercase tracking-widest font-bold">12h Remaining</span>
</div>
<div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden">
<div className="h-full w-[88%] bg-gradient-to-r from-orange-700 to-orange-400 rounded-full"></div>
</div>
<p className="text-xs text-on-secondary-container leading-relaxed">
                        The <span className="text-white font-bold">Titanium Multi-Tool</span> is almost unlocked for all Vault members. 42 more backers needed.
                    </p>
</div>
</div>
{/*  Wishlist/Personal (Asymmetric Grid)  */}
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-high rounded-3xl p-5 flex flex-col justify-between aspect-square">
<span className="material-symbols-outlined text-orange-500 text-3xl" data-icon="favorite" style={{"fontVariationSettings":"'FILL' 1"}}>favorite</span>
<div>
<h4 className="text-xs font-bold text-white">Price Drop</h4>
<p className="text-[10px] text-on-secondary-container mt-1">Item in your wishlist is now $0.00</p>
</div>
</div>
<div className="bg-surface-container-high rounded-3xl p-5 flex flex-col justify-between aspect-square relative overflow-hidden">
<div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
<span className="material-symbols-outlined text-zinc-500 text-3xl" data-icon="notifications_active">notifications_active</span>
<div>
<h4 className="text-xs font-bold text-white">System Alert</h4>
<p className="text-[10px] text-on-secondary-container mt-1">Security check required for Vault withdrawal</p>
</div>
</div>
</div>
{/*  Feed Item: System Update  */}
<div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5">
<div className="flex gap-4">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
<span className="material-symbols-outlined text-white text-xl" data-icon="rocket_launch">rocket_launch</span>
</div>
<div className="space-y-1">
<h3 className="text-sm font-bold text-white">Vault 2.0 is Here</h3>
<p className="text-xs text-on-secondary-container leading-relaxed">
                            We've upgraded our encryption. Your assets are now secured by quantum-resistant protocols. Tap to review your new recovery keys.
                        </p>
<div className="pt-2">
<button className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors">Learn More →</button>
</div>
</div>
</div>
</div>
</section>
</main>
{/*  Floating AI Butler Button  */}
<button className="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl shadow-[0_0_20px_rgba(255,92,40,0.5)] flex items-center justify-center text-white group active:scale-90 transition-transform z-50">
<span className="material-symbols-outlined text-3xl" data-icon="smart_toy" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</button>
      {/* spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}
