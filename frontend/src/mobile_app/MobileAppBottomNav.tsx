import React from 'react';
import { useTranslation } from 'react-i18next';

interface MobileAppBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function MobileAppBottomNav({ currentView, setCurrentView }: MobileAppBottomNavProps) {
  const { t } = useTranslation();

  // The 6 requested bottom navigation items
  const navItems = [
    { id: 'chat', label: 'AI Butler', icon: 'smart_toy' },
    { id: 'lounge', label: 'Lounge', icon: 'forum' },
    { id: 'referral', label: 'Referral', icon: 'card_giftcard' },
    { id: 'square', label: 'Square', icon: 'grid_view' },
    { id: 'prime', label: 'Prime', icon: 'shopping_bag' },
    { id: 'me', label: 'Me', icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 py-3 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = currentView === item.id || (currentView.startsWith(item.id) && item.id !== 'chat');
        // 'chat' maps to AI Butler.
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center transition-all active:scale-95 ${
              isActive ? 'text-primary' : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isActive ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[9px] font-medium font-headline mt-1 tracking-wider uppercase">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}