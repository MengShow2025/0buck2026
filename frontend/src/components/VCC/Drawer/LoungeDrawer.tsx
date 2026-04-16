import React, { useState } from 'react';
import { Search, VolumeX, ShieldAlert, Sparkles, MessageCircle, Bot, UserPlus, Users, MessageSquare, Plus, PlusCircle, UserCheck, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const LoungeDrawer: React.FC = () => {
  const { setActiveDrawer, setActiveChat, pushDrawer, t, user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const CHAT_LIST = [
    {
      id: '1',
      name: t('lounge.official'),
      avatar: 'https://ui-avatars.com/api/?name=Official&background=0D8ABC&color=fff',
      icon: <Sparkles className="w-6 h-6 text-white" />,
      avatarBg: 'bg-[var(--wa-teal)]',
      lastMessage: t('lounge.msg_iphone_launch'),
      time: '10:42',
      unread: 1,
      isOfficial: true,
      type: 'topic'
    },
    {
      id: '2',
      name: user?.butler_name || t('lounge.ai_butler'),
      icon: <Bot className="w-6 h-6 text-white" />,
      avatarBg: 'bg-indigo-500',
      lastMessage: t('lounge.msg_phase_reward'),
      time: t('common.yesterday'),
      unread: 0,
      isOfficial: true,
      type: 'private'
    },
    {
      id: 'friend_1',
      name: 'Alex Design',
      avatar: 'https://ui-avatars.com/api/?name=Alex&background=random',
      lastMessage: t('lounge.msg_camera_group'),
      time: '14:20',
      unread: 0,
      type: 'private'
    },
    {
      id: '3',
      name: t('lounge.group_nyc'),
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      avatarBg: 'bg-green-500',
      lastMessage: t('lounge.msg_camping_gear'),
      time: t('common.tuesday'),
      unread: 12,
      isMuted: true,
      type: 'group',
      memberCount: 482
    },
    {
      id: '4',
      name: t('lounge.group_digital'),
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      avatarBg: 'bg-blue-500',
      lastMessage: t('lounge.msg_dumbo_headphones'),
      time: t('common.monday'),
      unread: 0,
      isMuted: true,
      type: 'group',
      memberCount: 1250
    },
    {
      id: '5',
      name: t('lounge.order_helper'),
      icon: <ShieldAlert className="w-6 h-6 text-white" />,
      avatarBg: 'bg-gray-500',
      lastMessage: t('lounge.msg_package_delivered'),
      time: '10/24',
      unread: 0,
      isOfficial: true,
      type: 'topic'
    }
  ];

  const SEARCH_RESULTS = [
    { id: 's1', name: t('lounge.tech_expert'), id_str: '0B-8827', type: 'user', isFriend: false, avatar: 'https://ui-avatars.com/api/?name=TE&background=random' },
    { id: 's2', name: t('lounge.alex_design'), id_str: '0B-1024', type: 'user', isFriend: true, avatar: 'https://ui-avatars.com/api/?name=Alex&background=random' },
    { id: 's3', name: `# ${t('square.topic_must_buy')}`, type: 'topic', memberCount: `12.5${t('square.unit_k')}` },
    { id: 's4', name: t('square.group_hardware'), type: 'group', memberCount: 85 }
  ];

  const handleChatClick = (chat: any) => {
    setActiveChat({
      id: chat.id,
      name: chat.name,
      type: chat.type,
      avatar: chat.avatar,
      memberCount: chat.memberCount
    });
    pushDrawer('chat_room');
  };

  const handleAddFriend = (e: React.MouseEvent, user: any) => {
    e.stopPropagation();
    console.log('Adding friend:', user.name);
    // Logic for sending request
  };

  const PLUS_MENU_OPTIONS = [
    { id: 'group', name: t('lounge.start_group'), icon: <Users className="w-5 h-5" />, color: 'text-blue-500' },
    { id: 'add', name: t('lounge.add_friend'), icon: <UserPlus className="w-5 h-5" />, color: 'text-green-500' },
    { id: 'scan', name: t('lounge.scan'), icon: <PlusCircle className="w-5 h-5" />, color: 'text-purple-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#000000]" onClick={() => setShowPlusMenu(false)}>
      {/* Header with Search and Actions */}
      <div className="px-4 py-3 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveDrawer('none')}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm active:scale-90 transition-all text-gray-600 dark:text-gray-300 shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(e.target.value.length > 0);
              }}
              placeholder={t('lounge.search_placeholder')} 
              className="w-full bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 text-[14px] font-medium rounded-2xl py-2.5 pl-9 pr-4 outline-none border border-gray-200 dark:border-white/10 placeholder:text-gray-400 shadow-sm focus:border-[var(--wa-teal)] transition-all"
            />
          </div>
          
          <button 
            onClick={() => pushDrawer('contacts')}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm active:scale-90 transition-all text-gray-600 dark:text-gray-300"
            title={t('lounge.friend_mgmt')}
          >
            <Users className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowPlusMenu(!showPlusMenu);
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg active:scale-90 transition-all ${
                showPlusMenu ? 'bg-gray-800 text-white' : 'text-white'
              }`}
              style={!showPlusMenu ? { background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' } : {}}
              title={t('lounge.more_actions')}
            >
              <Plus className={`w-6 h-6 transition-transform duration-300 ${showPlusMenu ? 'rotate-45' : ''}`} />
            </button>

            {/* Plus Menu Popover */}
            {showPlusMenu && (
              <div 
                className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1C1C1E] rounded-[24px] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 animate-in zoom-in-95 duration-200 origin-top-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-1.5">
                  {PLUS_MENU_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setShowPlusMenu(false);
                        if (option.id === 'group') pushDrawer('contacts'); // Redirect to selection for now
                        if (option.id === 'add') setIsSearching(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-[18px] transition-colors text-left group"
                    >
                      <div className={`${option.color} group-active:scale-90 transition-transform`}>
                        {option.icon}
                      </div>
                      <span className="text-[14px] font-semibold text-gray-900 dark:text-white tracking-tight">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {isSearching ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-3 text-[12px] font-black text-gray-400 uppercase tracking-widest">{t('lounge.search_results')}</div>
            {SEARCH_RESULTS.map((result) => (
              <div 
                key={result.id}
                className="flex items-center px-4 py-3 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/10 overflow-hidden flex-shrink-0 mr-3 flex items-center justify-center">
                  {result.avatar ? (
                    <img src={result.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-black text-gray-900 dark:text-white truncate">{result.name}</div>
                  <div className="text-[11px] text-gray-400 font-bold">{result.type === 'user' ? `${t('square.id_prefix')}${result.id_str}` : `${result.memberCount}${t('common.members')}`}</div>
                </div>
                {result.type === 'user' && (
                  result.isFriend ? (
                    <div className="flex items-center gap-1 text-[11px] font-black text-[var(--wa-teal)] bg-[var(--wa-teal)]/10 px-2 py-1 rounded-lg">
                      <UserCheck className="w-3.5 h-3.5" /> {t('common.is_friend')}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleAddFriend(e, result)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg shadow-md active:scale-95 transition-all"
                      style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' }}
                    >
                      <UserPlus className="w-3.5 h-3.5" /> {t('common.add')}
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {CHAT_LIST.map((chat, index) => (
              <div 
                key={chat.id} 
                onClick={() => handleChatClick(chat)}
                className={`flex items-center px-4 py-3 cursor-pointer active:bg-gray-50 dark:active:bg-white/5 transition-colors ${
                  index !== CHAT_LIST.length - 1 ? 'border-b border-gray-50 dark:border-white/5' : ''
                }`}
              >
                {/* Avatar with Unread Badge */}
                <div className="relative flex-shrink-0 mr-3">
                  <div className={`w-12 h-12 rounded-[18px] overflow-hidden flex items-center justify-center ${chat.avatarBg || 'bg-gray-100 dark:bg-white/10'} shadow-sm border border-white/20`}>
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    ) : (
                      chat.icon
                    )}
                  </div>
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white dark:border-[#000000] shadow-md">
                      {chat.unread > 99 ? '99+' : chat.unread}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <h3 className="text-[15px] font-black text-gray-900 dark:text-gray-100 truncate tracking-tight">
                        {chat.name}
                      </h3>
                      {chat.isOfficial && (
                        <div className="text-[9px] font-black text-white bg-blue-500 px-1.5 py-0.5 rounded-md flex-shrink-0 uppercase tracking-tighter">
                          {t('lounge.official_label')}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 font-bold flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate pr-2 font-medium">
                      {chat.lastMessage}
                    </p>
                    {chat.isMuted && (
                      <VolumeX className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};