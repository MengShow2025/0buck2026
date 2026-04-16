import React, { useState } from 'react';
import { Search, Flame, Bell, ChevronRight, MessageSquare, Heart, Share2, Calendar, Users, Zap, TrendingUp, Check, ChevronDown, Play, Star, ShieldCheck, X, PlusCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';

const TOPICS = [
  { id: 't1', name: 'square.topic_must_buy', count: '12.5w', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 't2', name: 'square.topic_crowdfunding', count: '8.2w', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 't3', name: 'square.topic_camping', count: '4.1w', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 't4', name: 'square.topic_ootd', count: '3.3w', color: 'text-pink-600', bg: 'bg-pink-50' },
];

const GROUP_BUY_DATA = [
  { id: 1, name: 'square.iphone_15_pro', img: '1092644', tag: 'square.c2w_tag', left: 5, type: 'presale' },
  { id: 2, name: 'square.artisan_keyboard', img: '3850512', tag: 'square.topic_crowdfunding', left: 12, type: 'crowdfunding' },
  { id: 3, name: 'square.sony_wh_1000xm5', img: '3780681', tag: 'square.wishlist_tag', left: 28, type: 'wishlist' }
];

const FeedCard: React.FC<{ i: number; onMediaClick: (type: 'image' | 'video', url: string) => void }> = ({ i, onMediaClick }) => {
  const { pushDrawer, t } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(100 + i * 12);

  const text = i % 2 === 0 
    ? t('square.feed_text_1')
    : t('square.feed_text_2');

  const images = Array.from({ length: (i % 9) + 1 }, (_, index) => `https://picsum.photos/seed/feed_${i}_${index}/600/600`);
  const videoUrl = `https://picsum.photos/seed/video_${i}/800/450`;
  const hasVideo = i === 1; // Mock video for the second item
  const vipLevel = (i % 8) + 1;
  const isSVIP = i % 3 === 0;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushDrawer('user_profile');
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushDrawer('share_menu');
  };

  return (
    <div 
      className="bg-white/95 dark:bg-white/5 backdrop-blur-xl rounded-[28px] shadow-sm border border-white/40 dark:border-white/10 p-4 mb-4 active:scale-[0.99] transition-all duration-200 relative overflow-hidden"
      onClick={() => {
        if (showComments) setShowComments(false);
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleAvatarClick}>
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 font-bold text-[14px] shadow-sm relative group-active:scale-90 transition-transform">
            U{i}
            {isSVIP && <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border border-white flex items-center justify-center shadow-sm">
              <Star className="w-2.5 h-2.5 text-white fill-current" />
            </div>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black text-gray-900 dark:text-white group-hover:text-[#E8450A] transition-colors">{t('contacts.alex_design')}_{i}</span>
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-black italic tracking-tighter shadow-sm border ${
                isSVIP 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400' 
                  : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'
              }`}>
                {isSVIP ? t('square.svip_level') : t('square.vip_level')}{vipLevel}
              </div>
            </div>
            <div className="text-[11px] text-gray-400 font-medium">{i * 5} {t('square.post_time_suffix')}</div>
          </div>
        </div>
        <span className="text-[10px] bg-gray-500/10 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">
          {i % 3 === 0 ? t('square.merchant') : t('square.user_share')}
        </span>
      </div>
      
      <div className="relative">
        <p className={`text-[14px] text-gray-700 dark:text-gray-300 mb-1 leading-snug font-medium ${!isExpanded ? 'line-clamp-4' : ''}`}>
          {text}
        </p>
        {text.length > 100 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-[13px] text-[#E8450A] font-bold flex items-center gap-0.5 mb-3 hover:opacity-80"
          >
            {isExpanded ? t('tracking.collapse') : t('common.more')}
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 rotate-180" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {hasVideo ? (
        <div 
          onClick={(e) => { e.stopPropagation(); onMediaClick('video', videoUrl); }}
          className="relative w-full aspect-video rounded-[24px] overflow-hidden mb-3 group cursor-pointer border border-white/20 shadow-sm"
        >
          <img src={videoUrl} alt="Video Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
            <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 shadow-xl">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold border border-white/20">
            0:45
          </div>
        </div>
      ) : (
        <div className={`grid gap-1 mb-3 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={(e) => { e.stopPropagation(); onMediaClick('image', img); }}
              className="aspect-square rounded-xl overflow-hidden border border-white/10 shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <img src={img} alt="Feed" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 pt-1">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[13px] font-bold active:scale-95 transition-all duration-200 ${isLiked ? 'text-red-500 scale-110' : 'hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {likeCount}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
          className={`flex items-center gap-1.5 text-[13px] font-bold active:scale-95 transition-all duration-200 ${showComments ? 'text-blue-500 scale-110' : 'hover:text-blue-500'}`}
        >
          <MessageSquare className={`w-4 h-4 ${showComments ? 'fill-current' : ''}`} /> {20 + i * 3}
        </button>
        <button 
          onClick={handleShareClick}
          className="flex items-center gap-1.5 text-[13px] font-bold active:scale-95 transition-transform ml-auto hover:text-[#E8450A]"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comment Tree (Mock) */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[12px] font-black text-gray-500 shrink-0 shadow-sm">U1</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-black text-gray-900 dark:text-white">{t('contacts.user_a')}</span>
                <span className="text-[10px] text-gray-400 font-bold italic">12{t('square.mins_ago')}</span>
              </div>
              <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-snug font-medium">{t('square.comment_1')}</p>
              
              {/* Reply */}
              <div className="mt-3 flex gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">B</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[12px] font-black text-gray-900 dark:text-white">{t('contacts.user_b')}</span>
                    <span className="text-[9px] text-gray-400 font-bold italic">{t('common.now')}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-snug font-medium">
                    <span className="text-[#E8450A] font-black">@{t('contacts.user_a')}</span> {t('square.reply_1')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              autoFocus
              type="text"
              placeholder={t('feed.comment_placeholder')}
              className="flex-1 bg-gray-100/50 dark:bg-white/5 rounded-full px-4 py-1.5 text-[12px] outline-none border border-white/20 focus:border-[#E8450A] transition-all"
            />
            <button className="w-8 h-8 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' }}>
              <Zap className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const SquareDrawer: React.FC = () => {
  const { setActiveDrawer, setActiveChat, pushDrawer, setSelectedProductId, t } = useAppContext();
  const [joinedWishlist, setJoinedWishlist] = useState<number[]>([]);
  const [previewMedia, setPreviewMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);

  const handleActionClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setSelectedProductId(item.type === 'wishlist' ? `w${item.id}` : `p${item.id}`);
    if (item.type === 'wishlist') {
      if (!joinedWishlist.includes(item.id)) {
        setJoinedWishlist([...joinedWishlist, item.id]);
      }
      pushDrawer('wishlist_detail');
    } else {
      pushDrawer('product_detail');
    }
  };

  const handleCardClick = (item: any) => {
    setSelectedProductId(item.type === 'wishlist' ? `w${item.id}` : `p${item.id}`);
    if (item.type === 'wishlist') {
      pushDrawer('wishlist_detail');
    } else {
      pushDrawer('product_detail');
    }
  };

  const handleChatEntry = (chat: any) => {
    setActiveChat({
      id: chat.id.toString(),
      name: chat.name,
      type: chat.type === 'topic' ? 'topic' : 'group_buy',
      avatar: chat.avatar || `https://ui-avatars.com/api/?name=${chat.name}&background=random&color=fff`,
      memberCount: chat.left ? 100 - chat.left : 1000
    });
    pushDrawer('chat_room');
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-black relative">
      {/* Search Bar */}
      <div className="px-3 py-2 bg-white dark:bg-[#1C1C1E] sticky top-0 z-10 border-b border-gray-100 dark:border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('square.search_placeholder')}
            className="w-full bg-gray-100 dark:bg-white/8 text-gray-800 dark:text-gray-200 text-[14px] rounded-2xl py-2 pl-9 pr-4 outline-none placeholder:text-gray-500 dark:placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 mb-4">
          <h3 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-500" />
            {t('square.official_rec')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-lg p-3 rounded-[24px] border border-white/40 dark:border-white/10 cursor-pointer active:scale-95 transition-all duration-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-[14px] font-bold text-gray-900 dark:text-white mb-0.5">{t('square.official_activity')}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t('square.official_activity_desc')}</div>
            </div>
            <div 
              onClick={() => pushDrawer('lounge')}
              className="bg-white/40 dark:bg-white/5 backdrop-blur-lg p-3 rounded-[24px] border border-white/40 dark:border-white/10 cursor-pointer active:scale-95 transition-all duration-200 shadow-sm"
            >
              <div className="w-10 h-10 bg-purple-500/10 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-[14px] font-bold text-gray-900 dark:text-white mb-0.5">{t('square.official_community')}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t('square.official_community_desc')}</div>
            </div>
          </div>
        </div>

        <div className="px-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5 uppercase tracking-tight">
              <Flame className="w-4 h-4 text-orange-500" />
              {t('square.c2w_wishlist')}
            </h3>
            <button 
              onClick={() => setActiveDrawer('all_group_buy')}
              className="text-[12px] text-[#E8450A] font-bold flex items-center"
            >
              {t('common.all')} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {GROUP_BUY_DATA.map(item => (
              <div 
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="w-full bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-[24px] shadow-sm border border-white/40 dark:border-white/10 p-3 cursor-pointer active:scale-[0.98] transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
                      <img 
                        src={`https://picsum.photos/seed/${item.id}/200/200`} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 truncate">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter border backdrop-blur-md shrink-0 ${
                          item.type === 'wishlist' 
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                            : 'bg-[#E8450A]/10 text-[#E8450A] border-[#E8450A]/20'
                        }`}>
                          {t(item.tag)}
                        </span>
                        <h4 className="text-[14px] font-black text-gray-900 dark:text-white italic tracking-tight truncate">{t(item.name)}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 font-bold leading-tight">
                        {item.type === 'wishlist' 
                          ? `${t('square.wishlist_prefix')}${item.left * 12}${t('square.wishlist_suffix')}` 
                          : `${t('square.c2w_prefix')}${item.left}${t('square.c2w_suffix')}`
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleActionClick(e, item)}
                    className={`ml-3 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all shadow-md active:scale-90 border whitespace-nowrap ${
                      item.type === 'wishlist'
                        ? joinedWishlist.includes(item.id)
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'text-white border-white/20'
                    }`}
                    style={item.type !== 'wishlist' ? { background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' } : {}}
                  >
                    {item.type === 'wishlist' 
                      ? joinedWishlist.includes(item.id) ? t('square.in_wishlist') : t('square.want')
                      : t('square.participate')
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              {t('square.topics')}
            </h3>
            <button 
              onClick={() => setActiveDrawer('all_topics')}
              className="text-[12px] text-[#E8450A] font-medium flex items-center"
            >
              {t('common.all')} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {TOPICS.slice(0, 3).map(topic => (
              <div 
                key={topic.id}
                onClick={() => handleChatEntry({ ...topic, type: 'topic' })}
                className={`w-full ${topic.bg} dark:bg-white/5 backdrop-blur-md rounded-[24px] p-4 border border-white/40 dark:border-white/10 cursor-pointer active:scale-[0.98] transition-all duration-200 flex items-center justify-between shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1C1C1E] bg-gray-200 overflow-hidden shrink-0 shadow-sm">
                        <img src={`https://ui-avatars.com/api/?name=U${i}&background=random&size=64`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className={`text-[15px] font-bold ${topic.color}`}># {t(topic.name)}</div>
                    <div className="text-[11px] text-gray-500 font-medium italic">{t('square.hot_chatting')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400 font-bold">{topic.count}</span>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fan Feeds Section */}
        <div className="px-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-gray-800 dark:text-gray-200">
              {t('square.feeds')}
            </h3>
            <button 
              onClick={() => pushDrawer('my_feeds')}
              className="w-9 h-9 bg-white/40 dark:bg-white/10 backdrop-blur-md text-[#E8450A] rounded-full flex items-center justify-center active:scale-90 transition-all duration-200 shadow-sm border border-white/40 dark:border-white/10 group"
              title={t('feed.post_title')}
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          {[1, 2, 3, 4, 5].map(i => (
            <FeedCard 
              key={i} 
              i={i} 
              onMediaClick={(type, url) => setPreviewMedia({ type, url })}
            />
          ))}
          
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#E8450A] border-t-transparent rounded-full animate-spin opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Media Preview Overlay */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setPreviewMedia(null)}
        >
          <button 
            className="absolute top-10 right-6 text-white/60 hover:text-white transition-colors"
            onClick={() => setPreviewMedia(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          {previewMedia.type === 'image' ? (
            <img 
              src={previewMedia.url} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" 
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div 
              className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={previewMedia.url} alt="Video Cover" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 shadow-xl scale-110">
                  <Play className="w-10 h-10 fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-[#E8450A]" />
                </div>
                <div className="flex justify-between text-white/60 text-[12px] font-bold">
                  <span>0:15</span>
                  <span>0:45</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

