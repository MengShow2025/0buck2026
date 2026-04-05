import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  Coins, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Timer,
  Users,
  Bot,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import WishingWellProgressBar from './WishingWellProgressBar';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  strategy_tag?: string;
}

interface BAPCardProps {
  type: string;
  data: any;
  onAction?: (action: string, params: any) => void;
}

/**
 * v3.4 BAP (Business Attachment Protocol) Renderer
 * Handles rendering of functional business cards within the chat stream.
 */
const BAPAttachmentRenderer: React.FC<BAPCardProps> = ({ type, data, onAction }) => {
  const { t } = useTranslation();
  
  switch (type) {
    case '0B_PRODUCT_GRID':
      return <ProductGridCard products={data.products} comment={data.butler_comment} onAction={onAction} t={t} />;
    case '0B_WISH_WELL':
      return <WishingWellCard wish={data} onAction={onAction} t={t} />;
    case '0B_CASHBACK_RADAR':
      return <CashbackRadarCard ledger={data} onAction={onAction} t={t} />;
    case '0B_RENEWAL_ALERT':
      return <RenewalAlertCard data={data} onAction={onAction} t={t} />;
    default:
      return (
        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-500 text-xs italic">
          {t('bap.unsupported_component')}: {type}
        </div>
      );
  }
};

/**
 * 0B_PRODUCT_GRID: 2x5 Matrix (Vortex style) as a chat card
 */
const ProductGridCard = ({ products, comment, onAction, t }: { products: Product[], comment?: string, onAction?: any, t: any }) => (
  <div className="flex flex-col gap-4 max-w-2xl w-full">
    {comment && (
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
          <Bot size={16} className="text-primary" />
        </div>
        <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">"{comment}"</p>
      </div>
    )}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.slice(0, 10).map((product, idx) => (
        <motion.div
          key={product.id}
          whileHover={{ y: -5 }}
          className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm flex flex-col"
        >
          <div className="aspect-[3/4] overflow-hidden bg-zinc-50 relative">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            {product.strategy_tag === 'TRAFFIC' && (
              <div className="absolute top-0 right-0 p-1">
                <div className="bg-red-500/80 backdrop-blur-sm text-white text-[6px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase tracking-tighter shadow-lg flex items-center gap-0.5">
                  <Zap size={6} fill="currentColor" /> {t('bap.no_cashback')}
                </div>
              </div>
            )}
          </div>
          <div className="p-3">
            <h4 className="text-[10px] font-black text-zinc-900 uppercase truncate mb-1">{product.title}</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-primary">${product.price}</span>
              <button 
                onClick={() => onAction?.('BUY', {
                  id: product.id,
                  name: product.title,
                  price: product.price,
                  image: product.image,
                  quantity: 1
                })}
                className="p-1.5 bg-black text-white rounded-lg hover:bg-primary hover:text-black transition-all"
              >
                <ShoppingBag size={12} />
              </button>
            </div>
          </div>
          {product.strategy_tag && (
            <div className="absolute top-2 left-2">
              <span className="bg-black/80 backdrop-blur-md text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Cpu size={8} /> {product.strategy_tag}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

/**
 * 0B_WISH_WELL: Socialized wishing well card
 */
const WishingWellCard = ({ wish, onAction, t }: { wish: any, onAction?: any, t: any }) => (
  <div className="p-5 bg-zinc-950 border border-orange-500/20 rounded-[2rem] shadow-2xl max-w-sm w-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/30">
        <Zap size={20} className="text-orange-500 animate-pulse" />
      </div>
      <div>
        <h4 className="text-sm font-black text-white uppercase tracking-tight">{t('bap.wishing_well_title')}</h4>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t('bap.c2m_protocol_active')}</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
        <img src={wish.image_url} alt="wish" className="w-full h-full object-cover opacity-80" />
      </div>
      <p className="text-xs text-zinc-400 font-medium italic leading-relaxed">"{wish.description}"</p>
      
      <WishingWellProgressBar 
        voteCount={wish.vote_count} 
        targetCount={wish.target_count || 10} 
        expiryAt={wish.expiry_at} 
        status={wish.status} 
      />
      
      <button 
        onClick={() => onAction?.('VOTE', wish.id)}
        className="w-full py-3 bg-white hover:bg-orange-500 text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl"
      >
        {t('bap.support_wish')}
      </button>
    </div>
  </div>
);

/**
 * 0B_CASHBACK_RADAR: 20-period cashback tracker
 */
const CashbackRadarCard = ({ ledger, onAction, t }: { ledger: any, onAction?: any, t: any }) => {
  const currentPeriod = ledger.current_period || 1;
  const totalPeriods = 20;
  
  return (
    <div className="p-6 bg-black border border-blue-500/20 rounded-[2rem] shadow-2xl max-w-sm w-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">{t('bap.cashback_radar_title')}</h4>
            <p className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest">{t('bap.cashback_20_period')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-500 uppercase">{t('bap.total_value')}</p>
          <p className="text-lg font-black text-white">${ledger.total_amount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: totalPeriods }).map((_, i) => {
            const period = i + 1;
            const isCompleted = period < currentPeriod;
            const isCurrent = period === currentPeriod;
            
            return (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-black border transition-all ${
                  isCompleted ? 'bg-blue-600 border-blue-500 text-white' :
                  isCurrent ? 'bg-blue-500/20 border-blue-500 text-blue-500 animate-pulse' :
                  'bg-zinc-900 border-zinc-800 text-zinc-700'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={10} /> : period}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-zinc-500 uppercase">{t('bap.current_period')}</span>
            <span className="text-xs font-black text-blue-500">P{currentPeriod} / P20</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-zinc-500 uppercase">{t('bap.next_payout')}</span>
            <span className="text-xs font-black text-white">${ledger.period_amount}</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
          {t('bap.view_ledger')} <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

/**
 * 0B_RENEWAL_ALERT: Card for break-in check-in recovery
 */
const RenewalAlertCard = ({ data, onAction, t }: { data: any, onAction?: any, t: any }) => (
  <div className="p-6 bg-red-950/20 border border-red-500/40 rounded-[2rem] shadow-2xl max-w-sm w-full backdrop-blur-md">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
        <AlertTriangle size={24} className="text-red-500 animate-bounce" />
      </div>
      <div>
        <h4 className="text-base font-black text-white uppercase tracking-tight">{t('bap.renewal_alert_title')}</h4>
        <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">{t('bap.break_in_detected')}</p>
      </div>
    </div>

    <div className="p-4 bg-black/40 rounded-2xl border border-red-500/10 mb-6">
      <p className="text-xs text-zinc-300 font-medium leading-relaxed">
        {t('bap.renewal_alert_desc', { days: data.days_missed || 3 })}
      </p>
    </div>

    <div className="flex gap-3">
      <button 
        onClick={() => onAction?.('BUY_RENEWAL_CARD')}
        className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
      >
        {t('bap.buy_renewal_card')}
      </button>
      <button 
        onClick={() => onAction?.('DISMISS_ALERT')}
        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
      >
        {t('bap.dismiss')}
      </button>
    </div>
  </div>
);

export default BAPAttachmentRenderer;
