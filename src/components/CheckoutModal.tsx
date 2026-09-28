import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, Lock, CreditCard, Smartphone, 
  ChevronRight, ArrowLeft, AlertCircle, Building2, Truck, CheckCircle2,
  Copy, ExternalLink
} from 'lucide-react';
import { CartItem, Currency, PaymentMethod, Order } from '../types';
import { 
  formatPrice, formatCardNumber, formatExpiryDate, 
  detectCardType, generateTransactionId, generateTrackingCode 
} from '../utils/formatters';
import { PROMO_CODES } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedPromo: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedPromo,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  // Step 1: Shipping Details, Step 2: Online Payment Gateway, Step 3: 3D Secure / OTP Verification
  const [step, setStep] = useState<'shipping' | 'payment' | 'otp_modal'>('shipping');

  // Customer state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // Mobile Banking state (bKash / Nagad)
  const [mfsNumber, setMfsNumber] = useState('');
  const [mfsOtp, setMfsOtp] = useState('');
  const [mfsPin, setMfsPin] = useState('');
  const [mfsStep, setMfsStep] = useState<'number' | 'otp' | 'pin'>('number');

  // OTP / 3DS state for cards
  const [otpInput, setOtpInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState('');

  // Computations
  const subtotal = items.reduce((acc, item) => {
    const price = currency === 'USD' ? item.product.priceUSD : item.product.priceBDT;
    return acc + price * item.quantity;
  }, 0);

  const discountPercent = appliedPromo && PROMO_CODES[appliedPromo] ? PROMO_CODES[appliedPromo].discountPercent : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  const freeShippingThreshold = currency === 'USD' ? 150 : 15000;
  const shippingFee = currency === 'USD' ? (subtotal >= freeShippingThreshold ? 0 : 15) : (subtotal >= freeShippingThreshold ? 0 : 120);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const cardBrand = detectCardType(cardNumber);

  // Validate Step 1
  const validateShipping = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email is required for payment confirmation';
    if (!phone.trim() || phone.length < 7) errors.phone = 'Valid phone number is required';
    if (!address.trim()) errors.address = 'Delivery address is required';
    if (!city.trim()) errors.city = 'City/Division is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('payment');
    }
  };

  // Process Online Payment
  const initiatePayment = () => {
    setProcessingError('');

    if (selectedMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 15) {
        setProcessingError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardHolder.trim()) {
        setProcessingError('Please enter cardholder name.');
        return;
      }
      if (cardExpiry.length < 5) {
        setProcessingError('Please enter card expiry date (MM/YY).');
        return;
      }
      if (cardCvc.length < 3) {
        setProcessingError('Please enter 3 or 4-digit CVV/CVC code.');
        return;
      }

      // Open 3DS verification modal
      setStep('otp_modal');
      return;
    }

    if (selectedMethod === 'bkash' || selectedMethod === 'nagad') {
      if (mfsStep === 'number') {
        if (!mfsNumber || mfsNumber.length < 11) {
          setProcessingError(`Please enter a valid 11-digit ${selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} mobile account number.`);
          return;
        }
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setMfsStep('otp');
        }, 800);
        return;
      }

      if (mfsStep === 'otp') {
        if (!mfsOtp || mfsOtp.length < 4) {
          setProcessingError('Please enter the 6-digit SMS verification code sent to your phone.');
          return;
        }
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setMfsStep('pin');
        }, 700);
        return;
      }

      if (mfsStep === 'pin') {
        if (!mfsPin || mfsPin.length < 4) {
          setProcessingError('Please enter your 5-digit wallet PIN to authorize.');
          return;
        }
        executeSuccessfulOrder();
        return;
      }
    }

    // Google Pay / Apple Pay / COD
    executeSuccessfulOrder();
  };

  const executeSuccessfulOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      const orderNumber = 'ESH-' + Math.floor(10000 + Math.random() * 90000);
      const isCard = selectedMethod === 'card';
      const isMFS = selectedMethod === 'bkash' || selectedMethod === 'nagad';
      const isCOD = selectedMethod === 'cod';

      const order: Order = {
        id: orderNumber,
        createdAt: new Date().toISOString(),
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.image,
          price: currency === 'USD' ? i.product.priceUSD : i.product.priceBDT,
          quantity: i.quantity,
          color: i.selectedColor
        })),
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          postalCode: postalCode || '1205',
          notes
        },
        pricing: {
          currency,
          subtotal,
          discount: discountAmount,
          shipping: shippingFee,
          total: grandTotal,
          promoCodeApplied: appliedPromo || undefined
        },
        payment: {
          method: selectedMethod,
          status: isCOD ? 'Cash on Delivery' : 'Paid',
          transactionId: isCOD ? undefined : generateTransactionId(selectedMethod.toUpperCase()),
          cardLast4: isCard ? cardNumber.slice(-4) : undefined,
          walletNumber: isMFS ? mfsNumber : undefined,
          paidAt: isCOD ? undefined : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        fulfillment: {
          status: 'Confirmed',
          estimatedDelivery: '2–3 Business Days',
          trackingCode: generateTrackingCode(),
          courier: 'Eshan Express Dispatch'
        }
      };

      onOrderSuccess(order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl my-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('shipping')}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition mr-1"
                title="Back to delivery info"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <span>Eshan Gadgets Secure Checkout</span>
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
              </h2>
              <div className="text-xs text-neutral-400">
                {step === 'shipping' && 'Step 1 of 2: Shipping & Delivery Information'}
                {step === 'payment' && 'Step 2 of 2: Select Online Payment Method'}
                {step === 'otp_modal' && 'Card 3D-Secure 2.0 Bank Verification'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">

          {/* STEP 1: Shipping Address */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Julker Nayeen"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-[11px] text-rose-400">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-[11px] text-rose-400">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Phone Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712 345678"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-[11px] text-rose-400">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    City / Division <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Dhaka">Dhaka (Express 24h)</option>
                    <option value="Chittagong">Chittagong (48h)</option>
                    <option value="Sylhet">Sylhet (48h)</option>
                    <option value="Rajshahi">Rajshahi (48h)</option>
                    <option value="Khulna">Khulna (48h)</option>
                    <option value="Barisal">Barisal (48h)</option>
                    <option value="International">International Express</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Street Address &amp; House / Apartment <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #12, Road #4, Banani / Manhattan 5th Ave"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                />
                {formErrors.address && (
                  <p className="mt-1 text-[11px] text-rose-400">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1213"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Call upon arrival, leave at desk..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Brief */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 mt-4">
                <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                  <span>Cart Items ({items.length})</span>
                  <span className="font-mono-data font-semibold text-white">Total: {formatPrice(grandTotal, currency)}</span>
                </div>
                <div className="flex -space-x-2 overflow-hidden py-1">
                  {items.map((i) => (
                    <img
                      key={i.product.id}
                      src={i.product.image}
                      alt={i.product.name}
                      referrerPolicy="no-referrer"
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-neutral-900 object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition active:scale-98 shadow-md shadow-cyan-500/20"
                >
                  <span>Continue to Payment Method</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Online Payment Gateway Selection & Interactive UI */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('card');
                    setProcessingError('');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'card'
                      ? 'border-cyan-400 bg-cyan-950/30 text-white shadow-sm shadow-cyan-500/10'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mb-1.5 text-cyan-400" />
                  <span className="text-xs font-semibold">Credit/Debit Card</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">Visa · MC · Amex</span>
                </button>

                {/* bKash */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('bkash');
                    setProcessingError('');
                    setMfsStep('number');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'bkash'
                      ? 'border-[#E2136E] bg-[#E2136E]/10 text-white'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className="h-5 w-5 mb-1.5 flex items-center justify-center font-bold text-[#E2136E] text-xs">
                    ৳b
                  </div>
                  <span className="text-xs font-semibold">bKash Online</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">Instant Verification</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('nagad');
                    setProcessingError('');
                    setMfsStep('number');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'nagad'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <Smartphone className="h-5 w-5 mb-1.5 text-amber-500" />
                  <span className="text-xs font-semibold">Nagad Wallet</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">Mobile Banking</span>
                </button>

                {/* Google Pay / COD */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('googlepay');
                    setProcessingError('');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'googlepay'
                      ? 'border-sky-400 bg-sky-400/10 text-white'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <Building2 className="h-5 w-5 mb-1.5 text-sky-400" />
                  <span className="text-xs font-semibold">Google / Apple Pay</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">1-Tap Biometric</span>
                </button>
              </div>

              {/* CARD PAYMENT INTERFACE */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  {/* Visual Credit Card Preview */}
                  <div className="relative mx-auto h-44 w-full max-w-sm rounded-2xl bg-gradient-to-tr from-neutral-900 via-neutral-850 to-neutral-800 p-5 shadow-2xl border border-neutral-700 flex flex-col justify-between overflow-hidden">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-xl" />
                    
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-9 rounded bg-amber-400/80 border border-amber-300/40" />
                        <span className="text-[10px] font-mono-data tracking-wider text-neutral-400 uppercase">EMV CHIP</span>
                      </div>
                      <span className="font-mono-data text-xs font-bold uppercase tracking-wider text-cyan-400">
                        {cardBrand === 'visa' && 'VISA'}
                        {cardBrand === 'mastercard' && 'MASTERCARD'}
                        {cardBrand === 'amex' && 'AMEX'}
                        {cardBrand === 'generic' && 'SECURE CARD'}
                      </span>
                    </div>

                    <div className="z-10">
                      <div className="font-mono-data text-lg tracking-widest text-white">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                    </div>

                    <div className="flex items-end justify-between z-10 text-xs">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400">Cardholder</div>
                        <div className="font-mono-data font-medium text-white truncate max-w-[170px]">
                          {cardHolder || 'ESHAN VALUED CLIENT'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400">Expires</div>
                        <div className="font-mono-data font-medium text-white">
                          {cardExpiry || 'MM/YY'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono-data text-sm text-white placeholder-neutral-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="AS APPEARS ON CARD"
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white uppercase placeholder-neutral-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Expiration Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                        placeholder="12/28"
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono-data text-sm text-white placeholder-neutral-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        CVV / Security Code
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono-data text-sm text-white placeholder-neutral-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded border-neutral-800 bg-neutral-950 text-cyan-500 focus:ring-0"
                    />
                    <span>Save card securely for 1-click purchases at Eshan Gadgets</span>
                  </label>
                </div>
              )}

              {/* BKASH PAYMENT INTERFACE */}
              {selectedMethod === 'bkash' && (
                <div className="rounded-xl border border-[#E2136E]/40 bg-[#E2136E]/5 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2136E]/20 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E2136E] text-white font-bold text-xs">
                        ৳b
                      </div>
                      <span className="font-display font-bold text-white text-sm">bKash Payment Gateway</span>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-300">
                      Charge: <strong>{formatPrice(grandTotal, currency)}</strong>
                    </span>
                  </div>

                  {mfsStep === 'number' && (
                    <div className="space-y-3">
                      <p className="text-xs text-neutral-300">
                        Enter your 11-digit personal bKash account number. You will receive an instant OTP via SMS.
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          bKash Mobile Account Number
                        </label>
                        <input
                          type="tel"
                          maxLength={11}
                          value={mfsNumber}
                          onChange={(e) => setMfsNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="01712345678"
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-data text-sm text-white placeholder-neutral-600 focus:border-[#E2136E] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {mfsStep === 'otp' && (
                    <div className="space-y-3">
                      <div className="rounded bg-neutral-900 p-2.5 text-xs text-emerald-400 border border-emerald-800/40">
                        SMS code dispatched to <strong>{mfsNumber}</strong>. (For demo testing, enter <strong>123456</strong>)
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Enter 6-Digit Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={mfsOtp}
                          onChange={(e) => setMfsOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-data text-sm text-white tracking-widest placeholder-neutral-600 focus:border-[#E2136E] focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  )}

                  {mfsStep === 'pin' && (
                    <div className="space-y-3">
                      <p className="text-xs text-neutral-300">
                        Enter your 5-digit bKash PIN to authorize this direct payment.
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Enter bKash PIN
                        </label>
                        <input
                          type="password"
                          maxLength={5}
                          value={mfsPin}
                          onChange={(e) => setMfsPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••••"
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-data text-sm text-white tracking-widest text-center focus:border-[#E2136E] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* NAGAD PAYMENT INTERFACE */}
              {selectedMethod === 'nagad' && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-amber-500" />
                      <span className="font-display font-bold text-white text-sm">Nagad Gateway</span>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-300">
                      Amount: <strong>{formatPrice(grandTotal, currency)}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-neutral-300">
                      Enter your Nagad Account Number to complete checkout.
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Nagad Wallet Number
                      </label>
                      <input
                        type="tel"
                        maxLength={11}
                        value={mfsNumber}
                        onChange={(e) => setMfsNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="01812345678"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-data text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GOOGLE / APPLE PAY */}
              {selectedMethod === 'googlepay' && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white">Express Digital Wallet</h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                      Use your Apple Pay, Google Pay, or biometric wallet linked on this device to pay in one touch.
                    </p>
                  </div>
                  <div className="font-mono-data text-base font-bold text-white">
                    {formatPrice(grandTotal, currency)}
                  </div>
                </div>
              )}

              {/* Error Box */}
              {processingError && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-950/40 border border-rose-900/60 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{processingError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  ← Edit Shipping Details
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={initiatePayment}
                  className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition active:scale-98 disabled:opacity-50 shadow-md shadow-cyan-500/20"
                >
                  {isProcessing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                      <span>Verifying Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>
                        {selectedMethod === 'card' && `Pay ${formatPrice(grandTotal, currency)} Securely`}
                        {selectedMethod === 'bkash' && (mfsStep === 'pin' ? 'Confirm Payment' : 'Next Step')}
                        {selectedMethod === 'nagad' && `Pay ${formatPrice(grandTotal, currency)} with Nagad`}
                        {selectedMethod === 'googlepay' && `Authorize ${formatPrice(grandTotal, currency)}`}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: 3D Secure / OTP Modal for Cards */}
          {step === 'otp_modal' && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">3D Secure 2.0 Bank Verification</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    We sent a 6-digit authentication passcode to your bank-registered mobile number ending in <strong>••91</strong>.
                  </p>
                </div>

                <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-3 max-w-xs mx-auto text-xs text-neutral-300">
                  <div className="flex justify-between py-0.5">
                    <span className="text-neutral-500">Merchant:</span>
                    <span className="font-medium text-white">ESHAN GADGETS LTD</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-neutral-500">Amount:</span>
                    <span className="font-mono-data font-bold text-cyan-400">{formatPrice(grandTotal, currency)}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-neutral-500">Card:</span>
                    <span className="font-mono-data text-white">•••• {cardNumber.slice(-4) || '4242'}</span>
                  </div>
                </div>

                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center font-mono-data text-lg tracking-widest rounded-lg border border-neutral-700 bg-neutral-900 py-2.5 text-white placeholder-neutral-600 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setOtpInput('123456')}
                    className="mt-2 text-[11px] text-cyan-400 hover:underline"
                  >
                    Click to auto-fill Test OTP: 123456
                  </button>
                </div>

                {processingError && (
                  <p className="text-xs text-rose-400">{processingError}</p>
                )}

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => {
                      if (!otpInput || otpInput.length < 4) {
                        setProcessingError('Please enter the 6-digit OTP code.');
                        return;
                      }
                      executeSuccessfulOrder();
                    }}
                    className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                        <span>Authorizing...</span>
                      </>
                    ) : (
                      <span>Submit &amp; Authorize</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
