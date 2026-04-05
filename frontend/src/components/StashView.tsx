import { useMemo } from 'react';
import { ChevronDown, ShieldCheck, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CartItem, Product } from '../types';

interface StashViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onGoToSecurePay: () => void;
  onBuyItNow: (id: string) => void;
  onProductClick?: (product: Product) => void;
}

function parsePrice(price: string) {
  const n = parseFloat(price.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function StashView({ items, onUpdateQuantity, onRemoveItem, onGoToSecurePay, onBuyItNow, onProductClick }: StashViewProps) {
  const { t } = useTranslation();
  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + parsePrice(it.product.price) * it.quantity, 0);
  }, [items]);

  const shipping: number = 0;
  const itemCount = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);

  const recommendations: Product[] = useMemo(() => {
    const seed = items[0]?.product.image ?? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=60';
    return Array.from({ length: 8 }).map((_, idx) => ({
      id: `rec-${idx}`,
      name: idx % 2 === 0 ? 'Apple iPhone 16 Plus 128GB Unlocked Good Condition' : 'LOUIS VUITTON Alma BB Electric Epi Leather Satchel Bag Black',
      price: idx % 2 === 0 ? '$559.00' : '$1,499.63',
      description: '',
      delivery: 'Free delivery',
      moq: '1 piece',
      image:
        idx % 2 === 0
          ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=60'
          : seed
    }));
  }, [items]);

  return (
    <section className="flex-1 min-h-0 px-12 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-black font-headline text-on-surface tracking-tight">{t('nav.stash')}</div>
            <div className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">Your handpicked gains</div>
          </div>
          <button type="button" className="text-xs font-bold text-primary hover:underline">
            Send Us Your Comments
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {items.length === 0 ? (
              <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-zinc-500/10 rounded-3xl p-10 text-center">
                <div className="text-lg font-black text-on-surface">{t('nav.stash')} {t('nav.is_empty')}</div>
                <div className="text-sm font-medium text-on-surface-variant mt-2">{t('stash.empty_desc')}</div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest/80 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/70 border border-zinc-500/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {item.sellerAvatar ? (
                            <img src={item.sellerAvatar} alt={item.sellerName ?? 'Seller'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/20" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black text-on-surface truncate">{item.sellerName ?? 'Seller'}</div>
                          <div className="text-xs font-bold text-on-surface-variant/60">{item.sellerPositiveFeedback ?? '99.4% positive feedback'}</div>
                        </div>
                      </div>
                      <button type="button" className="text-xs font-bold text-primary hover:underline">
                        {item.sellerOnlyLabel ?? 'Pay only this seller'}
                      </button>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-32 aspect-square rounded-2xl overflow-hidden bg-black/5 border border-zinc-500/10 flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="text-sm font-black text-on-surface leading-snug">{item.product.name}</div>
                        <div className="text-lg font-black text-on-surface">{item.product.price}</div>

                        <div className="text-sm font-black text-primary">{item.deliveryLabel ?? 'Free 2-3 day delivery'}</div>
                        <div className="text-xs font-bold text-on-surface-variant">{item.deliveryMethod ?? 'FedEx 2Day'}</div>
                        <div className="text-xs font-bold text-on-surface-variant/60">Free returns</div>

                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-surface-container/60 border border-zinc-500/10 rounded-2xl w-fit">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-on-surface-variant">0Buck Refurbished</span>
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-4">
                          <div className="inline-flex items-center gap-2 p-1 bg-surface-container-lowest border border-zinc-500/10 rounded-2xl">
                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() => onRemoveItem(item.id)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-on-surface">{item.quantity}</div>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
                            <button type="button" onClick={() => onBuyItNow(item.id)} className="hover:text-primary transition-colors">
                              Buy it now
                            </button>
                            <button type="button" className="hover:text-primary transition-colors">
                              Save for later
                            </button>
                            <button type="button" onClick={() => onRemoveItem(item.id)} className="hover:text-error transition-colors">
                              {t('stash.remove')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-zinc-500/10">
                <div className="text-2xl font-black font-headline text-on-surface tracking-tight">{t('stash.order_summary')}</div>
              </div>
              <div className="p-8 space-y-5">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-on-surface-variant font-medium">{t('stash.items_count', { count: itemCount })}</div>
                    <div className="text-on-surface font-bold">${subtotal.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-on-surface-variant font-medium flex items-center gap-2">
                      <span>{t('stash.shipping')}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant/50">to 98105-4001</span>
                    </div>
                    <div className="text-primary font-black">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-500/10 flex items-center justify-between">
                  <div className="text-on-surface font-black text-lg">{t('stash.subtotal')}</div>
                  <div className="text-on-surface font-black text-lg">${subtotal.toFixed(2)}</div>
                </div>

                <button
                  type="button"
                  onClick={onGoToSecurePay}
                  className="w-full h-12 rounded-full bg-primary text-on-primary font-headline font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {t('stash.go_to_secure_pay')}
                </button>

                <div className="pt-4 border-t border-zinc-500/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-on-surface-variant leading-relaxed">
                    {t('stash.guarantee')}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest/60 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
              <div className="px-8 py-6">
                <div className="text-sm font-black text-on-surface">{t('stash.shipping')}</div>
              </div>
              <div className="px-8 pb-8 space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container/50 border border-zinc-500/10">
                  <div className="text-sm font-bold text-on-surface-variant">To 98105-4001</div>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xl font-black font-headline text-on-surface">{t('stash.for_you')}</div>
            <div className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">{t('stash.sponsored')}</div>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {recommendations.map((p) => (
              <div 
                key={p.id} 
                className="flex-none w-56 bg-surface-container-lowest border border-zinc-500/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onProductClick?.(p)}
              >
                <div className="aspect-[4/3] bg-black/5 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-xs font-bold text-on-surface line-clamp-2">{p.name}</div>
                  <div className="text-sm font-black text-on-surface">{p.price}</div>
                  <div className="text-[10px] font-bold text-primary flex items-center gap-1">
                    {p.delivery}
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
