import React from 'react';

export default function LoginMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  TopAppBar  */}
<nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-orange-900/10">
<div className="flex items-center justify-between px-6 h-16 w-full max-w-screen-2xl mx-auto">
<div className="flex items-center gap-4">
<button className="text-neutral-400 hover:bg-orange-600/10 transition-colors p-2 rounded-xl active:scale-95 active:duration-100">
<span className="material-symbols-outlined">menu</span>
</button>
<span className="text-2xl font-bold italic text-orange-600 tracking-tighter slashed-zero">0Buck</span>
</div>
<div className="flex items-center">
<button className="text-neutral-400 hover:bg-orange-600/10 transition-colors p-2 rounded-xl active:scale-95 active:duration-100">
<span className="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</nav>
{/*  Main Content: Login Screen  */}
<main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-32">
{/*  Hero Background Texture (Visual Soul)  */}
<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
<div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full"></div>
<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-900/20 blur-[120px] rounded-full"></div>
</div>
<div className="w-full max-w-md z-10 space-y-8">
<header className="text-center space-y-2">
<h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter slashed-zero text-white">
                    Access <span className="text-brand-orange">0Buck</span>
</h1>
<p className="text-neutral-400 font-body text-sm px-4">
                    The luminous ledger for high-performance transactions.
                </p>
</header>
{/*  Login Card  */}
<div className="bg-neutral-900/40 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/5 space-y-6">
{/*  Social Login Cluster  */}
<div className="grid grid-cols-3 gap-4">
<button aria-label="Login with Google" className="flex items-center justify-center p-4 bg-neutral-800/50 hover:bg-neutral-800 transition-all rounded-2xl active:scale-95">
<img alt="" className="w-6 h-6 grayscale brightness-200" data-alt="minimalist white google logo icon on transparent background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4xcat_ROkOIFyhmXPAEMLuWvROfnhSgvvYcRqH5iEj_wL_zLJMYVV9Ip020GnaKEoiRNCkAZXaOIIGoHlMHxv3h7ETIdrIjZ_pry0v8S92VsR0NnM7bvjFLTvv0P6L_96mBycElfk5l_mpshbSajb0mPbZEd1jdrucPkbRxquNG3k-0SHdNK2HUeOQA0RKH_93WrUiWw1Glq3_rThHW6-1OS-EOXSwwGhDFB9cNK0wzF1czojBX_sZGQTjWkV-X8FSJjAo5uDJSa5"/>
</button>
<button aria-label="Login with Apple" className="flex items-center justify-center p-4 bg-neutral-800/50 hover:bg-neutral-800 transition-all rounded-2xl active:scale-95">
<span className="material-symbols-outlined text-white" style={{"fontVariationSettings":"'FILL' 1"}}>ios</span>
</button>
<button aria-label="Login with Facebook" className="flex items-center justify-center p-4 bg-neutral-800/50 hover:bg-neutral-800 transition-all rounded-2xl active:scale-95">
<span className="material-symbols-outlined text-white" style={{"fontVariationSettings":"'FILL' 1"}}>social_leaderboard</span>
</button>
</div>
<div className="flex items-center gap-4">
<div className="h-[1px] flex-grow bg-white/10"></div>
<span className="text-xs font-label text-neutral-500 tracking-widest uppercase">Or email</span>
<div className="h-[1px] flex-grow bg-white/10"></div>
</div>
{/*  Email Input Form  */}
<form className="space-y-4" onsubmit="return false;">
<div className="space-y-1">
<label className="text-xs font-medium text-neutral-400 ml-1">Account ID</label>
<div className="relative group">
<input className="w-full bg-neutral-800/40 border-none focus:ring-2 focus:ring-brand-orange/20 rounded-xl py-4 px-5 text-white placeholder-neutral-600 transition-all" placeholder="ledger@0buck.com" type="email"/>
</div>
</div>
<button className="w-full bg-gradient-to-tr from-primary to-primary-container text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 active:scale-95 transition-transform" onClick={(e) => { e.preventDefault(); setCurrentView('chat'); }}>
                        Secure Email Login
                    </button>
</form>
{/*  Guest Entry & Disclaimer  */}
<div className="pt-4 border-t border-white/5">
<button className="w-full py-2 text-brand-orange font-semibold text-sm hover:underline transition-all">
                        Browse as Guest
                    </button>
<div className="mt-4 flex gap-3 p-4 bg-orange-950/20 rounded-2xl border border-orange-500/10">
<span className="material-symbols-outlined text-brand-orange text-lg">info</span>
<p className="text-xs leading-relaxed text-orange-200/70">
                            Private ledger groups and the Precision Marketplace require a verified account for transaction integrity.
                        </p>
</div>
</div>
</div>
{/*  Footer Small  */}
<footer className="text-center space-y-4">
<p className="text-xs text-neutral-600 font-label slashed-zero">© 2024 0Buck Precision Ledger</p>
<div className="flex justify-center gap-6 text-xs text-neutral-500">
<a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
<a className="hover:text-white transition-colors" href="#">Terms of Service</a>
</div>
</footer>
</div>
</main>
{/*  BottomNavBar (Visible for Guest Preview)  */}

{/*  Responsive Backdrop for Premium Feel  */}
<div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

    </div>
  );
}
