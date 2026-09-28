import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck, CreditCard } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface HeroSectionProps {
  flagshipProduct: Product;
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  flagshipProduct,
  currency,
  onSelectProduct,
  onExploreClick
}) => {
  const currentPrice = currency === 'USD' ? flagshipProduct.priceUSD : flagshipProduct.priceBDT;
  const originalPrice = currency === 'USD' ? flagshipProduct.originalPriceUSD : flagshipProduct.originalPriceBDT;

  return (
    <section className="relative overflow-hidden border-b border-neutral-850 bg-neutral-950">
      {/* Subtle radial ambient glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Editorial Headline & Value Offer */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quiet Unboxed Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span>Eshan Special Drop</span>
              <span aria-hidden="true">·</span>
              <span>Acoustic Reference Series</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">In Stock</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              PRECISION AUDIO. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
                ZERO COMPROMISE.
              </span>
            </h1>

            <p className="max-w-xl text-base text-neutral-400 leading-relaxed">
              Explore the pinnacle of modern gadgetry. Featuring our flagship AeroSound Pro Max with adaptive 48dB active noise cancellation, custom neodymium acoustic chambers, and multi-day battery reserve.
            </p>

            {/* Price & Primary Action Group */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-data text-3xl font-bold text-white">
                    {formatPrice(currentPrice, currency)}
                  </span>
                  <span className="font-mono-data text-sm text-neutral-500 line-through">
                    {formatPrice(originalPrice, currency)}
                  </span>
                </div>
                <div className="text-xs text-neutral-400">Includes 2-Year Official Brand Warranty</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectProduct(flagshipProduct)}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-400 active:scale-98 shadow-lg shadow-cyan-500/20"
                >
                  <span>View Specifications</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onExploreClick}
                  className="rounded-lg border border-neutral-700 bg-neutral-900/80 px-5 py-3.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                >
                  Browse Catalog
                </button>
              </div>
            </div>

            {/* Trust Assurances (Adjacency to offer) */}
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-850 pt-6 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Online Gateway &amp; bKash</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>2-3 Day Nationwide Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image Frame with Zero Broken Image Policy */}
          <div className="lg:col-span-6 relative">
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
              <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                <img
                  src={flagshipProduct.image}
                  alt={flagshipProduct.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Styled resilient fallback if asset fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center', 'bg-neutral-900');
                      parent.innerHTML = `
                        <div class="p-8 text-center">
                          <div class="mx-auto mb-3 h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            🎧
                          </div>
                          <div class="font-display text-lg font-bold text-white">${flagshipProduct.name}</div>
                          <div class="text-xs text-neutral-400 mt-1">Next-Gen Acoustic Studio Engine</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>

              {/* Quiet overlay info bar */}
              <div className="flex items-center justify-between border-t border-neutral-800/80 bg-neutral-900/90 px-5 py-3 text-xs">
                <div className="flex items-center gap-2 text-neutral-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Studio Edition · Space Gray &amp; Matte Black</span>
                </div>
                <button
                  onClick={() => onSelectProduct(flagshipProduct)}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  Quick Inspect →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
