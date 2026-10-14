import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { checkPincodeServiceability } from '../utils/pincodeData';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Check,
  MapPin,
  Banknote
} from 'lucide-react';

export const ProductQuickView = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist, cart } = useCart();
  const { navigateTo, pincodeInfo, updatePincode } = useOrder();
  const [quantity, setQuantity] = useState(1);

  // Pincode checker state
  const [testPin, setTestPin] = useState(pincodeInfo.pincode || '');
  const [pinResult, setPinResult] = useState(() => checkPincodeServiceability(pincodeInfo.pincode || '110001'));

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find((i) => i.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigateTo('checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    const res = checkPincodeServiceability(testPin);
    setPinResult(res);
    if (res.isValid && res.serviceable) {
      updatePincode(testPin, res.city, res.state);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in no-print">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100 flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-gray-700 bg-white/80 hover:bg-gray-100 rounded-full transition shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 p-6 bg-gray-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
          {product.badge && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs uppercase">
              {product.badge}
            </span>
          )}

          <div className="w-full max-w-[280px] aspect-square flex items-center justify-center relative">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-full object-contain drop-shadow-md"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Original
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-700">
              <RotateCcw className="w-4 h-4 text-blue-600" /> 7 Days Replacement
            </span>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-bold text-blue-600 uppercase tracking-wider">{product.brand}</span>
              <span className="text-gray-400">{product.category}</span>
            </div>

            <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2 font-heading">
              {product.title}
            </h2>

            {/* Ratings and Assured */}
            <div className="flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-gray-500">
                {product.reviewCount?.toLocaleString('en-IN')} Ratings & Verified Reviews
              </span>
              {product.isAssured && (
                <span className="ml-auto text-xs font-black italic text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  ⚡ Assured
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-gray-950 font-heading">
                  ₹{product.discountedPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {product.discountPercent}% OFF
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Inclusive of all taxes. Free express shipping on this order.
              </p>
            </div>

            {/* Pincode Serviceability Check Widget */}
            <div className="mb-4 bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Delivery & Pincode Serviceability</span>
              </span>
              <form onSubmit={handleCheckPincode} className="flex gap-2 mb-2">
                <input
                  type="text"
                  maxLength={6}
                  value={testPin}
                  onChange={(e) => setTestPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN"
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                >
                  Check
                </button>
              </form>

              {pinResult && pinResult.isValid && (
                <div className="space-y-1 text-[11px]">
                  <div className="text-emerald-800 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{pinResult.speed}</span>
                  </div>
                  <div className="text-gray-600 flex items-center justify-between">
                    <span>Delivering to: <strong>{pinResult.city}, {pinResult.state}</strong></span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <Banknote className="w-3 h-3" /> COD Available
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Specs Table */}
            {product.specs && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Key Specifications
                </h4>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-gray-100 last:border-none">
                      <span className="text-gray-500 font-medium">{spec.key}</span>
                      <span className="text-gray-800 font-semibold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="mb-4 text-xs font-medium">
              {product.inStock ? (
                product.stock <= 5 ? (
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Hurry! Only {product.stock} left in stock.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>In Stock ({product.stock} units available)</span>
                  </div>
                )
              ) : (
                <div className="text-rose-600 font-bold bg-rose-50 p-2 rounded-lg">
                  Currently Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
            {product.inStock && (
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-2 py-1.5 bg-white shrink-0 sm:w-28">
                <span className="text-xs font-semibold text-gray-500">Qty:</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="text-xs font-bold text-gray-800 focus:outline-none bg-transparent cursor-pointer"
                >
                  {Array.from({ length: Math.min(product.stock, 5) }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart */}
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{cartQty > 0 ? `Add More (${cartQty})` : 'Add to Cart'}</span>
            </button>

            {/* Buy Now */}
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleBuyNow}
              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now</span>
            </button>

            {/* Wishlist Toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`p-2.5 rounded-lg border transition shrink-0 cursor-pointer ${
                isFavorited
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-gray-200 text-gray-600 hover:text-rose-600 hover:bg-gray-50'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
