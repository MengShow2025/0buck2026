import { Search, Edit3, MoreVertical, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

const activeUsers = [
  { id: '1', name: 'Julian', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian' },
  { id: '2', name: 'Amara', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara' },
  { id: '3', name: 'Marcus', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { id: '4', name: 'Talia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Talia' }
];

const conversations = [
  {
    id: '1',
    name: 'Julian Sterling',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JulianS',
    lastMessage: 'The layout looks incredible, really feeling the editorial vibe!',
    time: '2m',
    unread: true,
    isActive: true
  },
  {
    id: '2',
    name: 'Amara Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmaraC',
    lastMessage: "I'll send over the updated assets by EOD. Let me know what you think.",
    time: '1h'
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusT',
    lastMessage: 'Did you see the latest 0Buck editorial? The typography is wild.',
    time: '4h'
  },
  {
    id: '4',
    name: 'Design Group',
    initials: 'DG',
    lastMessage: 'You: Yes, I agree we should use asymmetrical bubbles.',
    time: 'Yesterday',
    isGroup: true
  }
];

export default function MessagesView() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* List Column */}
      <section className="w-full md:w-[400px] bg-background flex flex-col overflow-y-auto no-scrollbar border-r border-outline-variant/5">
        <div className="px-8 py-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center justify-between">
            Active Now
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          </h3>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {activeUsers.map(user => (
              <div key={user.id} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-14 h-14 rounded-[18px] object-cover group-hover:scale-105 transition-transform border-2 border-transparent group-hover:border-primary/20"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-background"></div>
                </div>
                <span className="text-xs font-semibold text-on-surface">{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2">
          <h3 className="px-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Recent</h3>
          <div className="space-y-1">
            {conversations.map(conv => (
              <div 
                key={conv.id}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer group ${
                  conv.isActive ? 'bg-surface-container-low' : 'hover:bg-surface-container'
                }`}
              >
                <div className="relative flex-shrink-0">
                  {conv.isGroup ? (
                    <div className="w-12 h-12 rounded-[16px] bg-secondary-container flex items-center justify-center text-on-secondary-container font-headline font-black text-xs">
                      {conv.initials}
                    </div>
                  ) : (
                    <img 
                      src={conv.avatar} 
                      alt={conv.name} 
                      className={`w-12 h-12 rounded-[16px] object-cover transition-all ${
                        !conv.isActive ? 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={`font-headline font-bold text-sm truncate ${
                      conv.isActive ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'
                    }`}>
                      {conv.name}
                    </h4>
                    <span className={`text-[10px] font-bold ${conv.unread ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {conv.time}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${conv.unread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State / Detail Area */}
      <section className="hidden lg:flex flex-1 bg-surface-container-low items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-primary/10 rounded-full blur-3xl absolute -top-4 -left-4"></div>
            <div className="w-32 h-32 bg-secondary/10 rounded-full blur-3xl absolute -bottom-4 -right-4"></div>
            <div className="relative w-48 h-48 bg-surface-container-lowest rounded-[40px] shadow-2xl shadow-primary/5 flex items-center justify-center">
              <MessageSquare className="w-16 h-16 text-primary/40 fill-current" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">Select a conversation</h2>
            <p className="text-on-surface-variant leading-relaxed">Choose one of your existing dialogues or start a new editorial stream to begin your fluid conversation experience.</p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-headline font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              New Message
            </button>
            <button className="px-8 py-3 bg-surface-container-lowest text-primary rounded-xl font-headline font-bold text-sm hover:bg-surface-container-low transition-all">
              View Contacts
            </button>
          </div>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-surface-container-lowest/40 backdrop-blur-md border border-outline-variant/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mt-12">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            End-to-End Encrypted Editorial
          </div>
        </div>
      </section>
    </div>
  );
}
