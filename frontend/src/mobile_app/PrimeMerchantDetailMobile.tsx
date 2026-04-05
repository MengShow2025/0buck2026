import React from 'react';

export default function PrimeMerchantDetailMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  TopAppBar  */}
<header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl flex flex-col w-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
<div className="flex items-center justify-between px-6 py-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-orange-600">arrow_back</span>
<h1 className="text-2xl font-extrabold text-white uppercase tracking-tighter font-['Plus_Jakarta_Sans']">Supplier Marketplace</h1>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-zinc-400">share</span>
<div className="relative">
<span className="material-symbols-outlined text-orange-600">shopping_cart</span>
<span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-zinc-950">3</span>
</div>
</div>
</div>
{/*  IM Mode Persistent Product Scroller  */}
<div className="px-6 pb-4 overflow-x-auto flex gap-3 scroll-smooth">
<div className="flex-none w-20 h-20 rounded-xl bg-zinc-900 overflow-hidden ring-1 ring-orange-500/30">
<img className="w-full h-full object-cover" data-alt="Minimalist white smart watch on dark background with high contrast lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Gxh0QPkgByT00vk5-R7NLcBlV2nJEH-Jn7S1lZ-yMFBkUgbvghrlZ-6D436b4Lw78ghzn1-qIG1bi5smFOxjp5-QkiBW2IxA-cfonDnh3CgdTTO5tOPfl4GT-ausJtOqHmW-WbBN9TlfWksNSTGv3uty0n-mTlKhRjxmLwHF7zq850hA7yQUM3QLw8kFPUyXmOE38ZWNmybGVJOEyJhfKAqIdvf79Qdoe6sTQtLUoe2U7Ah7AXwIxdULIBX86ptR6pMJ-75wr2sF"/>
</div>
<div className="flex-none w-20 h-20 rounded-xl bg-zinc-900 overflow-hidden ring-1 ring-white/10">
<img className="w-full h-full object-cover" data-alt="High-end professional studio headphones on a wooden texture background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwOu9_JAMT8LWb8iAiVmcuSco9MXuc2Bc3TcFIC5F-CdwY781UqsgWsiIrD8avfzF7atpnO0cKxT_h2Q3qw3BkHu-0IeiiA8sPuANJgoB1CiSMzapCGn0W3KYF7O1RillnDAy-j4g0nkqyyL3hd_kQ5nuIDPNZisnhibsriVIg4HC6Kn9MS_46N3bcB7updSFpbTxNqiD16FhNhTLAo_3qtn0f-lZVF0dtkHT2I9pS-5vDwLL5tnQj_9LlfSKofpgPczsHt_ce1OHx"/>
</div>
<div className="flex-none w-20 h-20 rounded-xl bg-zinc-900 overflow-hidden ring-1 ring-white/10">
<img className="w-full h-full object-cover" data-alt="Red athletic sneaker floating in mid-air against a clean grey background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1GZB9PHyHh4agfehbo0HInoTXi10LH-wF7fi6T21mL7h9x5Vp0VSD659jiN5FYYnya8ftdbmWqWTtnu5GtWRFqdSHv_rIdhVex5ZTMoqKMuKYTeb-0qXOCeuH8-I8KPH29fE11KpotDJTLA49F1IazTHAEWv4p3-8YFMHKbsnxDzL9Ia-EzqT6iyQPHSmmhIRjrtFt4rVHH5xpYH8F9SnIuAzk7dcGeMgCKtXV2xkjNYR8tL8yV6Sjm4Vii2AVjFuuwy4zTsNnGei"/>
</div>
<div className="flex-none w-20 h-20 rounded-xl bg-zinc-900 overflow-hidden ring-1 ring-white/10">
<img className="w-full h-full object-cover" data-alt="Modern high-tech laptop open on a desk with glowing keyboard lights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqyOJcOgosSedlZFuVFi5GolxR5Zu51xF_b1nMO19fXxUJkRnk8v8pcvvCBamYJzrU0ISI9jFsMsaouAlzSLDrUEamrri_aZGn7rBVFVohmE6QXylzZvyueh0jRk4Cpc7K2chLbBAUhjOsWqCxPUihaQQiqQ1aA6qCot6vpA1BT3O_vheYDh3VU2GcxYwRVbx_rS012dVzkH58mBqYI7ZsPXdwVsRRyKLXPe-pC6Q_CsL_4cKRL_IkZSWQEUYUYuKoyXXB-5fN5aRS"/>
</div>
</div>
</header>
<main className="pt-44 pb-32 px-4 space-y-8">
{/*  Hero Section: Merchant Info  */}
<section className="space-y-6">
<div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-2xl">
<img className="w-full h-full object-cover" data-alt="Modern automated manufacturing facility with robotic arms and blue industrial lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUYxrxB5DqQJfX-wFdhcgjRt6B7DtvA6z_Fn4uvgABk_xnHI6k2JsQQtRJpzm1KP_syVtxoBJ_p1S4ftiDbiHuKoG_u3Da393AvoXGrpKbemFZIr-4SdSOZhNOmG0lTvVBXCmYDzrTgxvlTROxxbbNIm7cmQnC-co80Edy5GmGxnfO-a2AHI8xco-uPGFrnNPW4g1v_6DNqOaNQNc6-VU2Dxz2pjGmwQytdCXBwpEccc4LEro4PcQHIwCmSAr7QgI-7XkY5o6JS2t0"/>
<div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
<div className="absolute bottom-6 left-6 right-6">
<div className="flex items-center gap-2 mb-2">
<span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Tier 1 Supplier</span>
<div className="flex items-center text-orange-400">
<span className="material-symbols-outlined text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs font-bold ml-1">4.9 (2.4k Reviews)</span>
</div>
</div>
<h2 className="text-3xl font-black font-headline tracking-tighter text-white">Lumina Precision Components</h2>
<p className="text-zinc-400 text-sm flex items-center gap-1">
<span className="material-symbols-outlined text-sm">location_on</span>
                        Industrial District 7, Neo-Shengzen Tech Park
                    </p>
</div>
</div>
{/*  Activity Banner  */}
<div className="bg-orange-600/10 border border-orange-500/20 p-4 rounded-2xl flex items-center gap-4">
<div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
<p className="text-orange-500 text-xs font-semibold uppercase tracking-wider">Live Activity: 14 agents currently negotiating bulk orders</p>
</div>
</section>
{/*  Company Intro  */}
<section className="space-y-3">
<h3 className="text-lg font-bold font-headline tracking-tight text-white/90">The Core Mission</h3>
<p className="text-zinc-400 leading-relaxed text-sm">
                Specializing in aerospace-grade micro-sensors and photonic interconnects. With 12 automated lines and a dedicated R&amp;D wing, Lumina leads the Prime network in precision and delivery speed.
            </p>
<div className="flex gap-2 pt-2">
<span className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-lg text-xs font-medium border border-white/5">ISO 9001</span>
<span className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-lg text-xs font-medium border border-white/5">TS 16949</span>
<span className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-lg text-xs font-medium border border-white/5">Eco-Vadis Gold</span>
</div>
</section>
{/*  Product Grid (Bento Style)  */}
<section className="space-y-4">
<div className="flex items-center justify-between">
<h3 className="text-xl font-black font-headline text-white">Catalog Highlights</h3>
<span className="text-orange-500 text-xs font-bold uppercase">View All</span>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="col-span-2 bg-zinc-900 rounded-3xl p-5 flex flex-col justify-end min-h-[200px] relative overflow-hidden group border border-white/5">
<img className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" data-alt="Macro photography of a high-performance computer processor chip with gold circuits" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBTkEXlrb6r2J8vaKfT4_yM6W4rLyQnXVe25pPK_FGmtWBf1L-ysGRr3wy3c3e0vakw7l6t59q_G5GSnVaBZySvUVeItfb9ftb52p21VaV2CVY9-V4HbNhbvEkwFmFkRES-IVukfBlW_csay1YlH-6_eIa8tan0xM3nz2NJTAnsD80NZBzaJ4Yn3yGJRnxFciiv3KD18xXvdP-wo5WyRun1UKFHjWqiiiR8XaK0t4EI_y-OmN8LNY9k2H71MKAesf8F7G3M09DGkUU"/>
<div className="relative z-10">
<span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-1 block">Best Seller</span>
<h4 className="text-lg font-bold text-white leading-tight">Quantum-X Flux Capacitor</h4>
<p className="text-zinc-400 text-xs">$1,240.00 / unit</p>
</div>
</div>
<div className="bg-zinc-900 rounded-3xl p-4 space-y-3 border border-white/5">
<div className="aspect-square rounded-xl bg-zinc-800 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Abstract glowing fiber optic cables in a dark server room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuFg96hKudsrG9hNHt6xYmz2N_JIwhhdqwYFwazjnJOeKu66JqvjUS-hrNf0ICzRjJV3wXcE08i9qUMRp2Dcx97FHy74fKurldiyNQ7ecYKa1iBMXPNzIOrXzu2WhpLfCDm4u5Fl1Wdm5FEacvtFEaNj3_76ezbWryscGr-KqM1JQc3XMJ0AWyDpEaoyrsF4B9TqMoUIAn2SgqyFJCO5gHrGLPBQ6JZr77QXyz-dDZARqlpkA3lPg4LYwnbAgicVo9CPxjVR_uqOMg"/>
</div>
<div>
<h4 className="font-bold text-sm text-white">Optic-Link S1</h4>
<p className="text-zinc-500 text-[10px]">$42.00</p>
</div>
</div>
<div className="bg-zinc-900 rounded-3xl p-4 space-y-3 border border-white/5">
<div className="aspect-square rounded-xl bg-zinc-800 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A robotic hand interacting with a digital interface showing glowing code" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDngXG4dDQOKK6QJFCtQM6SjZYqcteQXlZELlkw4AVQcWNyaW5O-M7F1m5Hk_bpCxgR2yuChbefF2xtbSmZiNi1gKL3f068sbqp671_zUG0geG_xfWLK-PlYcfb0TquUGMbzgXagt0yeWZc8jLhClOfvv0IzlN-er4YdRJP8QlkvpiUXqJ1RwfMbD-knGgkPen0tvoDm8H1e_bG8Na2oQbgennvVlXSBrh1mrw73U8TLn-atu4pki86xWnZN6XXFLJannB_e5V_g1FX"/>
</div>
<div>
<h4 className="font-bold text-sm text-white">Neural Hub Core</h4>
<p className="text-zinc-500 text-[10px]">$899.00</p>
</div>
</div>
</div>
</section>
{/*  Factory Photos/Videos Gallery  */}
<section className="space-y-4">
<h3 className="text-xl font-black font-headline text-white">Inside the Facility</h3>
<div className="flex gap-3 overflow-x-auto pb-2">
<div className="flex-none w-64 h-40 rounded-2xl bg-zinc-900 overflow-hidden relative border border-white/5">
<img className="w-full h-full object-cover" data-alt="A high-tech clean room with researchers in white suits working on microelectronics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgYw87n9yaOpyMeLF_WGU9f9qgf7sRfAJqVvc6pAXGGZ5KCLqw6HU8aDYzf3sXaLV2VCVEMGOu1a5MXQuFqXENyEesVh6G-gyiEyPynA56aDRckYXsj8sDTOn_x79ZraQxWv0m8CEEL-0zIbXh9fzwxubr97Ol430u_M8pmKZbiZs4ZWdt89rm_FkUvZHvGc81f7A90rccMnLwsHqRTQpVOlD30VG380uWa5mKTvp1b8h73Xuw7tCa9oUv6nGFFJdfffJBe7baaCoN"/>
<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
<span className="material-symbols-outlined text-white text-4xl" style={{"fontVariationSettings":"'FILL' 1"}}>play_circle</span>
</div>
</div>
<div className="flex-none w-64 h-40 rounded-2xl bg-zinc-900 overflow-hidden border border-white/5">
<img className="w-full h-full object-cover" data-alt="Automated production line with precise robotic soldering in a modern factory" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvHDHySJry5vwxaV6anJR6Rm-Fian3HKwO59vP1EYiArRPS11abxbzZ68C-DQk-7G8R8BPsNTweYeV7vHxUPJHj-cNrrW3e0iB1-pKBHqfAAJoCcykfuW0ITc14HoStRDSpqgh5Tv_0_AtyD_FK-Mu6eMmiNSOY-1X-p7BKc1sv8bzp_fJUnvQKAWVapFVvu66Os5t1F3SibAqIOkPGPby7t87CP3imyd6uKB7tMV572zEL_P7hN6z-0IEa9AX7OHPA67KHNS3vl0z"/>
</div>
</div>
</section>
{/*  Reviews Section  */}
<section className="space-y-6">
<div className="flex items-center justify-between">
<h3 className="text-xl font-black font-headline text-white">Verified Reviews</h3>
<span className="material-symbols-outlined text-zinc-500">tune</span>
</div>
<div className="space-y-4">
{/*  Review Card 1  */}
<div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5 space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-500 font-bold">JD</div>
<div>
<p className="text-sm font-bold text-white">Jordan Dax</p>
<p className="text-[10px] text-zinc-500 uppercase">CTO, NexaCorp</p>
</div>
</div>
<div className="flex text-orange-500 scale-75">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
</div>
</div>
<p className="text-zinc-400 text-sm italic leading-relaxed">"Their lead times are unbeatable in the Shenzhen district. The quality control on the Flux Capacitor batch was flawless. 10/10 recommendation."</p>
</div>
{/*  Review Card 2  */}
<div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5 space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">SL</div>
<div>
<p className="text-sm font-bold text-white">Sarah Liao</p>
<p className="text-[10px] text-zinc-500 uppercase">Procurement Lead</p>
</div>
</div>
<div className="flex text-orange-500 scale-75">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined">star</span>
</div>
</div>
<p className="text-zinc-400 text-sm italic leading-relaxed">"Great communication. Had a slight delay with customs, but their support team was active 24/7. Highly reliable."</p>
</div>
</div>
</section>
{/*  Recommendation List  */}
<section className="space-y-4">
<h3 className="text-xl font-black font-headline text-white">Similar Merchants</h3>
<div className="space-y-3">
<div className="flex gap-4 items-center bg-zinc-900 p-3 rounded-2xl border border-white/5">
<div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Abstract colorful light reflections in a glass sculpture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5Mq4TnnjVqG2efbZxpN4nsLdbteK9eAa2NbUE4RFuceKotx4P9iFCWTIAEmyh49yuZ6HSaNhvvFG4YT_fdjggwG04tCdsMNR_DEHoauyXsHVwzWfrGG2Ac3HgRjdCn4owdZIUsf8aE5ScTTH9GR82FJ44qIxAVntvDxnZjXimeLLzgGglhpJ2zTJEgDkRK6GjZ3fhG5t2BvFzQ1C0dadUtB1leuNjMDg_LeFYR6Dqad2WOcmqjn4auy9gtNFtAlb9fVQTI-LKEeUH"/>
</div>
<div className="flex-1">
<h4 className="text-sm font-bold text-white">Prism Optical Labs</h4>
<p className="text-[10px] text-zinc-500">Tier 2 • Shenzhen East</p>
</div>
<span className="material-symbols-outlined text-zinc-500">chevron_right</span>
</div>
<div className="flex gap-4 items-center bg-zinc-900 p-3 rounded-2xl border border-white/5">
<div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Close up of a technician's hands working on a green circuit board with tools" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEvlHvIl1FWTG817DGXpkBoFLg7gsfY98BoVYoPOyZPO2gqf76PNA4bRyhwxGc_xmXvtrlbz1YRjG3CHd9tPuPZYnVYHWE8djOrWhg4GXjnq8z8BqZLgkAUgXB4OKoeMV3wexjEMYPjG9o1OaUeeNA5_iHD20su1Clhe4-OTxajmLGQLzj6u_4vs-2vyBJCqOLyRte9DidWACrPFwR8OX7c2BLRoezQ4OYlLtuEKYaf8eNtl9ED0v5mElXfopuVInZq28mCZS3oXuJ"/>
</div>
<div className="flex-1">
<h4 className="text-sm font-bold text-white">Apex MicroSystems</h4>
<p className="text-[10px] text-zinc-500">Tier 1 • Global</p>
</div>
<span className="material-symbols-outlined text-zinc-500">chevron_right</span>
</div>
</div>
</section>
</main>
{/*  Floating AI Butler  */}
<div className="fixed bottom-28 right-6 z-40">
<div className="relative group">
<div className="absolute -inset-2 bg-orange-600 rounded-full blur opacity-25 group-active:opacity-50 transition duration-200"></div>
<button className="relative bg-zinc-950 p-4 rounded-full border border-orange-500/50 shadow-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-orange-500 text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</button>
{/*  Prompt Bubble  */}
<div className="absolute bottom-full right-0 mb-4 w-48 bg-zinc-900 p-3 rounded-2xl rounded-br-none border border-white/10 shadow-2xl pointer-events-none">
<p className="text-[10px] text-zinc-300 font-medium">Need help negotiating terms with Lumina?</p>
</div>
</div>
</div>
{/*  BottomNavBar  */}

{/*  Content Overlays for active mode  */}
<div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-30 z-[60]"></div>

    </div>
  );
}
