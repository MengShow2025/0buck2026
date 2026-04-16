import React, { useState } from 'react';
import { Target, Gift, Users, Trophy, ChevronRight, ShieldCheck, Share2, Award, Zap, TrendingUp, Copy, QrCode, Calendar, Clock, ChevronDown, ChevronUp, UserCheck, Star, HelpCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const FanCenterDrawer: React.FC = () => {
  const { pushDrawer, t, hasCheckedInToday, setHasCheckedInToday, userLevel, isInfluencer, influencerRatios } = useAppContext();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isRatesExpanded, setIsRatesExpanded] = useState(false);

  // Define ratios for each level
  const levelRatios = {
    Bronze: { referral: 0.02, fan: 0.01 },
    Silver: { referral: 0.03, fan: 0.015 },
    Gold: { referral: 0.04, fan: 0.02 },
    Platinum: { referral: 0.05, fan: 0.03 },
  };

  const currentRatios = isInfluencer && influencerRatios 
    ? influencerRatios 
    : levelRatios[userLevel as keyof typeof levelRatios];

  // Mock data for rewards summary
  const rewardStats = {
    totalFans: 128,
    totalEarned: '342.50',
    todayEarned: '12.00',
    referralCode: 'VORTEX888',
    userLevel: isInfluencer ? t('influencer.label') : `${userLevel} Member`,
    referralRate: `${(currentRatios.referral * 100).toFixed(1)}%`,
    fanRate: `${(currentRatios.fan * 100).toFixed(1)}%`,
    rebateSummary: {
      totalPendingAmount: '45.80',
      daysRemaining: 4,
      totalPhases: 20,
      currentPhase: 7,
      activeOrdersCount: 3
    },
    orderDetails: [
      { id: 'ORD-001', name: 'Wireless Earbuds', phase: '7/20', daysLeft: 4, rate: '5%', estAmount: '15.00' },
      { id: 'ORD-002', name: 'Mechanical Watch', phase: '3/20', daysLeft: 12, rate: '8%', estAmount: '22.50' },
      { id: 'ORD-003', name: 'Leather Bag', phase: '1/20', daysLeft: 25, rate: '5%', estAmount: '8.30' }
    ],
    breakdown: [
      { label: t('fan.fan_reward'), amount: '245.00', count: 12, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
      { label: t('fan.referral_reward'), amount: '97.50', count: 8, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: t('fan.cashback_amount'), amount: '14.50', count: 1, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    ]
  };

  const handleSignIn = () => {
    setHasCheckedInToday(true);
    // Logic for batch sign-in across all orders
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewardStats.referralCode);
    alert(t('fan.referral_copied'));
  };

  const handleGenerateQR = () => {
    pushDrawer('share_menu');
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#000000] p-4 gap-4 pb-32 overflow-y-auto no-scrollbar">
      {/* 1. Daily Multi-Order Sign-in Section */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-6 shadow-xl border border-[var(--wa-teal)]/20 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Calendar className="w-24 h-24 text-[var(--wa-teal)]" />
        </div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="space-y-1">
            <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">{t('fan.progress_title')}</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-black text-gray-900 dark:text-white tracking-tighter">${rewardStats.rebateSummary.totalPendingAmount}</span>
              <span className="text-[12px] text-[var(--wa-teal)] font-bold">{t('fan.estimated_rebate')}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-orange-600 font-black text-[14px]">
              <Clock className="w-4 h-4" />
              <span>{t('fan.fastest_prefix')}{rewardStats.rebateSummary.daysRemaining}{t('fan.fastest_suffix')}</span>
            </div>
            <button 
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 font-bold uppercase mt-1 ml-auto active:scale-95 transition-all"
            >
              <span>{rewardStats.rebateSummary.activeOrdersCount}{t('fan.syncing_suffix')}</span>
              {isDetailsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Progress & Action */}
        <div className="space-y-4 relative z-10">
          <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '65%', background: 'linear-gradient(90deg, #FF7A3D 0%, #E8450A 100%)', boxShadow: '0 0 10px rgba(232,69,10,0.35)' }} />
          </div>
          
          <button
            onClick={handleSignIn}
            disabled={hasCheckedInToday}
            style={!hasCheckedInToday ? { background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)', boxShadow: '0 4px 14px rgba(232,69,10,0.35)' } : undefined}
            className={`w-full py-3.5 rounded-2xl font-semibold text-[15px] transition-all flex items-center justify-center gap-2 ${
              hasCheckedInToday
              ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
              : 'text-white active:scale-95'
            }`}
          >
            {hasCheckedInToday ? <UserCheck className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            {hasCheckedInToday ? t('fan.check_in_done') : t('fan.check_in_all')}
          </button>
        </div>

        {/* Expandable Order Details */}
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
          <button 
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="w-full flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-tighter hover:text-gray-600 transition-colors"
          >
            <span>{t('fan.view_details')}</span>
            {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isDetailsExpanded && (
            <div 
              className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2"
              onClick={() => setIsDetailsExpanded(false)}
            >
              {rewardStats.orderDetails.map(order => (
                <div 
                  key={order.id} 
                  className="bg-gray-50 dark:bg-white/5 rounded-2xl p-3 flex items-center justify-between border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional: navigate to order detail
                    // pushDrawer('order_detail'); 
                  }}
                >
                  <div className="space-y-0.5">
                    <div 
                      className="text-[12px] font-black text-[var(--wa-teal)] underline underline-offset-2 decoration-[var(--wa-teal)]/30 active:text-[var(--wa-teal)]/70 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDetailsExpanded(false);
                        pushDrawer('order_detail');
                      }}
                    >
                      {order.id}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDetailsExpanded(false);
                        }}
                      >
                        {t('fan.phase')} {order.phase}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{t('fan.days_left_prefix')}{order.daysLeft}{t('fan.days_left_suffix')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-black text-[var(--wa-teal)]">${order.estAmount}</div>
                    <div className="text-[9px] text-orange-500 font-bold mt-0.5">{t('fan.milestone_reward')} {order.rate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. My Referral Identity & Reward Rates */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[32px] p-6 text-white shadow-xl relative transition-all">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Share2 className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[13px] font-black uppercase tracking-widest opacity-80">{t('fan.referral_reward')}</h4>
              <button 
                onClick={() => setIsRatesExpanded(!isRatesExpanded)}
                className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>{rewardStats.userLevel}</span>
                {isRatesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="text-[32px] font-black leading-none tracking-tighter">{rewardStats.referralCode}</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 active:scale-90 transition-all"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button 
              onClick={handleGenerateQR}
              className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 active:scale-90 transition-all"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Reward Rates Board */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="text-[12px] font-black uppercase">{t('fan.reward_rates')}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                pushDrawer('tier_rules');
              }}
              className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full active:scale-95 transition-all group"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('fan.rule_details')}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="text-[10px] opacity-60 font-black uppercase tracking-widest mb-1">{t('fan.referral_rate')}</div>
                <div className="text-[20px] font-black">{rewardStats.referralRate}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="text-[10px] opacity-60 font-black uppercase tracking-widest mb-1">{t('fan.fan_rate')}</div>
                <div className="text-[20px] font-black">{rewardStats.fanRate}</div>
              </div>
            </div>

            {isRatesExpanded && (
              <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                <div className="h-px bg-white/10 w-full" />
                <h5 className="text-[11px] font-black uppercase tracking-widest opacity-60">{t('fan.all_tiers')}</h5>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[10px] font-bold opacity-40 uppercase">{t('fan.tier_name')}</div>
                  <div className="text-[10px] font-bold opacity-40 uppercase text-center">{t('fan.referral_rate')}</div>
                  <div className="text-[10px] font-bold opacity-40 uppercase text-right">{t('fan.fan_rate')}</div>
                </div>
                {Object.entries(levelRatios).map(([level, rates]) => (
                  <div key={level} className={`grid grid-cols-3 gap-2 py-1 ${level === userLevel ? 'bg-white/20 -mx-2 px-2 rounded-lg' : ''}`}>
                    <div className="text-[12px] font-black">{level}</div>
                    <div className="text-[12px] font-black text-center">{(rates.referral * 100).toFixed(1)}%</div>
                    <div className="text-[12px] font-black text-right">{(rates.fan * 100).toFixed(1)}%</div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2 py-1 opacity-80 italic">
                  <div className="text-[12px] font-black">{t('influencer.label')}</div>
                  <div className="text-[12px] font-black text-center col-span-2">{t('fan.negotiable')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 3. Influencer Application & Leaderboard */}
      <div className="grid grid-cols-2 gap-3 relative">
        <button 
          onClick={() => pushDrawer('influencer_apply')}
          className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[28px] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 active:scale-95 transition-all group relative overflow-hidden"
        >
          <div 
            onClick={(e) => {
              e.stopPropagation();
              pushDrawer('service');
            }}
            className="absolute top-3 right-3 p-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-gray-600 active:scale-90 transition-all z-10"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <div className="text-center relative z-10">
            <span className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight block">{t('fan.influencer_label')}</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="text-[9px] text-purple-500 font-bold uppercase">{t('fan.apply_now')}</span>
              <ChevronRight className="w-2.5 h-2.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </button>
        <button 
          onClick={() => pushDrawer('leaderboard')}
          className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[28px] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 active:scale-95 transition-all group relative overflow-hidden"
        >
          <div 
            onClick={(e) => {
              e.stopPropagation();
              pushDrawer('service');
            }}
            className="absolute top-3 right-3 p-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-gray-600 active:scale-90 transition-all z-10"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight block">{t('fan.leaderboard_label')}</span>
            <span className="text-[9px] text-orange-500 font-bold uppercase">{t('fan.rank_prefix')}142</span>
          </div>
        </button>
      </div>

      {/* 4. Total Rewards Breakdown */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">{t('fan.earnings_history')}</h4>
          <button 
            onClick={() => pushDrawer('service')}
            className="flex items-center gap-1 text-[10px] text-[var(--wa-teal)] font-bold uppercase active:scale-95 transition-all"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{t('fan.rule_doc')}</span>
          </button>
        </div>
        <div className="space-y-4">
          {rewardStats.breakdown.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => pushDrawer('reward_history')}
              className="flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.bg} dark:bg-white/5 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13px] font-black text-gray-900 dark:text-white tracking-tight">{item.label}</div>
                  <div className="text-[11px] text-gray-400 font-bold uppercase">{item.count}{t('fan.records')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-black text-gray-900 dark:text-white">${item.amount}</div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};