import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { CancelOrderModal } from '../components/CancelOrderModal';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ChevronRight, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Play
} from 'lucide-react';

export const MyOrdersPage = () => {
  const { orders, advanceOrderStatus, navigateTo } = useOrder();
  const [selectedTab, setSelectedTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (selectedTab === 'ACTIVE') {
      if (['Delivered', 'Cancelled'].includes(order.status)) return false;
    } else if (selectedTab === 'DELIVERED') {
      if (order.status !== 'Delivered') return false;
    } else if (selectedTab === 'CANCELLED') {
      if (order.status !== 'Cancelled') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.orderId.toLowerCase().includes(q);
      const matchItem = order.items?.some((i) => i.title.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q));
      return matchId || matchItem;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ordered':
        return <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Ordered</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Processing in Hub</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Shipped & In Transit</span>;
      case 'Out for Delivery':
        return <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-bold">Out for Delivery</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">✓ Delivered</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold">✕ Cancelled</span>;
      default:
        return <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 text-center max-w-md w-full shadow-xs">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">No Orders Found</h2>
          <p className="text-xs text-gray-500 mb-6">
            You haven't placed any orders yet. Explore our curated gadgets, fashion, and deals!
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center gap-2 mx-auto"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 font-heading flex items-center gap-2">
              My Orders
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                {orders.length} Total
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track shipments, download GST tax invoices, and manage order cancellations
            </p>
          </div>

          {/* Search Orders */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or Product..."
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 overflow-x-auto text-xs font-bold shadow-xs">
          {[
            { id: 'ALL', label: `All Orders (${orders.length})` },
            { id: 'ACTIVE', label: `Active (${orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length})` },
            { id: 'DELIVERED', label: `Delivered (${orders.filter((o) => o.status === 'Delivered').length})` },
            { id: 'CANCELLED', label: `Cancelled (${orders.filter((o) => o.status === 'Cancelled').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition shrink-0 ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const canCancel = order.status === 'Ordered' || order.status === 'Processing';

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition hover:shadow-md"
                >
                  {/* Order Card Header */}
                  <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <span className="text-gray-400 block text-[10px] font-bold uppercase">Order Placed</span>
                        <span className="font-semibold text-gray-800">{order.displayDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] font-bold uppercase">Total Amount</span>
                        <span className="font-bold text-gray-900">₹{order.pricing?.totalPayable?.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] font-bold uppercase">Ship To</span>
                        <span className="font-semibold text-gray-800 truncate max-w-[140px] block">{order.address?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-gray-400 block text-[10px] font-bold uppercase">Order #</span>
                        <span className="font-mono font-bold text-blue-700">{order.orderId}</span>
                      </div>

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Status Banner & Quick Step Progress */}
                  <div className="px-5 py-3.5 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      {order.status !== 'Cancelled' ? (
                        <span className="text-xs text-gray-600 font-medium">
                          Estimated Delivery: <strong className="text-gray-900">{order.estimatedDelivery}</strong>
                        </span>
                      ) : (
                        <span className="text-xs text-rose-600 font-medium">
                          Reason: <strong>{order.cancellationReason || 'Cancelled by customer'}</strong>
                        </span>
                      )}
                    </div>

                    {/* Simulation Toolbar for Testing Lifecycle progression */}
                    {order.status !== 'Cancelled' && (
                      <div className="flex items-center gap-1.5 text-[11px] bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                        <span className="text-gray-400 font-medium mr-1 flex items-center gap-1">
                          <Play className="w-3 h-3 text-blue-600" /> Demo:
                        </span>
                        {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                          <button
                            key={st}
                            disabled={order.status === st}
                            onClick={() => advanceOrderStatus(order.orderId, st)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              order.status === st
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order Items List */}
                  <div className="p-5 divide-y divide-gray-100">
                    {order.items?.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-contain bg-gray-50 p-2 rounded-xl border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{item.brand}</span>
                          <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">{item.title}</h4>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Qty: <strong className="text-gray-800">{item.quantity}</strong> • Category: {item.category}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-gray-900 font-mono">
                            ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            Saved ₹{((item.originalPrice - item.discountedPrice) * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Actions: Cancel Order & Tracking */}
                  <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 text-xs">
                    <div className="text-gray-500 text-[11px]">
                      <span>Payment: <strong>{order.paymentMethod}</strong></span>
                      <span className="mx-2">•</span>
                      <span>Delivery Pin: <strong>{order.address?.pincode}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <button
                          onClick={() => setSelectedCancelOrder(order)}
                          className="px-4 py-2 rounded-lg border border-rose-300 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-xs text-gray-500">
              No orders matched your filter or search query.
            </div>
          )}
        </div>

      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        order={selectedCancelOrder}
        isOpen={!!selectedCancelOrder}
        onClose={() => setSelectedCancelOrder(null)}
      />
    </div>
  );
};
