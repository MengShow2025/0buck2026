import React from 'react';

export default function PrimeSupplierListMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  TopAppBar & IM Mode Header  */}
<header className="fixed top-0 w-full z-50 glass-header">
<div className="flex items-center justify-between px-4 py-3">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
<img alt="Logo" data-alt="minimalist logo for global marketplace featuring orange abstract geometric shapes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUXDUltnaCtUrtVf8x_2La5thjraLhDYT6yTu6gHRBG6pFAecm8WJs8hYwWO_T4xA_9ER0xT4yilNwjMKpVcCuCHATvReT1W2s10AKO5_-sQSUPS2UQOFL9UKMmPiE2oeWa66Gfo43CDuyAYDmjpjDNSgJrGq0JVWgKJKnRClj5u8ra4MH77NB4zZTjXXj1GmgzsIZWJhZ5j0btT_qXq9ZRVbI29OJz_1MwLaJtb5mkyeNAz-7-Ic8JOADzdog8OPnfNdczTFhj0Zt"/>
</div>
<h1 className="font-jakarta font-extrabold text-xl uppercase tracking-tighter text-white">Supplier Marketplace</h1>
</div>
<div className="flex items-center gap-4">
<button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
<span className="material-symbols-outlined">share</span>
</button>
<button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors relative">
<span className="material-symbols-outlined">shopping_cart</span>
</button>
</div>
</div>
{/*  IM Mode: Horizontal Product List  */}
<div className="px-4 pb-4">
<div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
{/*  Product Mini Card 1  */}
<div className="flex-shrink-0 w-24">
<div className="aspect-square rounded-2xl overflow-hidden mb-1 card-stroke bg-zinc-900">
<img className="w-full h-full object-cover" data-alt="professional product shot of a sleek modern smartwatch on a clean dark reflective surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiDDc7xoYbxVdMIQMr7KudLUqstrYAFXkWrohe_iKYRTOuUAlcKkMwF9U2cSptDzFFg4XU1xKgJL-WH8NWPBcOoIouhNvYnuPGf517vyImhJwE1wIrJzfrp5PznCAh0iG_NTzspn0y6VPz_D9GXw3rwIUMGJz1V4OwNPY0SBSeayQG79JbS8SueeYqjIxY8wGjDrS3lIaALtipuqTXqjWWZrXtkV53kO__LzHSMf_YJVwzTviTzuAPya9N0PzEfHFl55eWm6ovQ9pu"/>
</div>
<p className="text-primary font-jakarta font-bold text-sm">$0.00</p>
</div>
{/*  Product Mini Card 2  */}
<div className="flex-shrink-0 w-24">
<div className="aspect-square rounded-2xl overflow-hidden mb-1 card-stroke bg-zinc-900">
<img className="w-full h-full object-cover" data-alt="high-end studio photography of black wireless headphones with metallic orange accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi6Mynt6jwAGVv9yOOLHsey6oUkzFrE_C1HzxgUH-WikFcScF1ShK07YGuNI9AM-Y0auREZ1fqREEKdJKFkwwYFSA-7DQ3nGcNcYN7zV_yJSzIdhgycf3xKCrlOzQ1Rk7OnJTF1ARuXP901IaS-bOHjTdiHhTmKp16mNc4qmqw9dwphpXmxsbzxJIKxKwEmutFFr5aXxnkufbO2G6kdKxl-IDP5zr4PJSz_aQ9BZgAMucWWfUuSrxBoGb8ThHtxLBrjTUTSA9pGVhU"/>
</div>
<p className="text-primary font-jakarta font-bold text-sm">$0.00</p>
</div>
{/*  Product Mini Card 3  */}
<div className="flex-shrink-0 w-24">
<div className="aspect-square rounded-2xl overflow-hidden mb-1 card-stroke bg-zinc-900">
<img className="w-full h-full object-cover" data-alt="minimalist aesthetic wristwatch with leather strap on textured dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2z5UiSZS0Zd09BXljW1YMqz9KeHOavfYf6lSiuWX6eAR_fTE06d60AEnJ6Wasp-kU0sRetgYGG0ElILj2UvpZUT6fjuqBerAYEpiUa4msdUKPx34JEO9ffrHKUvCmFsgkmO1oQAbA04LjN4tc7iSlol9DJAOH7Ra6110fwg467sFp_yr6QpOXKiQqyeVZCfx3FZz_GQdU0koPPLdQmBEmrD4kHAm20Y0ll2Dm1qBxPsrns2n0xVFR7O5MpJhapUwLU50xq1FpjzTx"/>
</div>
<p className="text-primary font-jakarta font-bold text-sm">$0.00</p>
</div>
{/*  Product Mini Card 4  */}
<div className="flex-shrink-0 w-24">
<div className="aspect-square rounded-2xl overflow-hidden mb-1 card-stroke bg-zinc-900">
<img className="w-full h-full object-cover" data-alt="luxury ergonomic mechanical keyboard with orange keycap highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC48jiyvEIwZDnBR2jSA4W3tHdro0xkXJyXsdy0uglIlyxgh-LRfkkeBH04fSw6L3miahvE4ndv7ZBUFKbgfiskskRNwuXD62EWr87ASFGcb8ebFyzqndppaRrrexzjNQatkocEnBFlVBfwquHsce5owWTm7OzqTOtBT14eKHyFSG_ctvGYIRQRklj9bedb_ugT6OwgbVYQz8c-6uK43xdm74Wqy44-8S-qsgvbxL6CS5XqUrRfnhyoDduFHYGeRd3snjvc_R7vrPek"/>
</div>
<p className="text-primary font-jakarta font-bold text-sm">$0.00</p>
</div>
</div>
</div>
{/*  Live Activity Banner  */}
<div className="bg-primary py-1.5 px-4 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
<span className="text-[10px] font-jakarta font-extrabold tracking-widest text-white uppercase">Live Activity</span>
</div>
<p className="text-[10px] text-white/90 font-medium tracking-tight">124 Suppliers online now • Global Express Active</p>
</div>
</header>
{/*  Main Content: Supplier List  */}
<main className="mt-56 px-4 space-y-6">
{/*  Supplier Card 1  */}
<div className="aspect-[4/5] relative rounded-[32px] overflow-hidden card-stroke bg-zinc-900 flex flex-col group">
<div className="absolute top-4 left-4 z-10 flex gap-2">
<span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
                    VERIFIED
                </span>
<span className="bg-zinc-950/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    8 YEARS
                </span>
</div>
{/*  Hero Image / Logo Area  */}
<div className="h-1/2 relative bg-zinc-800">
<img className="w-full h-full object-cover opacity-60" data-alt="modern glass architectural building reflecting city lights at night representing a corporate supplier" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-qBEY9Lfm5kIlTzN8YIA19UpfwE-DyUPNyTqtsM7xwAHjYYtus9RbRsP0OZIC4N1A6ysLiEIgQBCrRD6ZcC1-ZLu0hZFsQd6pleEESzSVwXYlMQK4Ae5Y1fh08zzLo5UwVe0RvqxHvSjDLjhMXL1Q9KvGitBzwOPoKFU6x8qbdZhroNQsgYfCC4_ylDTkEeQh85WADWeE-4VaNwkh0vrrTv4U4vG1XwVezQQk2-_bomcV-1yL_LrbCqCZiorFdzWDPcX-z5-a_Bb3"/>
<div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-zinc-900 to-transparent">
<div className="flex items-end justify-between">
<div>
<h3 className="text-xl font-jakarta font-bold text-white tracking-tight">TechNova Global</h3>
<div className="flex items-center gap-2 mt-1">
<img alt="CN" className="w-4 h-3 rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUEygh1GxTmRu-cwnmCWZKWbXZFj0XVaPGyL9HfbHGpfXmwIpCJqqhUGrHg07uRM7WGniWS3Y66LlUp3Bk22FPnsDEroBC1fEVSXM2zzPorhkH48cEiN4rge3VZ4QHkbcAikoXubLfKMxPnuglPkkb-wQ28o-CkjW4FbCWeJGETWSIMpAs1NIGQJ8Z6fhwdidKtUXlVT6hKWyO8JCTPopCcIsT1fc6vEUKucUOKdvclIn1zrxz6UAw1p1XyEVZTfggQN8YNc8txCqC"/>
<span className="text-zinc-400 text-xs font-medium">Shenzhen, China</span>
</div>
</div>
<div className="text-right">
<div className="flex items-center gap-1 text-orange-400">
<span className="material-symbols-outlined text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold text-sm">4.9</span>
</div>
<p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">98% Reorder</p>
</div>
</div>
</div>
</div>
{/*  Featured Products & Stats  */}
<div className="flex-1 p-5 flex flex-col justify-between">
<div className="flex justify-between items-center mb-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-lg">rebase_edit</span>
<span className="text-xs font-jakarta font-semibold text-zinc-300">Matches your active stack</span>
</div>
<button className="bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all">
<span className="material-symbols-outlined text-white text-lg">trending_up</span>
</button>
</div>
<div className="grid grid-cols-3 gap-3">
<div className="space-y-1.5">
<div className="aspect-square rounded-xl bg-zinc-800 card-stroke overflow-hidden">
<img className="w-full h-full object-cover" data-alt="close up of premium laptop hardware components and metallic finish" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzUDax167bGExn4Doo-aL7uVGJPhWsZ6rwtw7iuT0hWcFBUzf3NXFz2oHotZMB1OpZOoGalpw2WlEkno9FLGUX9c17xOdedQKxRGyA7B28H-aDRCFoYBbNacs8prMacDAmsIDtqxR-5fFDEGQDihRPobT5Lcb7ESp54gu6jw2BzGmmGed-hrj_Ae-1PLWwVoUIZ3wyiUs0X9YUIKJqEbkvCcnPZ0EjWwxlfGa7vEIjyO4GpUMcFmy4e9LhW6IJq7u6aP3_qxVwsj6v"/>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-primary font-bold">$12.40</span>
<span className="text-[8px] text-zinc-500 font-medium">MOQ: 100</span>
</div>
</div>
<div className="space-y-1.5">
<div className="aspect-square rounded-xl bg-zinc-800 card-stroke overflow-hidden">
<img className="w-full h-full object-cover" data-alt="macro photography of carbon fiber texture and automotive components" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAKly4KS02VnHswlTSVdMc-TfNbBPitFGgLGZbyeowPA0SI4poduZj0iMMVVfd2zETnjDonOkxn6azKiAiX6XDCGO0nFRpvXMfoQmKH3xmc5DYxKFTku0yEDHyOzKnmmDUHu2LhRPuKLYPMqhAASfH3Cg8M4lcAhcIdR-2Thxk7x1-X1ilL4Z8tO4Pq4-lISisjGbo3mXSWCyJ-7TBR0X0vqZQNCnyhMbd3GrvnsTTE9z39CXqmgoLvNciLDQ942SP7sbyH0jR1GkW"/>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-primary font-bold">$4.99</span>
<span className="text-[8px] text-zinc-500 font-medium">MOQ: 500</span>
</div>
</div>
<div className="space-y-1.5">
<div className="aspect-square rounded-xl bg-zinc-800 card-stroke overflow-hidden">
<img className="w-full h-full object-cover" data-alt="smart home iot device with sleek touch screen and minimalist design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoMVxf3CVJAP2pQy9sMc0A2D-b5XR9mNEt6RKkPwkXDwoRc2IHgzM6ydJwzVExp5iZRc25vtSfSXLHOD4kamkry6pg_bOt_b1_hdKxNEZNwXSNN6z6oqKn3Tk8Kbe9dGaxMsO5aZVvW9bLkaS3v1c1pOChGwgYpkwrzxZMlkeFEMna3BR8_dhktP-M3UDAfAYAqsV-dPe5Fhs09xgVVi6TiqaKH8JeQsRAnlxD3ZGzjAqQiF8YknuaKh0LJmbzGBhusbFQZpTLQ0Uj"/>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-primary font-bold">$22.00</span>
<span className="text-[8px] text-zinc-500 font-medium">MOQ: 10</span>
</div>
</div>
</div>
</div>
</div>
{/*  Supplier Card 2  */}
<div className="aspect-[4/5] relative rounded-[32px] overflow-hidden card-stroke bg-zinc-900 flex flex-col">
<div className="absolute top-4 left-4 z-10 flex gap-2">
<span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
                    VERIFIED
                </span>
<span className="bg-zinc-950/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    3 YEARS
                </span>
</div>
<div className="h-1/2 relative bg-zinc-800">
<img className="w-full h-full object-cover opacity-60" data-alt="bright clean manufacturing facility with automated robotic arms and precision equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLk6fPi0ztkaD-r0Upz2yEt5_VUcN03gxU4mTouJjor07KyrrgOatRnlzgDR2prsF5-kRbYvx_6H3WVCehEwzJQO-Fj57by7rr2t61IgxKVlHiTvmVigSE-3h3bJH0sqs5mDsYwMvtIJmUBJIfxlEg8-3r-aie1YM8WX7lw4ghJ3nZQVCSVb9sTzIWkxe3XbRAc8Em2ex_iqWPHuQANovVZwEpAwJ8VRhZ7zw6r2VWpeEq6xJUpZK5jhcjRNAjQ9WXd_feHHOP-ivK"/>
<div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-zinc-900 to-transparent">
<div className="flex items-end justify-between">
<div>
<h3 className="text-xl font-jakarta font-bold text-white tracking-tight">Apex Precision Mfg</h3>
<div className="flex items-center gap-2 mt-1">
<img alt="CN" className="w-4 h-3 rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm6saD7N-d7C_1wmkazIefnA4Gd62Ux6XNkK_gztNY_yny0bCXroXr2JJ0jEtRWdPnCG8L4yh3kaHQei1Wyh1FcxbxGXevfBZVLaED6v8DGMzjw3p7OuWJdDiYi-giDid68T1Q0ZNqwZVTNcbWFxdbUlVXlK5X08d6GbOgXnzEj-o1VemX4pL_nIy1DBcLUKBpCSonD7SkmAGEyvTXsZhRjV9nffUuOjNUjeGVYcAPqt4Vg1_PTXojGqiPe_z6QRP8jhKLa1IWWpuj"/>
<span className="text-zinc-400 text-xs font-medium">Guangzhou, China</span>
</div>
</div>
<div className="text-right">
<div className="flex items-center gap-1 text-orange-400">
<span className="material-symbols-outlined text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold text-sm">4.7</span>
</div>
<p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">89% Reorder</p>
</div>
</div>
</div>
</div>
<div className="flex-1 p-5 flex flex-col justify-between">
<div className="flex justify-between items-center mb-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-lg">bolt</span>
<span className="text-xs font-jakarta font-semibold text-zinc-300">Fast ship capability</span>
</div>
</div>
<div className="grid grid-cols-3 gap-3">
<div className="space-y-1.5">
<div className="aspect-square rounded-xl bg-zinc-800 card-stroke overflow-hidden">
<img className="w-full h-full object-cover" data-alt="mechanical watch movement parts and high-precision gears" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATLLH7IIxGkfJVHz4UhzgL9rrh53xEpB5qAoynw7xWjDATuhGUJZ2cOVlsIcy3w4QNT7XdVx_twER_dOTXBtC2d0oZX1H4mq-8dIoBwyZYRWb8lDc8MKoYi7F2Aw8qKh2dQOIvMs0y0cjrSt0xLSyp9dT0mDandNckPEfw-O_JoIfOg5E9gJkaMlezfbJ6lluhShllA6sm1l14cS7uKI4BlblPmCJojahzQDLIA_64ohGObtNCtADuDFQOaaoGQIlTjQUmJqky520q"/>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-primary font-bold">$45.00</span>
<span className="text-[8px] text-zinc-500 font-medium">MOQ: 5</span>
</div>
</div>
<div className="space-y-1.5">
<div className="aspect-square rounded-xl bg-zinc-800 card-stroke overflow-hidden">
<img className="w-full h-full object-cover" data-alt="microchips and electronic components on a blue circuit board" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7l54WZyh_qMGQk7TWKeyGOsWZ39zZKYNVcCltLy8Xc6iz3MpJsAXY0Nx_gOelhJhNOk0kZ8LkyAEA7pMB3Z64MZFwkMkpTYYW127pYJsLVWumkVuJNFW8WTAEIp48kgXwY2lu_qIONgHVsgul9Dy4Hod8lMsrVa3nG6oU8aj4d92_Xj46weYhOZei4IZNBahPomLAVendhu-p3CHUcNasDUSOjt06SNAiHJAaMPk_mNVegTF6ulGZx_QQPzd9x81VRHKhfHKdUkKD"/>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-primary font-bold">$2.10</span>
<span className="text-[8px] text-zinc-500 font-medium">MOQ: 1000</span>
</div>
</div>
<div className="space-y-1.5">
<div className="aspect-square rounded-xl bg-zinc-800 card-stroke overflow-hidden">
<img className="w-full h-full object-cover" data-alt="industrial grade high-capacity power bank and electrical connectors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu-FwU1DzRFU-mXNeM8cLgcF3_prpDIeiSXq1JWX3JHby1WCNSPCjrsEUHxLhaLNloWIZzce_IiJINOcNsuelTcUgvFhcRwmBJqS0m6c3LixOWigZ2bFVhGex3TmoUwAEBk7Sc9XgRT-mJj_nQUhw2PRGqeRQd-ePVLUkwkcqjwchOvPsXeoRi-QJrWEejlI3zDNVi-G93y7hNrBwbDWl9tOvY7eMoIPppSMhO-cTrJFNGRgrOeRevlgC9ItTXGCC-alxamETb1Km8"/>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-primary font-bold">$34.50</span>
<span className="text-[8px] text-zinc-500 font-medium">MOQ: 50</span>
</div>
</div>
</div>
</div>
</div>
</main>
{/*  Floating AI Butler Assistant  */}
<button className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center z-[60] active:scale-95 transition-transform group">
<span className="material-symbols-outlined text-white text-3xl group-hover:rotate-12 transition-transform">smart_toy</span>
<div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
<div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
</div>
</button>
      {/* spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}
