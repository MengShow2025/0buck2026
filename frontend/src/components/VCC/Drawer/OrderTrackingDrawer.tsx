import React from 'react';
import { MapPin, Truck, ChevronLeft, ChevronRight, Package, Clock, Phone, ExternalLink, Box, Navigation, Info, Copy } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const OrderTrackingDrawer: React.FC = () => {
  const { popDrawer, t } = useAppContext();

  // Mock logistics tracking data (Reference: Taobao Screenshot)
  const tracking = {
    number: 'YT7613567716028',
    carrier: t('notification.yunexpress'),
    phone: '95554',
    status: t('tracking.in_transit'),
    currentLocation: t('tracking.current_location_mock'),
    description: t('tracking.product_desc'),
    productImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200',
    address: {
      name: t('tracking.recipient_name'),
      phone: '135****4247',
      location: t('tracking.recipient_location')
    },
    timeline: [
      { 
        id: 1, 
        time: t('common.yesterday') + ' 20:54', 
        status: t('tracking.in_transit'), 
        desc: t('tracking.timeline_desc_1'), 
        active: true 
      },
      { 
        id: 2, 
        time: t('common.yesterday') + ' 20:53', 
        status: '', 
        desc: t('tracking.timeline_desc_2'), 
        active: false 
      },
      { 
        id: 3, 
        time: t('common.yesterday') + ' 19:43', 
        status: '', 
        desc: t('tracking.timeline_desc_3'), 
        active: false 
      },
      { 
        id: 4, 
        time: t('common.yesterday') + ' 17:02', 
        status: t('tracking.picked_up'), 
        desc: t('tracking.timeline_desc_4'), 
        active: false 
      },
      { 
        id: 5, 
        time: t('common.yesterday') + ' 13:25', 
        status: t('tracking.shipped'), 
        desc: t('tracking.timeline_desc_5'), 
        active: false 
      },
      { 
        id: 6, 
        time: t('common.yesterday') + ' 12:32', 
        status: t('tracking.warehouse_processing'), 
        desc: t('tracking.timeline_desc_6'), 
        active: false 
      },
      { 
        id: 7, 
        time: t('common.yesterday') + ' 09:54', 
        status: t('tracking.warehouse_received'), 
        desc: t('tracking.timeline_desc_7'), 
        active: false 
      },
      { 
        id: 8, 
        time: t('common.yesterday') + ' 09:46', 
        status: t('tracking.order_placed'), 
        desc: t('tracking.timeline_desc_8'), 
        active: false 
      },
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#000000] pb-24 overflow-y-auto no-scrollbar relative">
      {/* 1. Header (Taobao Style) */}
      <div className="bg-white dark:bg-[#1C1C1E] px-5 py-6 flex items-start gap-4 shadow-sm border-b border-gray-100 dark:border-white/5 relative z-10">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-black/20 shrink-0 shadow-sm">
          <img 
            src={tracking.productImage} 
            className="w-full h-full object-cover" 
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[16px] font-black text-gray-900 dark:text-white leading-tight">
                {tracking.status}
              </span>
              <span className="text-[13px] text-gray-500 font-bold">{tracking.currentLocation}</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm active:scale-95 transition-all">
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] text-gray-600 dark:text-gray-300 font-bold">{t('tracking.contact_merchant')}</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 line-clamp-1 leading-relaxed">{tracking.description}</p>
        </div>
      </div>

      {/* 2. Carrier Info (Taobao Style) */}
      <div className="bg-white dark:bg-[#1C1C1E] px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-black">
            YT
          </div>
          <span className="text-[13px] font-black text-gray-800 dark:text-gray-200">{tracking.carrier}</span>
          <span className="text-[13px] font-medium text-gray-500">{tracking.number}</span>
          <button className="text-[11px] text-gray-400 hover:text-blue-500 font-bold ml-1 flex items-center gap-0.5">
            <Copy className="w-3 h-3" /> {t('common.copy')}
          </button>
        </div>
        <div className="text-[11px] text-gray-400 font-bold">{t('tracking.contact_phone')} {tracking.phone}</div>
      </div>

      {/* 3. Detailed Timeline (Taobao Style) */}
      <div className="bg-white dark:bg-[#1C1C1E] px-5 py-6">
        <div className="space-y-0">
          {tracking.timeline.map((node, idx) => (
            <div key={node.id} className="relative flex gap-5 pb-8 group">
              {/* Timeline Line */}
              {idx !== tracking.timeline.length - 1 && (
                <div className="absolute left-[7px] top-6 bottom-0 w-px bg-gray-100 dark:bg-white/10" />
              )}
              
              {/* Timeline Dot */}
              <div className="relative z-10 w-[15px] h-[15px] mt-1.5 flex items-center justify-center">
                <div className={`rounded-full transition-all ${
                  node.active 
                  ? 'w-[15px] h-[15px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' 
                  : 'w-[9px] h-[9px] bg-gray-200 dark:bg-white/20'
                }`} />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline gap-2">
                  {node.status && (
                    <span className={`text-[13px] font-black tracking-tight ${node.active ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
                      {node.status}
                    </span>
                  )}
                  <span className={`text-[12px] font-bold ${node.active ? 'text-orange-500' : 'text-gray-400'}`}>
                    {node.time}
                  </span>
                </div>
                <div className={`text-[12px] leading-relaxed font-medium ${node.active ? 'text-orange-500' : 'text-gray-500'}`}>
                  {node.desc}
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center py-2 text-[12px] text-gray-400 font-bold gap-1 cursor-pointer hover:text-gray-600 transition-colors">
            {t('tracking.collapse')} <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </div>

      {/* 4. Shipping Address Footer (Taobao Style) */}
      <div className="bg-white dark:bg-[#1C1C1E] mt-4 px-5 py-6 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-[12px] font-black text-orange-600">{t('tracking.recipient')}</span>
          </div>
          <div className="space-y-1">
            <div className="text-[14px] font-black text-gray-900 dark:text-white">
              {tracking.address.name}, {tracking.address.phone}
            </div>
            <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
              {tracking.address.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};