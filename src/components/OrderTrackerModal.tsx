import React, { useState } from 'react';
import { X, Search, PackageCheck, CheckCircle2, Clock, Truck, MapPin, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/formatters';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
  initialTrackingCode?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
  initialTrackingCode = ''
}) => {
  if (!isOpen) return null;

  const [searchCode, setSearchCode] = useState(initialTrackingCode);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    recentOrders.find((o) => o.fulfillment.trackingCode.toLowerCase() === initialTrackingCode.toLowerCase() || o.id.toLowerCase() === initialTrackingCode.toLowerCase()) ||
    (recentOrders.length > 0 ? recentOrders[0] : null)
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const code = searchCode.trim().toLowerCase();
    if (!code) return;

    const found = recentOrders.find(
      (o) => o.fulfillment.trackingCode.toLowerCase() === code || o.id.toLowerCase() === code
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      // Mock generated lookup if not in local store
      setSelectedOrder({
        id: searchCode.toUpperCase().startsWith('ESH-') ? searchCode.toUpperCase() : `ESH-${searchCode}`,
        createdAt: new Date().toISOString(),
        items: [
          {
            productId: 'demo',
            productName: 'AeroSound Pro Max Studio Headphones',
            productImage: '/src/assets/images/hero_gadgets_showcase_1790571976516.jpg',
            price: 249,
            quantity: 1,
            color: 'Space Gray'
          }
        ],
        customer: {
          fullName: 'Valued Client',
          email: 'client@eshangadgets.com',
          phone: '+880 1712-345678',
          address: 'Delivery In Progress, Banani',
          city: 'Dhaka',
          postalCode: '1213'
        },
        pricing: {
          currency: 'USD',
          subtotal: 249,
          discount: 0,
          shipping: 0,
          total: 249
        },
        payment: {
          method: 'card',
          status: 'Paid',
          transactionId: 'TXN-941284',
          cardLast4: '4242'
        },
        fulfillment: {
          status: 'Shipped',
          estimatedDelivery: 'Tomorrow, by 5:00 PM',
          trackingCode: searchCode.toUpperCase(),
          courier: 'Eshan Express Cargo'
        }
      });
    }
  };

  const steps = [
    { label: 'Order Confirmed', time: 'Completed', icon: CheckCircle2, done: true },
    { label: 'Payment Verified', time: 'Online Auth 256-bit', icon: Clock, done: true },
    { label: 'Packed at Hub', time: 'Quality QC Verified', icon: PackageCheck, done: true },
    { label: 'Out for Courier Delivery', time: 'In Transit', icon: Truck, done: selectedOrder?.fulfillment.status === 'Shipped' || selectedOrder?.fulfillment.status === 'Delivered' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white">Track Gadget Shipment</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-900/60">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Order # or Tracking Code (e.g. ESH-89412)"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 transition"
            >
              Track Order
            </button>
          </form>

          {recentOrders.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
              <span>Recent:</span>
              <div className="flex flex-wrap gap-1.5">
                {recentOrders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSelectedOrder(o);
                      setSearchCode(o.fulfillment.trackingCode);
                    }}
                    className="font-mono-data text-cyan-400 hover:underline bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800"
                  >
                    #{o.id} ({o.fulfillment.trackingCode})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Order Details */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {selectedOrder ? (
            <>
              {/* Order Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div>
                  <div className="text-xs text-neutral-400">Tracking Code</div>
                  <div className="font-mono-data text-sm font-bold text-white">
                    {selectedOrder.fulfillment.trackingCode}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-400">Courier Partner</div>
                  <div className="text-xs font-medium text-neutral-200">
                    {selectedOrder.fulfillment.courier}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-400">Est. Arrival</div>
                  <div className="text-xs font-semibold text-emerald-400">
                    {selectedOrder.fulfillment.estimatedDelivery}
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Live Dispatch Progress
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                  {steps.map((st, i) => {
                    const Icon = st.icon;
                    return (
                      <div key={i} className="relative flex items-start gap-4">
                        <div
                          className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full ${
                            st.done
                              ? 'bg-cyan-500 text-neutral-950 ring-4 ring-neutral-900'
                              : 'bg-neutral-800 text-neutral-500 ring-4 ring-neutral-900'
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${st.done ? 'text-white' : 'text-neutral-500'}`}>
                            {st.label}
                          </div>
                          <div className="text-[11px] text-neutral-400">{st.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Item Summary */}
              <div className="border-t border-neutral-800 pt-4">
                <div className="text-xs text-neutral-400 mb-2">Package Contents:</div>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-neutral-300">
                      <span>{it.quantity}x {it.productName}</span>
                      <span className="font-mono-data text-neutral-400">
                        {formatPrice(it.price * it.quantity, selectedOrder.pricing.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400">
              No shipment selected. Enter your tracking code above to inspect live courier movement.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
