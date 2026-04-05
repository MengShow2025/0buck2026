import React from 'react';
import { motion } from 'motion/react';

export default function ReferralTalentMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  TopAppBar  */}
<header className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-orange-900/10 flex justify-between items-center px-6 h-20 w-full">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-orange-600 dark:text-orange-500">menu</span>
<span className="font-['Plus_Jakarta_Sans'] tracking-tighter text-2xl font-black italic text-orange-600 dark:text-orange-500 uppercase">0Buck</span>
</div>
<div className="relative active:scale-95 transition-transform">
<span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-2xl">shopping_cart</span>
<span className="absolute -top-1 -right-1 bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white">3</span>
</div>
</header>
<main className="pt-24 px-6 max-w-md mx-auto space-y-8">
{/*  IM Group Mode Header (Referral Context)  */}
<section className="flex items-center gap-4 bg-surface-container-low p-5 rounded-2xl">
<div className="relative">
<img className="w-14 h-14 rounded-full border-2 border-primary" data-alt="close-up profile avatar of a sleek futuristic digital entity with orange glowing neon accents on a dark metallic background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB03l4ocWEYgTUQA6cz49gq-iWSNbqLW5DUzKSHDkAwDBu-cSt1lP45ZCJDv8oAnJwxCmeNyiISvmGgKDXLjKs25erqwu1xn6nAYwsdTxA5Kn2o8x5GplGcbCiRFFRXViwiAQKPbohR4Cx1Y3sfkAPiSQNCrlcl2OI4hWPg9fasnOX2UZK6QwPe9SQijmYukNSnBHdDyd9CN7CaPvEa9jUb6vRsXD-cYPwfM9rY1oW2FnSXV7CKRsPlGrRmcZIP9FrhN5N7d_coDWyn"/>
<div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface-container-low"></div>
</div>
<div>
<h1 className="font-headline font-extrabold text-lg tracking-tight text-on-surface">0Buck Elite Group</h1>
<p className="text-secondary text-sm">Referral ID: 8829 • <span className="text-primary font-bold">LVL 4</span></p>
</div>
</section>
{/*  Talent Application Entry  */}
<section className="bg-gradient-to-br from-primary/20 to-transparent p-6 rounded-3xl border border-primary/10">
<div className="flex justify-between items-start mb-4">
<div className="space-y-1">
<span className="text-[10px] font-bold tracking-widest uppercase text-primary">Opportunity</span>
<h2 className="text-2xl font-headline font-black text-on-surface">Talent Application</h2>
</div>
<span className="material-symbols-outlined text-primary text-3xl">stars</span>
</div>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Join the exclusive network of high-performance referrers and unlock tiered commissions up to 45%.</p>
<button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl active:scale-95 transition-transform">
                Apply for Elite Talent
            </button>
</section>
{/*  Exclusive Commission Metrics (Terminal Style Bento)  */}
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-highest p-5 rounded-2xl flex flex-col justify-between aspect-square">
<span className="material-symbols-outlined text-primary">payments</span>
<div>
<span className="text-[10px] text-secondary font-bold uppercase tracking-tighter">Commission</span>
<div className="text-3xl font-headline font-black text-on-surface">28.4%</div>
<span className="text-[10px] text-green-500 font-bold">+2.1% boost active</span>
</div>
</div>
<div className="bg-surface-container-highest p-5 rounded-2xl flex flex-col justify-between aspect-square">
<span className="material-symbols-outlined text-primary">group</span>
<div>
<span className="text-[10px] text-secondary font-bold uppercase tracking-tighter">Active Fans</span>
<div className="text-3xl font-headline font-black text-on-surface">1,242</div>
<span className="text-[10px] text-secondary">Top 5% of Referrers</span>
</div>
</div>
</div>
{/*  Fan Rewards Breakdown  */}
<section className="space-y-4">
<h3 className="font-headline font-bold text-lg px-2">Fan Rewards Breakdown</h3>
<div className="space-y-3">
<div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">redeem</span>
</div>
<div>
<p className="font-bold text-sm">Loyalty Drop</p>
<p className="text-xs text-secondary">Distribution in 48h</p>
</div>
</div>
<div className="text-right">
<p className="font-bold text-primary">$420.00</p>
<p className="text-[10px] text-secondary">Unclaimed</p>
</div>
</div>
<div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">confirmation_number</span>
</div>
<div>
<p className="font-bold text-sm">Raffle Credits</p>
<p className="text-xs text-secondary">3 Entries Active</p>
</div>
</div>
<div className="text-right">
<p className="font-bold text-on-surface">1,200</p>
<p className="text-[10px] text-secondary">XP Gained</p>
</div>
</div>
</div>
</section>
{/*  Advanced Sharing Tools  */}
<section className="bg-surface-container-highest p-6 rounded-3xl space-y-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">share</span>
<h3 className="font-headline font-bold text-lg">Elite Share Suite</h3>
</div>
<div className="space-y-4">
<div className="bg-black/40 p-4 rounded-xl border border-white/5">
<label className="text-[10px] uppercase font-black text-secondary tracking-widest mb-2 block">Universal Referral Link</label>
<div className="flex items-center justify-between gap-2">
<code className="text-primary font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">0buck.network/talent/8829/secure</code>
<button className="p-2 bg-surface-container-low rounded-lg active:scale-90 transition-transform">
<span className="material-symbols-outlined text-sm">content_copy</span>
</button>
</div>
</div>
<div className="grid grid-cols-3 gap-3">
<button className="flex flex-col items-center gap-2 p-4 bg-surface-container-low rounded-xl hover:bg-neutral-800 transition-all">
<span className="material-symbols-outlined text-primary">qr_code_2</span>
<span className="text-[10px] font-bold uppercase">QR Code</span>
</button>
<button className="flex flex-col items-center gap-2 p-4 bg-surface-container-low rounded-xl hover:bg-neutral-800 transition-all">
<span className="material-symbols-outlined text-primary">auto_fix_high</span>
<span className="text-[10px] font-bold uppercase">AI Bio</span>
</button>
<button className="flex flex-col items-center gap-2 p-4 bg-surface-container-low rounded-xl hover:bg-neutral-800 transition-all">
<span className="material-symbols-outlined text-primary">analytics</span>
<span className="text-[10px] font-bold uppercase">Heatmap</span>
</button>
</div>
</div>
</section>
</main>
{/*  Floating AI Butler  */}
<div className="fixed bottom-24 right-6 z-50">
<button className="w-14 h-14 bg-orange-600 text-white rounded-full shadow-[0_0_30px_rgba(255,92,40,0.4)] flex items-center justify-center active:scale-90 transition-transform">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</button>
<div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-background animate-pulse"></div>
</div>

{/* Draggable View Toggle */}
<motion.div 
  drag
  dragConstraints={{ left: -100, right: 100, top: -400, bottom: 50 }}
  whileDrag={{ scale: 1.1, zIndex: 100 }}
  className="fixed bottom-24 left-6 z-50 flex flex-col gap-3 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl touch-none"
>
  <button 
    onClick={() => setCurrentView('referral_talent')}
    className="w-12 h-12 bg-orange-600 text-white rounded-xl shadow-lg flex flex-col items-center justify-center active:scale-90 transition-all shadow-orange-900/40"
  >
    <span className="material-symbols-outlined text-lg">stars</span>
    <span className="text-[7px] font-black uppercase mt-0.5 tracking-tighter">Talent</span>
  </button>
  
  <div className="h-px w-6 mx-auto bg-white/5"></div>
  
  <button 
    onClick={() => setCurrentView('referral_user')}
    className="w-12 h-12 bg-neutral-900 text-neutral-500 rounded-xl shadow-lg flex flex-col items-center justify-center active:scale-90 transition-all border border-white/10"
  >
    <span className="material-symbols-outlined text-lg">person</span>
    <span className="text-[7px] font-black uppercase mt-0.5 tracking-tighter">Member</span>
  </button>
</motion.div>
      {/* spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}
