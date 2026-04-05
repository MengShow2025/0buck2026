import React from 'react';

export default function MeMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  Top IM Product Bar ($0.00 Mode)  */}
<div className="sticky top-0 z-[60] bg-black/60 backdrop-blur-md border-b border-white/5 py-3">
<div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-6">
<div className="flex-shrink-0 flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 border border-primary/20">
<span className="text-[10px] font-black text-primary uppercase italic tracking-tighter">$0.00 Items</span>
</div>
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-zinc-800 overflow-hidden border border-white/10">
<img alt="KB" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv0mDkfpRp_LcZYrl-zYp2YiHRPlAkTUL-HD2hZC-m-4_wgUCGlTo3AJvalofchST1cwtEuY-CvSzIjkn34PEk9xyQl6uRNVRVTCMhNwoR6vXHs0zcXknyA-xxhC3levsVViVa1TPgMpO-S5I8rsU_Z4MRj5HKjU_16QodTFfj7iA5uPkfgS2YtaVdcOomCCAKSGiA0QiuscGCTYiT24vLHRPUX8Hyc6J6EqJHYKkZV-aGVDxGuoBumNjZJoew8MfHnLH_Kjyrv2Xg"/>
</div>
<div className="w-8 h-8 rounded-lg bg-zinc-800 overflow-hidden border border-white/10">
<img alt="Wallet" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdQ_H1MQptbY5mcmv4awUoAH1ySu1u2tN5PNCRvlKgXQ-tKXyPE2Vtu3o3RMP5UG7FAzW4B-kGzKsCish_Sx1ma_NVpnIe9vxSPMxMoePl11oZavDjkrMrfBS_W6EL9hvEORag9HOBOVuqxvRDTk_ntXGkFbiQTtjHaUj1pJTT7yHzuNFlTJqcTEmHaJC7Xz0AqCIR43zleQBCWuADwXfMn0s5umqBdDABEdNwchuLfgzDUJ-e3AfdfgaWmIv2gafr9vhlSp7lmw2X"/>
</div>
<div className="w-8 h-8 rounded-lg bg-zinc-800 overflow-hidden border border-white/10">
<img alt="Mic" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZlnMderTTW7FcS8MVMUbBj7JKCHgnB0ThoYV5vuoFQOHXKfqZOcPUoLDCTKm5CBFkC8KZQUE_nA8JevL5t9sLptDs8ig7_kxTNAem6V-P5vO4q5Mb3x3i98BKZcEpPopZ1k-w87g2NEj6VXgOl_f9mGvrLM-PzFvECIwjvFxw0HzNIbkTARmqarn8llLie6QWUcUUTXzWHjl3N2kSsiTInt92hCsKWMrYjEviIsExyMEJpyy_2lBmBsLIonteuOSAOBmGa26VFvn2"/>
</div>
<div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-dashed border-white/20">
<span className="material-symbols-outlined text-xs text-zinc-600">add</span>
</div>
</div>
</div>
</div>
<main className="max-w-xl mx-auto px-6 space-y-6 mt-6">
{/*  Header: Refined Profile Section  */}
<header className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="relative">
<div className="absolute -inset-1 bg-gradient-to-tr from-primary to-orange-400 rounded-full blur opacity-20"></div>
<img alt="Avatar" className="relative w-20 h-20 rounded-full object-cover border-2 border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEess_qFpcR6Fx0jSdN56uyQdJMQW6XcPPchreTIiTveoF1SeAcIPWoYRYYZIuvNAWs7WtQAbVXG3q9EmjMHvmfi06lars5ujcCPt3ZdsuZt6XzWHJ6pSP7FBQF2DqOps1FI7DUKGiWLMV8cj2GvgViPig1BaYShq8Ze1uyIGhh-KwN8vbFO6-Q8Z7a52U0m9S__LbREpl96ca5h9nqqW2a_pQOV8rZU2wotjb9gc8Og1vzuIwO3n6hwgWaQ_G_u4TRLb56ECIcr5F"/>
<div className="absolute -bottom-1 -right-1 bg-primary px-2 py-0.5 rounded-full text-[9px] font-black text-white uppercase shadow-lg border border-black/50">Gold V</div>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<h1 className="font-headline text-xl font-extrabold text-white">Alex Sterling</h1>
<button className="text-zinc-500 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-lg">edit_square</span>
</button>
</div>
<p className="text-zinc-500 text-[11px] font-label font-medium uppercase tracking-wider">0B-9982310 • Verified Merchant</p>
</div>
</div>
<div className="bg-white/5 p-1 rounded-full flex items-center gap-1 border border-white/10">
<button className="p-1.5 rounded-full bg-primary text-white shadow-lg"><span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings":"'FILL' 1"}}>dark_mode</span></button>
<button className="p-1.5 rounded-full text-zinc-500"><span className="material-symbols-outlined text-[16px]">light_mode</span></button>
</div>
</header>
{/*  Wallets Bento Grid  */}
<section className="grid grid-cols-2 gap-4">
<div className="glass-card p-5 rounded-3xl relative overflow-hidden">
<h4 className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-3">Cash Wallet</h4>
<div className="flex items-baseline gap-1">
<span className="text-primary font-headline text-2xl font-bold tracking-tight">$</span>
<span className="text-white font-headline text-3xl font-black tracking-tight">2,482</span>
</div>
<button className="mt-4 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                View Details <span className="material-symbols-outlined text-[12px]">chevron_right</span>
</button>
</div>
<div className="glass-card p-5 rounded-3xl border-primary/20">
<h4 className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-3">0Buck Points</h4>
<div className="flex items-baseline gap-1">
<span className="text-primary font-headline text-3xl font-black tracking-tight">84,200</span>
</div>
<button className="mt-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest border-b border-zinc-700 hover:text-white transition-all">
                Rules
            </button>
</div>
</section>
{/*  SIGN-IN CASHBACK CARD (CRITICAL)  */}
<section className="relative bg-gradient-to-br from-zinc-900 to-black p-6 rounded-[2.5rem] border border-primary/30 overflow-hidden">
<div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>
<div className="flex justify-between items-start mb-6">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-wider">Phase 02</span>
<h3 className="font-headline text-white font-bold text-lg">12-Day Streak</h3>
</div>
<p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest">Next Reward Unlock In</p>
<div className="text-white font-headline font-black text-2xl tabular-nums tracking-tight">04:22:15</div>
</div>
<button className="bg-primary text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(255,92,40,0.3)] active:scale-95 transition-all">
                Check In
            </button>
</div>
<div className="space-y-4">
<div className="grid grid-cols-3 gap-2">
<div className="bg-white/5 p-3 rounded-2xl border border-white/5">
<p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Max Cashback</p>
<p className="text-primary font-bold text-sm">$45.00</p>
</div>
<div className="bg-white/5 p-3 rounded-2xl border border-white/5">
<p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Order Value</p>
<p className="text-white font-bold text-sm">$150.00</p>
</div>
<div className="bg-white/5 p-3 rounded-2xl border border-white/5">
<p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Total Reclaimed</p>
<p className="text-emerald-500 font-bold text-sm">$890.22</p>
</div>
</div>
<div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
<div className="w-2/3 h-full bg-primary shadow-[0_0_8px_rgba(255,92,40,0.8)]"></div>
</div>
</div>
</section>
{/*  Activity Banner (Fixed Look)  */}
<div className="bg-zinc-900 rounded-2xl p-3 border border-white/5 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>campaign</span>
</div>
<p className="text-zinc-400 text-[11px] font-medium italic">Latest Activity: Alex S. just reclaimed $12.50...</p>
</div>
<span className="material-symbols-outlined text-zinc-700 text-sm">close</span>
</div>
{/*  Recent Orders Section  */}
<section className="space-y-4">
<div className="flex items-center justify-between">
<h3 className="font-headline font-bold text-white text-lg">Recent Orders</h3>
<span className="text-primary text-[11px] font-bold uppercase tracking-wider">View All</span>
</div>
<div className="glass-card rounded-[2rem] p-4 flex gap-4 items-center">
<div className="w-16 h-16 rounded-2xl bg-zinc-800 overflow-hidden flex-shrink-0 border border-white/5">
<img alt="Headphones" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8sFDVBDG2_QOkvHwSStFIPthF8OZxkiKu90egkyOcJNR-i1aMk3-X7sOAm-imXiChSHnsZ2fNmu2jNKs-s1PgvWY6L2O2IsblzKLj0J5NrI_DdIB5Ewo7XjKx_2UJqFxKCON0Wh1XpYc0f9ffX2J8AB6kdnYMzSXLxfpmt9AYxPlIk0uXUWPnRZmWqetOxu06lk9eOTdjJxFmfS8yTAsaNgO6vkLqUGs31utcnH84nKud6q-VORuBZMMdDNviT9TlG29KeVv6w0bw"/>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start mb-1">
<h4 className="text-white text-sm font-bold">Titan-H1 Headphones</h4>
<span className="text-primary text-[9px] font-black uppercase px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">In Transit</span>
</div>
<p className="text-zinc-500 text-[10px] mb-3">Arriving: Oct 24, 2023</p>
<div className="flex gap-2">
<button className="bg-white/5 hover:bg-white/10 text-white text-[10px] px-4 py-1.5 rounded-xl font-bold transition-all border border-white/5">Track Order</button>
<button className="bg-white/5 hover:bg-white/10 text-white text-[10px] px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all border border-white/5">
<span className="material-symbols-outlined text-[14px]">share</span> Share Item
                    </button>
</div>
</div>
</div>
</section>
{/*  Navigation List: Systematic Settings  */}
<section className="glass-card rounded-[2.5rem] p-2 space-y-1">
<div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-[1.5rem] transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">link</span>
</div>
<div>
<p className="text-white text-[13px] font-bold">Referral Program</p>
<p className="text-zinc-500 text-[10px]">Invite friends &amp; earn points</p>
</div>
</div>
<span className="material-symbols-outlined text-zinc-700">chevron_right</span>
</div>
<div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-[1.5rem] transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">shield_person</span>
</div>
<div>
<p className="text-white text-[13px] font-bold">Google 2FA</p>
<p className="text-zinc-500 text-[10px]">Security: Active</p>
</div>
</div>
<span className="material-symbols-outlined text-zinc-700">chevron_right</span>
</div>
<div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-[1.5rem] transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">payments</span>
</div>
<div>
<p className="text-white text-[13px] font-bold">Language / Currency</p>
<p className="text-zinc-500 text-[10px]">English (US) / USD</p>
</div>
</div>
<span className="material-symbols-outlined text-zinc-700">chevron_right</span>
</div>
<div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-[1.5rem] transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">location_on</span>
</div>
<div>
<p className="text-white text-[13px] font-bold">Address Management</p>
<p className="text-zinc-500 text-[10px]">2 Saved Locations</p>
</div>
</div>
<span className="material-symbols-outlined text-zinc-700">chevron_right</span>
</div>
<div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-[1.5rem] transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">password</span>
</div>
<div>
<p className="text-white text-[13px] font-bold">Security &amp; Password</p>
<p className="text-zinc-500 text-[10px]">Manage login credentials</p>
</div>
</div>
<span className="material-symbols-outlined text-zinc-700">chevron_right</span>
</div>
</section>
{/*  Footer: Secondary Actions  */}
<footer className="flex flex-col gap-3 py-6">
<button className="w-full py-4 rounded-3xl bg-zinc-900 border border-white/5 text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
<span className="material-symbols-outlined text-sm">help</span>
            Help Center &amp; Documentation
        </button>
<button className="w-full py-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
<span className="material-symbols-outlined text-sm">logout</span>
            Sign Out Alex Sterling
        </button>
</footer>
</main>
{/*  Floating AI Butler Assistant  */}
<div className="fixed bottom-32 right-6 z-[70]">
<button className="relative w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(255,92,40,0.4)] group active:scale-90 transition-all">
<span className="material-symbols-outlined text-white text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
<span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-black">
<span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
</span>
{/*  Tooltip/Badge for notifications  */}
<div className="absolute -top-10 right-0 bg-white text-black text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            System Assistant Ready
        </div>
</button>
</div>
      {/* spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}
