import React from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Zap, 
  Heart,
  Truck,
  CheckCircle2
} from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    totalMRP,
    totalDiscountedPrice,
    totalSavings,
    deliveryFee,
    totalPayable,
    toggleWishlist,
    isInWishlist
  } = useCart();

  const { navigateTo, pincodeInfo } = useOrder();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-100">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 text-center max-w-lg w-full shadow-xs">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
            Your Cart is Empty!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Explore our curated range of electronics, gadgets, and apparel with the best festival discounts.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition active:scale-95 shadow-md flex items-center gap-2 mx-auto"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cart Page Title & Subhead */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 font-heading flex items-center gap-2">
              Shopping Cart
              <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Deliver to: <strong>{pincodeInfo.pincode}</strong> ({pincodeInfo.city})
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* 2-Column Cart Layout: Items List (Left) + Price Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Delivery address reassurance banner */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Delivery pin code: <strong>{pincodeInfo.pincode}</strong>
                </span>
              </div>
              <span className="text-emerald-600 font-bold">
                {deliveryFee === 0 ? 'FREE Express Delivery Eligible' : 'Standard Delivery ₹40'}
              </span>
            </div>

            {/* List of Cart Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
              {cart.map((item) => {
                const isOverLimit = item.quantity >= item.stock;
                const isFavorite = isInWishlist(item.id);

                return (
                  <div key={item.id} className="p-4 sm:p-6 transition hover:bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      
                      {/* Product Image */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg p-2 shrink-0 border border-gray-100 flex items-center justify-center relative self-center sm:self-start">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                        {item.isAssured && (
                          <span className="absolute bottom-1 right-1 text-[9px] font-black italic bg-blue-50 text-blue-700 border border-blue-200 px-1 rounded">
                            ⚡ Assured
                          </span>
                        )}
                      </div>

                      {/* Product Info & Actions */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                              {item.brand}
                            </span>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 mt-0.5">
                              {item.title}
                            </h3>
                          </div>
                          
                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-rose-600 p-1 rounded-md transition"
                            title="Remove Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-black text-gray-950 font-heading">
                            ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            {item.discountPercent}% off
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[11px] text-gray-400">
                              (₹{item.discountedPrice.toLocaleString('en-IN')} each)
                            </span>
                          )}
                        </div>

                        {/* Stock Limit / Out-of-Stock Warning Badge */}
                        <div className="mt-2 text-xs">
                          {isOverLimit ? (
                            <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md font-semibold border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                              <span>Maximum available quantity reached ({item.stock} in stock)</span>
                            </div>
                          ) : item.stock <= 5 ? (
                            <span className="text-rose-600 font-semibold">
                              Hurry, only {item.stock} left in stock!
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium">
                              In Stock • Eligible for FREE Express Delivery
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls & Secondary Actions */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 flex-wrap gap-3">
                          {/* Quantity Selector (+ / - / delete) */}
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition active:scale-95"
                              title="Decrease Quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-4 py-1 text-xs font-bold text-gray-900 border-x border-gray-200 select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isOverLimit}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={`px-3 py-1.5 text-gray-600 transition active:scale-95 ${
                                isOverLimit
                                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                  : 'hover:bg-gray-100'
                              }`}
                              title={isOverLimit ? 'Max stock reached' : 'Increase Quantity'}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Save to Wishlist & Remove Links */}
                          <div className="flex items-center gap-4 text-xs font-semibold">
                            <button
                              type="button"
                              onClick={() => toggleWishlist(item)}
                              className="text-gray-600 hover:text-rose-600 flex items-center gap-1 transition"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                              <span>{isFavorite ? 'Saved in Wishlist' : 'Save for Later'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-500 hover:text-rose-600 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Promise Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Guaranteed Safe Delivery:</span> All items are packed with sanitized protection and handled by verified couriers.
              </div>
            </div>

          </div>

          {/* Right Column: Price Breakdown Card (Sticky Right Sidebar) */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price Details ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                </h2>
              </div>

              {/* Price Calculation Rows */}
              <div className="p-4 space-y-3 text-sm">
                {/* Total MRP */}
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP</span>
                  <span className="font-medium text-gray-900">₹{totalMRP.toLocaleString('en-IN')}</span>
                </div>

                {/* Discount on MRP */}
                <div className="flex justify-between text-emerald-600">
                  <span>Discount on MRP</span>
                  <span className="font-semibold">- ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>

                {/* Delivery Charges */}
                <div className="flex justify-between text-gray-600 items-center">
                  <span>Delivery Charges</span>
                  <div>
                    {deliveryFee === 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs line-through text-gray-400">₹40</span>
                        <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">₹40</span>
                    )}
                  </div>
                </div>

                {deliveryFee > 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-md">
                    Add items worth ₹{(500 - totalDiscountedPrice).toLocaleString('en-IN')} more to unlock <strong>FREE Delivery</strong>!
                  </p>
                )}

                {/* Total Payable Amount */}
                <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-base font-heading">
                    Total Payable Amount
                  </span>
                  <span className="text-xl font-black text-gray-950 font-heading">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Savings Guarantee Banner (Green Text) */}
              <div className="bg-emerald-50 px-4 py-3 border-t border-emerald-100 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You will save ₹{totalSavings.toLocaleString('en-IN')} on this order 🎉</span>
              </div>

              {/* Place Order CTA Button */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigateTo('checkout')}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <span>Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-gray-500">
              <ShieldCheck className="w-5 h-5 text-gray-600 shrink-0" />
              <span>
                Safe and Secure Payments. 100% Authentic products guaranteed.
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
