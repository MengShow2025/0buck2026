import React from 'react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black mb-8 text-center uppercase tracking-tighter">0Buck Frontend-Backend Linkage Strategy</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Frontend Layer */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-[var(--wa-teal)] flex flex-col items-center">
          <div className="w-12 h-12 bg-[var(--wa-teal)] rounded-full flex items-center justify-center text-white mb-4">
            <span className="font-bold">UI</span>
          </div>
          <h2 className="font-black text-lg mb-2">Frontend Drawer</h2>
          <p className="text-xs text-gray-500 text-center italic">Checkout, Settings, AI Butler</p>
          <div className="mt-4 w-full h-px bg-gray-100" />
          <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Calls Hooks</p>
        </div>

        {/* Sync/Mock Layer */}
        <div className="bg-orange-500/10 p-6 rounded-3xl border-2 border-orange-500 border-dashed flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white mb-4">
            <span className="font-bold">API</span>
          </div>
          <h2 className="font-black text-lg mb-2 text-orange-600">Service Layer</h2>
          <p className="text-xs text-orange-800 text-center italic font-bold">mockApi.ts / hooks/useApi.ts</p>
          <div className="mt-4 w-full h-px bg-orange-200" />
          <p className="mt-4 text-[10px] text-orange-400 font-bold uppercase tracking-widest">Handles State Sync</p>
        </div>

        {/* Real Backend (Future) */}
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border-2 border-gray-600 flex flex-col items-center text-white">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white mb-4 opacity-50">
            <span className="font-bold">DB</span>
          </div>
          <h2 className="font-black text-lg mb-2 opacity-50">Real Backend</h2>
          <p className="text-xs text-gray-400 text-center italic">Shopify, Node.js, DB</p>
          <div className="mt-4 w-full h-px bg-gray-700" />
          <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Future Integration</p>
        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-[40px] shadow-2xl max-w-2xl mx-auto border border-gray-100">
        <h3 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-2">
          <span className="w-2 h-8 bg-[var(--wa-teal)] rounded-full" />
          Why a "Service Layer"?
        </h3>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">1</div>
            <div>
              <p className="font-black text-[15px]">Isolation of Concerns</p>
              <p className="text-sm text-gray-500 leading-snug">The UI doesn't care if the data comes from a local Mock or a real Server. We just swap the service internals later.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">2</div>
            <div>
              <p className="font-black text-[15px]">AI Execution Consistency</p>
              <p className="text-sm text-gray-500 leading-snug">When AI says "Check-in successful!", it triggers the Service Layer, which updates the Global Context. No more "fake" talk.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">3</div>
            <div>
              <p className="font-black text-[15px]">Fast Frontend Iteration</p>
              <p className="text-sm text-gray-500 leading-snug">We can finish the entire interaction loop (Checkout &rarr; Payment &rarr; Order Status) without waiting for backend development.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
