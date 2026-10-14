import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { AddressForm } from '../components/AddressForm';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle,
  Home,
  Briefcase
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout, updateProfile, setIsAuthModalOpen } = useAuth();
  const { addresses, addAddress, updateAddress, deleteAddress, orders, navigateTo } = useOrder();
  const { wishlist } = useCart();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || 'Vinay Kumar');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'vinay.kumar@example.com');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+91 98765 43210');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 text-center max-w-md w-full shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-heading">Sign In to View Profile</h2>
          <p className="text-xs text-gray-500 mb-6">
            Log in with your mobile number or email using instant OTP to view saved addresses and track orders.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition"
          >
            Log In with OTP
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });
    setIsEditingProfile(false);
  };

  const handleSaveAddress = (addrData) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addrData);
    } else {
      addAddress(addrData);
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const activeOrdersCount = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Profile Hero Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl font-heading shadow-md ring-4 ring-blue-50 shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-heading">
                  {user.name}
                </h1>
                <span className="text-[11px] font-black text-amber-900 bg-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 fill-amber-950" /> Plus Member ✦
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-gray-700">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> {user.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-700">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" /> {user.email}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex-1 md:flex-none px-4 py-2 text-xs font-bold border border-gray-300 hover:bg-gray-50 rounded-xl transition shadow-2xs"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={logout}
              className="flex-1 md:flex-none px-4 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 animate-fade-in">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800">Edit Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => navigateTo('orders')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-400 transition"
          >
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Total Orders</span>
              <span className="text-2xl font-black text-gray-900 font-heading">{orders.length}</span>
              <span className="text-[11px] text-blue-600 block mt-0.5">{activeOrdersCount} in transit</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => navigateTo('wishlist')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-rose-400 transition"
          >
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Wishlist Items</span>
              <span className="text-2xl font-black text-gray-900 font-heading">{wishlist.length}</span>
              <span className="text-[11px] text-rose-600 block mt-0.5">Saved for later</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Saved Addresses</span>
              <span className="text-2xl font-black text-gray-900 font-heading">{addresses.length}</span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">Verified Pincodes</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Manage Saved Addresses Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900 font-heading">
                Manage Delivery Addresses
              </h2>
              <p className="text-xs text-gray-500">
                Pre-filled addresses used for 1-click Express Checkout
              </p>
            </div>
            {!showAddressForm && (
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setShowAddressForm(true);
                }}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            )}
          </div>

          {/* Inline Address Form if adding or editing */}
          {showAddressForm && (
            <AddressForm
              initialData={editingAddress}
              onSave={handleSaveAddress}
              onCancel={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
            />
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{addr.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-gray-200 text-gray-700 flex items-center gap-1">
                        {addr.type === 'WORK' ? <Briefcase className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                        {addr.type || 'HOME'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {addr.addressLine}<br />
                    {addr.city}, {addr.state} - <strong>{addr.pincode}</strong><br />
                    <span className="text-gray-800 font-semibold">Phone: {addr.phone}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3 text-xs font-bold">
                  <button
                    onClick={() => {
                      setEditingAddress(addr);
                      setShowAddressForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
