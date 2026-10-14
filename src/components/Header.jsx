import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/products';
import { PincodeModal } from './PincodeModal';
import { EmailNotificationDrawer } from './EmailNotificationDrawer';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  MapPin, 
  ChevronDown, 
  Package, 
  Sparkles, 
  X,
  Zap,
  User,
  LogOut,
  Mail,
  ShieldCheck
} from 'lucide-react';

export const Header = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  const { totalItemsCount, wishlist } = useCart();
  const { activePage, navigateTo, pincodeInfo, orders } = useOrder();
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#2874f0] text-white shadow-md no-print">
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => navigateTo('home')}
                className="text-left flex flex-col group transition cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black italic tracking-tight font-heading text-white flex items-center">
                    Zap<span className="text-amber-400">Kart</span>
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400 ml-0.5" />
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold tracking-wide italic text-gray-200">
                  <span>Explore</span>
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    Plus <Sparkles className="w-3 h-3 inline fill-amber-400" />
                  </span>
                </div>
              </button>

              {/* Delivery Pincode Locator */}
              <button
                type="button"
                onClick={() => setIsPinModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition text-left cursor-pointer border border-transparent hover:border-white/20"
                title="Click to change delivery pin code"
              >
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="leading-tight">
                  <span className="block text-[10px] text-blue-100 font-medium">Deliver to</span>
                  <span className="block text-xs font-bold text-white flex items-center gap-1">
                    {pincodeInfo.pincode}
                    <ChevronDown className="w-3 h-3 text-blue-200" />
                  </span>
                </div>
              </button>
            </div>

            {/* Live Search Bar with Category Dropdown */}
            <div className="flex-1 max-w-2xl relative">
              <div className="flex items-center bg-white rounded-lg shadow-inner overflow-hidden border border-transparent focus-within:ring-2 focus-within:ring-amber-400">
                {/* Category Dropdown Pill */}
                <div className="relative hidden lg:block shrink-0 border-r border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 transition"
                  >
                    <span className="truncate max-w-[110px]">{selectedCategory}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {isCategoryDropdownOpen && (
                    <div 
                      className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50 animate-fade-in"
                      onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsCategoryDropdownOpen(false);
                            if (activePage !== 'home') navigateTo('home');
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-blue-50 transition flex items-center justify-between ${
                            selectedCategory === cat ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-gray-700'
                          }`}
                        >
                          <span>{cat}</span>
                          {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (activePage !== 'home') navigateTo('home');
                  }}
                  placeholder="Search for Mobiles, Electronics, Brands and More..."
                  className="w-full px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />

                {/* Clear button */}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition mr-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Search Submit Icon */}
                <button
                  type="button"
                  onClick={() => {
                    if (activePage !== 'home') navigateTo('home');
                  }}
                  className="px-4 py-2 text-blue-600 hover:bg-gray-50 transition shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Auth, Outbox, Wishlist, Cart */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              
              {/* Automated Email Hub Button */}
              <button
                type="button"
                onClick={() => setIsEmailDrawerOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition text-xs font-semibold"
                title="View Automated Customer & Admin Emails"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span className="hidden xl:inline">Emails</span>
              </button>

              {/* Account / Login Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/10 transition text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-blue-200" />
                  </button>

                  {isUserMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 text-gray-800 animate-fade-in"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-xs font-bold text-gray-900 truncate">{user.name}</div>
                        <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          navigateTo('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-blue-50 text-gray-700 hover:text-blue-600 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5" /> My Profile
                      </button>

                      <button
                        onClick={() => {
                          navigateTo('orders');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-blue-50 text-gray-700 hover:text-blue-600 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" /> My Orders
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
                          {orders.length}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          navigateTo('wishlist');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-blue-50 text-gray-700 hover:text-blue-600 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5" /> Wishlist
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">
                          {wishlist.length}
                        </span>
                      </button>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white hover:bg-gray-100 text-blue-700 font-bold px-3.5 py-1.5 rounded-md text-xs sm:text-sm transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => navigateTo('wishlist')}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition font-medium text-xs sm:text-sm ${
                  activePage === 'wishlist' ? 'bg-white/15' : ''
                }`}
                title="View Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-300 fill-rose-300' : 'text-white'}`} />
                <span className="hidden lg:inline">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button with Counter Badge */}
              <button
                onClick={() => navigateTo('cart')}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold transition shadow-xs ${
                  activePage === 'cart' ? 'ring-2 ring-white' : ''
                }`}
              >
                <ShoppingCart className="w-5 h-5 text-gray-900" />
                <span className="hidden sm:inline text-sm">Cart</span>
                <span className="bg-gray-900 text-amber-400 rounded-full min-w-5 h-5 px-1 text-xs font-black flex items-center justify-center">
                  {totalItemsCount}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Pincode Bar */}
        <div className="md:hidden bg-[#1f62d1] px-4 py-1.5 flex items-center justify-between text-xs text-blue-100 border-t border-blue-400/30">
          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="flex items-center gap-1.5 text-left w-full"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              Deliver to: <strong>{pincodeInfo.pincode}</strong> ({pincodeInfo.city})
            </span>
            <ChevronDown className="w-3 h-3 text-blue-200 ml-auto" />
          </button>
        </div>
      </header>

      {/* Pincode Selection Modal */}
      <PincodeModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />

      {/* Email Notification Drawer */}
      <EmailNotificationDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
      />
    </>
  );
};
