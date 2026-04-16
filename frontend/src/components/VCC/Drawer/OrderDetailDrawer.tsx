import React from 'react';
import { MapPin, CreditCard, Clock, ChevronRight, Copy, Truck, ExternalLink, ShieldCheck, HelpCircle, Package, ArrowLeft, Gift } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const OrderDetailDrawer: React.FC = () => {
  const { pushDrawer, popDrawer, setAiInput, setActiveChat, setActiveDrawer, t } = useAppContext();

  // Mock order detail data
  const order = {
    id: 'ORD-20260409-1A',
    status: 'in_transit',
    date: '2026-04-09 14:22:15',
    address: {
      name: 'Long Zhang',
      phone: '+86 138****8888',
      fullAddress: 'No. 88, West Lake Avenue, Xihu District, Hangzhou, Zhejiang, China'
    },
    payment: {
      method: 'Apple Pay',
      subtotal: '149.95',
      shipping: '0.00',
      discount: '-15.00',
      total: '134.95'
    },
    tracking: {
      number: 'YT123456789',
      carrier: 'YunExpress',
      status: 'Out for delivery'
    },
    items: [
      {
        id: 'item-1',
        title: 'Artisan Crafted Wireless Earbuds',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
        price: '29.99',
        quantity: 5,
        sku: 'Space Grey / Standard'
      }
    ]
  };

  const handleAfterSales = () => {
    // 1. Set the AI input context with the order ID
    setAiInput(`Hi AI Butler, I need help with order #${order.id}.`);
    
    // 2. Set the active chat to the AI Butler
    setActiveChat({
      id: 'ai_butler',
      name: 'AI Butler',
      type: 'private',
      avatar: 'https://ui-avatars.com/api/?name=AI+Butler&background=FF5722&color=fff'
    });

    // 3. Switch to the chat room drawer
    setActiveDrawer('chat_room');
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#000000] p-5 space-y-4 pb-24 overflow-y-auto no-scrollbar">
      {/* 1. Status Hero Section */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
          <Truck className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-[20px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('order.package_in_transit')}</h3>
        <p className="text-[12px] text-gray-500 font-medium">{t('order.expected_arrival')}: Tomorrow, April 10</p>
      </div>

      {/* 2. Tracking Quick Link (Clickable to Map) */}
      <div 
        onClick={() => pushDrawer('order_tracking')}
        className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-500">
            <MapPin className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <div className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('order.track_on_map')}</div>
            <div className="text-[11px] text-blue-500 font-bold">{order.tracking.status}</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>

      {/* 3. Shipping Address */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5" /> {t('order.shipping_address')}
        </div>
        <div className="space-y-1">
          <div className="text-[14px] font-black text-gray-900 dark:text-white">{order.address.name} <span className="text-gray-400 font-medium ml-2">{order.address.phone}</span></div>
          <p className="text-[12px] text-gray-500 leading-relaxed font-medium">{order.address.fullAddress}</p>
        </div>
      </div>

      {/* 4. Product List */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5 pb-3">
          <Package className="w-3.5 h-3.5" /> {t('order.order_items')}
        </div>
        {order.items.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner">
              <img src={item.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-[14px] font-black text-gray-900 dark:text-white line-clamp-1 leading-tight mb-1">{item.title}</h4>
              <div className="text-[11px] text-gray-400 font-bold mb-1">{item.sku}</div>
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-black text-[var(--wa-teal)]">${item.price}</span>
                <span className="text-[12px] text-gray-500 font-black">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Payment Summary */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-widest">
          <CreditCard className="w-3.5 h-3.5" /> {t('order.payment_summary')}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[13px] font-medium text-gray-500">
            <span>{t('order.subtotal')}</span>
            <span className="text-gray-900 dark:text-white font-black">${order.payment.subtotal}</span>
          </div>
          <div className="flex justify-between text-[13px] font-medium text-gray-500">
            <span>{t('order.shipping_cost')}</span>
            <span className="text-green-500 font-black">{t('order.free_shipping')}</span>
          </div>
          <div className="flex justify-between text-[13px] font-medium text-gray-500">
            <span>{t('order.discounts')}</span>
            <span className="text-red-500 font-black">{order.payment.discount}</span>
          </div>
          <div className="h-px bg-gray-50 dark:bg-white/5 w-full my-1" />
          <div className="flex justify-between text-[16px] font-black">
            <span className="text-gray-900 dark:text-white">{t('order.total_amount')}</span>
            <span className="text-[var(--wa-teal)] tracking-tighter">${order.payment.total}</span>
          </div>
        </div>
        <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-tight">
          <span>{t('order.payment_method')}</span>
          <span className="text-gray-600 dark:text-gray-200">{order.payment.method}</span>
        </div>
      </div>

      {/* 6. Order Metadata */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-gray-400 font-black uppercase tracking-widest">{t('order.order_number')}</span>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-black">
            {order.id} <Copy className="w-3.5 h-3.5 cursor-pointer active:scale-90" />
          </div>
        </div>
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-gray-400 font-black uppercase tracking-widest">{t('order.order_time')}</span>
          <span className="text-gray-900 dark:text-white font-bold">{order.date}</span>
        </div>
      </div>

      {/* 7. Action Footer Buttons */}
      <div className="pt-4 space-y-3">
        {order.status !== 'in_transit' && (
          <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-2xl flex items-center gap-2 animate-pulse">
            <Gift className="w-4 h-4 text-orange-600" />
            <span className="text-[11px] font-black text-orange-600 uppercase">{t('order.confirm_rebate_note')}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleAfterSales}
            className="bg-white dark:bg-white/5 text-gray-600 dark:text-white text-[13px] font-semibold py-4 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> {t('order.after_sales')}
          </button>
          <button className="text-white text-[13px] font-semibold py-4 rounded-[22px] active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #FF7A3D 0%, #E8450A 100%)', boxShadow: '0 4px 14px rgba(232,69,10,0.30)' }}>
            <ShieldCheck className="w-4 h-4" /> {t('order.confirm_receipt')}
          </button>
        </div>
      </div>
    </div>
  );
};