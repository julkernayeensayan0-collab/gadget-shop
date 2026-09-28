import React from 'react';
import { CheckCircle2, Printer, PackageCheck, Copy, ArrowRight, X, ExternalLink } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/formatters';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (trackingCode: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const copyTracking = () => {
    navigator.clipboard.writeText(order.fulfillment.trackingCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md print:bg-white print:p-0">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl my-6 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header Banner */}
        <div className="border-b border-neutral-800 bg-neutral-950 px-6 py-5 flex items-center justify-between print:border-b print:border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono-data text-emerald-400 font-semibold uppercase tracking-wider">
                Payment Verified &amp; Confirmed
              </div>
              <h2 className="font-display text-lg font-bold text-white print:text-black">
                Order #{order.id}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
              title="Print Invoice"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Tracking Notification Box */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
            <div>
              <div className="text-xs text-neutral-400">Official Tracking Code</div>
              <div className="font-mono-data text-sm font-bold text-cyan-300 flex items-center gap-2 mt-0.5">
                <span>{order.fulfillment.trackingCode}</span>
                <button
                  onClick={copyTracking}
                  className="text-neutral-400 hover:text-white"
                  title="Copy code"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.fulfillment.trackingCode);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 transition"
            >
              <PackageCheck className="h-3.5 w-3.5" />
              <span>Live Shipment Status</span>
            </button>
          </div>

          {/* Customer & Payment Meta Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-neutral-800 pb-5 print:text-black">
            <div>
              <div className="text-neutral-500 uppercase tracking-wider text-[10px] mb-1">Delivering To</div>
              <div className="font-semibold text-white print:text-black">{order.customer.fullName}</div>
              <div className="text-neutral-400 print:text-gray-600 mt-0.5">{order.customer.address}</div>
              <div className="text-neutral-400 print:text-gray-600">{order.customer.city} · {order.customer.phone}</div>
            </div>

            <div>
              <div className="text-neutral-500 uppercase tracking-wider text-[10px] mb-1">Payment Method</div>
              <div className="font-semibold text-white print:text-black uppercase">
                {order.payment.method === 'card' && `Card (•••• ${order.payment.cardLast4 || '4242'})`}
                {order.payment.method === 'bkash' && `bKash Wallet (${order.payment.walletNumber})`}
                {order.payment.method === 'nagad' && `Nagad Wallet (${order.payment.walletNumber})`}
                {order.payment.method === 'googlepay' && 'Google / Apple Pay'}
                {order.payment.method === 'cod' && 'Cash on Delivery'}
              </div>
              {order.payment.transactionId && (
                <div className="font-mono-data text-[11px] text-cyan-400 print:text-gray-600 mt-0.5">
                  Trx ID: {order.payment.transactionId}
                </div>
              )}
              <div className="text-neutral-400 print:text-gray-600">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Itemized Products */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 print:text-black">
              Purchased Gadgets
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-neutral-850 bg-neutral-950/60 p-3 print:border-gray-200 print:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-lg object-cover bg-neutral-900"
                    />
                    <div>
                      <div className="font-display text-xs font-semibold text-white print:text-black">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-neutral-400 print:text-gray-500">
                        Qty: {item.quantity} {item.color ? `· Color: ${item.color}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="font-mono-data text-xs font-semibold text-white print:text-black">
                    {formatPrice(item.price * item.quantity, order.pricing.currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="rounded-xl border border-neutral-850 bg-neutral-950 p-4 space-y-2 text-xs print:bg-white print:border-gray-200">
            <div className="flex justify-between text-neutral-400 print:text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono-data text-neutral-200 print:text-black">
                {formatPrice(order.pricing.subtotal, order.pricing.currency)}
              </span>
            </div>

            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promo Discount ({order.pricing.promoCodeApplied})</span>
                <span className="font-mono-data">
                  -{formatPrice(order.pricing.discount, order.pricing.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-neutral-400 print:text-gray-600">
              <span>Shipping &amp; Handling</span>
              <span className="font-mono-data text-neutral-200 print:text-black">
                {order.pricing.shipping === 0 ? 'FREE' : formatPrice(order.pricing.shipping, order.pricing.currency)}
              </span>
            </div>

            <div className="flex justify-between border-t border-neutral-800 pt-2 text-sm font-bold text-white print:text-black print:border-gray-200">
              <span>Total Paid</span>
              <span className="font-mono-data text-cyan-400 print:text-black">
                {formatPrice(order.pricing.total, order.pricing.currency)}
              </span>
            </div>
          </div>

          {/* Footnote */}
          <div className="text-center text-[11px] text-neutral-500 print:text-gray-500 space-y-1">
            <p>Thank you for purchasing from Eshan Gadgets. An email receipt was dispatched to {order.customer.email}.</p>
            <p>For warranty or support queries, contact support@eshangadgets.com</p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-4 flex items-center justify-end print:hidden">
          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-500 px-5 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition"
          >
            Done &amp; Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
