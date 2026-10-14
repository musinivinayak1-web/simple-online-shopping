import React from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { Heart, ShoppingCart, Trash2, ArrowRight, Zap, Star } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { navigateTo } = useOrder();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 text-center max-w-md shadow-xs">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 mb-6">
            Tap the heart icon on any product to save items you love and buy them whenever you're ready!
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center gap-2 mx-auto"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 font-heading flex items-center gap-2">
              My Wishlist
              <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Items saved for later. Prices and availability are subject to change.
            </p>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative pt-[75%] bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-xs transition"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-xs line-clamp-2 mt-0.5 mb-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      <span>{product.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-white" />
                    </div>
                    {product.isAssured && (
                      <span className="text-[10px] font-black italic text-blue-700 bg-blue-50 px-1 rounded">
                        ⚡ Assured
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-black text-gray-950 font-heading">
                      ₹{product.discountedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {product.discountPercent}% off
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex gap-2">
                  <button
                    type="button"
                    disabled={!product.inStock}
                    onClick={() => {
                      addToCart(product, 1);
                      toggleWishlist(product);
                    }}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
