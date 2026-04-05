import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Share2, ShoppingCart, 
  Verified, Star, StarHalf, PlayCircle,
  LayoutGrid, List, Plus, CheckCircle, ShieldCheck, X,
  Activity, Network, Lock, ShoppingBag,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MerchantDetailViewProps {
  onBack: () => void;
  onProductClick: (product: any) => void;
  merchant: any; // Using any for now, could be typed to Merchant type
}

export default function MerchantDetailView({ onBack, onProductClick, merchant }: MerchantDetailViewProps) {
  const { t } = useTranslation();
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [catalogPage, setCatalogPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const catalogProducts = React.useMemo(() => {
    const prods = merchant?.products || [];
    if (prods.length > 0) {
      if (prods.length < 9) {
         const padded = [...prods];
         while(padded.length < 12) {
           padded.push({...prods[0], name: `${prods[0].name} (Copy ${padded.length})`});
         }
         return padded;
      }
      return prods;
    }
    
    return Array(12).fill(null).map((_, i) => ({
      name: `Industrial Component ${i + 1}`,
      price: `$${(Math.random() * 1000 + 100).toFixed(2)}`,
      moq: `${Math.floor(Math.random() * 50 + 10)} Units`,
      image: i % 2 === 0 
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCv334OctGW9MFqB0SNdf0CmYXHK7YC6vD_3Y2w5f6j7liUhNCXjU2KE5_S9iDUVgl8LOHU0pjL1B26TGBzR3zUkNZedyRIIFL-B2JFOifPyW0tagP43llqEtfCUjpSXDeUI2LAG-EZEC3qKbTDU_pg4T4KvgZa51AN4oEaqo1EDULj7TD0v03P_4wt0QE2UAMOwJbsAs8_kLJM_Q4qtOUmQal04pDwMnyHBczYwkFU-izZqabCmAElCr2z1upvK8KD_sdGIoYl7Bjk"
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuC4JgznWrigzl-v879vpgA6dK5NhMXVORXdGkzrTMVR9FjeGseFi65mPERHgeAxxkhXC5dCeMPGK6db6I988QwcHESczxLd2-bvgAKQfIj6i34UNBrF_yyqC0ZjxAa98H2HgIDH_1CCdfgMa9r-xyl2FCM331FOdGDlotQ5Z96IZec-yg9Y9rCeQM4y7MAnDSOws8IuGmEGSTuYw3MeY_FWEYemUqUVDKq1YZg6UgP-xQR_iAZ7liUej8UTD0t3XEKQDUz3n4NrZr9t"
    }));
  }, [merchant?.products]);

  const totalPages = Math.ceil(catalogProducts.length / ITEMS_PER_PAGE);
  const currentProducts = catalogProducts.slice(
    (catalogPage - 1) * ITEMS_PER_PAGE,
    catalogPage * ITEMS_PER_PAGE
  );

  const RatingAnalytics = (
    <div 
      onClick={() => setShowReviewsModal(true)}
      className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-extrabold font-headline tracking-tighter uppercase group-hover:text-primary transition-colors">Rating Analytics</h3>
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors flex items-center gap-1">
          View All <ArrowLeft className="w-3 h-3 rotate-180" />
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="text-5xl font-headline font-black text-orange-500">4.9<span className="text-lg text-zinc-600">/5.0</span></div>
          <div className="flex gap-1">
            <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
            <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
            <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
            <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
            <StarHalf className="w-6 h-6 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-xs text-zinc-400">Based on 1,240 verified global trades</p>
        </div>
        <div className="col-span-2 space-y-3">
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-[94%]"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span>Quality of Build</span>
            <span>94% Excellent</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-[98%]"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span>Shipping Accuracy</span>
            <span>98% Flawless</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a] text-white selection:bg-primary-container selection:text-white relative">
      <style>{`
        .orange-gradient { background: linear-gradient(135deg, #af3000 0%, #ff5c28 100%); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Activity Ticker (Fixed below TopBar) */}
      <div className="fixed top-[72px] md:top-24 left-0 right-0 w-full z-40 bg-primary/20 border-y border-primary/30 py-1 overflow-hidden whitespace-nowrap backdrop-blur-xl marquee-container cursor-help">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
            display: inline-block;
          }
          .marquee-container:hover .animate-marquee,
          .marquee-container:active .animate-marquee {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex gap-12 animate-marquee text-[10px] font-bold tracking-widest uppercase text-white">
          <span className="text-primary">● v3.4 OPTIMIZED</span>
          <span>NEW INVENTORY: HIGH-GRADE SEMICONDUCTORS AVAILABLE</span>
          <span>•</span>
          <span>PRICE ALERT: LOGISTICS TIER 1 DROP -4%</span>
          <span>•</span>
          <span>SUPPLIER VERIFIED: SHENZHEN QUANTUM PRECISION</span>
          <span>•</span>
          <span>URGENT: BID CLOSING IN 04:22:19</span>
        </div>
      </div>

      <main className="pt-10 md:pt-12 pb-24 px-6 max-w-[1600px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          
          {/* Left Sidebar: Merchant Identity */}
          <aside className="space-y-6">
            <div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5">
              <div className="relative mb-6 w-max">
                <img 
                  className="w-24 h-24 rounded-2xl object-cover bg-zinc-800" 
                  src={merchant?.logo || "https://lh3.googleusercontent.com/aida-public/AB6AXuAB05hy-B3askvM11VnU7A6ABrrNJcSG77MIVUYd4u6WsSjth41l8x32qiVs5AVpWDGjIiFw9sBLou7iyaLSGtUrvuoOAhnbZLxHV9dV32hCsVXeOWHwjbw7rnvrYMXS_7Asq_4G5JnD_LIL9FjzLFQwjl-9gi_F8SXstLH1dUp-vs6jI8hqJtCiZD9ecQd2Foj8tHBDZmGLGmQuxr4pSaFqxjP7j13JjifiIOjjUa5HnppNGfR2U5tUhoCFCIm1JNZXPFKcnQ3qVKf"}
                  alt={merchant?.name || "Merchant"}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 h-6 w-6 rounded-full border-4 border-zinc-900 flex items-center justify-center" title={`Verified Tier ${merchant?.nodeLevel || 1}`}>
                  <Verified className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold font-headline tracking-tighter mb-1 uppercase">{merchant?.name || 'SHENZHEN QUANTUM'}</h1>
              <p className="text-zinc-500 text-sm mb-6">Verified Global Node</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Reliability</span>
                  <div className="text-lg font-headline font-black text-orange-500">99.8%</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Response</span>
                  <div className="text-lg font-headline font-black text-white">12min</div>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Global Rank</span>
                  <span className="text-white font-mono">#042</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Trading Volume</span>
                  <span className="text-white font-mono">$4.2M / mo</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Established</span>
                  <span className="text-white font-mono">2014</span>
                </div>
              </div>
            </div>

            {/* Rating Analytics (Mobile Only - Moved here) */}
            <div className="lg:hidden">
              {RatingAnalytics}
            </div>

            <div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5">
              <h3 className="font-headline font-bold mb-4 text-sm text-zinc-300 uppercase">Certification Vault</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-medium">ISO 9001:2015</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <Verified className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-medium">Global Green Tier</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-medium">EU Compliance Cert</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left group">
                  <ShoppingBag className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white">Market</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left group">
                  <Activity className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white">Analytics</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left group">
                  <Network className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white">Network</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left group">
                  <Lock className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white">Vault</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content: Catalog & Media */}
          <section className="space-y-12">
            {/* Hero Factory Media */}
            <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={merchant?.cover || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGafTwz_3oz9bEAA19KhcAnJqH2DDOnhWCO39SdNH20yYlOHbf4KTQfbZJIWsF2S_gYYLIvEKHDyAznack38F1qCER684Qr6eXulwtsevMEr-kzhzOqlByg7dqyyx8bBBEAhaCWQSYUq8jPXi1KESeuQcCHzaFQGkuNrV0tnVCic9iVswSAa3DByTLdbSAo9wWBxjh4uXNYTCvdbj9XxwtmK7xZ8ZEoRVUqW8LUF8upGBCyYnaaQtFJVUGBukujJcQKkejMaBBg_PE"}
                alt="Factory"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div>
                  <span className="bg-primary/20 text-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block backdrop-blur-md border border-primary/20">LIVE PRODUCTION VIEW</span>
                  <h2 className="text-4xl font-extrabold font-headline tracking-tighter">Facility Alpha-7</h2>
                </div>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/10 transition-all text-white">
                  <PlayCircle className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Bento Catalog */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-extrabold font-headline tracking-tighter">CORE CATALOG</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors text-white">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-zinc-800 rounded-lg text-white">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                {currentProducts.map((p: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => onProductClick(p)}
                    className="bg-zinc-900/40 rounded-2xl p-3 border border-white/5 group hover:border-primary/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-800 flex items-center justify-center">
                      {p.image ? (
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={p.image} alt={p.name} />
                      ) : (
                        <div className="text-zinc-600 text-[10px] font-black tracking-widest uppercase">No Image</div>
                      )}
                    </div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-bold text-sm font-headline tracking-tight group-hover:text-primary transition-colors leading-tight truncate">{p.name}</h4>
                      <span className="text-primary font-mono text-xs font-bold whitespace-nowrap">{p.price}</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] mb-3 truncate">MOQ: {p.moq || 'N/A'}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to order logic could go here
                      }}
                      className="w-full bg-zinc-800 group-hover:bg-primary text-white py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button 
                    onClick={() => setCatalogPage(p => Math.max(1, p - 1))}
                    disabled={catalogPage === 1}
                    className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-400">
                    Page <span className="text-white">{catalogPage}</span> of <span className="text-white">{totalPages}</span>
                  </span>
                  <button 
                    onClick={() => setCatalogPage(p => Math.min(totalPages, p + 1))}
                    disabled={catalogPage === totalPages}
                    className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Rating Analytics (Desktop Only) */}
            <div className="hidden lg:block">
              {RatingAnalytics}
            </div>
          </section>
        </div>
      </main>

      {/* Reviews Modal */}
      <AnimatePresence>
        {showReviewsModal && (
          <ReviewsModal 
            onClose={() => setShowReviewsModal(false)} 
            reviews={[]} // Could pass real reviews data here
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewsModal({ onClose, reviews: initialReviews }: { onClose: () => void; reviews: any[] }) {
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  const anonymizeName = (name: string) => {
    if (name.length <= 2) return name;
    return `${name[0]}***${name[name.length - 1]}`;
  };

  // Generate mock reviews to simulate a large dataset
  const allReviews = React.useMemo(() => {
    const extended = [...initialReviews];
    const templates = [
      "The procurement process was exceptionally streamlined. Highly recommended for bulk orders.",
      "High-fidelity output confirmed via laboratory testing. Perfect for our next product line.",
      "Impressive lead times and consistent quality across multiple shipments.",
      "The automated bidding system secured us a price point we couldn't find elsewhere.",
      "Professional packaging and clear documentation. A top-tier supplier."
    ];
    const users = ["Nexus Logistics", "Quant-Supply", "GlobalTrade Co", "Industrial Core", "Streamline Hub"];
    const avatars = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALYkiJFv_mJ-feVOL_a5qsi9gstMZn48i69SUncTVpDhk5SQwnvrBF2EynnANm-nKWEBJTAIyMhRekA5bzTrSlVyqb_JN-TAuDNBQpZexEHKYohMN4MF5XnHAd5b6kwwJchCThkHMUTkpU9iaL_fKm8aUmyvhhQayu7zhJpw6lCOYCAgdIwczggzvXt5uKXCNL7HUWZ0IRUJvJbq4CGlvkGHhvoW9QSy557n45hld9ymhLgYflEHRvFrFbKqoQHPwAOkRZw3lSj5Kk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAGvACccaowURsjsAfrrRCTVan3mrq_I4hY9Tz2qqhFJ9dIaeEVxCKWltvo7W_ugbFixzix7XxFY6o7n7S76N5D-tpoeayZBOG0uPyr747ljUxfpQNuTVE2udf1jnl-eWbzCOfK2ksj2V2jD-1nqgAXb1GMsWzg02ndi0h4X6uD5CSPMwKLSfpaflEjd80T-9NB7tB6vdo_H-GWP5ETjVlTUxoPSHK-EuWWaTBBwFDDnxEbxyZ5QEqz8kYifYmqcsQP_rEK92OtFZF"
    ];
    const flags = [
      "https://flagcdn.com/w40/us.png",
      "https://flagcdn.com/w40/gb.png",
      "https://flagcdn.com/w40/de.png",
      "https://flagcdn.com/w40/fr.png",
      "https://flagcdn.com/w40/jp.png",
      "https://flagcdn.com/w40/cn.png"
    ];

    for (let i = 0; i < 100; i++) {
      extended.push({
        id: `mock-${i}`,
        date: `January ${Math.floor(Math.random() * 30) + 1}, 2026`,
        user: users[i % users.length],
        avatar: avatars[i % avatars.length],
        flag: flags[i % flags.length],
        content: templates[i % templates.length]
      });
    }
    return extended;
  }, [initialReviews]);

  const loadMore = useCallback(() => {
    if (visibleCount < allReviews.length && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 15, allReviews.length));
        setIsLoading(false);
      }, 800);
    }
  }, [visibleCount, allReviews.length, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const visibleReviews = allReviews.slice(0, visibleCount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-zinc-950 border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl z-10 sticky top-0">
          <div>
            <h2 className="text-2xl font-black font-headline text-white uppercase tracking-tighter mb-1">Global Node Reviews</h2>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <span className="text-white font-bold text-sm">4.9</span>
              <span className="text-zinc-500 text-xs font-medium tracking-wide">Based on 1,240 verified global trades</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {visibleReviews.map((review, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index % 15 * 0.05 }}
              key={review.id} 
              className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 p-1">
                    <img src={review.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white font-headline">{anonymizeName(review.user)}</span>
                      <img src={review.flag} alt="Country" className="h-3 w-4 rounded-sm object-cover opacity-80" />
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-primary/20">Verified Trade</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{review.date}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                  ))}
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed font-medium pl-16">
                "{review.content}"
              </p>
            </motion.div>
          ))}
          
          {visibleCount < allReviews.length && (
            <div ref={observerTarget} className="py-8 flex justify-center">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <div className="h-6"></div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}