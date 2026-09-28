import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, SlidersHorizontal, ArrowUpDown, Sparkles, Check, 
  ShoppingBag, Heart, Shield, Zap, SearchX 
} from 'lucide-react';
import { PRODUCTS, PROMO_CODES } from './data/products';
import { Product, Category, Currency, CartItem, Order } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & Category filter
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Currency
  const [currency, setCurrency] = useState<Currency>('USD');

  // Cart & Wishlist persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('eshan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eshan_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('eshan_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState('ESHAN10');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerCode, setTrackerCode] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eshan_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('eshan_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('eshan_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Actions
  const handleAddToCart = (product: Product, quantity = 1, color?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color || product.colors?.[0] }];
      }
    });
    showToast(`Added ${quantity}x "${product.name}" to bag`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleBuyNow = (product: Product, quantity = 1, color?: string) => {
    handleAddToCart(product, quantity, color);
    setIsCheckoutOpen(true);
  };

  // Wishlist Action
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from saved wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  // Promo Code Action
  const handleApplyPromo = (code: string) => {
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      return { success: true, message: `Promo '${code}' applied successfully!` };
    }
    return { success: false, message: 'Invalid promo code. Try ESHAN10 or TECHVIP' };
  };

  // On successful order checkout
  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
  };

  // Track order trigger
  const handleOpenTrackerWithCode = (code: string) => {
    setTrackerCode(code);
    setIsTrackerOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.features.some((f) => f.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const priceA = currency === 'USD' ? a.priceUSD : a.priceBDT;
      const priceB = currency === 'USD' ? b.priceUSD : b.priceBDT;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default order
    });
  }, [activeCategory, searchQuery, sortBy, currency]);

  const categories: Category[] = ['All', 'Audio', 'Wearables', 'Power', 'Gaming & Desk'];

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-neutral-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'USD' ? 'BDT' : 'USD'))}
        cartCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      {/* Hero Showcase Campaign */}
      <HeroSection
        flagshipProduct={PRODUCTS[0]}
        currency={currency}
        onSelectProduct={setSelectedProduct}
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <main id="catalog-section" className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Controls Bar: Category Filter Buttons & Sorter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-850 pb-6 mb-8">
          
          {/* Interactive Filter Tabs (Permitted Segmented Controls) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900/80 rounded-xl border border-neutral-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: Active Count & Sorting Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
            <span className="text-neutral-400">
              Showing <span className="font-mono-data font-semibold text-white">{filteredProducts.length}</span> gadgets
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="featured">Featured Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Results indicator if searching */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-2.5 text-xs text-neutral-300">
            <div>
              Search results for: <span className="font-semibold text-cyan-400">"{searchQuery}"</span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-neutral-400 hover:text-white underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Product Grid (3-column desktop baseline with generous gap) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onSelectProduct={setSelectedProduct}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 py-20 text-center space-y-3">
            <SearchX className="mx-auto h-12 w-12 text-neutral-600" />
            <h3 className="font-display text-lg font-bold text-white">No gadgets match your search</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              We couldn't find any gadgets matching "{searchQuery}". Try searching for audio, chargers, titanium, or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Editorial Story / Brand Section */}
        <section className="mt-20 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/70 to-neutral-950 p-8 sm:p-12">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              The Eshan Engineering Standard
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Curated Gadgets. Verified Authentic. Paid Online in Seconds.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Every device in our catalog is rigorously stress-tested for thermal dissipation, battery endurance, and acoustic fidelity. We partner directly with authorized distributors to provide official factory warranty cards with every order.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>Zero Counterfeits Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>Instant Mobile &amp; Card Gateway</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={() => setAppliedPromo('')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleOpenTrackerWithCode}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        recentOrders={orders}
        initialTrackingCode={trackerCode}
      />

    </div>
  );
}
