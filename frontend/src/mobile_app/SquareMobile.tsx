import React from 'react';

export default function SquareMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  IM Mode Header: Persistent top bar with scrolling products  */}
<header className="fixed top-0 w-full z-50 glass thin-outline border-t-0 border-x-0">
{/*  Live Activity Banner  */}
<div className="orange-gradient px-4 py-2 flex items-center justify-center gap-2 overflow-hidden">
<span className="material-symbols-outlined text-[18px] text-white animate-pulse">campaign</span>
<p className="text-[11px] font-headline font-extrabold text-white tracking-wider uppercase">Live Activity: 5X Carbon Wallets @ $0.00 Drop in 12m</p>
</div>
<div className="flex flex-col">
<div className="flex items-center justify-between px-6 h-14">
<div className="flex items-center gap-3">
<div className="w-7 h-7 rounded-full bg-surface-variant overflow-hidden thin-outline">
<img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBs5OEe6yrXezESm1dvKnvEU4yOzk4_GcGUoneqMJGQESBgWcUR1JmBa-sUTi-rCM954ZX7oNqblZvzrBD75u5QcbFc-c3UlqtsmpLJWz9XaPUTvx1iAuiRrF3VJl1BT8dNFrtq_wmVaF5wbJJgDKsFzxsGvZq1WJ_38NEC0VTEpgV7zwRucSqPqyke9dlZ-gGErdQrIK0M7IXOVhheEinL61HMqLKOtBsTSLvlqU4wPcvEcmoKd2zEwSbfOj_E7p145zcdomvci-5"/>
</div>
<h1 className="font-headline font-extrabold tracking-tight text-lg text-primary">0Buck</h1>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-primary p-1">notifications</button>
<button className="material-symbols-outlined text-primary p-1">search</button>
</div>
</div>
{/*  Scrolling Product Thumbnails  */}
<div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-3 pt-1">
<div className="flex-shrink-0 flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1 thin-outline">
<div className="w-6 h-6 rounded-full overflow-hidden">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl_BeuAiUSdwBD8btGI1UbEYy0tByi0DxxT_g7fcRBATdhI47aRwTmgck8tJWqGB-l76z4spm9b4olp2hFDOonrt3MU9y31i7vpzyf8t5XnV5Lpcq_zHOIeFUkhZhF2F31fspvQpd9xPtFyXW6SiSP3U4V7ZJYRmIxY0uWgEqn3ghZmZv2bzmrc1b5aVQWuXUoNlmjss50sgmyxPZqo_eiEO9bSEOnRx1LBrRjJSGQGxfgigPRw3P0-abbk8CVa_6vFinPkg-ieufR"/>
</div>
<span className="text-[10px] font-bold text-primary">$0.00</span>
</div>
<div className="flex-shrink-0 flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1 thin-outline">
<div className="w-6 h-6 rounded-full overflow-hidden">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAds0WK1SSKZTdTBWDerMM4413z_oz0lTpHA4OLoogVn5U6WpLDu2ezohWMA9uIxr_0bZ7-WtIiIqZuFBmK3ht-0wIqZSDj6YjeEIJjrEOEauBtRpxYOj4IGDvkIRoUVXbE7QjxO4ZoLox9BgMbfgZ10yZNrvi_EyZAlgOpMKLKDYMEnZjuZ2L9PWlWOaAW1rVJT6RoskNasYLohu3hkuzkMRVAnHKGpewaCguD6xyRBTAt4IKr1tWhoamByfsoiXe3jhMUBY_QcHFI"/>
</div>
<span className="text-[10px] font-bold text-primary">$0.00</span>
</div>
<div className="flex-shrink-0 flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1 thin-outline">
<div className="w-6 h-6 rounded-full overflow-hidden">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1k8CkSLkEcmWVAnF1mhfR76ROZpS_RHV-7Az5Mpik9MEKer6xUdWyMWv2S4KWrAReAcLm8x8RcuZsSFbVi3SdIrMdurvlK-A_g4oxqAbqcpPS1Lt2bw4wK-NG2GA7KW0BI2nnfdJeJe5tbYEuDVUZj17Z7ae9Gs3aXeo5TbdVnAciZFQ2h7ZySDqS13_2sF1XWCRTLAplWeKtVaSW2tQFCctMTjhwqeBNnA6jKhIO8KhTY0yfk0yFupYP-X0JwkE0Qvd0RtFGywF8"/>
</div>
<span className="text-[10px] font-bold text-primary">$0.00</span>
</div>
<div className="flex-shrink-0 flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1 thin-outline text-white/40">
<span className="material-symbols-outlined text-sm">more_horiz</span>
</div>
</div>
</div>
</header>
<main className="pt-32 pb-32">
{/*  Platform Activities: New/Hot Drops & Voting  */}
<section className="px-6 mb-12">
<div className="flex justify-between items-end mb-6">
<div>
<h2 className="font-headline text-2xl font-extrabold tracking-tight">Square Activity</h2>
<p className="text-xs text-secondary mt-1">Real-time platform movements</p>
</div>
<button className="text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30 px-3 py-1 rounded-full">Explore</button>
</div>
<div className="grid grid-cols-2 gap-4">
{/*  User Voting: Poll Interface  */}
<div className="col-span-2 bg-surface thin-outline rounded-3xl p-6">
<div className="flex items-center gap-2 mb-4">
<span className="inline-block bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Community Poll</span>
<span className="text-xs text-secondary">4h left</span>
</div>
<h3 className="font-headline text-lg font-bold mb-4 leading-snug">What should be our next Genesis Drop?</h3>
<div className="space-y-3">
<button className="w-full relative h-12 rounded-xl overflow-hidden thin-outline active:scale-95 transition-transform">
<div className="absolute left-0 top-0 h-full bg-primary/10 w-[42%]"></div>
<div className="absolute inset-0 flex justify-between items-center px-4">
<span className="text-sm font-medium">Titanium Flask</span>
<span className="text-xs font-bold text-primary">42%</span>
</div>
</button>
<button className="w-full relative h-12 rounded-xl overflow-hidden border-2 border-primary active:scale-95 transition-transform">
<div className="absolute left-0 top-0 h-full bg-primary/20 w-[58%]"></div>
<div className="absolute inset-0 flex justify-between items-center px-4">
<div className="flex items-center gap-2">
<span className="text-sm font-bold">E-Ink Pad</span>
<span className="material-symbols-outlined text-primary text-sm">check_circle</span>
</div>
<span className="text-xs font-bold text-primary">58%</span>
</div>
</button>
</div>
</div>
{/*  Group Buying: Progress Bar  */}
<div className="bg-surface thin-outline rounded-3xl p-5 flex flex-col justify-between aspect-square">
<div>
<div className="flex justify-between">
<span className="bg-red-500/10 text-red-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Hot Drop</span>
<span className="material-symbols-outlined text-secondary text-sm">groups</span>
</div>
<h4 className="font-headline font-bold text-xs mt-3">Solar Charger Pack</h4>
</div>
<div>
<div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-2">
<div className="h-full bg-primary w-[88%]"></div>
</div>
<p className="text-[10px] text-primary font-bold">88/100 Joined</p>
<p className="text-[9px] text-secondary mt-1">Expires: 02:14:55</p>
</div>
</div>
{/*  Crowdfunding  */}
<div className="bg-surface thin-outline rounded-3xl p-5 flex flex-col justify-between aspect-square">
<div>
<div className="flex justify-between">
<span className="bg-blue-500/10 text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Funding</span>
<span className="material-symbols-outlined text-secondary text-sm">rocket_launch</span>
</div>
<h4 className="font-headline font-bold text-xs mt-3">Smart Home Hub V2</h4>
</div>
<div>
<div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-2">
<div className="h-full bg-blue-400 w-[75%]"></div>
</div>
<p className="text-[10px] text-blue-400 font-bold">75% Funded</p>
<p className="text-[9px] text-secondary mt-1">2.4k Contributors</p>
</div>
</div>
</div>
</section>
{/*  Industry Topics: Topic of the Week  */}
<section className="px-6 mb-12">
<div className="bg-surface thin-outline rounded-3xl overflow-hidden">
<div className="aspect-[16/9] relative">
<img className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBazrqMsb00WICHmAH-4MKr_n6CmCAtPoanojHpdcR4hLnLrqps-V_URTgGWU3Kdr2RUHHb2n29Zj-tWAOadNImqpVkcqChpp7dlsEqjFuMPIpyne_mVSWSWHxA9DrrLjAsgv8Pdj8t1aQg8xYZhi70vVYYOuPzTJUD54Cl6hoMKXHKfJLGSNJsAxSSMHVMW-weyJfhaKK-cJnEJuBVMsdnj-NljEpzCE2JVI_9no1XSkR93A3l3Hyu-rr7g7NTf-OvhxbWL41-N5py"/>
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
<div className="absolute bottom-4 left-6 right-6">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
<span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Topic of the Week</span>
</div>
<h3 className="font-headline text-xl font-extrabold leading-tight">The Decentralized Supply Chain</h3>
</div>
</div>
<div className="p-6 pt-2">
<p className="text-sm text-secondary leading-relaxed mb-4">
                    Explore how community-owned manufacturing protocols are making $0.00 high-end lifestyle products a sustainable reality.
                </p>
<button className="w-full py-3 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest thin-outline hover:bg-white/10 transition-colors">Read Full Report</button>
</div>
</div>
</section>
{/*  User Social: Moments & Posts  */}
<section className="px-6">
<h2 className="font-headline text-2xl font-extrabold tracking-tight mb-6">Moments</h2>
<div className="space-y-10">
{/*  Moment (Instagram Style)  */}
<div className="group">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full p-0.5 border border-primary">
<img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnvbXVMRRyA5GEr4pa0BTaK9GVp0bjeVx11H8MvoXo0Lm7-TZRVtZJg2bEldvB34qyK3m7AEnahVUnNmb9bUMMRZ8g-KSos0fG53NdAxJniuXyb6Mu1e5mwCN_iDszws511JGRRUnQriEurFy-mRsyF_yVl0K0mPz8lqJMFMvVg1hWOI2F3H-_n6yqgptKxTBspiuN_ukZHYWAxqc-slyhDCc5pPquVgXi2xQ0kTVAMNWqHuqa42LsVGAto8SBpjn0c7Ytmfdj3Dy4"/>
</div>
<div className="flex-1">
<div className="flex items-center gap-2">
<p className="text-sm font-bold">Marcus.eth</p>
<span className="material-symbols-outlined text-blue-400 text-[14px] fill-current">verified</span>
</div>
<p className="text-[10px] text-secondary">Just now • Paris</p>
</div>
<button className="material-symbols-outlined text-secondary">more_horiz</button>
</div>
<div className="rounded-3xl overflow-hidden aspect-[4/5] bg-surface thin-outline mb-4">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl_BeuAiUSdwBD8btGI1UbEYy0tByi0DxxT_g7fcRBATdhI47aRwTmgck8tJWqGB-l76z4spm9b4olp2hFDOonrt3MU9y31i7vpzyf8t5XnV5Lpcq_zHOIeFUkhZhF2F31fspvQpd9xPtFyXW6SiSP3U4V7ZJYRmIxY0uWgEqn3ghZmZv2bzmrc1b5aVQWuXUoNlmjss50sgmyxPZqo_eiEO9bSEOnRx1LBrRjJSGQGxfgigPRw3P0-abbk8CVa_6vFinPkg-ieufR"/>
</div>
<div className="flex gap-4 mb-3">
<button className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[24px]">favorite</span>
</button>
<button className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[24px]">chat_bubble</span>
</button>
<button className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[24px]">send</span>
</button>
</div>
<p className="text-sm leading-relaxed mb-1"><span className="font-bold mr-2">Marcus.eth</span>Carbon Wallet has arrived. The texture is insane for a $0 drop. ⚡️</p>
<p className="text-xs text-secondary">#0Buck #Genesis #Tech</p>
</div>
{/*  Post (Xiaohongshu Editorial Style)  */}
<div className="bg-surface thin-outline rounded-3xl overflow-hidden">
<div className="grid grid-cols-2 gap-[1px] bg-outline">
<img className="aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAds0WK1SSKZTdTBWDerMM4413z_oz0lTpHA4OLoogVn5U6WpLDu2ezohWMA9uIxr_0bZ7-WtIiIqZuFBmK3ht-0wIqZSDj6YjeEIJjrEOEauBtRpxYOj4IGDvkIRoUVXbE7QjxO4ZoLox9BgMbfgZ10yZNrvi_EyZAlgOpMKLKDYMEnZjuZ2L9PWlWOaAW1rVJT6RoskNasYLohu3hkuzkMRVAnHKGpewaCguD6xyRBTAt4IKr1tWhoamByfsoiXe3jhMUBY_QcHFI"/>
<img className="aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1k8CkSLkEcmWVAnF1mhfR76ROZpS_RHV-7Az5Mpik9MEKer6xUdWyMWv2S4KWrAReAcLm8x8RcuZsSFbVi3SdIrMdurvlK-A_g4oxqAbqcpPS1Lt2bw4wK-NG2GA7KW0BI2nnfdJeJe5tbYEuDVUZj17Z7ae9Gs3aXeo5TbdVnAciZFQ2h7ZySDqS13_2sF1XWCRTLAplWeKtVaSW2tQFCctMTjhwqeBNnA6jKhIO8KhTY0yfk0yFupYP-X0JwkE0Qvd0RtFGywF8"/>
</div>
<div className="p-5">
<h3 className="font-headline font-bold text-md mb-2">My Top 5 0Buck Finds This Month</h3>
<p className="text-xs text-secondary line-clamp-2 mb-4 leading-relaxed">From the Sonic Pods to the Neo Watch, here's how I styled my latest haul for a minimalist aesthetic look...</p>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full overflow-hidden thin-outline">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUxsb1IwAd6VbCQjoxuApf_TfeVUsTGSvt0LfHU1zVKRBJzfN64Mzdm2QCsv7CD1jW5wgiox8RGVV8U1uMJgBZplNYtiLe3nAzqt4fazLeH4sxdPUytX3YAYtevNYH9YeXhIcbM_b5D34DqK_vKqHAr2O2ZI4LhgtZUUluUN9D-EnfgzryGNE96cpaAdu92Rd0WduaWqFiaXQ_E92ci3Ec-MJrBsjcet1vO5ABkyGr5FXLOwD3jH-KCT40_4rM-jEx9HMG1UIGV66U"/>
</div>
<span className="text-[10px] font-bold">Aesthetic_Lee</span>
</div>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-[14px] fill-current">favorite</span>
<span className="text-[10px] font-bold">2.4k</span>
</div>
</div>
</div>
</div>
</div>
</section>
</main>
{/*  Floating AI Butler: Persistent Concierge  */}
<div className="fixed bottom-28 right-6 z-50">
<button className="w-16 h-16 rounded-full glass thin-outline flex items-center justify-center shadow-2xl active:scale-90 transition-transform relative group">
<div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
<div className="relative">
<span className="material-symbols-outlined text-primary text-4xl">smart_toy</span>
{/*  Notification Badge  */}
<div className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-background rounded-full flex items-center justify-center">
<span className="text-[8px] font-black text-white">1</span>
</div>
</div>
<div className="absolute right-full mr-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-active:opacity-100 transition-opacity">
            Hey! New drop alert.
        </div>
</button>
</div>
      {/* spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}
