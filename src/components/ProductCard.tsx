import React from 'react';
import { ShoppingBag, Star, Eye, ShieldCheck, Heart } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  const currentPrice = currency === 'USD' ? product.priceUSD : product.priceBDT;
  const originalPrice = currency === 'USD' ? product.originalPriceUSD : product.originalPriceBDT;
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-850 bg-neutral-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-900 hover:shadow-xl">
      {/* Visual Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.classList.add('flex', 'items-center', 'justify-center', 'bg-neutral-900', 'p-6');
              parent.innerHTML = `
                <div class="text-center">
                  <div class="text-2xl mb-1">⚡</div>
                  <div class="font-display text-sm font-semibold text-white">${product.name}</div>
                  <div class="text-[11px] text-neutral-400 mt-1">${product.category}</div>
                </div>
              `;
            }
          }}
        />

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              isWishlisted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900/90 px-3.5 py-2 text-xs font-semibold text-white border border-neutral-700 hover:bg-white hover:text-neutral-950 transition-all shadow-lg"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Unboxed Metadata (Zero Pills) */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
          <span className="font-medium text-neutral-300">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{product.category}</span>
          {product.badge && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400 font-medium">{product.badge}</span>
            </>
          )}
        </div>

        {/* Product Name */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="font-display text-base font-semibold text-white line-clamp-1 cursor-pointer transition-colors hover:text-cyan-400"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Tagline / Micro-spec */}
        <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Rating and Warranty note */}
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-mono-data font-medium text-neutral-200">{product.rating}</span>
            <span className="text-neutral-500">({product.reviewsCount})</span>
          </div>
          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-cyan-400" />
            <span>Official Warranty</span>
          </span>
        </div>

        {/* Price & Action Baseline */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-neutral-850">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono-data text-lg font-bold text-white">
                {formatPrice(currentPrice, currency)}
              </span>
              <span className="font-mono-data text-xs text-neutral-500 line-through">
                {formatPrice(originalPrice, currency)}
              </span>
            </div>
            <span className="text-[11px] font-mono-data text-emerald-400">
              Save {discountPercent}%
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-500 hover:text-neutral-950 transition-colors active:scale-95"
            title="Add to cart"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
