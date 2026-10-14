import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto no-print">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar (hidden when printing) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-gray-800">Tax Invoice / Order Slip</span>
            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
              #{order.orderId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 text-gray-800 text-xs bg-white">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-300 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black italic tracking-tight font-heading text-blue-700">
                  Zap<span className="text-amber-500">Kart</span>
                </span>
                <span className="text-[10px] font-bold text-gray-500 border border-gray-300 px-1 rounded ml-1">
                  RETAIL
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                ZapKart Retail Internet India Pvt Ltd<br />
                Outer Ring Road, Devarabeesanahalli, Bengaluru - 560103<br />
                <strong>GSTIN:</strong> 29AABCS1429B1Z0 • <strong>CIN:</strong> U51109KA2012PTC066107
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider">
                TAX INVOICE
              </h2>
              <p className="text-gray-600 mt-1">
                <strong>Invoice No:</strong> INV-{order.orderId.replace('OD', '')}<br />
                <strong>Order ID:</strong> {order.orderId}<br />
                <strong>Order Date:</strong> {order.displayDate}<br />
                <strong>Payment Mode:</strong> {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Addresses: Sold By vs Shipped To */}
          <div className="grid grid-cols-2 gap-6 border-b border-gray-300 pb-5 mb-5 text-[11px]">
            <div>
              <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-1">
                Billed To & Shipped To:
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-gray-900">{order.address?.name}</strong><br />
                {order.address?.addressLine}<br />
                {order.address?.city}, {order.address?.state} - {order.address?.pincode}<br />
                Phone: {order.address?.phone}<br />
                Place of Supply: {order.address?.state} (07)
              </p>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-1">
                Delivery Details:
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Courier Partner: <strong>ZapKart Express Logistics</strong><br />
                AWB Tracking: <strong>ZPK{order.orderId.replace('OD', '88')}IN</strong><br />
                Estimated Delivery: <strong>{order.estimatedDelivery}</strong><br />
                Status: <span className="text-emerald-700 font-bold">PAID / CONFIRMED</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-gray-300 rounded-lg overflow-hidden mb-5">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold uppercase">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-center">HSN</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="p-2.5 text-gray-500">{idx + 1}</td>
                    <td className="p-2.5">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-[10px] text-gray-500">Brand: {item.brand} | Cat: {item.category}</div>
                    </td>
                    <td className="p-2.5 text-center text-gray-500 font-mono">851830</td>
                    <td className="p-2.5 text-center font-bold text-gray-900">{item.quantity}</td>
                    <td className="p-2.5 text-right font-mono">₹{item.discountedPrice.toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                      ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown & Signatory */}
          <div className="flex justify-between items-start gap-6 text-[11px]">
            <div className="flex-1 space-y-1 text-gray-500">
              <p><strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
              <p className="text-[10px] text-gray-400 mt-2">
                * This is a computer-generated tax invoice and requires no physical signature.
              </p>
            </div>

            <div className="w-64 space-y-1.5 border-t border-gray-200 pt-2 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Net):</span>
                <span className="font-mono">₹{order.pricing?.totalDiscountedPrice?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IGST / CGST (18% incl.):</span>
                <span className="font-mono">
                  ₹{Math.round((order.pricing?.totalDiscountedPrice || 0) * 0.18 / 1.18).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges:</span>
                <span className="font-mono">
                  {order.pricing?.deliveryFee === 0 ? 'FREE' : `₹${order.pricing?.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold border-t border-gray-200 pt-1">
                <span>Total Savings:</span>
                <span className="font-mono">- ₹{order.pricing?.totalSavings?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-black text-sm border-t-2 border-gray-900 pt-1">
                <span>Grand Total:</span>
                <span className="font-mono">₹{order.pricing?.totalPayable?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Barcode Simulation */}
          <div className="mt-8 pt-4 border-t border-dashed border-gray-300 flex items-center justify-between text-[10px] text-gray-500">
            <div className="font-mono tracking-widest text-gray-700">
              ||| | ||||| || |||||| | ||| || ||||||| {order.orderId}
            </div>
            <div>Thank you for shopping with ZapKart! For support visit zapkart.com/help</div>
          </div>

        </div>

        {/* Modal Bottom Actions (hidden when printing) */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print or Download PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
