import { UserPlus, MessageSquare, Phone, Plus, Search } from 'lucide-react';
import { motion } from 'motion/react';

const favorites = [
  {
    id: '1',
    name: 'Elena Vance',
    status: 'Active now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    online: true
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    status: 'Active now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusT',
    online: true
  },
  {
    id: '3',
    name: 'Sarah Chen',
    status: 'Away',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC',
    online: false
  }
];

const contactList = [
  {
    letter: 'A',
    contacts: [
      { id: 'a1', name: 'Aaron Sterling', role: 'Creative Director at Meta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron' },
      { id: 'a2', name: 'Alicia Keys', role: 'UX Researcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alicia' }
    ]
  },
  {
    letter: 'B',
    contacts: [
      { id: 'b1', name: 'Ben Thompson', role: 'Strategy Analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ben' }
    ]
  },
  {
    letter: 'D',
    contacts: [
      { id: 'd1', name: 'David Gandy', role: 'Fashion Consultant', initials: 'D' },
      { id: 'd2', name: 'Diana Prince', role: 'Museum Curator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana' }
    ]
  }
];

export default function ContactsView() {
  return (
    <div className="p-12 max-w-6xl mx-auto space-y-12 relative">
      {/* Quick Actions / Top Favorites */}
      <section>
        <h3 className="font-headline text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-6">Recent Interactions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map(fav => (
            <motion.div 
              key={fav.id}
              whileHover={{ y: -4 }}
              className="group bg-surface-container-lowest p-6 rounded-xl transition-all duration-300 hover:shadow-[0px_12px_32px_rgba(67,60,238,0.08)] cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={fav.avatar} 
                    className="w-14 h-14 squircle object-cover" 
                    alt={fav.name}
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-surface-container-lowest rounded-full ${fav.online ? 'bg-secondary' : 'bg-outline-variant/30'}`}></span>
                </div>
                <div className="overflow-hidden">
                  <p className="font-headline font-bold text-on-surface truncate">{fav.name}</p>
                  <p className="text-xs text-on-surface-variant">{fav.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          <motion.div 
            whileHover={{ y: -4 }}
            className="group bg-surface-container-lowest p-6 rounded-xl transition-all duration-300 hover:shadow-[0px_12px_32px_rgba(67,60,238,0.08)] cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 squircle bg-secondary-container flex items-center justify-center">
                  <Plus className="w-6 h-6 text-on-secondary-container" />
                </div>
              </div>
              <div>
                <p className="font-headline font-bold text-primary">New Contact</p>
                <p className="text-xs text-on-surface-variant">Invite someone</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alphabetical List Section */}
      <section className="space-y-10">
        {contactList.map(group => (
          <div key={group.letter} className="space-y-4">
            <div className="flex items-center gap-4">
              <h4 className="font-headline text-3xl font-black text-primary/20">{group.letter}</h4>
              <div className="h-[1px] flex-grow bg-surface-container"></div>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {group.contacts.map(contact => (
                <motion.div 
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    {contact.avatar ? (
                      <img 
                        src={contact.avatar} 
                        className="w-12 h-12 squircle object-cover shadow-sm" 
                        alt={contact.name}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 squircle bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-headline">
                        {contact.initials}
                      </div>
                    )}
                    <div>
                      <h5 className="font-headline font-bold text-on-surface text-base">{contact.name}</h5>
                      <p className="text-sm text-on-surface-variant font-body">{contact.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-primary hover:bg-white rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:bg-white rounded-lg transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-12 right-12 bg-primary text-on-primary p-4 rounded-2xl shadow-[0px_8px_24px_rgba(67,60,238,0.3)] flex items-center gap-3 z-50"
      >
        <UserPlus className="w-6 h-6" />
        <span className="font-headline font-bold pr-2">Add Contact</span>
      </motion.button>

      {/* Side Directory Scroll */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 py-4 px-2 rounded-full bg-surface-container-lowest/50 backdrop-blur-md shadow-sm z-40 hidden xl:flex">
        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '...', 'Z'].map(l => (
          <span key={l} className={`text-[10px] font-headline font-bold cursor-pointer hover:scale-125 transition-transform ${['A', 'D'].includes(l) ? 'text-primary' : 'text-on-surface-variant'}`}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
