import React from 'react';

export const KeyAttributesDrawer: React.FC = () => {
  const attributes = [
    { label: 'Audio Crossover', value: 'Two-way' },
    { label: 'Output Power', value: '0-5W' },
    { label: 'Battery Capacity', value: '1000-2000mah, 1200mAh' },
    { label: 'Feature', value: 'AirPlay, DLNA, Dolby Digita, EZCast, Miracast, Phone Function, Video Call, Wireless Charger for Mobile Phone' },
    { label: 'Material', value: 'Bamboo' },
    { label: 'Channels', value: '2 (2.0)' },
    { label: 'Product Name', value: 'Portable BT Speaker' },
    { label: 'Voice Control', value: 'No' },
    { label: 'Use', value: 'Computer, HOME THEATRE, Karaoke Player, Outdoor, Party, Portable Audio Player, Stage, mobile phone' },
    { label: 'Remote Control', value: 'No' },
    { label: 'Built-in Microphone', value: 'Yes' },
    { label: 'Size', value: '16*16*10cm' },
    { label: 'Number Of Loudspeaker Enclosure', value: '2' },
    { label: 'Tweeter Size', value: '1.1"' },
  ];

  return (
    <div className="bg-[#F2F2F7] dark:bg-black p-6 pb-20">
      <h3 className="text-[14px] font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Product Attributes</h3>
      <div className="divide-y divide-gray-100 dark:divide-white/5 border-t border-gray-100 dark:border-white/5">
        {attributes.map((attr, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1fr] gap-4 py-5 group">
            <span className="text-[13px] text-gray-400 font-bold leading-tight group-hover:text-gray-600 transition-colors uppercase tracking-tighter">{attr.label}</span>
            <span className="text-[13px] text-gray-900 dark:text-gray-300 font-black leading-tight italic">{attr.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
