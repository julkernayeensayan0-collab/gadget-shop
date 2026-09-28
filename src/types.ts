export type Category = 'All' | 'Audio' | 'Wearables' | 'Power' | 'Gaming & Desk' | 'Smart Home';

export type Currency = 'USD' | 'BDT';

export interface Product {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  priceUSD: number;
  originalPriceUSD: number;
  priceBDT: number;
  originalPriceBDT: number;
  rating: number;
  reviewsCount: number;
  image: string;
  brand: string;
  inStock: boolean;
  stockCount: number;
  warranty: string;
  badge?: string;
  colors?: string[];
  specs: {
    label: string;
    value: string;
  }[];
  features: string[];
  inTheBox: string[];
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PaymentMethod = 'card' | 'bkash' | 'nagad' | 'googlepay' | 'cod';

export interface Order {
  id: string;
  createdAt: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    color?: string;
  }[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  pricing: {
    currency: Currency;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    promoCodeApplied?: string;
  };
  payment: {
    method: PaymentMethod;
    status: 'Paid' | 'Pending Verification' | 'Cash on Delivery';
    transactionId?: string;
    cardLast4?: string;
    walletNumber?: string;
    paidAt?: string;
  };
  fulfillment: {
    status: 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
    estimatedDelivery: string;
    trackingCode: string;
    courier: string;
  };
}
