import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useDeviceType } from '../hooks/useDeviceType';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ChevronRight, ChevronLeft, LayoutGrid, List, Star, 
  ShoppingCart, ShieldCheck, MapPin, Check,
  Zap, Verified, Box, Cpu, Truck, Activity, Share2, CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { getApiUrl } from '../utils/api';

const BASE_SUPPLIERS = [
  {
    id: 's1',
    name: 'Nexus Global Tech',
    nodeLevel: 5,
    productionRate: '98.4%',
    leadTime: '4-7 Days',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhB-hCyvLULak3qkYN0KWba8XZfsQyRFixjGMmN6gZaWXOMeG5d39s3AUFri3G0UVRumCcwfCtgjW_3fz9gaQf1TLNxGW3k_LQKkN3TklBKiLLshz8TGC3kQjbg5Ee_-IbeeqhBugbtT5I4NeCyOnIOGiUpwZyFFYOp-rEy-F8e_TrmOPwvKMFZgTM9berrJFkd4IDKCToaD679PSb-Xe3mmhHtbgn8NYulS53vavP0126sQjnlDdvq3_ueWGF8mlHaW2F3MFpZMFl',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlWh1xhbP41Jr0rXmJkatP7kWS3GQxC1Rbpk6DJKhlXnS6eF0ODaDqjdLqnIOEdUx75eHB73KLgwwQNxKOpLJZOWm77YI8zNu-FzhCkOpSe7eJOvRFMsMDRnkZqglRWvmopWynOQvx5MkOZlXSi4ufiO8JqR3H35Moo5TPzdxMUbLuPpzDt15pfWZHo4OqKvni9j5cKEfyO0C2LqttMELzMZuO_NfgNDW3YantHna8a-9KkAQ7D0G_irN6FXhglr02BWb9az4m8Q8N',
    products: [
      { id: 'p1', name: 'Cobalt Module v.2', price: '$45.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxAH0qKWGjuiOXJD-zQjAEfd0FjZyBcEJhm3TN9Q8EvGup0blVpAPm4SVZmzCvPWJGy2IuVxu96wRDHmvdgiUIw3oWAKOQIlgugM6K_cnEiC_anO7zfkBllPGs-IUzPUVs13mTb0VqHPFcTUce7rwHzfrjgblfmxWttfN4gzZlZrjslxrfmQzpPrPCAsPp1yiHeiLycLQRYX0Ij4GN3sAd_kVGAj3_ctZs9H8Mk2rMHOv6rub2Vz6jwzBKnI4PNrQJVaYFkJcy4L3S' },
      { id: 'p2', name: 'Neural Processor', price: '$890.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ZnYtan6xp-qAG1ZSeBnDl-g0dBEMLZL1nd4YxHGe8n_Aln3fAkhClE0Rh57Cw-WYgshy4H2BoPyIJugspi302IHpw3UDNbgBI65nqVF3ds-b_t2bbcY_yyI2U4K138C2tFflW60FUhx311C8JthLXXtEfuGhCq31OrFse-8XBAcaB6641F3ncG23aLMF-Blbp4jATDU0sIGzO9SzvZ9SeoyOcd4wzgRLhst2dDMx7BrF8E3ao5t7UzXsSNGSkW-Egncd6R6_FvNu' },
      { id: 'p3', name: 'Titan Core', price: '$1,250.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ZnYtan6xp-qAG1ZSeBnDl-g0dBEMLZL1nd4YxHGe8n_Aln3fAkhClE0Rh57Cw-WYgshy4H2BoPyIJugspi302IHpw3UDNbgBI65nqVF3ds-b_t2bbcY_yyI2U4K138C2tFflW60FUhx311C8JthLXXtEfuGhCq31OrFse-8XBAcaB6641F3ncG23aLMF-Blbp4jATDU0sIGzO9SzvZ9SeoyOcd4wzgRLhst2dDMx7BrF8E3ao5t7UzXsSNGSkW-Egncd6R6_FvNu' }
    ]
  },
  {
    id: 's2',
    name: 'Aether Logistics',
    nodeLevel: 4,
    productionRate: '1.2M Units',
    leadTime: 'Platinum',
    isService: true,
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwR1AGfLNgKDp-GWu26MQ0HmB7nYloDWZ0DFpqWSYA9p0zf3YcIX-5XNl8j42gzL0W4MkKO0Ak1LmtFeqzctI3yzvwmh3OiuMpMSJ_h6RJfIU-3w2fq6z3PWo_imxjO7V4dOUiX7Ew1HPCWzDmsKHdOABh5O-bSRzDl109A7HsBfgJ690p9EIOLbnUrELXSiQVGVGxvZvEQJFycvwGIsxTNtrLbCIdkjQessQyBvp3SS6lC9vWoqPgUgdFyPay3zyhrcO3Jvyuy4Xe',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASHjtwrj2L0jH3AtJOEwDigJukuMOXzqrKfARdNRR1Lj7tCvplxJXCClN-_1CP3RSi_L_gTlGl_ZzHOPCHe0eMF45lLLYi7vmj9Z_iOMQPWauKWSHVkTIE4HQIAuc40RRyGRMwoFR-S6GPD0mMzHkM2VrCmQhEYT47h9FI3pi2IruaHejH3tSPRiC1wJ7CPTwZhtsJujgx56FzXnRrJDfL07RD7sQnKrY0-N0UgAnJAJO119P1wWPe5QCCgkwqty06nXJt4342qsXR',
    products: [
      { id: 'p4', name: 'Express Fulfillment', price: '$1,200/mo', icon: 'Truck' },
      { id: 'p5', name: 'Smart Storage', price: '$450/mo', icon: 'Box' },
      { id: 'p6', name: 'Node Proxy', price: '$85/mo', icon: 'Cpu' }
    ]
  },
  {
    id: 's3',
    name: 'Orion Bio-Systems',
    nodeLevel: 5,
    productionRate: 'S-Class',
    leadTime: '99.9%',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVjAJnQ1DU01xJRrnZekByfpjf4cbf52LyA0Mdb3xj5oiQ6D3Cu1lHn6Ipv5wBa8d8JHjuH4ikHW7JtdoAGK76lTjc0vAM1cemKmKdnt_ESG1-A5sjWtjwuUjfjxmp_pYPf8xA4bzLIFvBPF5ajW5H9J7RRuT2Jc6zam-7a0YGTUbbDkXHGQ7ZUhsTLdOT-Qma4WOSdBV4muUJCMxp18KV6aDcjdznzGBKmW8nlrq82fT-30h0yU8z-howYUB_8v54FPp8_kD2vUe',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5wXxbdAIPIQjyGe_5yWu6yUFdxfNRoLFc-LFbNS38ZA0vEhx5GByqPlNkDc09h4WI_KfxriG3aR9Z28NZj3Xi7BM19InURj6McP2DkY5xqc3FNPhZuH8tI_2mAJuKnqsnkUhPhNzCjc-kOktPsupYYdMdmDOHm4h_7lvViseeJJhQvvms_tkGwtR-EtvQJlL1HlMOMT8YQWbRgZ4oDWMAPtUA0O9U1d8wJlyf4fMG-nkf_30u0_J_ILjmPLeKAeDUOeRgNIr3SteQ',
    products: [
      { id: 'p7', name: 'Nano-Fiber S2', price: '$12.40/m', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv4hx3t1qHBL1ehvyxY5ACgNWxEalxbUqkZ8SCKi83R7TIz0tCpcG6Ayb2QMHw2jpClyv4yO1Kdl_46Iv-HZhrNRcFNwnRM9YNHvCSUvJFHZFHCl06IsPZ6ASFAETsyxZ0KQGxWGrVWNyUTaZTXMNsvl_4BUJnbSoPEeXFn4GA39OeZ187irvhkYiXfny24Qbu_9O-SZjbAEza7k3puBLd0ZmnkzGqN8djtc0mAP_LEqoaQXN7C49S_t6HBIKgYIMOPmLc0zWz0cMQ' },
      { id: 'p8', name: 'Bio-Sync Cell', price: '$45.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv4hx3t1qHBL1ehvyxY5ACgNWxEalxbUqkZ8SCKi83R7TIz0tCpcG6Ayb2QMHw2jpClyv4yO1Kdl_46Iv-HZhrNRcFNwnRM9YNHvCSUvJFHZFHCl06IsPZ6ASFAETsyxZ0KQGxWGrVWNyUTaZTXMNsvl_4BUJnbSoPEeXFn4GA39OeZ187irvhkYiXfny24Qbu_9O-SZjbAEza7k3puBLd0ZmnkzGqN8djtc0mAP_LEqoaQXN7C49S_t6HBIKgYIMOPmLc0zWz0cMQ' },
      { id: 'p9', name: 'Orion Pulse', price: '$89.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv4hx3t1qHBL1ehvyxY5ACgNWxEalxbUqkZ8SCKi83R7TIz0tCpcG6Ayb2QMHw2jpClyv4yO1Kdl_46Iv-HZhrNRcFNwnRM9YNHvCSUvJFHZFHCl06IsPZ6ASFAETsyxZ0KQGxWGrVWNyUTaZTXMNsvl_4BUJnbSoPEeXFn4GA39OeZ187irvhkYiXfny24Qbu_9O-SZjbAEza7k3puBLd0ZmnkzGqN8djtc0mAP_LEqoaQXN7C49S_t6HBIKgYIMOPmLc0zWz0cMQ' }
    ]
  }
];

const CATEGORIES = [
  'Microchips', 'Tactical Gear', 'Medical Robotics', 
  'Bio-Polymers', 'Quantum Sensors', 'Aerospace Parts',
  'Industrial AI', 'Nano-Fibers', 'Satellite Links',
  'Energy Storage', 'Subsea Cables', 'Graphene Tech'
];

export default function PrimeView({ onProductClick, onMerchantClick }: { onProductClick?: (product: Product) => void, onMerchantClick?: (merchant: any) => void }) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const deviceType = useDeviceType();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 25; // 5 rows * 5 columns

  // Fetch real suppliers from backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        const url = getApiUrl('/v1/suppliers/');
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSuppliers(data);
          } else {
            // Fallback to generated mock if DB is empty
            const generated = Array.from({ length: 50 }).map((_, i) => {
              const base = BASE_SUPPLIERS[i % BASE_SUPPLIERS.length];
              return {
                ...base,
                id: `s-${i}`,
                name: `${base.name} ${i + 1}`
              };
            });
            setSuppliers(generated);
          }
        }
      } catch (e) {
        console.error('Failed to fetch real suppliers:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const ALL_SUPPLIERS = suppliers;


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPages = Math.ceil(ALL_SUPPLIERS.length / itemsPerPage);
  
  const currentSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return ALL_SUPPLIERS.slice(start, start + itemsPerPage);
  }, [currentPage]);

  return (
    <div className={`h-full overflow-y-auto selection:bg-primary-container selection:text-on-primary-container ${isDark ? 'bg-[#050505] text-[#ffffff]' : 'bg-[#fff8f6] text-[#271814]'}`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="max-w-[1800px] mx-auto p-4 md:p-8 flex flex-col gap-2">
        <section className={`transition-all duration-300 ${isSearchFocused ? 'relative z-[100]' : 'relative z-10'}`}>
          <div className={`backdrop-blur-xl rounded-[2rem] p-12 relative border ${isDark ? 'bg-zinc-900/60 border-primary/15' : 'bg-surface-container-low border-outline-variant/30'}`}>
            {/* Background Glow (Clipped by inner container) */}
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
              <div className={`absolute -top-24 -right-24 w-96 h-96 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} blur-[100px] rounded-full`}></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className={`font-headline text-3xl md:text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-on-surface'}`}>
                {t('prime.source_title')} <span className="text-primary">{t('prime.source_highlight')}</span>
              </h2>
              <div className="w-full max-w-2xl relative" ref={searchRef}>
                <input
                  className={`w-full backdrop-blur-md rounded-2xl py-4 md:py-5 px-12 md:px-14 text-sm md:text-lg transition-all ${isDark ? 'bg-zinc-900/50 border-white/10 text-white placeholder-white/20 focus:border-primary/50' : 'bg-surface-container-high border-outline-variant/50 text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary/40'} border focus:ring-0`}
                  placeholder={t('prime.search_placeholder')}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                <Search className={`absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-white/40' : 'text-on-surface-variant'}`} />
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary to-primary-container text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-base hover:shadow-[0_0_20px_rgba(255,92,40,0.4)] transition-all">
                  {t('prime.command')}
                </button>

                {/* Mobile Search Dropdown Options (Reverted to Absolute Dropdown) */}
                <AnimatePresence>
                  {isSearchFocused && deviceType === 'h5' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute top-full left-0 right-0 mt-3 p-2 rounded-2xl border shadow-2xl z-[100] backdrop-blur-2xl max-h-[300px] overflow-y-auto no-scrollbar ${isDark ? 'bg-zinc-900/95 border-white/10' : 'bg-white/95 border-black/5'}`}
                    >
                      <div className="flex flex-col gap-1">
                        {CATEGORIES.map((cat, i) => (
                          <motion.button
                            key={cat}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSearchQuery(cat);
                              setIsSearchFocused(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left group ${isDark ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-black/5 text-zinc-500 hover:text-black'}`}
                          >
                            <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                            <span className="text-xs font-bold tracking-tight">{cat}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Tag Cloud (Hidden on Mobile Search Focus) */}
              <div className={`flex flex-wrap justify-center gap-3 mt-8 ${deviceType === 'h5' ? 'hidden' : 'flex'}`}>
                {CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    onClick={() => setSearchQuery(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${isDark ? 'bg-zinc-800 text-white/60 hover:text-white border-white/5 hover:border-white/10' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/50 hover:border-outline'}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Supplier Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {currentSuppliers.map((supplier) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={(e) => {
                e.preventDefault();
                if (onMerchantClick) {
                  onMerchantClick(supplier);
                }
              }}
              className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-500 shadow-2xl cursor-pointer"
            >
              {/* 1:1 Square Cover Image */}
              <div className="relative aspect-square w-full overflow-hidden flex-shrink-0">
                <img 
                  src={supplier.cover} 
                  alt={supplier.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                
                {/* Logo Overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-white/10 p-2 shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                    <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Share Button Overlay */}
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: supplier.name,
                          text: `Check out ${supplier.name} on 0Buck Global Supply Index`,
                          url: window.location.href,
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-primary hover:border-primary hover:bg-black/80 transition-all shadow-xl"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col gap-5">
                {/* Merchant Identity */}
                <div className="min-w-0">
                  <h4 className="text-white font-headline font-black text-lg leading-tight truncate group-hover:text-primary transition-colors">{supplier.name}</h4>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">{t('prime.verified_node')}</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex-shrink-0">
                  <div className="min-w-0">
                    <p className="text-zinc-500 text-[8px] uppercase font-black tracking-widest mb-1 truncate opacity-60">
                      {supplier.isService ? t('prime.capacity') : t('prime.prod_rate')}
                    </p>
                    <p className="text-white font-headline font-black text-base truncate tracking-tighter">{supplier.productionRate}</p>
                  </div>
                  <div className="border-l border-white/10 pl-3 min-w-0">
                    <p className="text-zinc-500 text-[8px] uppercase font-black tracking-widest mb-1 truncate opacity-60">
                      {supplier.isService ? t('prime.global_tier') : t('prime.lead_time')}
                    </p>
                    <p className="text-white font-headline font-bold text-base truncate tracking-tighter">{supplier.leadTime}</p>
                  </div>
                </div>

                {/* Featured Products 3-Column Grid */}
                <div className="flex flex-col gap-3">
                  <p className="text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] px-1">{t('prime.featured_selection')}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {supplier.products.slice(0, 3).map((p, i) => (
                      <div 
                        key={i} 
                        className="flex flex-col gap-2 group/item cursor-pointer min-w-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onProductClick) {
                            onProductClick({
                              id: p.id,
                              name: p.name,
                              price: p.price,
                              image: p.image || '',
                              description: ''
                            } as Product);
                          }
                        }}
                      >
                        <div className="aspect-square w-full rounded-xl bg-zinc-900 overflow-hidden border border-white/5 relative flex-shrink-0 shadow-lg">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {p.icon === 'Truck' ? <Truck className="w-4 h-4 text-primary" /> : 
                               p.icon === 'Cpu' ? <Cpu className="w-4 h-4 text-primary" /> :
                               <Box className="w-4 h-4 text-primary" />}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 px-0.5 min-w-0">
                          <p className="text-white text-[8px] font-bold leading-tight truncate uppercase tracking-tighter opacity-80 group-hover/item:opacity-100">{p.name}</p>
                          <p className="text-primary font-black text-[9px] tracking-tighter truncate">{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button - Minimalist Style */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMerchantClick) onMerchantClick(supplier);
                  }}
                  className="mt-auto w-full py-3.5 bg-zinc-900/50 text-zinc-500 border border-white/5 font-headline font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-xl relative z-10"
                >
                  {t('prime.send_inquiry')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination UI */}
        <div className="mt-20 flex flex-col items-center gap-8 pb-12">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                currentPage === 1 ? 'border-white/5 text-zinc-700 opacity-50 cursor-not-allowed' : 'border-white/10 text-white hover:bg-white/5 hover:border-primary/30'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all ${
                  currentPage === i + 1 
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(175,48,0,0.4)]' 
                    : 'bg-zinc-900/50 border border-white/5 text-zinc-500 hover:text-white hover:border-white/20'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                currentPage === totalPages ? 'border-white/5 text-zinc-700 opacity-50 cursor-not-allowed' : 'border-white/10 text-white hover:bg-white/5 hover:border-primary/30'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-600">
            0Buck Global Supply Index v4.2.0 • Showing {itemsPerPage} of {ALL_SUPPLIERS.length} Nodes
          </p>
        </div>
      </div>

      <div className={`fixed inset-0 pointer-events-none ${isDark ? 'opacity-[0.03]' : 'opacity-[0.02]'} mix-blend-overlay`}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" type="fractalNoise" />
          </filter>
          <rect filter="url(#noiseFilter)" height="100%" width="100%" />
        </svg>
      </div>
    </div>
  );
}