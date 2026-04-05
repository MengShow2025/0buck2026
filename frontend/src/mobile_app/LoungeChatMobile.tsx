import React from 'react';

export default function LoungeChatMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  Header & Fixed Ticker Shell  */}
<header className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 flex flex-col">
<div className="flex items-center justify-between px-4 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden border border-primary/20">
<img alt="AI Butler Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC94NEZI5lkLjX0bJZ5iV0SxDUDfSk1yMH8FHVqj4jC5kEFgdBm809yygPO3U9JI7ULHPFg6mKzAptRm9fbPzJHJ0V7eNv875RVRTTxa5HWlCRQs9ymOdDCqDGnc5cttDKETNmI0VcfFuzfoKJ2Nmwdl7LZ81bsD1w8494K7Rpe_1AXBF91RRXW0cFl0IYfHeoZ4OdcAbbEzutTWAug4waO76xn2gETKMxCRR4Pv5xettQODS4lijebXL7V4mUTftNSi5VwU2uDOEjz"/>
</div>
<div className="flex flex-col">
<h1 className="text-xl font-black text-white uppercase tracking-tighter font-headline flex items-center gap-1">
<span className="text-primary slashed-zero">0</span>BUCK LOUNGE
</h1>
<span className="text-[9px] font-bold text-primary tracking-[0.2em] uppercase opacity-80">IM Group Mode</span>
</div>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-neutral-400 text-2xl cursor-pointer hover:text-white transition-colors" data-icon="search">search</span>
<span className="material-symbols-outlined text-primary text-2xl cursor-pointer hover:scale-110 transition-transform" data-icon="notifications">notifications</span>
</div>
</div>
{/*  Scrolling Product Ticker  */}
<div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-3">
<div className="flex-none flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
<img alt="Sneaker" className="w-5 h-5 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu7QkckSIFELX3dcgjZ6jieTAJeKOOqE2Xf8w4Ls8lU_mwiq67bZst72fi-EhugjWFBmmYSMRVMMXVr9I0Bt5TvGtRZfyG-HW7sq9uVh5oz_OHy9GjY-qGG0Cv4I2tYFj0YKhUDvdJxMBLA3F0aW3Fu6v5Wxj-nFJigXlCvZU17M93qzNrMgOZRTPL51iof43XqW4MQEEglyNqyDZcmM7bMA44gw8wguC6q5ODLBz3yHQXrxrJrLCglIb1rTUhIHyjHTNAmA9KUYur"/>
<span className="text-[10px] font-bold text-white tracking-widest">$0.00</span>
</div>
<div className="flex-none flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
<img alt="Keyboard" className="w-5 h-5 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqVrIoZkT-SWgdhsJffKoRQFj_BzUm-WoRC6acOu-T3qvYZtTS87jk4pp2lu6s8zILbeIeohpPseko2UHPNuxO3LLcHYheYMSg-0HBNLlBCLkuRNmSGBgDwJn1YHl9zYCQJQ1fqangqGH64sE4QhGbTLv64v5xPARVmYCKtIdYPamszTYoC8is-nsA7hPz46US2tu5BGe_ZaIzB41rJyHNai1Qa_wBQSMhucpVGzbeRJKMPCUOL6lcWk8CJ_uoETfz-P4LfI3TNIdQ"/>
<span className="text-[10px] font-bold text-white tracking-widest">$0.00</span>
</div>
<div className="flex-none flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
<img alt="Watch" className="w-5 h-5 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_cspypqhOJUloaKA5lbejKNDE5jhBTn1C2JEVVW1j_-Z_kkwHYDCbYQqm027OuUMyvTiFq4WH6oxw2zlm9VtTwcjSjRyeKJm2yCPQ2VupI3eYeAaLoQVFjkDsQvnW1QW6dfQ0MGIWmw0et1LmbcwW6j413w0iC5A_E01SKmK8qzmFS7BFw7IsWhYaJ4JTPtAbycmWLWHu5yfxsbZ2ZdC2vR0Pm5ePCw3iedArMtUAeb0GiS8AfF2-C_JHr1HVjSs3GYDtxUUAfcyO"/>
<span className="text-[10px] font-bold text-white tracking-widest">$0.00</span>
</div>
<div className="flex-none flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
<img alt="Laptop" className="w-5 h-5 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNHSz2MgLl3f-L1xLrVw5lxHIVbyStgWj9XCRjEeWI4psZS2JdGrAH1-c4akJoO7sAwceTJrTuaqrToHnXGnqqAhHqHVoEglA5gl-TZ9xH7xTTunEKNRdfH1EFLVeo82qaGd_I8gH-y9Zu7w6awA5Oe8OUt-yJFb1sbWYwu6WKqEjUY0hFz7HevZZjMSCMZuyjpiK06L544ihfhDQdxi1qp6YEgHyf8ox39KhRW_hdd0b0quGAhCTsvnYFCfMOnrSYgUsr8kwg62Ur"/>
<span className="text-[10px] font-bold text-white tracking-widest">$0.00</span>
</div>
</div>
</header>
{/*  Main Content Canvas  */}
<main className="pt-[116px] pb-40 px-4 max-w-2xl mx-auto space-y-6">
{/*  Live Activity Banner  */}
<div className="sticky top-[116px] z-40 pt-2">
<div className="bg-primary text-white px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-xl shadow-primary/20">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[22px] animate-pulse" data-icon="campaign" style={{"fontVariationSettings":"'FILL' 1"}}>campaign</span>
<p className="text-[11px] font-black uppercase tracking-[0.05em]">Flash Drop: 5x Carbon Wallets @ $0.00 in 14m</p>
</div>
<span className="material-symbols-outlined text-sm opacity-60 cursor-pointer" data-icon="close">close</span>
</div>
</div>
{/*  Chat History  */}
<div className="flex flex-col gap-8 mt-4">
{/*  User Message  */}
<div className="flex flex-col items-end gap-2 max-w-[85%] ml-auto">
<div className="bg-neutral-800/80 border border-white/5 px-5 py-3 rounded-2xl rounded-tr-none">
<p className="text-[13px] leading-relaxed text-neutral-200">Yo, did anyone catch the last drop? 0Buck is insane.</p>
</div>
<span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">10:42 PM</span>
</div>
{/*  Butler Automated Entry  */}
<div className="flex items-start gap-3 max-w-[90%]">
<div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-none">
<span className="material-symbols-outlined text-primary text-lg" data-icon="smart_toy" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</div>
<div className="flex flex-col gap-3">
<div className="bg-neutral-900 border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none">
<p className="text-[13px] leading-relaxed text-neutral-300">Welcome to the inner circle. I am your **0Buck AI Butler**. I monitor exclusive drops and shared carts for this group. You've been automatically added to the whitelist.</p>
</div>
{/*  Shared Product Card  */}
<div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-[280px]">
<div className="relative h-44">
<img alt="Elite ANC Headphones" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfdYOYKaF8PU8Q9oI79cnycsgp1N_Q1qJYrNZ4rWPVsNkl5iYDLj6Lh3ETd6lCOAN-liNMcFwT_ArtVOmWXA4M-KzqiIaEd1lNGzdP5P2IhPrFjGANZ95ow-vG-X-qD9tC49BE5HnE0j7FUXKx3HZwqk2EEF74RR0aWEZTM4kEXF_ZfKfO9WkfCY-3xm1OKHz4KzKbHye0GB9toiHTFGKNXNr5Y6gynf0DdyRc4A6hj70DKbpk3fnI3F9mgwk9J9l12u9mvE3c6-6u"/>
<div className="absolute top-3 left-3 bg-primary px-2.5 py-1 rounded-lg text-[9px] font-black text-white tracking-widest">LIVE NOW</div>
</div>
<div className="p-5 space-y-3">
<div className="flex justify-between items-start">
<h3 className="font-headline font-bold text-white text-[15px]">Elite ANC Headphones</h3>
<span className="text-primary font-black text-[15px]">$0.00</span>
</div>
<div className="flex items-center gap-2">
<div className="flex -space-x-2">
<div className="w-6 h-6 rounded-full border-2 border-neutral-900 bg-neutral-800 overflow-hidden">
<img alt="User 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWf1vLdhjFaOsD3biEDbs-Ses7r0y67HRmtt2wm9htlrFfH2oPGChi64slc0DKxg-jBu2vlRB4EOLuZAUoloF39JomW1bD9563zZSfJfBCZ1X2c05Zjr9NvVLdBMCVF0d3hDURSXx9YQulC33gB7XWtjfiMMSEdBELf5_VkhtVkNLcFKF1VI45RgHASRxM14G8ehmcU6QaAlg4VfksiSzsxT3nRNVbT9thcxHbsa9hYB_8ssNpMefomni9QapHg1gOFZ_k3xnWlrvS"/>
</div>
<div className="w-6 h-6 rounded-full border-2 border-neutral-900 bg-neutral-800 overflow-hidden">
<img alt="User 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDbG03SbnZqyVv9TD1uzuunVh-1eGCIyG30FlZYQmZwQ5JkSjM_z0n8VqWQnGiICSBtu9rynvaa6TdkUALD75e8yDylvVE5m6Vrm15Yh52WR2TyKmIifNssg2rUDe8YJUQQLEnx4ae8oovhHX63c90_gK3lwjcJnPHdK8aRSSbPn0BnJzMOvGJjmymNdFuiSgLcMmvq8pdD9mE87yfDkBjf7MfyJ7XmRDR6ri0J6hgRyE57GJFdyxjvRWSr-_d5S-hMVTs22B6MdfA"/>
</div>
</div>
<span className="text-[10px] text-neutral-500 font-medium">3 group members tracking</span>
</div>
<button className="w-full bg-primary text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all">Claim Now</button>
</div>
</div>
<span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Butler • Just now</span>
</div>
</div>
{/*  Group Member Message  */}
<div className="flex items-start gap-3 max-w-[85%]">
<div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex-none border border-white/5">
<img alt="Hyper_Vibe Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChcpUwpMr5HWwQfEMS83gZN05rSHRBvdK0qC7HKuhQUWfg_OlzJkkLQXKW2fWAJTQSahWCgvWmTZntvOXV41Czu83zD5aoJL1JP3tffLQptDAWIARdGN_mjlD-MLzT38nAIXByf_6WTuH3wAcenrha-5Wz9YKXraqZsyhUNmEhUie8wkxx5qv3elZhtG9EIsOh58vgNfXU65A3wkbqIbNmC6XQL8MMUoAkNncbzIP6QJpps8aYxpJnz2AUXOvay_dV3i_HbX6b70l0"/>
</div>
<div className="flex flex-col gap-2">
<div className="bg-neutral-900 border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none">
<p className="text-[13px] leading-relaxed text-neutral-300">Butler, check stock on those headphones. Are there any left for the silver tier members?</p>
</div>
<span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Hyper_Vibe • 10:45 PM</span>
</div>
</div>
{/*  Butler Response  */}
<div className="flex items-start gap-3 max-w-[90%]">
<div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-none">
<span className="material-symbols-outlined text-primary text-lg" data-icon="smart_toy" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</div>
<div className="flex flex-col gap-2">
<div className="bg-neutral-900 border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none">
<p className="text-[13px] leading-relaxed text-neutral-300">Searching... <span className="text-primary font-bold">@Hyper_Vibe</span>, 12 units remaining in vault. Claim within 2 minutes for $0.00 priority access.</p>
</div>
<span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Butler • 10:46 PM</span>
</div>
</div>
</div>
</main>
{/*  Floating AI Butler Badge  */}
<div className="fixed right-6 bottom-32 z-50 group">
<div className="relative">
<div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-neutral-950 animate-bounce">
<span className="text-[9px] font-black text-white">1</span>
</div>
<button className="w-16 h-16 bg-neutral-950 border-2 border-primary/40 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
<span className="material-symbols-outlined text-primary text-4xl" data-icon="bolt" style={{"fontVariationSettings":"'FILL' 1"}}>bolt</span>
</button>
</div>
<div className="absolute bottom-full right-0 mb-4 w-56 bg-neutral-900/95 backdrop-blur-xl p-4 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
<div className="flex items-center gap-2 mb-2">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<p className="text-[10px] text-primary font-black uppercase tracking-widest">Butler Alert</p>
</div>
<p className="text-[13px] text-neutral-200 font-medium">Vault access granted. Tap to enter private negotiation.</p>
</div>
</div>
{/*  Message Input Bar  */}
<div className="fixed bottom-24 left-0 w-full px-4 z-40">
<div className="max-w-2xl mx-auto">
<div className="glass-panel border border-white/10 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xl">
<button className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-white transition-colors">
<span className="material-symbols-outlined text-2xl" data-icon="add_circle">add_circle</span>
</button>
<input className="flex-1 bg-transparent border-none text-[14px] focus:ring-0 text-white placeholder-neutral-600 py-2" placeholder="Message group..." type="text"/>
<button className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center hover:bg-primary/30 transition-all">
<span className="material-symbols-outlined text-xl" data-icon="send" style={{"fontVariationSettings":"'FILL' 1"}}>send</span>
</button>
</div>
</div>
</div>
{/*  Bottom Navigation Shell  */}


    </div>
  );
}
