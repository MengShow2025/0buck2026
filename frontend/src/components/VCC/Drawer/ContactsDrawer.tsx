import React, { useState } from 'react';
import { Search, UserPlus, Users, MessageSquare, ChevronRight, ChevronDown, Star, MoreHorizontal, UserCheck, Clock } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const ContactsDrawer: React.FC = () => {
  const { pushDrawer, setActiveChat, t } = useAppContext();
  const [isNewFriendsExpanded, setIsNewFriendsExpanded] = useState(true);

  const NEW_FRIENDS = [
    { id: 'nf1', name: t('contacts.lorna'), message: `${t('common.me')} ${t('contacts.lorna')}`, status: 'pending', avatar: 'https://ui-avatars.com/api/?name=Lorna&background=random' },
    { id: 'nf2', name: t('contacts.jessie'), message: `Hi, I am ${t('contacts.jessie')} from BEA`, status: 'expired', avatar: 'https://ui-avatars.com/api/?name=Jessie&background=random' },
    { id: 'nf3', name: t('contacts.gtja_support'), message: t('magicpocketmenu.24_7_ai_human'), status: 'added', avatar: 'https://ui-avatars.com/api/?name=GTJA&background=random' },
    { id: 'nf4', name: t('contacts.premium_wine_17277618867'), message: t('notification.sitewide_100_back_extra_points'), status: 'expired', avatar: 'https://ui-avatars.com/api/?name=JJCC&background=random' },
  ];

  const CONTACT_CATEGORIES = [
    { id: 'groups', name: t('contact.groups'), count: 1, icon: <Users className="w-5 h-5 text-indigo-500" /> },
    { id: 'discover', name: t('contact.discover'), count: '99+', icon: <Search className="w-5 h-5 text-green-500" />, drawer: 'all_fan_feeds' },
    { id: 'my_feeds', name: t('contact.my_feeds'), count: 8, icon: <Clock className="w-5 h-5 text-orange-500" />, drawer: 'my_feeds' },
  ];

  const CONTACTS = [
    { id: 'c1', name: t('contacts.carl'), initial: 'C', avatar: 'https://ui-avatars.com/api/?name=Carl&background=random' },
    { id: 'c2', name: t('contacts.geek_master'), initial: 'G', avatar: 'https://ui-avatars.com/api/?name=GM&background=random' },
    { id: 'c3', name: t('contacts.lorna_tech'), initial: 'L', avatar: 'https://ui-avatars.com/api/?name=LT&background=random' },
    { id: 'c4', name: t('contacts.alex_design'), initial: 'A', avatar: 'https://ui-avatars.com/api/?name=Alex&background=random' },
    { id: 'c5', name: t('contacts.vortex_fan'), initial: 'V', avatar: 'https://ui-avatars.com/api/?name=VF&background=random' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#000000] overflow-y-auto pb-24">
      {/* Search Bar */}
      <div className="px-4 py-3 bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-100/50 dark:border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={t('contact.search_placeholder')} 
            className="w-full bg-gray-100/50 dark:bg-white/5 text-gray-800 dark:text-gray-200 text-[15px] rounded-xl py-2 pl-9 pr-4 outline-none border border-transparent focus:border-[var(--wa-teal)] transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 mt-4 space-y-1">
        {/* New Friends Header */}
        <div 
          onClick={() => setIsNewFriendsExpanded(!isNewFriendsExpanded)}
          className="flex items-center justify-between px-3 py-2 cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-[13px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {isNewFriendsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>{t('contact.new_friends')}</span>
          </div>
          <MoreHorizontal className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* New Friends List */}
        {isNewFriendsExpanded && (
          <div className="space-y-2 mb-4">
            {NEW_FRIENDS.map((nf) => (
              <div 
                key={nf.id} 
                className="mx-3 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-[24px] p-3 flex items-center justify-between border border-white/40 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-[18px] overflow-hidden border border-white/20 shadow-sm shrink-0">
                    <img src={nf.avatar} alt={nf.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[15px] font-black text-gray-900 dark:text-white truncate">{nf.name}</div>
                    <div className="text-[12px] text-gray-400 dark:text-gray-500 truncate font-medium">{nf.message}</div>
                  </div>
                </div>
                <div className="shrink-0 ml-2">
                  {nf.status === 'added' ? (
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5">
                      {t('contact.added')}
                    </span>
                  ) : nf.status === 'expired' ? (
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-dashed border-gray-200 dark:border-white/5">
                      {t('contact.expired')}
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 text-white text-[12px] font-semibold rounded-lg shadow-md active:scale-95 transition-all" style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' }}>
                        {t('contact.accept')}
                      </button>
                      <button className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-500 text-[12px] font-black rounded-lg active:scale-95 transition-all">
                        {t('common.ignore')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Categories */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/40 dark:border-white/10 shadow-sm mx-3 mb-6">
          {CONTACT_CATEGORIES.map((cat, idx) => (
            <div 
              key={cat.id} 
              onClick={() => cat.drawer ? pushDrawer(cat.drawer as any) : console.log(`${cat.name} clicked`)}
              className={`flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50 dark:active:bg-white/5 transition-colors ${idx !== CONTACT_CATEGORIES.length - 1 ? 'border-b border-gray-100/50 dark:border-white/5' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[12px] bg-gray-50 dark:bg-white/5 flex items-center justify-center shadow-sm">
                  {cat.icon}
                </div>
                <span className="text-[15px] font-black text-gray-900 dark:text-white">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-400 dark:text-gray-500 font-bold">{cat.count}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Alphabetical Contacts */}
        <div className="space-y-4 px-3">
          <div className="text-[13px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-3 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{t('contact.star_friends')}</span>
          </div>
          
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/40 dark:border-white/10 shadow-sm">
            {CONTACTS.map((contact, idx) => (
              <div 
                key={contact.id} 
                onClick={() => {
                  setActiveChat({ id: contact.id, name: contact.name, type: 'private', avatar: contact.avatar });
                  pushDrawer('chat_room');
                }}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer active:bg-gray-50 dark:active:bg-white/5 transition-colors ${idx !== CONTACTS.length - 1 ? 'border-b border-gray-100/50 dark:border-white/5' : ''}`}
              >
                <div className="w-11 h-11 rounded-[16px] overflow-hidden border border-white/20 shadow-sm">
                  <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[15px] font-black text-gray-900 dark:text-white tracking-tight">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
