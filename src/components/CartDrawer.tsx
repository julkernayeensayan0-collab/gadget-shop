import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/formatters';
import { PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success?: boolean; text?: string }>({});

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const price = currency === 'USD' ? item.product.priceUSD : item.product.priceBDT;
    return acc + price * item.quantity;
  }, 0);

  const discountPercent = appliedPromo && PROMO_CODES[appliedPromo] ? PROMO_CODES[appliedPromo].discountPercent : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  // Free shipping threshold: $150 or ৳15,000
  const freeShippingThreshold = currency === 'USD' ? 150 : 15000;
  const standardShipping = currency === 'USD' ? (subtotal >= freeShippingThreshold ? 0 : 15) : (subtotal >= freeShippingThreshold ? 0 : 120);
  const total = Math.max(0, subtotal - discountAmount + standardShipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromo(promoInput.trim().toUpperCase());
    setPromoFeedback({ success: res.success, text: res.message });
    if (res.success) {
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/75 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-cyan-400" />
              <h2 className="font-display text-lg font-bold text-white">Your Shopping Bag</h2>
              <span className="font-mono-data text-xs text-neutral-400">
                ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-800/60 text-neutral-500">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">Your bag is empty</h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    Explore our curated collection of premium gadgets and tech gear.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = currency === 'USD' ? item.product.priceUSD : item.product.priceBDT;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedColor || 'def'}`}
                    className="flex gap-4 rounded-xl border border-neutral-850 bg-neutral-950 p-3.5 transition-colors hover:border-neutral-750"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-xs font-semibold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-neutral-500 hover:text-red-400 transition p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {item.selectedColor && (
                          <div className="text-[11px] text-neutral-400 mt-0.5">
                            Color: <span className="text-neutral-300 font-medium">{item.selectedColor}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-900">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-800 rounded bg-neutral-900 text-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-mono-data px-2 font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-mono-data text-xs font-bold text-white">
                          {formatPrice(itemPrice * item.quantity, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="border-t border-neutral-800 bg-neutral-950 p-6 space-y-4">
              
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. ESHAN10)"
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 py-1.5 pl-8 pr-3 text-xs text-white uppercase placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded">
                    <span>Applied: <strong>{appliedPromo}</strong> ({discountPercent}% OFF)</span>
                    <button
                      onClick={onRemovePromo}
                      className="text-neutral-400 hover:text-red-400 ml-2 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoFeedback.text && !appliedPromo && (
                  <div className={`text-[11px] ${promoFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {promoFeedback.text}
                  </div>
                )}
              </div>

              {/* Cost Summary */}
              <div className="space-y-2 border-t border-neutral-850 pt-3 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono-data text-neutral-200 font-medium">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span className="font-mono-data font-medium">
                      -{formatPrice(discountAmount, currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Shipping</span>
                  <span className="font-mono-data text-neutral-200">
                    {standardShipping === 0 ? (
                      <span className="text-emerald-400 font-medium">FREE</span>
                    ) : (
                      formatPrice(standardShipping, currency)
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-neutral-850 pt-2 text-sm font-semibold text-white">
                  <span>Total Due</span>
                  <span className="font-mono-data text-base font-bold text-cyan-400">
                    {formatPrice(total, currency)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 text-xs font-bold text-neutral-950 transition hover:bg-cyan-400 active:scale-98 shadow-lg shadow-cyan-500/20"
              >
                <span>Proceed to Online Payment</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>256-bit Encrypted SSL Payment Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
