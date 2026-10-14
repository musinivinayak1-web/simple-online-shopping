import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { MapPin, X, Check, Navigation } from 'lucide-react';

const popularPincodes = [
  { pin: '110001', city: 'Connaught Place, New Delhi', state: 'Delhi', eta: 'Tomorrow, 11 AM' },
  { pin: '400001', city: 'Fort / Colaba, Mumbai', state: 'Maharashtra', eta: 'Tomorrow, 2 PM' },
  { pin: '560001', city: 'MG Road, Bengaluru', state: 'Karnataka', eta: 'Same-Day by 9 PM' },
  { pin: '600001', city: 'George Town, Chennai', state: 'Tamil Nadu', eta: '2 Days Delivery' },
  { pin: '700001', city: 'BBD Bagh, Kolkata', state: 'West Bengal', eta: '2 Days Delivery' },
  { pin: '500001', city: 'Abids / Koti, Hyderabad', state: 'Telangana', eta: 'Tomorrow, 4 PM' }
];

export const PincodeModal = ({ isOpen, onClose }) => {
  const { pincodeInfo, updatePincode } = useOrder();
  const [inputPin, setInputPin] = useState(pincodeInfo.pincode || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = (pin, city, state) => {
    if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setError('');
    updatePincode(pin, city || 'Verified Location', state || 'India');
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const matched = popularPincodes.find((p) => p.pin === inputPin);
    if (matched) {
      handleApply(matched.pin, matched.city, matched.state);
    } else {
      handleApply(inputPin, 'Standard Delivery Area', 'India');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Choose Your Delivery Location</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-gray-500 mb-4">
            Select your delivery location to see product availability and accurate delivery dates.
          </p>

          <form onSubmit={handleManualSubmit} className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Enter a 6-digit PIN code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputPin}
                onChange={(e) => {
                  setInputPin(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="e.g. 560001"
                className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest text-center font-bold"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition active:scale-95 shadow-xs"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-xs text-rose-500 mt-2 font-medium">{error}</p>}
          </form>

          {/* Quick Select Popular Cities */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <span>Popular Delivery Hubs</span>
              <span className="text-emerald-600 font-medium">⚡ Express Ready</span>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {popularPincodes.map((item) => {
                const isSelected = item.pin === pincodeInfo.pincode;
                return (
                  <button
                    key={item.pin}
                    type="button"
                    onClick={() => handleApply(item.pin, item.city, item.state)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm">{item.pin}</span>
                        <span className="text-xs text-gray-600 truncate max-w-[180px]">{item.city}</span>
                      </div>
                      <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
                        ⚡ {item.eta}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-blue-500" />
            <span>Currently delivering to: <strong>{pincodeInfo.pincode}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
