import { Search, MoreVertical, UserCircle, Bell, ShoppingCart, ArrowLeft, Sparkles, Share2, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ViewType } from '../types';

export interface TopBarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  onMenuClick?: () => void;
  currentView?: ViewType;
  onViewChange?: (view: ViewType) => void;
  isAuthenticated?: boolean;
  onUserClick?: () => void;
  hideHeader?: boolean;
  cartItemsCount?: number;
}

export default function TopBar({ 
  title, 
  subtitle, 
  currentView, 
  onViewChange, 
  showSearch = true, 
  onBack,
  onShare,
  onMenuClick,
  isAuthenticated = false,
  onUserClick,
  hideHeader = false,
  cartItemsCount = 0
}: TopBarProps) {
  if (hideHeader) return null;

  const { t } = useTranslation();
  
  return (
    <header className="sticky top-0 w-full flex justify-between items-center px-6 md:px-12 py-4 md:py-6 z-30 bg-background/80 backdrop-blur-xl border-b border-zinc-500/10 transition-all">
      <div className="flex items-center gap-4 md:gap-6 flex-1">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-xl bg-surface-container-low border border-zinc-500/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col min-w-0">
          <h2 className="text-sm md:text-xl font-black text-on-surface font-headline tracking-tight truncate max-w-[120px] md:max-w-none">{title}</h2>
          {subtitle && <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest truncate max-w-[120px] md:max-w-none">{subtitle}</p>}
        </div>
        
      {/* Center - View Navigation */}
      <div className="flex-1 flex justify-center h-full">
      </div>

        {showSearch && (
          <div className="relative w-full max-w-md group hidden md:block ml-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder={t('common.search_placeholder')}
              className="w-full bg-surface-container-low border border-zinc-500/10 rounded-xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all font-body text-sm placeholder:text-on-surface-variant/70 shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        {onShare && (
          <button 
            onClick={onShare}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all relative"
            title="Share"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all relative">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
        <button 
          onClick={() => onViewChange && onViewChange('cart')}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all relative"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-primary text-[8px] sm:text-[9px] flex items-center justify-center rounded-full text-white font-bold border-2 border-background">
              {cartItemsCount}
            </span>
          )}
        </button>
        <div className="h-6 sm:h-8 w-[1px] bg-zinc-500/10 mx-1 sm:mx-2"></div>
        <button 
          onClick={onUserClick}
          className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-surface-container-high transition-all group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface">{isAuthenticated ? "Julian Rossi" : t('nav.guest')}</p>
            <p className="text-[10px] text-on-surface-variant font-medium">{isAuthenticated ? t('nav.pro_member') : t('nav.guest_mode')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-low overflow-hidden border border-zinc-500/10 group-hover:border-primary transition-all relative">
            <img
              src={isAuthenticated ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"}
              alt={isAuthenticated ? "Julian Rossi" : t('nav.guest')}
              className={`w-full h-full object-cover ${!isAuthenticated ? 'grayscale-[0.5]' : ''}`}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            {isAuthenticated && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-low"></div>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
