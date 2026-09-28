import React from 'react';
import { ShoppingBag, Search, Compass, PackageCheck, Zap } from 'lucide-react';
import { Category, Currency } from '../types';

interface NavbarProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  currency: Currency;
  onToggleCurrency: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  currency,
  onToggleCurrency,
  cartCount,
  onOpenCart,
  onOpenTracker,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  setIsSearchOpen
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      {/* Top Banner Notice (single line, subtle) */}
      <div className="bg-neutral-900/60 border-b border-neutral-850 px-4 py-1.5 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
        <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        <span>Spring Tech Drop · Instant Online Payment via Card, bKash &amp; Digital Wallets · 100% Genuine</span>
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand Wordmark (Single text element, no subtitle badges) */}
        <button
          onClick={() => {
            onSelectCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap focus-visible:outline-none"
        >
          ESHAN GADGETS
        </button>

        {/* Zone 2: 4-6 Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onSelectCategory('All')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeCategory === 'All' ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400' : ''
            }`}
          >
            All Gadgets
          </button>
          <button
            onClick={() => onSelectCategory('Audio')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeCategory === 'Audio' ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400' : ''
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => onSelectCategory('Wearables')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeCategory === 'Wearables' ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400' : ''
            }`}
          >
            Wearables
          </button>
          <button
            onClick={() => onSelectCategory('Power')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeCategory === 'Power' ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400' : ''
            }`}
          >
            Power &amp; GaN
          </button>
          <button
            onClick={() => onSelectCategory('Gaming & Desk')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeCategory === 'Gaming & Desk' ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400' : ''
            }`}
          >
            Desk &amp; Gear
          </button>
          <button
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-cyan-400 whitespace-nowrap transition-colors"
          >
            <PackageCheck className="h-4 w-4" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Action Points */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            title={`Switch to ${currency === 'USD' ? 'BDT (৳)' : 'USD ($)'}`}
            className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-mono-data rounded border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <span className="font-semibold text-cyan-400">{currency}</span>
            <span className="ml-1 text-neutral-500">{currency === 'USD' ? '$' : '৳'}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-900"
            aria-label="Search gadgets"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Cart Bag Action Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-cyan-400 active:scale-95"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-bold text-white font-mono-data">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Search Drawer / Bar */}
      {isSearchOpen && (
        <div className="border-t border-neutral-850 bg-neutral-900/95 px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Search className="h-4 w-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by gadget name, feature (ANC, GaN, Titanium), or category..."
              className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs text-neutral-500 hover:text-neutral-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
