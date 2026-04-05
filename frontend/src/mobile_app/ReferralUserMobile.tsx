import React from 'react';
import { motion } from 'motion/react';

export default function ReferralUserMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  TopAppBar  */}
<header className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-orange-900/10 flex justify-between items-center px-6 h-20 w-full">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-orange-500 active:scale-95 transition-transform" data-icon="menu">menu</span>
<span className="font-['Plus_Jakarta_Sans'] tracking-tighter text-2xl font-black italic text-orange-600 dark:text-orange-500 uppercase">0Buck</span>
</div>
<div className="relative active:scale-95 transition-transform">
<span className="material-symbols-outlined text-orange-500 text-2xl" data-icon="shopping_cart">shopping_cart</span>
<span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-neutral-950">3</span>
</div>
</header>
<main className="pt-24 pb-32 px-5 max-w-md mx-auto">
{/*  Live Referral Alerts (Scrolling Ticker)  */}
<section className="mb-6 overflow-hidden bg-neutral-900/50 rounded-xl py-2 px-4 border-l-2 border-orange-500">
<div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
<span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Live:</span>
<div className="flex gap-8 animate-marquee text-neutral-400 text-xs font-mono">
<span>USER_4492 JUST EARNED $42.00</span>
<span>NEW REFERRAL FROM @OX_ALPHA</span>
<span>MIKE_V JOINED THE NETWORK</span>
</div>
</div>
</section>
{/*  Bento Grid Hero Section  */}
<div className="grid grid-cols-2 gap-4 mb-8">
{/*  Total Rewards Card  */}
<div className="col-span-2 bg-neutral-900 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
<div className="absolute top-0 right-0 p-4 opacity-10">
<span className="material-symbols-outlined text-8xl" data-icon="account_balance_wallet">account_balance_wallet</span>
</div>
<p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Total Rewards</p>
<h1 className="text-4xl font-headline font-extrabold text-white tracking-tight mb-2">$12,450.00</h1>
<div className="flex items-center gap-2 text-primary font-bold text-sm">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
<span>+24.8% This Month</span>
</div>
</div>
{/*  Stats Mini Cards  */}
<div className="bg-neutral-900 p-5 rounded-3xl border-b-4 border-orange-600/20">
<p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">Sales Comm.</p>
<p className="text-2xl font-headline font-black text-white">15.4%</p>
</div>
<div className="bg-neutral-900 p-5 rounded-3xl border-b-4 border-orange-600/20">
<p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">Global Rank</p>
<p className="text-2xl font-headline font-black text-orange-500">#12</p>
</div>
</div>
{/*  Invitation Hub (Glassmorphism & Asymmetry)  */}
<section className="mb-10">
<h2 className="text-xl font-headline font-extrabold text-white mb-4 pl-2 flex items-center gap-2">
<span className="w-2 h-6 bg-orange-600 rounded-full"></span>
                Invitation Hub
            </h2>
<div className="bg-neutral-900/60 backdrop-blur-md p-6 rounded-3xl relative">
<div className="flex justify-between items-start mb-6">
<div>
<p className="text-neutral-400 text-sm mb-1">Your Registration Code</p>
<div className="flex items-center gap-3">
<span className="text-2xl font-mono font-black tracking-widest text-white">ZER0X-882</span>
<span className="material-symbols-outlined text-orange-500 cursor-pointer" data-icon="content_copy">content_copy</span>
</div>
</div>
<div className="bg-orange-600/10 p-3 rounded-2xl text-center">
<p className="text-primary text-xl font-black">1,240</p>
<p className="text-[10px] font-bold text-neutral-500 uppercase">Fans</p>
</div>
</div>
<button className="w-full bg-gradient-to-br from-orange-600 to-orange-400 py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-orange-900/40 active:scale-95 transition-transform">
                    Share Referral Link
                </button>
</div>
</section>
{/*  Scrolling Product Bar  */}
<section className="mb-10">
<div className="flex justify-between items-center mb-4 px-2">
<h3 className="font-headline font-bold text-neutral-200">Featured Products</h3>
<span className="text-primary text-xs font-bold uppercase">View All</span>
</div>
<div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
<div className="flex-none w-48 bg-neutral-900 p-4 rounded-3xl group">
<div className="h-32 rounded-2xl mb-4 overflow-hidden bg-neutral-800">
<img className="w-full h-full object-cover" data-alt="minimalist modern watch in dark studio lighting with orange highlights and sharp reflections" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxwe2ijKIJ6tAVM7gO5GzJmoKUxd5DAlgnIczRsvDQ_WzmbWppeJU9npR3HzKVdTuEgz2jNvHH3umu-ojuC3UzpFW7mlxxgUM73xW5Jkg18a_TIMQYGl8sVeE9BUYDZCkmIrqVDbB8B71KlaYw0xGZwcXXu85MRcwB34TDPYMXVby70c_QInaDJUeEvJ0doH8QAc9Gu4FSUvmPqKFnRTURGESHevjCeNw2pCcFVVu8SdEZgWn4LBSUmPZoC-pD79dTv3SPhCgQ9kS7"/>
</div>
<p className="text-white font-bold text-sm mb-1">Stealth Chrono</p>
<p className="text-orange-500 text-xs font-black">2.5% Bounty</p>
</div>
<div className="flex-none w-48 bg-neutral-900 p-4 rounded-3xl group">
<div className="h-32 rounded-2xl mb-4 overflow-hidden bg-neutral-800">
<img className="w-full h-full object-cover" data-alt="professional studio headphones on a dark pedestal with cinematic orange rim lighting and smoke effects" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDvVvC-xu-cq0BAD5GojFxC_QIu6Zj83Wg-lpK-fXPMzn2CtWNZc8FdLdS9jpdWLF3NzdNrhUEVOl3tO1Q3B4siRV1wTpUc3wlD1VNHF9bUGF33MZgbV064N33rjNRViVXccc6IQtgbqkf5JMsJMwumLuhBMAKwKZKPEoNQvZ-pyIxSNZ0yKCnxvwcCBg0fir9vcKppMMaeM-BjkHN9XwuRxcsJUME3zuAJDnD6mIK_y2wRIg9010oqwCuth5aX5LkB6_6RFaYf4ds"/>
</div>
<p className="text-white font-bold text-sm mb-1">Audio-X Pro</p>
<p className="text-orange-500 text-xs font-black">4.0% Bounty</p>
</div>
<div className="flex-none w-48 bg-neutral-900 p-4 rounded-3xl group">
<div className="h-32 rounded-2xl mb-4 overflow-hidden bg-neutral-800">
<img className="w-full h-full object-cover" data-alt="premium leather wallet placed on a slate surface with moody dark lighting and golden glow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE04NZRt22seMTH2nHu25M701W4Olwqe8svIRuAZE55GeDFlXdvV1XJ3Iqpm-y2eFxFaV2hjlU04E5SnHd-XTk-OSZw3YK68ZqIwvddjHsdzNwYixN5cCfUrURuPD2x7PzVjsuALKJ8OCRuxP3_eZTAfkPufrut5N4zmtXjIj5S6HzWBZzGbjRbCEv8OQQNdW3-f3sruJpJcIWH5_W-AgfPOkkodOg20x9tLOgf4HYD9y7txjiXinjp0y0jKutVl6ZbmIeQ7MGdsEG"/>
</div>
<p className="text-white font-bold text-sm mb-1">Leather Nomad</p>
<p className="text-orange-500 text-xs font-black">1.2% Bounty</p>
</div>
</div>
</section>
{/*  Network Activity Feed  */}
<section className="mb-10">
<h3 className="font-headline font-bold text-neutral-200 mb-4 pl-2">Network Activity</h3>
<div className="space-y-3">
<div className="flex items-center justify-between p-4 bg-neutral-900/40 rounded-2xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
<span className="material-symbols-outlined text-orange-500" data-icon="person">person</span>
</div>
<div>
<p className="text-white text-sm font-bold">Alex J.</p>
<p className="text-neutral-500 text-xs">Used your code</p>
</div>
</div>
<p className="text-orange-500 font-mono text-sm">+$12.50</p>
</div>
<div className="flex items-center justify-between p-4 bg-neutral-900/40 rounded-2xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
<span className="material-symbols-outlined text-orange-500" data-icon="redeem">redeem</span>
</div>
<div>
<p className="text-white text-sm font-bold">Reward Payout</p>
<p className="text-neutral-500 text-xs">Direct deposit</p>
</div>
</div>
<p className="text-orange-500 font-mono text-sm">-$500.00</p>
</div>
</div>
</section>
</main>
{/*  Floating AI Butler (FAB)  */}
<button className="fixed right-6 bottom-28 w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full shadow-[0_8px_30px_rgb(255,92,40,0.4)] flex items-center justify-center z-50 active:scale-90 transition-transform">
<span className="material-symbols-outlined text-white text-3xl" data-icon="smart_toy" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</button>

{/* Draggable View Toggle */}
<motion.div 
  drag
  dragConstraints={{ left: -100, right: 100, top: -400, bottom: 50 }}
  whileDrag={{ scale: 1.1, zIndex: 100 }}
  className="fixed bottom-28 left-6 z-50 flex flex-col gap-3 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl touch-none"
>
  <button 
    onClick={() => setCurrentView('referral_talent')}
    className="w-12 h-12 bg-neutral-900 text-neutral-500 rounded-xl shadow-lg flex flex-col items-center justify-center active:scale-90 transition-all border border-white/10"
  >
    <span className="material-symbols-outlined text-lg">stars</span>
    <span className="text-[7px] font-black uppercase mt-0.5 tracking-tighter">Talent</span>
  </button>
  
  <div className="h-px w-6 mx-auto bg-white/5"></div>
  
  <button 
    onClick={() => setCurrentView('referral_user')}
    className="w-12 h-12 bg-orange-600 text-white rounded-xl shadow-lg flex flex-col items-center justify-center active:scale-90 transition-all shadow-orange-900/40"
  >
    <span className="material-symbols-outlined text-lg">person</span>
    <span className="text-[7px] font-black uppercase mt-0.5 tracking-tighter">Member</span>
  </button>
</motion.div>
{/*  BottomNavBar  */}
      {/* spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}
