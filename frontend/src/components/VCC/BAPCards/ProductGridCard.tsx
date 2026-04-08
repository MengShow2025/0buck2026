import React from 'react';
import { Package, Info } from 'lucide-react';

interface ProductGridProps {
  data: {
    title: string;
    price: number;
    original_price: number;
    physical_verification: { 
      weight_kg: number; 
      dimensions_cm: string 
    };
    image_url: string;
  };
}

export const ProductGridCard: React.FC<ProductGridProps> = ({ data }) => {
  return (
    <div className="w-[280px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 my-1 self-start rounded-tl-none relative group transition-all">
      
      {/* Top Image Banner */}
      <div className="w-full h-52 bg-gray-100 relative">
        <img src={data.image_url} alt={data.title} className="w-full h-full object-cover" />
        
        {/* Physical Verification Overlay - Crucial for "Artisan" trust */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-md">
          <span className="text-[10px]">⚖️</span> {data.physical_verification.weight_kg}kg Verified
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-3 bg-white">
        <h3 className="font-semibold text-gray-900 leading-tight mb-1 text-[15px] line-clamp-2">{data.title}</h3>
        
        <p className="text-[11px] text-gray-500 mb-3 flex items-center gap-1">
          <Package className="w-3 h-3" /> {data.physical_verification.dimensions_cm}
        </p>
        
        <div className="flex justify-between items-baseline mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-[var(--wa-teal)] leading-none">${data.price.toFixed(2)}</span>
            <span className="text-[11px] text-gray-400 line-through mt-0.5">${data.original_price.toFixed(2)}</span>
          </div>
          
          <div className="text-[10px] text-orange-600 font-bold bg-orange-100 px-1.5 py-0.5 rounded">
            100% BACK
          </div>
        </div>
        
        {/* CTA Button */}
        <button className="w-full py-2.5 bg-[#FFF0EB] text-[var(--wa-teal)] font-bold text-sm rounded-lg border border-[#FFD9CD] active:bg-[#FFE0D3] transition-colors shadow-sm">
          Check out & Earn Rewards
        </button>
      </div>
    </div>
  );
};
