import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { CartItem, SecurePayPayload } from '../types';

interface SecurePayViewProps {
  payload: SecurePayPayload | null;
  onBack?: () => void;
}

export default function SecurePayView({ payload, onBack }: SecurePayViewProps) {
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('Washington');
  const [zip, setZip] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);

  useEffect(() => {
    setLocalItems(payload?.items ?? []);
  }, [payload]);

  const parsePrice = useMemo(() => {
    return (price: string) => {
      const n = parseFloat(price.replace(/[^0-9.]/g, ''));
      return Number.isFinite(n) ? n : 0;
    };
  }, []);

  const itemsSubtotal = useMemo(() => {
    return localItems.reduce((sum, it) => sum + parsePrice(it.product.price) * it.quantity, 0);
  }, [localItems, parsePrice]);

  const shipping: number = 0;
  const tax = useMemo(() => Math.round(itemsSubtotal * 0.105 * 100) / 100, [itemsSubtotal]);
  const orderTotal = useMemo(() => Math.round((itemsSubtotal + shipping + tax) * 100) / 100, [itemsSubtotal, shipping, tax]);

  const totalQuantity = useMemo(() => localItems.reduce((sum, it) => sum + it.quantity, 0), [localItems]);
  const primaryItem = localItems[0];
  const supplierName = primaryItem?.sellerName ?? 'Supplier';
  const supplierAvatar = primaryItem?.sellerAvatar;
  const supplierPositiveFeedback = primaryItem?.sellerPositiveFeedback ?? '97.4% positive feedback';
  const deliveryLabel = primaryItem?.deliveryLabel ?? 'Free 2-3 day delivery';
  const deliveryEta = primaryItem?.deliveryEta ?? 'Get it by Apr 2 – Apr 3';
  const deliveryMethod = primaryItem?.deliveryMethod ?? 'FedEx 2Day';

  return (
    <section className="flex-1 min-h-0 px-12 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              disabled={!onBack}
              className="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-zinc-500/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors disabled:opacity-40 disabled:hover:text-on-surface-variant disabled:hover:bg-surface-container-lowest"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-3xl font-black font-headline text-on-surface tracking-tight">Secure Pay</div>
              <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Final check before liftoff</div>
            </div>
          </div>
          <button type="button" className="text-xs font-bold text-primary hover:underline">
            Give us feedback
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-zinc-500/10">
                <div className="text-lg font-black font-headline text-on-surface">Final check before liftoff</div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/70 border border-zinc-500/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {supplierAvatar ? (
                      <img src={supplierAvatar} alt={supplierName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-on-surface truncate">{supplierName}</div>
                    <div className="text-xs font-bold text-on-surface-variant/60">{supplierPositiveFeedback}</div>
                  </div>
                </div>

                {localItems.length > 0 ? (
                  <div className="space-y-6">
                    {localItems.map((it) => (
                      <div key={it.id} className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-32 aspect-square rounded-2xl overflow-hidden bg-black/5 border border-zinc-500/10 flex-shrink-0">
                          <img src={it.product.image} alt={it.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="text-sm font-black text-on-surface leading-snug">{it.product.name}</div>
                          <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-black text-on-surface">${parsePrice(it.product.price).toFixed(2)}</div>
                            <div className="text-xs font-bold text-on-surface-variant/60 line-through">$1,500.00</div>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-2 bg-surface-container/60 border border-zinc-500/10 rounded-2xl">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-on-surface-variant">0Buck Refurbished</span>
                          </div>

                          <div className="pt-1">
                            <div className="text-xs font-black text-on-surface mb-2">Quantity</div>
                            <div className="relative w-40">
                              <select
                                value={it.quantity}
                                onChange={(e) => {
                                  const next = parseInt(e.target.value, 10);
                                  setLocalItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, quantity: next } : p)));
                                }}
                                className="w-full appearance-none bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                              >
                                {[1, 2, 3, 4, 5].map((q) => (
                                  <option key={q} value={q}>
                                    {q}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            </div>
                          </div>

                          <div className="text-xs font-bold text-on-surface-variant/60 pt-2">Free returns</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-medium text-on-surface-variant">
                    No item selected. Go back and add items to stash or click “Buy now” on a product.
                  </div>
                )}

                <div className="pt-6 border-t border-zinc-500/10 space-y-3">
                  <div className="text-sm font-black text-on-surface flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    Delivery
                  </div>
                  <div className="text-sm font-black text-primary">{deliveryLabel}</div>
                  <div className="text-xs font-bold text-on-surface-variant">{deliveryEta}</div>
                  <div className="text-xs font-bold text-on-surface-variant">{deliveryMethod}</div>
                  <div className="text-xs font-bold text-on-surface-variant/60 pt-2">Save up to 10%</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-zinc-500/10">
                <div className="text-lg font-black font-headline text-on-surface">Ship to</div>
              </div>
              <div className="p-8 space-y-5">
                <div>
                  <div className="text-xs font-black text-on-surface mb-2">Email</div>
                  <input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (showEmailError) setShowEmailError(false);
                    }}
                    onBlur={() => setShowEmailError(email.trim().length === 0)}
                    placeholder="Email"
                    className={`w-full bg-surface-container-lowest border rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 transition-all ${
                      showEmailError ? 'border-error' : 'border-zinc-500/10 focus:border-primary/30'
                    }`}
                  />
                  {showEmailError && <div className="text-xs font-bold text-error mt-2">Error: Enter an email address.</div>}
                  <div className="text-xs text-on-surface-variant/70 mt-2">We&apos;ll send your order confirmation after Secure Pay.</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <div className="text-xs font-black text-on-surface mb-2">Country or region</div>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface"
                    />
                  </div>
                  <div>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    />
                  </div>
                  <div>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    />
                  </div>
                  <div>
                    <input
                      value={street1}
                      onChange={(e) => setStreet1(e.target.value)}
                      placeholder="Street address"
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    />
                  </div>
                  <div>
                    <input
                      value={street2}
                      onChange={(e) => setStreet2(e.target.value)}
                      placeholder="Street address 2 (optional)"
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    />
                  </div>
                  <div>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    />
                  </div>
                  <div>
                    <input
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="State/Province/Region"
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    />
                  </div>
                  <div>
                    <input
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="ZIP code"
                      className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 md:col-span-2">
                    <div>
                      <input
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        placeholder="Country Code"
                        className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                      />
                    </div>
                    <div>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number (required)"
                        className="w-full bg-surface-container-lowest border border-zinc-500/10 rounded-2xl py-3 px-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                      />
                      <div className="text-xs text-on-surface-variant/60 mt-2">We only use this number if there&apos;s a shipping issue.</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEmailError(email.trim().length === 0)}
                  className="h-12 px-10 bg-primary text-on-primary rounded-full font-headline font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-zinc-500/10">
                <div className="text-2xl font-black font-headline text-on-surface tracking-tight">Order Summary</div>
              </div>
              <div className="p-8 space-y-5">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-on-surface-variant font-medium">Item ({totalQuantity})</div>
                    <div className="text-on-surface font-bold">${itemsSubtotal.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-on-surface-variant font-medium">Shipping</div>
                    <div className="text-primary font-black">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-on-surface-variant font-medium">Tax*</div>
                    <div className="text-on-surface font-bold">${tax.toFixed(2)}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-500/10 flex items-center justify-between">
                  <div className="text-on-surface font-black text-lg">Order total</div>
                  <div className="text-on-surface font-black text-lg">${orderTotal.toFixed(2)}</div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container/60 border border-zinc-500/10 text-xs text-on-surface-variant leading-relaxed">
                  The state of Washington requires 0Buck to collect sales tax and applicable fees from buyers. 0Buck will pay the collected tax to the tax authority.
                  <span className="text-primary font-bold ml-1">Learn more</span>
                </div>

                <button
                  type="button"
                  className="w-full h-12 rounded-full bg-primary text-on-primary font-headline font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm and pay
                </button>
                <button type="button" className="w-full text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                  Enter shipping address
                </button>

                <div className="pt-4 border-t border-zinc-500/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-on-surface-variant leading-relaxed">
                    Purchase protected by <span className="text-primary font-bold">0Buck Money Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest/60 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
              <div className="px-8 py-6">
                <div className="text-sm font-black text-on-surface">Pay with</div>
              </div>
              <div className="px-8 pb-8 space-y-3">
                {['Klarna Installments', 'PayPal', 'Venmo', 'Add new card', 'PayPal Credit'].map((m) => (
                  <div key={m} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container/50 border border-zinc-500/10">
                    <div className="text-sm font-bold text-on-surface-variant">{m}</div>
                    <ChevronDown className="w-4 h-4 text-on-surface-variant/60" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest/60 backdrop-blur-xl border border-zinc-500/10 rounded-3xl overflow-hidden">
              <div className="px-8 py-6">
                <div className="text-sm font-black text-on-surface">Add coupons</div>
              </div>
            </div>

            <div className="text-[10px] text-on-surface-variant/50 font-medium px-2">
              Copyright © 1995-2026 0Buck Inc. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
