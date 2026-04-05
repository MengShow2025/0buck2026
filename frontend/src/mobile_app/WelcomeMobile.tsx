import React from 'react';

export default function WelcomeMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  Ambient Background FX  */}
<div className="fixed inset-0 z-0">
<div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
<div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-orange-900/5 blur-[100px]"></div>
<div className="absolute inset-0 frosted-overlay backdrop-blur-[100px]"></div>
</div>
{/*  Main Content Shell  */}
<main className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
{/*  Animated Content Logic  */}
<div className="flex flex-col items-center space-y-4">
{/*  Vertical Text Cycler  */}
<div className="h-12 overflow-hidden md:h-14 lg:h-20">
<div className="flex flex-col animate-vertical-slide">
<span className="text-2xl md:text-5xl lg:text-7xl font-headline font-[200] tracking-tight py-2 opacity-0">...</span>
<span className="text-2xl md:text-5xl lg:text-7xl font-headline font-[200] tracking-tight py-2">Every date</span>
<span className="text-2xl md:text-5xl lg:text-7xl font-headline font-[200] tracking-tight py-2">Every encounter</span>
<span className="text-2xl md:text-5xl lg:text-7xl font-headline font-[200] tracking-tight py-2">Every journey</span>
<span className="text-2xl md:text-5xl lg:text-7xl font-headline font-[200] tracking-tight py-2">Every flash of genius</span>
<span className="text-2xl md:text-5xl lg:text-7xl font-headline font-[200] tracking-tight py-2">Every purchase</span>
</div>
</div>
{/*  Fixed Lead-in  */}
<p className="text-secondary text-sm md:text-lg font-headline font-light tracking-[0.4em] mt-6 uppercase opacity-60">
                evolving into...
            </p>
{/*  Final Branding Section  */}
<div className="mt-8 flex flex-col items-center">
<h1 className="font-headline font-[900] text-6xl md:text-8xl lg:text-9xl tracking-tighter flex items-center">
<span className="text-[#FF5C00] animate-pulse-glow mr-[-0.02em]">0</span>
<span className="text-white">Buck</span>
</h1>
</div>
</div>
{/*  Footer Action  */}
<div className="fixed bottom-12 left-0 w-full flex flex-col items-center space-y-8">
<button className="group flex flex-col items-center focus:outline-none transition-all duration-300" onClick={(e) => { e.preventDefault(); setCurrentView('chat'); }}>
<div className="p-5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 group-hover:bg-primary-container/20 group-hover:border-primary-container/40 transition-all duration-500 mb-4 group-active:scale-95">
<span className="material-symbols-outlined text-3xl text-white group-hover:text-[#FF5C00] transition-colors" data-icon="arrow_forward">arrow_forward</span>
</div>
<span className="text-[10px] font-label uppercase tracking-[0.5em] text-secondary group-hover:text-white transition-colors">Enter Experience</span>
</button>
<nav className="flex items-center space-x-10">
<a className="text-[10px] font-label text-zinc-600 hover:text-white transition-colors tracking-[0.2em] uppercase" href="#">Sign In</a>
<span className="w-1 h-1 rounded-full bg-zinc-800"></span>
<a className="text-[10px] font-label text-zinc-600 hover:text-white transition-colors tracking-[0.2em] uppercase" href="#">About</a>
</nav>
</div>
</main>
{/*  Visual Texture Layers  */}
<div className="fixed inset-0 z-20 pointer-events-none mix-blend-soft-light opacity-[0.04]">
<div className="absolute inset-0" data-alt="Subtle fine grain and stardust texture overlay" style={{"backgroundImage":"url('https"}}></div>
</div>
{/*  Decorative Corner Accents  */}
<div className="fixed top-8 left-8 z-30 opacity-20">
<div className="w-10 h-[1px] bg-white"></div>
<div className="w-[1px] h-10 bg-white mt-[-1px]"></div>
</div>
<div className="fixed bottom-8 right-8 z-30 opacity-20">
<div className="w-10 h-[1px] bg-white ml-auto"></div>
<div className="w-[1px] h-10 bg-white ml-auto mt-[-1px]"></div>
</div>

    </div>
  );
}
