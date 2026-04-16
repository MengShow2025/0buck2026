import React, { useState } from 'react';
import { Truck, CheckCircle2, CreditCard, Gift, UserPlus, Zap, Heart, MessageSquare, Bot, Award, ShieldCheck, TrendingUp, MoreHorizontal, ChevronRight, Send } from 'lucide-react';
import { useAppContext } from '../AppContext';

const NOTIFS = [
  { id: 'order_shipped',    group: 'Today',  type: 'order',    icon: <Truck className="w-4 h-4 text-blue-500" />,    color: 'bg-blue-50 dark:bg-blue-900/20',      title: 'Order shipped', sub: 'ORD-2841 · SF Express SF1234567890', extra: 'ETA 2-3 business days', cta: 'Track package', drawer: 'orders' as const },
  { id: 'cashback_earned',  group: 'Today',  type: 'reward',   icon: <CreditCard className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-50 dark:bg-emerald-900/20', title: 'Cash reward received +$15.00', sub: 'Stage cashback · Stage 7 · ORD-001', extra: 'Balance updated and ready to withdraw', cta: 'View balance', drawer: 'reward_history' as const },
  { id: 'post_liked',       group: 'Today',  type: 'social',   icon: <Heart className="w-4 h-4 text-red-500" />,     color: 'bg-red-50 dark:bg-red-900/20',        title: 'Someone liked your post', sub: 'Alex_Design · SVIP liked your post', extra: null, cta: null, drawer: null },
  { id: 'ai_reward',        group: 'Today',  type: 'reward',   icon: <Bot className="w-4 h-4 text-cyan-500" />,      color: 'bg-cyan-50 dark:bg-cyan-900/20',       title: 'AI task reward +$2.50', sub: 'Today’s AI interaction task completed', extra: null, cta: 'View details', drawer: 'reward_history' as const },
  { id: 'order_delivered',  group: 'Yesterday',  type: 'order',    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, color: 'bg-green-50 dark:bg-green-900/20',  title: 'Package delivered', sub: 'ORD-2799 · Artisan Earbuds', extra: 'Delivered yesterday at 14:32', cta: 'Write review', drawer: 'orders' as const },
  { id: 'comment_reply',    group: 'Yesterday',  type: 'social',   icon: <MessageSquare className="w-4 h-4 text-blue-500" />, color: 'bg-blue-50 dark:bg-blue-900/20',    title: 'Someone replied to your comment', sub: 'Marcus_T replied: this one is really great…', extra: null, cta: null, drawer: null },
  { id: 'new_follower',     group: 'Yesterday',  type: 'social',   icon: <UserPlus className="w-4 h-4 text-pink-500" />, color: 'bg-pink-50 dark:bg-pink-900/20',      title: 'New follower', sub: 'Sophie_Chen · VIP3', extra: null, cta: 'View profile', drawer: 'contacts' as const },
  { id: 'flash_sale',       group: 'This Week',  type: 'activity', icon: <Zap className="w-4 h-4 text-orange-500" />,    color: 'bg-orange-50 dark:bg-orange-900/20',  title: '⚡ Flash sale reminder', sub: '11.11 warm-up sale · tonight 20:00', extra: 'Up to 70% OFF, Prime only', cta: 'Shop now', drawer: null },
  { id: 'withdrawal',       group: 'This Week',  type: 'finance',  icon: <CreditCard className="w-4 h-4 text-violet-500" />, color: 'bg-violet-50 dark:bg-violet-900/20', title: 'Withdrawal approved', sub: '-$500.00 · PayPal · arrives in 1-3 business days', extra: null, cta: 'Open wallet', drawer: 'wallet' as const },
  { id: 'c2w_success',      group: 'This Week',  type: 'activity', icon: <Gift className="w-4 h-4 text-rose-500" />,     color: 'bg-rose-50 dark:bg-rose-900/20',      title: '🎉 Crowdfunding success! +23% overflow', sub: 'C2W-X · Minimal Mechanical Keyboard Workstation', extra: 'Estimated ship: 2024 Q1', cta: 'View order', drawer: 'orders' as const },
  { id: 'referral_reward',  group: 'This Week',  type: 'reward',   icon: <TrendingUp className="w-4 h-4 text-blue-500" />, color: 'bg-blue-50 dark:bg-blue-900/20',    title: 'Referral reward received +$45.00', sub: 'Referred item: Titanium Watch', extra: null, cta: 'View details', drawer: 'reward_history' as const },
  { id: 'prime_renewal',    group: 'This Week',  type: 'system',   icon: <Award className="w-4 h-4 text-amber-500" />,   color: 'bg-amber-50 dark:bg-amber-900/20',    title: 'Prime membership expiring soon', sub: 'Expires in 7 days · renew with 15% off', extra: null, cta: 'Renew now', drawer: 'prime' as const },
  { id: 'security',         group: 'This Week',  type: 'system',   icon: <ShieldCheck className="w-4 h-4 text-zinc-500" />, color: 'bg-zinc-100 dark:bg-white/10',      title: 'Security alert · New device login', sub: 'iPhone 16 Pro · Shenzhen, Guangdong', extra: 'If this was not you, change password now', cta: 'Review now', drawer: null },
];

const GROUPS = ['Today', 'Yesterday', 'This Week'];

export const DesktopNotificationsView: React.FC = () => {
  const { pushDrawer } = useAppContext();
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replied, setReplied] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState('');

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    setReplied(prev => new Set([...prev, id]));
    setReplyingId(null);
    setReplyText('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl shrink-0 flex items-center justify-between">
        <h2 className="text-[18px] font-black text-zinc-900 dark:text-white">Notifications</h2>
        <button className="text-[12px] text-zinc-400 hover:text-orange-500 transition-colors font-medium">Mark all as read</button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
        <div className="max-w-2xl mx-auto space-y-8">
          {GROUPS.map(group => {
            const items = NOTIFS.filter(n => n.group === group);
            if (!items.length) return null;
            return (
              <div key={group}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{group}</div>
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="space-y-2">
                  {items.map(notif => (
                    <div key={notif.id} className="bg-white dark:bg-[#18181B] rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors overflow-hidden">
                      {/* Main Row */}
                      <div className="flex items-start gap-4 p-4">
                        <div className={`w-9 h-9 rounded-xl ${notif.color} flex items-center justify-center shrink-0 mt-0.5`}>
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-zinc-900 dark:text-white leading-snug">{notif.title}</div>
                          <div className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-0.5">{notif.sub}</div>
                          {notif.extra && (
                            <div className="text-[11px] text-zinc-400 mt-1 bg-zinc-50 dark:bg-white/5 px-2 py-1 rounded-lg inline-block">{notif.extra}</div>
                          )}
                          {/* Social reply */}
                          {notif.type === 'social' && !replied.has(notif.id) && (
                            <div className="mt-2">
                              {replyingId !== notif.id ? (
                                <button
                                  onClick={() => setReplyingId(notif.id)}
                                  className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" /> Quick reply
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    autoFocus
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleReply(notif.id)}
                                    placeholder="Type a reply..."
                                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-1.5 text-[12px] outline-none border border-zinc-200 dark:border-zinc-700 focus:border-orange-400 transition-colors"
                                  />
                                  <button
                                    onClick={() => handleReply(notif.id)}
                                    className="w-8 h-8 rounded-xl text-white flex items-center justify-center active:scale-90 transition-transform shadow-md"
                                    style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' }}
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setReplyingId(null)} className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
                                </div>
                              )}
                            </div>
                          )}
                          {replied.has(notif.id) && (
                            <div className="flex items-center gap-1 mt-1 text-[11px] text-zinc-400 italic">
                              <CheckCircle2 className="w-3 h-3 text-green-500" /> Replied
                            </div>
                          )}
                        </div>
                        <button className="text-zinc-300 hover:text-zinc-500 transition-colors shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      {/* CTA Footer */}
                      {notif.cta && notif.drawer && (
                        <button
                          onClick={() => pushDrawer(notif.drawer!)}
                          className="w-full flex items-center justify-between px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 text-[12px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                        >
                          {notif.cta} <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
