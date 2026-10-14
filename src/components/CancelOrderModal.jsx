import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { X, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const cancellationReasons = [
  'Expected delivery date is too late',
  'Ordered by mistake / Duplicate order',
  'Need to change delivery address or phone number',
  'Price of the item has dropped',
  'Found a better deal on another website',
  'Purchased wrong size, color, or variant',
  'Item not required anymore'
];

export const CancelOrderModal = ({ order, isOpen, onClose }) => {
  const { cancelOrder } = useOrder();
  const [selectedReason, setSelectedReason] = useState(cancellationReasons[0]);
  const [additionalComments, setAdditionalComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleConfirmCancellation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Process cancellation through OrderContext
    await cancelOrder(order.orderId, selectedReason, additionalComments);
    
    setIsSubmitting(false);
    onClose();
  };

  const isPrepaid = order.paymentMethod !== 'COD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in no-print">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-rose-50 text-rose-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-sm">Cancel Order #{order.orderId}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-rose-100 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleConfirmCancellation} className="p-6 space-y-4">
          <p className="text-xs text-gray-600">
            Please tell us why you want to cancel this order. Your feedback helps us improve our delivery and service.
          </p>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Reason for Cancellation *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium text-gray-800"
            >
              {cancellationReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Comments */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Additional Feedback (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Provide more details..."
              className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          {/* Refund Notice Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Refund Details</span>
            </div>
            {isPrepaid ? (
              <p className="text-emerald-700 leading-relaxed text-[11px]">
                A full refund of <strong>₹{order.pricing?.totalPayable?.toLocaleString('en-IN')}</strong> will be reversed back to your original payment mode ({order.paymentMethod}) within <strong>2-4 business days</strong>.
              </p>
            ) : (
              <p className="text-emerald-700 leading-relaxed text-[11px]">
                This was a Cash on Delivery order. No amount was collected, so no refund is necessary.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Keep Order
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition active:scale-95 disabled:bg-gray-400 cursor-pointer"
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
