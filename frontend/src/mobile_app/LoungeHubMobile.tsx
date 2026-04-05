import React from 'react';

export default function LoungeHubMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  Fixed Header Cluster  */}
<header className="fixed top-0 w-full z-50 glass-panel bg-black/60 border-b border-white/5">
<div className="flex flex-col w-full px-6 pt-4 pb-2">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 p-[2px] flex items-center justify-center">
<img className="w-full h-full rounded-full object-cover bg-black" data-alt="Close up professional portrait of a tech-savvy user in a high-contrast cinematic lighting profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJRethYIVPUj2C8meq9FLTZ-PgK3RneDOQufcsqkFiG-2tUYuGMQ47RijVTDiudtQ7qttXOjidzLp3ImBSXmLueg0Iuaxr-GdgmBai1RirhqXSs0up-Wdqectedtk73Moo8fzvdUZlc59C0y0q8jSnyE_tnJHpFPkwKZhQRs-p6HGnm66dPzWbbf5CLN0d5IyJBvt8OhSBjdshRoLpUB-dS_Excu7j0laOdKgYPC_rProwHLxGk0Jsqqq7FaWO_EKiHn7Nj5YbJBw-"/>
</div>
<div className="flex flex-col">
<span className="text-2xl font-black text-primary uppercase tracking-tighter font-headline leading-none flex items-center">
<span className="slashed-zero mr-[2px]">0</span>BUCK
                    </span>
<span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest leading-none mt-1">IM Group Mode</span>
</div>
</div>
<div className="flex items-center gap-3">
<button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
<span className="material-symbols-outlined text-white text-xl">notifications</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
<span className="material-symbols-outlined text-white text-xl">support_agent</span>
</button>
</div>
</div>
{/*  Scrolling Product Thumbnails  */}
<div className="flex overflow-x-auto gap-3 hide-scrollbar py-2">
<div className="flex-shrink-0 flex items-center gap-3 bg-white/5 rounded-2xl p-2 pr-4 border border-white/5">
<div className="w-10 h-10 rounded-xl bg-orange-950 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Sleek modern digital smartwatch" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbF9qOyFRlWrgXi0Y1rxbVv89Tr_9n4lT0LHh-rU8AyMglkdm2WgXVvStcC01UZwuaBVVKsM_lt1LFIClcK9SDBtk1pAIp9q_C_e090Ipezq6_XQdOKVrXPZrsjSVNsgWGzgVeD0qEu_KYm6PmFGmEBIPBZxHaj8sH-GVri8tUZReXZdgq_BVu9NfT9SPhkZK8O5KhzI9IvcSqze55rnsVxo9LFbEB9RIdeygUjvavS0p63yEqCcXpkqZgE_Mx-pVkZHlKPZeJ-0TC"/>
</div>
<div className="flex flex-col">
<span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Flash Sale</span>
<span className="text-xs font-bold text-primary">$0.99</span>
</div>
</div>
<div className="flex-shrink-0 flex items-center gap-3 bg-white/5 rounded-2xl p-2 pr-4 border border-white/5">
<div className="w-10 h-10 rounded-xl bg-orange-950 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="High-end noise cancelling headphones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHCeZ6_fnyA_dKDQnoz53F1gqhsQd8wHULigSzPpU8fw2DWBds_y_pSQPzlHaSSPdTOKAM0RFrV4CdKzGZx_KiNLfzG3WjJ6n0ICj00_IiI4QLOGUx45GvWYcf1iyBeSPCMl6L5bFXn7NNskpbSMQ1Xny5K-yeuQiFFu5U81Jg366atuL72rehBBCbGwPTTCGYki_wrKZBPtEpvVooxauuWiK9QCap8horjX7KdJotme1UG06ChWamYDyiNFz6nvWFEqZLR9BoceSy"/>
</div>
<div className="flex flex-col">
<span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Premium</span>
<span className="text-xs font-bold text-primary">$12.50</span>
</div>
</div>
<div className="flex-shrink-0 flex items-center gap-3 bg-white/5 rounded-2xl p-2 pr-4 border border-white/5">
<div className="w-10 h-10 rounded-xl bg-orange-950 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Minimalist street wear jacket" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChAbTaYtEtoFnuiZczz2V-MJ1t-uDQV1VdqRNk7UL1VOzHB4eO0SwwzwkcSEiY5mahldjgA0xizdZce4zCNhlPaUFelLJVMw3oV4lAeHUfJ6z2989wQSuPk9ZyDQ8bDfhqGJVZ_n5apBlGGhjVm6nWdWHs4tH3eGUROfs5EV4_95nHF25NGoJa2hiBpDk4lEOsvVzedVECwpudXRtp8_YIQxp5oiQ59uYlYYQw1KK5yRJTxO9GgPw8QqJlabkY_fFSNlFR-SgwqxSk"/>
</div>
<div className="flex flex-col">
<span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Lounge Wear</span>
<span className="text-xs font-bold text-primary">$8.00</span>
</div>
</div>
</div>
</div>
</header>
<main className="pt-40 pb-32 px-6 space-y-8">
{/*  Live Activity Banner  */}
<section className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r from-orange-600 to-orange-800 shadow-xl shadow-orange-900/20">
<div className="relative z-10 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
<span className="material-symbols-outlined text-white" style={{"fontVariationSettings":"'FILL' 1"}}>bolt</span>
</div>
<div>
<h3 className="font-headline font-bold text-white text-lg leading-none">Live Drop</h3>
<p className="text-white/80 text-xs font-medium mt-1">Sneaker Vault opening in 04:12</p>
</div>
</div>
<button className="bg-white text-orange-700 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-tight shadow-lg shadow-black/10 active:scale-95 transition-transform">Notify Me</button>
</div>
<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10"></div>
</section>
{/*  Search & QR Actions  */}
<section className="flex gap-3">
<div className="flex-1 flex items-center bg-white/5 rounded-2xl px-4 border border-white/5 focus-within:border-primary/50 transition-colors">
<span className="material-symbols-outlined text-neutral-500 mr-3">search</span>
<input className="bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 w-full py-4 text-sm font-medium" placeholder="Add via email or link..." type="text"/>
</div>
<button aria-label="Scan QR Code" className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center border border-white/5 hover:border-primary/40 transition-all active:scale-95">
<span className="material-symbols-outlined text-primary">qr_code_scanner</span>
</button>
</section>
{/*  Tabbed List Hub  */}
<section className="space-y-6">
<div className="flex gap-8 border-b border-white/5 pb-2">
<button className="relative pb-2 text-lg font-bold font-headline text-white group">
                Friends
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"></div>
</button>
<button className="pb-2 text-lg font-bold font-headline text-neutral-500 hover:text-neutral-300 transition-colors">
                Groups
            </button>
<button className="pb-2 text-lg font-bold font-headline text-neutral-500 hover:text-neutral-300 transition-colors">
                Vault Hub
            </button>
</div>
{/*  Content Feed  */}
<div className="grid grid-cols-1 gap-4">
{/*  Contact Card  */}
<div className="group relative overflow-hidden glass-panel rounded-[2rem] p-5 border border-white/5 hover:border-primary/20 transition-all duration-300">
<div className="flex items-center gap-5">
<div className="relative">
<img className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Portrait of Jordan Dare" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxkAxlx8o9mUPAfvsWJrcWbs3_NH4d0_7OIXps4eQgRZE2_0JebSDtjhEgi_Sz5n1UZvFyPRGNqe9q7o9lEgSSrGWo8Jtv8mXKKUUj9JPM7HTQZ_EVTyun1ydOZL6i_VL4kcC6QIUPbsPQxVyNJE8dU3zL7UzGBMX1MWwrmRuH-1b-EKYEshUGuBZltzyz6k4VjaVZjoCHjSUXUHs-HdIFPu-gWO5TRve34O2B0xnryip37ulltrxjtaPmBeG0egqIvL_OXk4Ariv"/>
<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
</div>
<div className="flex-1">
<h4 className="font-headline font-bold text-white text-lg">Jordan Dare</h4>
<p className="text-neutral-500 text-sm font-medium">Sent you a 0Buck Voucher</p>
</div>
<div className="text-right">
<span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded-md">Vip</span>
<p className="text-[10px] text-neutral-600 font-bold mt-2 uppercase">2M Ago</p>
</div>
</div>
</div>
{/*  Group Card  */}
<div className="group relative overflow-hidden glass-panel rounded-[2rem] p-5 border border-white/5 hover:border-primary/20 transition-all duration-300">
<div className="flex items-center gap-5">
<div className="flex -space-x-4">
<img className="w-12 h-12 rounded-xl border-2 border-black object-cover" data-alt="Group image 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWavd6azhDAZV7Ac9lcKmp4Z2s82UPr7btP_QzgAySX8cj26NVLSzTPmHjI8PsACI_A4jKMkRm6cPllOKoHSOcCPMwvKDLcitvLhMlSCWhhUeCH4QR0Q_1FHEcgRrQWXwWVIjgqYoBYq40sBAeTxDC11eY9tBF3LCbrIieVAYOxziQlVDgSbOBlXi2JG81f8K2a7FnE9h0EmJPIz1QgwH-UOOm0JzJKyckSMI01n6rRyY8T4Yr6FkmItuLkgpSAEkYW4A62-1C2ig3"/>
<img className="w-12 h-12 rounded-xl border-2 border-black object-cover" data-alt="Group image 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc-dCvIMVOnQEtfAq-Io6sc_ulb-QnXVhuhObXVfHE3_tEjNcsYuaDJ-YfrseSgQak9SEFRejwRUPR7jDHaRqnm2s9pD7sZC-M8FtJ__b68iXGSoljDM9okAw6mViZULjPZEE9ZjSNdidwNZ6bPgz97m9CBXDw52nPOmytOyyfW7lyybejgxKGYqDb0fp05XkGKSXFMonjvUiQojGA2UbAkOUOiEpplF5W4XanGbkZgNpMeqaatpI9m43o2dss3t28c5zejWEee0Zq"/>
<div className="w-12 h-12 rounded-xl border-2 border-black bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white">+12</div>
</div>
<div className="flex-1">
<h4 className="font-headline font-bold text-white text-lg">Elite Resellers</h4>
<p className="text-neutral-500 text-sm font-medium">Alex: Just dropped the link...</p>
</div>
<div className="flex flex-col items-end gap-1">
<div className="w-2 h-2 rounded-full bg-primary neon-glow-orange"></div>
<span className="text-[10px] text-neutral-600 font-bold">12:45</span>
</div>
</div>
</div>
{/*  Contact Card  */}
<div className="group relative overflow-hidden glass-panel rounded-[2rem] p-5 border border-white/5 hover:border-primary/20 transition-all duration-300">
<div className="flex items-center gap-5">
<div className="relative">
<img className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Portrait of Sarah Light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjg5w4VgKHCeG2yMbsd8WlQY3MAsOEDX2pzI5BE3VG4Dlr8mumqjtPdJak86YbPV3K-zJHVkxFx6-KTyrHgQXw1HudVDFIAbdmJ7byKry9inynxGcR0hSP4H4ZAdmRjLYKR0hxO1nwlmxmFUVQ36Hun-6pZJaJ8Y-s_on1-O-ffNGfSiNYvyXEMD6Qunsav5co49pIKKwKk0gS8-iBOlySWe-2FRgYj-5AllC-wCv6wnpMGY2ZOyAm1O7nZ1uUGPR-Y6py4Le9vpUA"/>
<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neutral-600 border-4 border-[#0a0a0a] rounded-full"></div>
</div>
<div className="flex-1">
<h4 className="font-headline font-bold text-white text-lg">Sarah Light</h4>
<p className="text-neutral-500 text-sm font-medium">Inactive for 3 days</p>
</div>
<div className="text-right">
<span className="text-[10px] font-bold text-neutral-500 uppercase bg-white/5 px-2 py-1 rounded-md">Alpha</span>
</div>
</div>
</div>
</div>
</section>
</main>
{/*  AI Butler / Floating Concierge  */}
<button aria-label="AI Concierge Butler" className="fixed bottom-28 right-6 w-16 h-16 rounded-2xl bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center neon-glow-orange active:scale-90 transition-transform z-40">
<span className="material-symbols-outlined text-white text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
<div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
</div>
</button>
      {/* spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}
