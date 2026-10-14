import React, { useState } from 'react';
import { indianStatesAndUTs, checkPincodeServiceability } from '../utils/pincodeData';
import { MapPin, Phone, User, Home, Briefcase, Check, AlertCircle } from 'lucide-react';

export const AddressForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone?.replace('+91 ', '') || '',
    pincode: initialData?.pincode || '',
    houseNo: initialData?.houseNo || '',
    street: initialData?.street || '',
    landmark: initialData?.landmark || '',
    city: initialData?.city || '',
    state: initialData?.state || 'Delhi',
    type: initialData?.type || 'HOME',
    isDefault: initialData?.isDefault || false
  });

  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [error, setError] = useState('');

  // Handle pincode change with instant serviceability check & auto city/state fill
  const handlePincodeChange = (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      const result = checkPincodeServiceability(pin);
      setPincodeStatus(result);
      if (result.isValid && result.serviceable) {
        setFormData((prev) => ({
          ...prev,
          city: result.city !== 'Standard Delivery Zone' ? result.city.split(',')[0] : prev.city || 'Central',
          state: result.state || prev.state
        }));
      }
    } else {
      setPincodeStatus(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter full name');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    if (!formData.houseNo.trim() || !formData.street.trim()) {
      setError('Please provide Flat/House No. and Street/Area details');
      return;
    }

    setError('');

    // Combine full address line for backward compatibility & invoice printing
    const addressLine = `${formData.houseNo}, ${formData.street}${formData.landmark ? `, Near ${formData.landmark}` : ''}`;
    
    onSave({
      ...formData,
      phone: `+91 ${formData.phone.replace(/\D/g, '')}`,
      addressLine
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>{initialData ? 'Edit Delivery Address' : 'Add New Indian Delivery Address'}</span>
        </h3>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
          All-India Serviceable
        </span>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Name and Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vinay Kumar"
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            10-Digit Mobile Number *
          </label>
          <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-2.5 border-r border-gray-300 flex items-center">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              placeholder="9876543210"
              className="w-full text-xs px-3 py-2.5 focus:outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Pincode with Live Verification */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Pincode (6 digits) *
          </label>
          <input
            type="text"
            maxLength={6}
            required
            value={formData.pincode}
            onChange={handlePincodeChange}
            placeholder="e.g. 560103"
            className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono font-bold tracking-widest text-center"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            City / Town / District *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Bengaluru"
            className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            State (28 States & UTs) *
          </label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full text-xs px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-medium"
          >
            {indianStatesAndUTs.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Pincode Serviceability Indicator */}
      {pincodeStatus && (
        <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
          pincodeStatus.serviceable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700'
        }`}>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{pincodeStatus.message}</span>
          </div>
          {pincodeStatus.speed && (
            <span className="font-bold text-[11px] bg-white px-2 py-0.5 rounded shadow-2xs">
              ⚡ {pincodeStatus.speed}
            </span>
          )}
        </div>
      )}

      {/* House No & Street */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Flat, House No., Building, Apartment *
          </label>
          <input
            type="text"
            required
            value={formData.houseNo}
            onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
            placeholder="e.g. Flat 402, Sunshine Residency"
            className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Area, Colony, Street, Sector, Village *
          </label>
          <input
            type="text"
            required
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            placeholder="e.g. Outer Ring Road, Bellandur"
            className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Landmark (Optional)
        </label>
        <input
          type="text"
          value={formData.landmark}
          onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
          placeholder="e.g. Opposite Ecospace Tech Park"
          className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
        />
      </div>

      {/* Address Type: Home / Work */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Address Type
        </label>
        <div className="flex gap-4">
          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
            formData.type === 'HOME' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs' : 'border-gray-200 text-gray-600'
          }`}>
            <input
              type="radio"
              name="addressType"
              checked={formData.type === 'HOME'}
              onChange={() => setFormData({ ...formData, type: 'HOME' })}
              className="hidden"
            />
            <Home className="w-4 h-4 text-blue-600" />
            <span>Home (All-Day Delivery)</span>
          </label>

          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
            formData.type === 'WORK' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs' : 'border-gray-200 text-gray-600'
          }`}>
            <input
              type="radio"
              name="addressType"
              checked={formData.type === 'WORK'}
              onChange={() => setFormData({ ...formData, type: 'WORK' })}
              className="hidden"
            />
            <Briefcase className="w-4 h-4 text-purple-600" />
            <span>Work (Delivery 9 AM - 6 PM)</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          Save & Deliver Here
        </button>
      </div>
    </form>
  );
};
