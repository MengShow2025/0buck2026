import React from 'react';

export default function ReferralRulesMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  TopAppBar  */}
<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 w-full bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-orange-900/10">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-orange-600 dark:text-orange-500">menu</span>
<span className="text-2xl font-black italic text-orange-600 dark:text-orange-500 uppercase font-['Plus_Jakarta_Sans'] tracking-tighter">0Buck</span>
</div>
{/*  IM Group Mode Context Indicator (Simulated background context)  */}
<div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
<div className="flex -space-x-2">
<img className="w-6 h-6 rounded-full border-2 border-neutral-950" data-alt="close up profile avatar of a tech-savvy community member with soft neon lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwvnl4m1SfLMeZFujoWOdvw3s_ovM_1p6XRChrP_27gEHb3Mvzw-n0cI4C0ywFlxl5vDJp3byVfFRailHi3rFt_Tar9sQdWXduFjTBTwH3V-jwx_rdl2n3uzt4WXGiEff1-BrWPnXKvEHiE89h3ksGLlp6CDSTR0pq1fy6pwyvZPDoGUuErgHUCK4QWHUmprPRLnBy4kruM4KlthXmXz-W5kLwZ1GfrRy2KcVGXxN1wMnq3vbF-Sk04g0T27AzM1W2Vr9XARVoFNUt"/>
<img className="w-6 h-6 rounded-full border-2 border-neutral-950" data-alt="close up profile avatar of a digital artist with colorful hair and artistic studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdq5EG8FkmO1Zh4XZnjz8NjLHyTsmChvP5E04Y1ThJHVrJe_b6Ke1qH-VxGIYc_SxI9DzPsLWyrzqaCaX0imOqpoLa7oqt03WB1XDj-Sie6CuITkF0PvSpps39yBcF5V_oJBNx4IvGOJpAzhr3HzVJC664clAhKPJBqlz_xpNtMitHePWyJdBvNu4reyQ6Rt93-da9e9O1PUYfZf7iB1dkejWyBd2oalxyYYHl9lzP_NGjbtc3oBVSTIwRpfc7wkDpKwc7WjKkuKyX"/>
</div>
<span className="text-xs font-medium text-neutral-400">Elite Ops Group (128)</span>
</div>
<div className="relative">
<span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-2xl">shopping_cart</span>
<span className="absolute -top-1 -right-1 bg-primary text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">3</span>
</div>
</nav>
{/*  Main Content (Rules Background Container)  */}
<main className="pt-24 pb-32 px-4 min-h-screen">
{/*  Blurred Content Behind Modal  */}
<div className="opacity-40 pointer-events-none scale-95 blur-sm transition-all duration-700">
<div className="mb-8">
<h1 className="font-headline text-4xl font-extrabold tracking-tighter mb-2">Network Rules</h1>
<p className="text-secondary text-sm">Review the 0Buck operating guidelines.</p>
</div>
<div className="space-y-4">
<div className="h-32 bg-surface-container-highest rounded-2xl w-full"></div>
<div className="h-64 bg-surface-container-highest rounded-2xl w-full"></div>
</div>
</div>
{/*  Pop-up Modal (Terminal Style)  */}
<div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-24 md:items-center">
<div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
<div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,92,40,0.15)] border border-white/5 animate-in fade-in slide-in-from-bottom-10 duration-500">
{/*  Terminal Header  */}
<div className="bg-black/50 px-6 py-4 flex items-center justify-between border-b border-white/5">
<div className="flex items-center gap-2">
<div className="flex gap-1.5">
<div className="w-3 h-3 rounded-full bg-red-500/50"></div>
<div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
<div className="w-3 h-3 rounded-full bg-green-500/50"></div>
</div>
<span className="ml-3 font-mono text-[10px] text-orange-500/70 tracking-widest uppercase">System.Rules.V4.0</span>
</div>
<button className="text-neutral-500 hover:text-white transition-colors">
<span className="material-symbols-outlined text-lg">close</span>
</button>
</div>
{/*  Terminal Body  */}
<div className="p-6 font-mono text-sm max-h-[618px] overflow-y-auto custom-scrollbar">
{/*  Intro  */}
<div className="mb-8">
<p className="text-orange-500 terminal-glow mb-2">&gt; INITIALIZING REFERRAL_TERMS.md...</p>
<p className="text-neutral-400 leading-relaxed italic">Welcome to the 0Buck Ecosystem. All agents are bound by the following protocols to ensure maximum yield transparency.</p>
</div>
{/*  Commission Tiers (Bento Style)  */}
<div className="grid grid-cols-2 gap-3 mb-8">
<div className="col-span-2 p-4 bg-orange-600/5 border border-orange-600/20 rounded-xl">
<div className="flex justify-between items-center mb-2">
<span className="text-orange-500 font-bold">LVL 1: INITIATE</span>
<span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-full">ACTIVE</span>
</div>
<p className="text-2xl font-bold text-white">5% <span className="text-xs font-normal text-neutral-500">Kickback</span></p>
</div>
<div className="p-4 bg-neutral-800/50 border border-white/5 rounded-xl">
<span className="text-[10px] text-neutral-500 block mb-1">LVL 2: VETERAN</span>
<p className="text-xl font-bold text-neutral-300">8%</p>
<span className="text-[10px] text-neutral-600">Locked: 50 Refs</span>
</div>
<div className="p-4 bg-neutral-800/50 border border-white/5 rounded-xl">
<span className="text-[10px] text-neutral-500 block mb-1">LVL 3: WHALE</span>
<p className="text-xl font-bold text-neutral-300">12%</p>
<span className="text-[10px] text-neutral-600">Locked: 200 Refs</span>
</div>
</div>
{/*  Rules List  */}
<div className="space-y-6">
<section>
<h3 className="text-orange-600 font-bold flex items-center gap-2 mb-3">
<span className="material-symbols-outlined text-sm">shield</span>
                                REFERRAL_PROTOCOL
                            </h3>
<ul className="space-y-3 text-neutral-400">
<li className="flex gap-3">
<span className="text-orange-500">01.</span>
<span>Rewards are credited 48h after transaction confirmation.</span>
</li>
<li className="flex gap-3">
<span className="text-orange-500">02.</span>
<span>Self-referral detection will lead to immediate account zero-out.</span>
</li>
<li className="flex gap-3">
<span className="text-orange-500">03.</span>
<span>Withdrawals processed in $BUCK via the Ledger directly.</span>
</li>
</ul>
</section>
</div>
{/*  AI Butler Inquiry Section  */}
<div className="mt-10 p-5 bg-gradient-to-br from-orange-600/10 to-transparent rounded-2xl border border-orange-500/10">
<div className="flex items-start gap-4">
<div className="w-12 h-12 bg-orange-600 flex items-center justify-center rounded-xl shrink-0">
<span className="material-symbols-outlined text-white text-2xl" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</div>
<div>
<h4 className="font-headline font-bold text-white mb-1">Confused about the rules?</h4>
<p className="text-xs text-neutral-400 mb-4">The Butler is online and ready to clarify any tier requirements or reward delays.</p>
<button className="w-full py-3 bg-primary rounded-xl font-headline font-black text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    ASK BUTLER
                                    <span className="material-symbols-outlined text-sm">terminal</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
{/*  NavigationDrawer (Hidden by default, structure provided)  */}
<div className="fixed inset-y-0 left-0 z-[60] -translate-x-full lg:translate-x-0 transition-transform duration-300">
<aside className="h-full w-80 rounded-r-2xl bg-neutral-950 flex flex-col p-8 gap-6 shadow-[20px_0_60px_-15px_rgba(255,92,40,0.1)]">
<div className="flex flex-col gap-1 mb-4">
<div className="w-16 h-16 rounded-2xl bg-orange-600/10 flex items-center justify-center mb-4 overflow-hidden border border-orange-500/20">
<img className="w-full h-full object-cover" data-alt="profile avatar of an elite tech executive in a minimalist studio with cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgKSMxZ7yOpRrWxVWavyUXXKJHAjyVa0Ge48KJ2SZ--42Xs8bvOOT0LBg1S_ioVbNzgLi0bYl5yPSyRfRGw44KsC-n8tIqA_ZtNV_Tdd0dAfPZ1cwHBlYl3L9d7Pd-qvdv9c99Wr6y42G43BO5cVeglXTUC4HtCTXQa23FGLqJnIZ_vdeU3M9f4iVB5vTiNK-BTF2s2RpHbObAbTdhYK44WUFAD4oX8f-XtAJUHAu6t9xYZ9ZUfXsV-7KwsPO9W88acekw_oGHOcxa"/>
</div>
<h3 className="font-headline text-lg font-black text-orange-600">0Buck Elite</h3>
<p className="text-neutral-500 text-xs">Referral ID: 8829</p>
<span className="mt-2 text-[10px] font-bold bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full self-start">LVL 4</span>
</div>
<nav className="space-y-2">
<a className="flex items-center gap-4 p-3 text-neutral-400 hover:pl-2 transition-all duration-300" href="#">
<span className="material-symbols-outlined">group</span>
<span className="font-headline">Network</span>
</a>
<button className="flex items-center gap-4 p-3 text-neutral-400 hover:pl-2 transition-all duration-300"  onClick={(e) => { e.preventDefault(); setCurrentView('me'); }}>
<span className="material-symbols-outlined">payments</span>
<span className="font-headline">Payouts</span>
</button>
<a className="flex items-center gap-4 p-3 text-neutral-400 hover:pl-2 transition-all duration-300" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-headline">Settings</span>
</a>
<button className="flex items-center gap-4 p-3 text-neutral-400 hover:pl-2 transition-all duration-300"  onClick={(e) => { e.preventDefault(); setCurrentView('chat'); }}>
<span className="material-symbols-outlined">help_center</span>
<span className="font-headline">Support</span>
</button>
</nav>
</aside>
</div>
{/*  BottomNavBar  */}

{/*  Ambient Texture Background  */}
<div className="fixed inset-0 pointer-events-none opacity-20">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#af300022,transparent_70%)]"></div>
</div>

    </div>
  );
}
