import React, { useState } from 'react';
import { 
  Bot,
  Users, 
  Compass, 
  Settings,
  HelpCircle,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sofa,
  Rss,
  LayoutGrid,
  Gift
} from 'lucide-react';
import { ViewType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const PrimeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 3h12l4 6-10 13L2 9Z" />
    <text x="12" y="14" fontSize="8" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none" style={{ fontFamily: 'var(--font-headline)' }}>$</text>
  </svg>
);

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout?: () => void;
  agentName?: string;
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  cartItemsCount?: number;
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  onLogout, 
  agentName,
  isAuthenticated = false,
  onLoginClick,
  cartItemsCount = 0
}: SidebarProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const agentDisplayName = agentName?.trim() ? agentName.trim() : t('nav.chat');
  const hasCustomAgentName = Boolean(agentName?.trim());

  const navItems = [
    { id: 'chat', label: agentDisplayName, icon: Bot },
    { id: 'circle', label: t('nav.lounge'), icon: Sofa },
    { id: 'explore', label: t('nav.explore'), icon: Gift },
    { id: 'square', label: t('nav.square'), icon: LayoutGrid },
    { id: 'prime', label: t('nav.prime'), icon: PrimeIcon },
    { id: 'activity', label: t('nav.feed'), icon: Rss },
  ];

  const bottomNavItems = [
    { id: 'cart', label: t('nav.stash'), icon: ShoppingCart, hasBadge: true },
  ];

  const myChannels = [
    { id: 'c1', name: 'Tech Talk', color: 'bg-primary' },
    { id: 'c2', name: 'Design Hub', color: 'bg-secondary' },
    { id: 'c3', name: 'Architecture', color: 'bg-tertiary' },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 h-full flex flex-col z-50 bg-background/80 backdrop-blur-xl border-r border-zinc-500/10 transition-all duration-300 ease-in-out ${
        isHovered ? 'w-64' : 'w-20'
      }`}
    >
      <div className="px-4 py-8 overflow-hidden">
        <div className="flex items-center gap-4 pl-2 h-12 relative">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-shrink-0"
              >
                <Logo mode="horizontal" size={32} />
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex-shrink-0"
              >
                <Logo mode="icon" size={48} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-3 space-y-2 overflow-hidden">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'square' && currentView === 'merchant-detail');
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? 'text-primary font-bold bg-surface-container-lowest' 
                  : 'text-on-surface-variant font-medium hover:bg-surface-container-highest'
              }`}
            >
              <div className="flex-shrink-0 relative">
                <Icon className={`w-6 h-6 transition-transform group-active:scale-90 ${isActive ? 'fill-current' : ''}`} />
                {item.id === 'chat' && hasCustomAgentName && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background border border-zinc-500/10 flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-primary fill-current" />
                  </span>
                )}
              </div>
              <span className={`font-headline text-sm tracking-tight transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                />
              )}
            </button>
          );
        })}

        {/* My Channels Section */}
        <div className={`pt-8 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <p className="px-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4 opacity-50 whitespace-nowrap">My Channels</p>
          <div className="space-y-1">
            {myChannels.map((channel) => (
              <button
                key={channel.id}
                className="w-full flex items-center gap-4 px-4 py-2 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-highest transition-all duration-200 group"
              >
                <div className={`w-2 h-2 rounded-full ${channel.color} group-hover:scale-125 transition-transform flex-shrink-0`} />
                <span className={`font-headline text-sm tracking-tight transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  {channel.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="px-6 mt-auto space-y-4 pt-8 border-t border-zinc-500/10 mb-8 overflow-visible">
        {bottomNavItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-4 font-medium transition-colors duration-200 group relative ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <div className="flex-shrink-0 relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {item.hasBadge && cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary text-[8px] flex items-center justify-center rounded-full text-white font-bold border border-background">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className={`font-headline text-[10px] tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute -right-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                />
              )}
            </button>
          );
        })}
        {isAuthenticated ? (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-4 text-on-surface-variant font-medium hover:text-error transition-colors duration-200 group"
          >
            <div className="flex-shrink-0">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className={`font-headline text-[10px] tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              {t('nav.logout')}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="w-full flex items-center gap-4 text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 group"
          >
            <div className="flex-shrink-0">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform rotate-180" />
            </div>
            <span className={`font-headline text-[10px] tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              {t('nav.login')}
            </span>
          </button>
        )}
      </div>

      <div className="p-4 border-t border-zinc-500/10 overflow-hidden">
        <button 
          onClick={() => onViewChange('me')}
          className="w-full flex items-center gap-3 p-2 rounded-xl bg-surface-container-lowest shadow-sm border border-zinc-500/10 hover:border-primary transition-all group"
        >
          <div className="relative flex-shrink-0">
            <img
              src={isAuthenticated
                ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian"
                : "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
              }
              alt={isAuthenticated ? "Julian Rossi" : t('nav.guest')}
              className={`w-10 h-10 rounded-xl object-cover transition-all ${!isAuthenticated ? 'grayscale-[0.5]' : ''} group-hover:scale-105`}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            {isAuthenticated && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-lowest"></div>
            )}
          </div>
          <div className={`transition-all duration-300 overflow-hidden text-left ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'
          }`}>
            <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">{isAuthenticated ? "Julian Rossi" : t('nav.guest')}</p>
            <p className="text-[10px] text-on-surface-variant font-medium">{isAuthenticated ? t('nav.pro_member') : t('nav.guest_mode')}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
