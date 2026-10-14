import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage, setToastMessage } = useCart();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
      <div className="flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-800 max-w-sm">
        {icons[toastMessage.type] || icons.success}
        <span className="text-sm font-medium pr-2">{toastMessage.message}</span>
        <button
          onClick={() => setToastMessage(null)}
          className="text-gray-400 hover:text-white p-1 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
