import React, { useState } from 'react';
import { X, Check, Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Zap } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface ProductModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'box'>('specs');

  const currentPrice = currency === 'USD' ? product.priceUSD : product.priceBDT;
  const originalPrice = currency === 'USD' ? product.originalPriceUSD : product.originalPriceBDT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Gallery / Image Left Column */}
          <div className="md:col-span-6 bg-neutral-950 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-850">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 bg-neutral-950/80 border border-neutral-700 px-2.5 py-1 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider rounded">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="mt-6 space-y-2 border-t border-neutral-850 pt-5 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-neutral-300 font-medium">{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Express courier delivery within 48–72 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>7-day easy replacement policy for hardware faults</span>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module Right Column */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span className="font-semibold text-cyan-400 uppercase tracking-wider">{product.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-mono-data font-semibold text-white">{product.rating}</span>
                  <span className="text-neutral-500">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  {product.name}
                </h2>
                <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price Banner */}
              <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Online Store Price</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-mono-data text-2xl font-bold text-white">
                      {formatPrice(currentPrice, currency)}
                    </span>
                    <span className="font-mono-data text-xs text-neutral-500 line-through">
                      {formatPrice(originalPrice, currency)}
                    </span>
                  </div>
                </div>
                <span className="font-mono-data text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded">
                  Stock: {product.stockCount} Available
                </span>
              </div>

              {/* Color Selection if available */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Finish / Color: <span className="text-cyan-400 font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          selectedColor === c
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Tabs: Specs vs Features vs Box */}
              <div className="pt-2">
                <div className="flex border-b border-neutral-800 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 px-3 transition-colors ${
                      activeTab === 'specs'
                        ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Tech Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`pb-2 px-3 transition-colors ${
                      activeTab === 'features'
                        ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Highlights
                  </button>
                  <button
                    onClick={() => setActiveTab('box')}
                    className={`pb-2 px-3 transition-colors ${
                      activeTab === 'box'
                        ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    In The Box
                  </button>
                </div>

                <div className="mt-3 text-xs">
                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 gap-1.5 bg-neutral-950/60 p-3 rounded-lg border border-neutral-850">
                      {product.specs.map((s, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-neutral-850/60 last:border-0">
                          <span className="text-neutral-400">{s.label}</span>
                          <span className="font-mono-data text-neutral-200 font-medium">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <ul className="space-y-1.5 bg-neutral-950/60 p-3 rounded-lg border border-neutral-850">
                      {product.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-neutral-300">
                          <Check className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'box' && (
                    <ul className="space-y-1.5 bg-neutral-950/60 p-3 rounded-lg border border-neutral-850">
                      {product.inTheBox.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-neutral-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase CTA Module */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-950">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-400 hover:text-white transition disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="font-mono-data px-2 text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-2 text-neutral-400 hover:text-white transition disabled:opacity-30"
                    disabled={quantity >= product.stockCount}
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              {/* Direct Instant Checkout with Online Payment */}
              <button
                onClick={() => {
                  onBuyNow(product, quantity, selectedColor);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 text-xs font-bold text-neutral-950 transition hover:bg-cyan-400 active:scale-98 shadow-md shadow-cyan-500/20"
              >
                <Zap className="h-4 w-4 fill-current" />
                <span>Buy Now with Online Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
