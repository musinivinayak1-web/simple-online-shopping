import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  FileText, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { currentOrder, orders, navigateTo } = useOrder();
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // If no current order just placed, fall back to most recent order from history
  const activeOrder = currentOrder || (orders.length > 0 ? orders[0] : null);

  if (!activeOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-heading">No Orders Placed Yet</h2>
          <p className="text-xs text-gray-500 mb-6">You haven't placed any orders yet. Browse our best-sellers to find something great!</p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Success Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs text-center relative overflow-hidden">
          
          {/* Animated Green Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ring-8 ring-emerald-50 animate-bounce-subtle">
            <CheckCircle className="w-12 h-12" />
          </div>

          <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Payment Confirmed • Order Placed
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading mb-2">
            Thank you, {activeOrder.address?.name?.split(' ')[0] || 'Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
            Your order has been received and is being prepared for dispatch with high priority.
          </p>

          {/* Key Order Meta Badges */}
          <div className="inline-grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 border border-gray-200/80 p-4 rounded-xl text-left text-xs max-w-2xl w-full">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Order ID</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{activeOrder.orderId}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
              <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> {activeOrder.estimatedDelivery}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Payment Mode</span>
              <span className="font-bold text-blue-700 text-sm">{activeOrder.paymentMethod}</span>
            </div>
          </div>

          {/* Primary Action Buttons: View Invoice & Continue Shopping */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setSelectedOrderForInvoice(activeOrder)}
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>View & Print Tax Invoice Slip</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Real-time Order Tracking Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
            Order Status & Shipment Tracking
          </h2>

          <div className="relative">
            {/* Timeline Bar */}
            <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-0">
              <div className="h-full bg-emerald-500 w-1/4 transition-all duration-700"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10 text-center sm:text-left">
              {/* Step 1: Placed */}
              <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Order Confirmed</div>
                  <div className="text-[11px] text-gray-500">{activeOrder.displayDate}</div>
                </div>
              </div>

              {/* Step 2: Packed */}
              <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-blue-100 animate-pulse">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-700">Packing in Warehouse</div>
                  <div className="text-[11px] text-gray-500">Expected in 4 Hours</div>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 opacity-60">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-700">Out for Dispatch</div>
                  <div className="text-[11px] text-gray-400">Via ZapKart Express</div>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 opacity-60">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-700">Delivered</div>
                  <div className="text-[11px] text-gray-400">{activeOrder.estimatedDelivery}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h3 className="font-bold text-sm text-gray-900 font-heading">
              Items in this Shipment ({activeOrder.items?.length || 0})
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              Delivering to: <strong className="text-gray-800">{activeOrder.address?.city}</strong>
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {activeOrder.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-contain bg-gray-50 p-2 rounded-lg border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{item.brand}</span>
                  <h4 className="text-xs font-semibold text-gray-900 truncate">{item.title}</h4>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Quantity: <strong className="text-gray-800">{item.quantity}</strong>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-gray-900">
                    ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    Saved ₹{((item.originalPrice - item.discountedPrice) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address & Price Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-100 text-xs">
            {/* Delivery Address Box */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Shipping Address
              </span>
              <p className="font-bold text-gray-900">{activeOrder.address?.name}</p>
              <p className="text-gray-600 mt-0.5 leading-relaxed">
                {activeOrder.address?.addressLine}<br />
                {activeOrder.address?.city}, {activeOrder.address?.state} - {activeOrder.address?.pincode}<br />
                Phone: {activeOrder.address?.phone}
              </p>
            </div>

            {/* Total Paid Box */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Payment Summary
                </span>
                <div className="flex justify-between py-0.5 text-gray-600">
                  <span>Items MRP:</span>
                  <span>₹{activeOrder.pricing?.totalMRP?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-0.5 text-emerald-700 font-medium">
                  <span>Savings:</span>
                  <span>- ₹{activeOrder.pricing?.totalSavings?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-0.5 text-gray-600">
                  <span>Delivery:</span>
                  <span>{activeOrder.pricing?.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.pricing?.deliveryFee}`}</span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-black text-sm text-gray-950 font-heading">
                <span>Total Paid:</span>
                <span>₹{activeOrder.pricing?.totalPayable?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Past Orders if any */}
        {orders.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-4">
              Previous Order History ({orders.length - 1} more)
            </h3>
            <div className="space-y-3">
              {orders.slice(1).map((ord) => (
                <div key={ord.orderId} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 text-xs">
                  <div>
                    <span className="font-mono font-bold text-gray-900">{ord.orderId}</span>
                    <span className="text-gray-500 ml-2">Placed on {ord.displayDate}</span>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      {ord.items?.length} items • ₹{ord.pricing?.totalPayable?.toLocaleString('en-IN')} • {ord.status}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrderForInvoice(ord)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs"
                  >
                    View Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Invoice Slip Modal */}
      <InvoiceModal
        order={selectedOrderForInvoice}
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
};
