import React from 'react';
import { Gift, Coins, ChevronRight, CheckCircle2, Ticket, TicketCheck, Zap, Bot } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const PointsExchangeDrawer: React.FC = () => {
  const { t } = useAppContext();

  const exchangeItems = [
    { id: 'ex1', name: t('perk.renewal_title'), desc: t('perk.renewal_desc'), cost: 1000, icon: <TicketCheck className="w-6 h-6 text-amber-500" />, category: 'Utility' },
    { id: 'ex2', name: t('perk.kol_title'), desc: t('perk.kol_desc'), cost: 50000, icon: <Zap className="w-6 h-6 text-blue-500" />, category: 'Status' },
    { id: 'ex3', name: t('perk.ai_pts_title'), desc: t('perk.ai_pts_desc'), cost: 10000, icon: <Bot className="w-6 h-6 text-cyan-500" />, category: 'Compute' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#000000] pb-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-8 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-[32px] shadow-xl shadow-amber-500/30 mb-2">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-[24px] font-black text-gray-900 dark:text-white tracking-tight">{t('points.exchange_center')}</h2>
        <p className="text-[13px] text-gray-500 font-bold px-6 leading-relaxed">
          {t('points.exchange_desc')}
        </p>
      </div>

      <div className="px-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {exchangeItems.map(item => (
          <div key={item.id} className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-black text-amber-600 uppercase tracking-widest">{item.category}</div>
                <div className="text-[16px] font-black text-gray-900 dark:text-white">{item.name}</div>
                <div className="text-[12px] text-gray-400 font-bold">{item.desc}</div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[18px] font-black text-gray-900 dark:text-white">{item.cost}</span>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">PTS</span>
              </div>
              <button className="bg-gray-900 dark:bg-white text-white dark:text-black text-[12px] font-black px-4 py-2 rounded-full shadow-lg group-hover:bg-amber-500 group-hover:text-white transition-all">
                {t('points.exchange_action')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};