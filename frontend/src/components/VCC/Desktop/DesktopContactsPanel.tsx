import React, { useState } from 'react';
import { Search, Users, ChevronRight, UserPlus, Clock, MessageCircle, Star, UserCheck, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useAppContext } from '../AppContext';

const NEW_FRIENDS = [
  { id: 'nf1', name: 'Lorna K.',      msg: 'Hi, this is Lorna. Please add me.', status: 'pending', initials: 'L', bg: 'bg-pink-500' },
  { id: 'nf2', name: 'Jessie T.',     msg: 'Hi, I am Jessie from BEA',  status: 'expired', initials: 'J', bg: 'bg-blue-500' },
  { id: 'nf3', name: 'GTJA Support',  msg: '24/7 AI + Human support',    status: 'added',   initials: 'G', bg: 'bg-green-600' },
  { id: 'nf4', name: 'Fine Wine Club',msg: 'Get 100 points for $100 spent', status: 'expired', initials: 'W', bg: 'bg-purple-500' },
];

const CONTACTS = [
  { id: 'c1', name: 'Alex Design',   initials: 'A', bg: 'bg-indigo-500', online: true,  note: 'Gadget enthusiast', mutual: 3 },
  { id: 'c2', name: 'Carl Tech',     initials: 'C', bg: 'bg-blue-500',   online: true,  note: 'Tech expert',       mutual: 1 },
  { id: 'c3', name: 'Geek Master',   initials: 'G', bg: 'bg-green-600',  online: false, note: 'Hardware lover',    mutual: 5 },
  { id: 'c4', name: 'Lorna Tech',    initials: 'L', bg: 'bg-pink-500',   online: false, note: 'Style creator',     mutual: 2 },
  { id: 'c5', name: 'Vortex Fan',    initials: 'V', bg: 'bg-orange-500', online: true,  note: 'Early user',        mutual: 7 },
];

export const DesktopContactsPanel: React.FC = () => {
  const { pushDrawer, setActiveChat } = useAppContext();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(CONTACTS[0]);
  const [newFriendsOpen, setNewFriendsOpen] = useState(true);

  const filtered = CONTACTS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const handleMessage = (contact: typeof CONTACTS[0]) => {
    setActiveChat({ id: contact.id, name: contact.name, type: 'private' });
    pushDrawer('chat_room');
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Contact list */}
      <aside className="w-[280px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-[#0D0D0F]">
        {/* Search */}
        <div className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-white dark:bg-zinc-800 rounded-xl pl-8 pr-3 py-2 text-[12px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none border border-zinc-200 dark:border-zinc-700 focus:border-orange-400 transition-colors"
            />
          </div>
        </div>

        {/* Shortcuts */}
        <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          {[
            { label: 'My Groups', icon: <Users className="w-4 h-4 text-indigo-500" />, badge: '1' },
            { label: 'Discover Friends', icon: <Search className="w-4 h-4 text-green-500" />, badge: '99+', drawer: 'all_fan_feeds' as const },
            { label: 'My Feeds', icon: <Clock className="w-4 h-4 text-orange-500" />,  badge: '8',   drawer: 'my_feeds' as const },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.drawer && pushDrawer(item.drawer)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-semibold">{item.badge}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
              </div>
            </button>
          ))}
        </div>

        {/* New friends */}
        <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => setNewFriendsOpen(!newFriendsOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-600 transition-colors"
          >
            <span>New Friends</span>
            {newFriendsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {newFriendsOpen && (
            <div className="space-y-1 mt-1">
              {NEW_FRIENDS.slice(0, 2).map(nf => (
                <div key={nf.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                  <div className={`w-8 h-8 rounded-xl ${nf.bg} flex items-center justify-center text-white font-black text-[11px] shrink-0`}>
                    {nf.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">{nf.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{nf.msg}</div>
                  </div>
                  {nf.status === 'pending' && (
                    <button className="text-[10px] font-black text-white px-2 py-1 rounded-lg shrink-0" style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' }}>
                      Accept
                    </button>
                  )}
                  {nf.status === 'added' && <UserCheck className="w-4 h-4 text-green-500 shrink-0" />}
                  {nf.status === 'expired' && <span className="text-[10px] text-zinc-400 font-semibold shrink-0">Expired</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto px-3 py-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2 mb-2">
            Contacts · {filtered.length}
          </div>
          {filtered.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelected(contact)}
              className={`w-full flex items-center gap-2.5 px-2 py-2.5 rounded-xl transition-colors text-left ${selected.id === contact.id ? 'bg-white dark:bg-white/8' : 'hover:bg-white dark:hover:bg-white/5'}`}
            >
              <div className={`w-9 h-9 rounded-xl ${contact.bg} flex items-center justify-center text-white font-black text-[12px] shrink-0 relative`}>
                {contact.initials}
                {contact.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-50 dark:border-[#0D0D0F]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-zinc-900 dark:text-white truncate">{contact.name}</div>
                <div className="text-[11px] text-zinc-400">{contact.note}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Add friend */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-[13px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' }}
          >
            <UserPlus className="w-4 h-4" /> Add Friend
          </button>
        </div>
      </aside>

      {/* Right: Contact profile */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto pt-12 px-8" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
        {/* Avatar */}
        <div className={`w-20 h-20 rounded-3xl ${selected.bg} flex items-center justify-center text-white font-black text-[28px] shadow-xl mb-4`}>
          {selected.initials}
        </div>
        <h2 className="text-[22px] font-black text-zinc-900 dark:text-white mb-1">{selected.name}</h2>
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`w-2 h-2 rounded-full ${selected.online ? 'bg-green-500' : 'bg-zinc-400'}`} />
          <span className="text-[12px] text-zinc-400">{selected.online ? 'Online' : 'Offline'}</span>
        </div>
        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-1">{selected.note}</p>
        <div className="flex items-center gap-1.5 mb-6">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[12px] text-zinc-400">{selected.mutual} mutual friends</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full max-w-xs mb-8">
          <button
            onClick={() => handleMessage(selected)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold text-[14px] shadow-md active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)' }}
          >
            <MessageCircle className="w-4 h-4" /> Message
          </button>
          <button
            onClick={() => pushDrawer('user_profile')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-[14px] hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" /> View Profile
          </button>
        </div>

        {/* Info cards */}
        <div className="w-full max-w-xs space-y-2.5">
          {[
            { label: '0Buck ID', value: `0B-${selected.id.toUpperCase()}` },
            { label: 'Mutual Friends', value: `${selected.mutual}` },
            { label: 'Status',     value: selected.online ? 'Online' : 'Offline' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#18181B] rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-[13px] text-zinc-400">{item.label}</span>
              <span className="text-[13px] font-semibold text-zinc-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
