import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchMinimaxChat } from '../services/minimaxService';

export default function AIButlerMobile({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; hasProduct?: boolean }[]>([
    { role: 'ai', text: "Hello! I've been monitoring the marketplace. Are you looking for anything specific today? I found a price drop on your wishlist item." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Custom butler name logic from local storage
  const [butlerName, setButlerName] = useState(() => localStorage.getItem('butlerName') || '0Buck Butler');

  useEffect(() => {
    const handleNameChange = (e: CustomEvent) => setButlerName(e.detail);
    window.addEventListener('butlerNameChanged', handleNameChange as EventListener);
    return () => window.removeEventListener('butlerNameChanged', handleNameChange as EventListener);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userText = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const responseText = await fetchMinimaxChat(
        [{ role: 'user', content: userText }],
        butlerName
      );
      
      const isBuyingIntent = /推荐|buy|购买|look|想要/i.test(userText);
      setMessages(prev => [...prev, { role: 'ai', text: responseText, hasProduct: isBuyingIntent }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to the network." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-app-container w-full min-h-screen bg-background text-on-surface font-body">
      
{/*  Top Navigation Anchor (From JSON)  */}
<header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-6 py-4 w-full shadow-2xl shadow-orange-900/10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden bg-orange-600/20 p-0.5 border border-orange-500/30">
<img className="w-full h-full object-cover rounded-full" data-alt="Futuristic glowing AI butler avatar with neon orange accents and metallic textures in a sleek profile view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH_AzwRa6elqYOeo-03mGhxGHJk8oEveBkUokkHes_KMFhPFpxTrdbcrnCcDNTAEtiBDInxLnGwGlc5zxdHW1Nc_jPHIOC4FCoM123k3WQW1ExRPZ3aYEyrv5LJPfEKpPfqeLUEpbM3XoSU1jBGKvy8RAiloSCDbj7prTZn_2rfZGzmLzsBEufooUPgPZdGuLWqfD6-_0M9T8d3OdkqPo0skWQb2Ph8nTGeYzVuoaAuovMh3ce57584vaEy9Rqp1gu8i3WeR3hRpKn"/>
</div>
        <span className="text-orange-500 font-black tracking-tighter font-['Plus_Jakarta_Sans'] tracking-tight font-bold text-xl">{butlerName}</span>
      </div>
<button className="text-zinc-400 hover:bg-white/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
<span className="material-symbols-outlined">more_vert</span>
</button>
</header>
{/*  Sub-Header Scroll & Activity Banner  */}
<div className="fixed top-[72px] w-full z-40 bg-zinc-950/90 backdrop-blur-md pt-4">
{/*  Horizontal Recommended Products  */}
<div className="px-6 mb-4">
<h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">Instant Recommendations</h3>
<div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
{/*  Card 1  */}
<div className="flex-shrink-0 w-32 bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5">
<img className="w-full h-24 object-cover" data-alt="Premium wireless noise-cancelling headphones on a sleek dark surface with warm rim lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKavgDDmP0kRC2JJu_i6v3cqq-hsZlKjvzI7Xz-WlTFeZmczW0XZ9iYGYIi_e0I8Pqbh0DV7rOgN0ulbQ3XsyFSGf8ABr2MuAX6nWdcANvNeLxyXqRXk2tnm_YYyMzGZCAKTF9uYzYmlAtooh72q7qj6MwC4tBvz6A4ksCn644LzuxA8sPYy5Ye2Dm-8cBqhDb3b-Kpa-aQxg5OU8ObhKxVA4Q_MK4T2Sp9KF_RdS4d55Y8GH5DiVXfmydsjbWJFOghXDfj76vhndB"/>
<div className="p-2">
<p className="text-[10px] text-zinc-400 truncate">H-Series Pods</p>
<p className="text-orange-500 font-bold text-sm">$0.00</p>
</div>
</div>
{/*  Card 2  */}
<div className="flex-shrink-0 w-32 bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5">
<img className="w-full h-24 object-cover" data-alt="Minimalist luxury designer watch with a black leather strap and chrome dial in dramatic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpfG2nDFc_M8Alud1K6KU0x7DVmaBvj88zvrh0hGPXk2rbUjf91-dp3ELk-LF0nf63Qpq2UpR4Uzl69mm-QszYUJEZOcA3xbEMBjcMDz2puzFgWLRZo2KiTwrXTMdu5QYLYBr9IYLtVzCQdMRrPz2BV3PgCNvBomB2HrIKzDyz68yAIigNUp9c0bAmXeIPJ-noSxbPF6IcyVsgorOgWUfkj-6F0e4H68owiw3GLPHsbsMqThsJNvYJRGbM1wQoQdqxacEE9ajCslA7"/>
<div className="p-2">
<p className="text-[10px] text-zinc-400 truncate">Vortex Time</p>
<p className="text-orange-500 font-bold text-sm">$0.00</p>
</div>
</div>
{/*  Card 3  */}
<div className="flex-shrink-0 w-32 bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5">
<img className="w-full h-24 object-cover" data-alt="High-end mechanical gaming keyboard with orange backlighting and matte black keycaps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY839_u3ZE93F25iCabz77YB9yYN9FT2hirvp8zeI773lh2xat_SBHDok4LsLC1S3LLxp6aJ93uTOb7K0ugT4AcAj1aqcx-7pYIVgtYEfwalyO9wzh9yD8C71NTisyxFmPEyuSvpCnxtXYqMO2Wg_1_sT6gD-3L5glBTbA8ro4l0cB1XlXnrBESpO3nphdU7owkETWADpS3neTj4yGOQEvLuZyx_qyRbNEtZSUOmAML-sdtJtx_TvofWdshUI7u27XxKIZgVcgdI5A"/>
<div className="p-2">
<p className="text-[10px] text-zinc-400 truncate">Tactile Pro</p>
<p className="text-orange-500 font-bold text-sm">$0.00</p>
</div>
</div>
</div>
</div>
{/*  Activity Banner  */}
<div className="mx-6 mb-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
<div className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
</div>
<div className="flex flex-col">
<span className="text-orange-500 text-xs font-bold font-headline tracking-wide uppercase">Live Activity</span>
<span className="text-zinc-300 text-[11px]">Butler is searching for 0-buck deals...</span>
</div>
</div>
</div>
      {/*  Chat Feed  */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto pt-[280px] pb-32 px-6 space-y-6 hide-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end self-end max-w-[85%] ml-auto' : 'items-start max-w-[85%]'}`}>
            <div className={`p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'chat-bubble-user text-white font-medium shadow-lg shadow-orange-900/20' 
                : 'chat-bubble-ai text-zinc-200'
            }`}>
              {msg.text}
            </div>
            
            {msg.role === 'ai' && msg.hasProduct && (
              <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-orange-500/30 orange-glow w-full max-w-[280px] mt-3">
                <img className="w-full h-40 object-cover" data-alt="Product" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa4T4zdmt75J_utgYh9NJYu2Bl3bCZY-VGy7MToPbtKELe1aRzvP8J9LIdmSP35xDsWAylr3aIp-XsDAdA816fiIugmMjsAwb9ztP7XQ5075Xb_v8J7ah8Xt2Icshl4nw54ycUbJGoI3UbhnBJpRCAceZirLyo2Hhw6sSpn3-jC8h33d7RYh5sjOvekPGMg6GHEpHD_D04z-_12-zGCKGYstJo08m15BiaktUBJWzVOdJntj2THPu7-Az51FhYhgAQg_fiwRixRkXH"/>
                <div className="p-4 bg-zinc-900">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline font-bold text-white leading-tight">AeroSit Pro X</h4>
                    <span className="text-orange-500 font-black text-lg">$0.00</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mb-4 leading-normal">Carbon fiber frame with adaptive lumbar support. Limited inventory.</p>
                  <button className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95">
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            <span className={`text-[10px] text-zinc-600 mt-1 uppercase tracking-widest font-medium ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
              {msg.role === 'user' ? 'You' : butlerName} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="chat-bubble-ai p-4 text-sm text-zinc-200 leading-relaxed flex gap-1">
              <span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span><span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}
        
        <div className="h-20"></div>
      </main>
{/*  Bottom Navigation & Input Shell  */}
<div className="fixed bottom-0 left-0 w-full z-50">
{/*  Floating Input Bar  */}
<div className="px-4 pb-4">
<div className="bg-zinc-900/90 backdrop-blur-2xl rounded-[28px] p-2 flex items-center gap-2 border border-white/5 shadow-2xl">
<div className="flex items-center gap-1">
<button className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-orange-500 transition-colors">
<span className="material-symbols-outlined">add_a_photo</span>
</button>
<button className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-orange-500 transition-colors">
<span className="material-symbols-outlined">mic</span>
</button>
</div>
<input 
            className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:ring-0 text-sm py-2" 
            placeholder="Ask your Butler..." 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-full active:scale-90 transition-transform"
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
          >
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>send</span>
</button>
</div>
</div>
{/* spacer for bottom nav */}
<div className="h-10"></div>
</div>

    </div>
  );
}
