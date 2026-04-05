import React from "react";
import { Merchant, Product } from '../types';
import { MerchantCard } from './MerchantCard';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, ShoppingCart, Bell, Terminal, Target, Droplet, BookOpen, 
  Settings, HelpCircle, LogOut, ShieldCheck, AtSign, Truck, Heart, 
  Users, Bot, ChevronRight, Activity, Zap, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

interface FeedViewProps {
  onRequireAuth?: (action: () => void) => void;
  onProductClick?: (product: Product) => void;
}

export default function FeedView({ onRequireAuth, onProductClick }: FeedViewProps) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`flex-1 h-full overflow-hidden flex ${isDark ? 'bg-[#0a0a0a] text-[#fff8f6]' : 'bg-[#fff8f6] text-[#271814]'}`}>
      <style>{`
        .glass-card { 
          background: rgba(255, 255, 255, 0.03); 
          backdrop-filter: blur(80px); 
          border: 1px solid rgba(255, 92, 0, 0.15); 
        }
        .neon-text-orange { text-shadow: 0 0 12px rgba(255, 92, 0, 0.4); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Main Feed Content Area */}
      <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-20 hide-scrollbar relative">
        
        {/* Header Section */}
        <header className="py-16 pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Live Market Stream</span>
          </div>
          <h1 className="font-headline text-6xl font-extrabold tracking-tighter neon-text-orange">Command Feed</h1>
          <p className="text-zinc-500 font-body text-lg mt-4 max-w-2xl leading-relaxed">
            Real-time intelligence dashboard. Synchronizing multi-chain events, logistics tracking, and social interactions.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Notifications Bento Grid Section */}
          <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold tracking-tight">System Alerts</h2>
              <span className="text-xs text-zinc-500 font-mono">12 Events Logged</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* System Security Notif */}
              <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <ShieldCheck className="text-orange-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Security</p>
                    <p className="text-[10px] text-zinc-500">Active Monitoring</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">Quantum-resistant encryption active</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">Protocol layers 0-4 secured via cryptographic heartbeat. Handshake latency: 12ms.</p>
              </div>

              {/* Activity Notif */}
              <div className="glass-card p-6 rounded-3xl relative group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <AtSign className="text-zinc-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mention</p>
                    <p className="text-[10px] text-zinc-500">2m ago</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">User @cryptoking mentioned you</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">"Hey @user, have you seen the liquidity shift on the Ledger dashboard? Might be time to execute..."</p>
                <button className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline">View in Lounge</button>
              </div>

              {/* Logistics Updates - Wide Card */}
              <div className="glass-card p-6 rounded-3xl col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-zinc-900 flex-shrink-0">
                  <img alt="Hardware wallet case" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQHb-ULNgbA3co3PKyR-BfixD9SIilI_xUZT2-wqu_emB6SyUTKXCx_D6eYEa2LF1ZHLFf4oxRkp48pz97aXWzBq0a6pk-IMzPzq4ec--UJODiL9FA5XBAPzsfeMae0bc2silDxxVNl-r8v5HMqh_pN1yfQuI-S3l42oU5hwcCWjZhEkMlonuwxBXpH0a7NNKCnVxp-hSEVE6OwDFS_Ry-QqtDeHnJtPZju7r-jT6FREEEy2tW41YOVwhiKj4xkstFgYk3NYoRyGS_"/>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order Update #TRZ-882</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Trezor Model T Case - Arrived</h3>
                  <p className="text-sm text-zinc-400 mb-4">Package reached the regional sorting center in Zurich. Final mile delivery scheduled for tomorrow.</p>
                  
                  {/* Mini Progress bar */}
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full w-[88%]" style={{ boxShadow: '0 0 10px rgba(255, 92, 0, 0.5)' }}></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-zinc-600 font-mono">Shipped</span>
                    <span className="text-[10px] text-orange-500 font-mono font-bold">In Transit (88%)</span>
                    <span className="text-[10px] text-zinc-600 font-mono">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Standard Notifications List - Wide Card */}
              <div className="glass-card p-6 rounded-3xl col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recent Activity Log</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {/* Standard Notif 1 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="text-sm font-bold text-zinc-200 truncate">Payout Successful</h4>
                        <span className="text-[10px] text-zinc-600 font-mono flex-shrink-0">14m ago</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">Your referral commission of <span className="text-orange-500 font-mono">$120.00</span> has been settled to your ledger.</p>
                    </div>
                  </div>

                  {/* Standard Notif 2 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="text-sm font-bold text-zinc-200 truncate">Flash Node Activated</h4>
                        <span className="text-[10px] text-zinc-600 font-mono flex-shrink-0">1h ago</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">A new high-yield liquidity pool is open for <span className="font-bold text-zinc-300">Microchips</span>. Participation window closes in 12h.</p>
                    </div>
                  </div>

                  {/* Standard Notif 3 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="text-sm font-bold text-zinc-200 truncate">Action Required</h4>
                        <span className="text-[10px] text-zinc-600 font-mono flex-shrink-0">3h ago</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">Please verify your new shipping address for upcoming Tier 2 deliveries.</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors border-t border-white/5">
                  View Full Ledger History
                </button>
              </div>
            </div>
          </section>

          {/* Personal Interests Panel */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <h2 className="font-headline text-2xl font-bold tracking-tight">Intelligence</h2>
            
            {/* Wishlist */}
            <div className="glass-card p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Price Alerts</h3>
                <Heart className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0">
                    <img alt="Product thumbnail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsiqQ2hYfJcl0Vb_A6yS2oo2IGqeXWd6FKmsdzM4lYiX2_BR1NKm3JmnNZ0bML2FEIzHknOyu4EAcTfhIcceP3OTDZZQpibjLCBD792JcYQsmSPrrqr1zzhoL6b9gTFvaEC755rEr6TE7RyByS7-SjRys6Ah51Ic97qCaj04pqkcQ0VRNKZjYRZVDdvBNOG6rxfn61B3o7r6MeeUSVRokTBJmYSXOwBnBHyy-0_OAGD9fEAp3YMFAc-uHzc17VoXnp7VdRhHrVlGAs"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-200">Hyper-React V2</p>
                    <p className="text-xs text-orange-500 font-mono">-15% Drop Today</p>
                  </div>
                  <p className="text-sm font-mono">$189.00</p>
                </div>
                <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0">
                    <img alt="Watch thumbnail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdEKCJJPvu_yFpY0uvmlhvByHCcdSpE5nCE9hA0ACthQ6pHYRsGy5SlVdkvApdH2PH-pNtlrYNWQElJkgGRatAYV57_PPCGYIcWYrLUFMqrJQ60TNixW_RcoZ6-Sdz-CYdMmQu3i7B0wEWw0zoTfPC4g_h4-SNSgK-T7Rl0kjQBx0zN9VulhmD5Kv9mRq9Ylz-c0dOi2WrJevTAmTHzHGBoj8D1d0_53o5JrVMYNhJ-YcVDacrqYlcjtuDxdbBAGsIm8loMerTOHRG"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-200">Titanium Diver</p>
                    <p className="text-xs text-zinc-500 font-mono">Stable Price</p>
                  </div>
                  <p className="text-sm font-mono">$2,450.00</p>
                </div>
              </div>
            </div>

            {/* Crowdfunding Status */}
            <div className="glass-card p-6 rounded-3xl bg-orange-950/20 border-orange-500/30">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Group-funding
              </h3>
              <div className="relative w-full aspect-square flex items-center justify-center mb-4">
                {/* Simple SVG Progress Circle */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle className="text-zinc-800" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-orange-500" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="43.7" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-mono">88%</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Funded</span>
                </div>
              </div>
              <p className="text-center text-sm text-zinc-300 font-medium">Decentralized GPU Cluster v2</p>
              <p className="text-center text-xs text-zinc-500 mt-1">6 hours remaining until batch close</p>
              <button className="w-full mt-6 py-2 bg-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-orange-400 transition-colors">Increase Stake</button>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-[60] group">
        <div className="absolute -top-1 -right-1 z-10 w-4 h-4 bg-orange-600 rounded-full border-2 border-[#0a0a0a] animate-bounce"></div>
        <div className="w-16 h-16 rounded-[2rem] bg-orange-500 flex items-center justify-center cursor-pointer shadow-xl shadow-orange-900/40 hover:scale-110 transition-all duration-300">
          <img alt="Butler AI" className="w-full h-full object-cover rounded-[2rem]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABT_dd85ZZDSp-5xjygPeJxI8_adAh-iiLXkvdxN0QDmCBS-qVYERAjM5k9NZ041NyXVBiQ0nvhnJVYnvgwmZGHwNsS2gYEcvKcvhByYOqcWbnQbqqjh1n0T6MVpO4vXk54YXdqaDlXuuAkx6I0lOx-RC5vSQi1CvtiNU_gqKnMhyGNggIl8OO2MBQrwRYPGVXyS5EzEftmYb5H_bjjhwNtvnfPOpFfjWVz0FkWe-Ta22HmFtg2oHwFOAMJL3hpBZNxyOEldnl0pyV"/>
        </div>
        {/* Tooltip */}
        <div className="absolute right-20 bottom-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <p className="text-xs font-bold text-white">1 New Alert <span className="text-zinc-500 font-normal">from Butler AI</span></p>
        </div>
      </div>
    </div>
  );
}
