import React from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Check, 
  AlertTriangle,
  Eye,
  ShieldCheck
} from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, isInWishlist, toggleWishlist, cart } = useCart();
  const { navigateTo } = useOrder();

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!product.inStock || product.stock === 0) return;
    addToCart(product, 1);
    navigateTo('checkout');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      onClick={() => onQuickView && onQuickView(product)}
      className="group bg-white rounded-xl border border-gray-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
    >
      {/* Top Badges & Wishlist Heart */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {/* Deal / Bestseller Badge */}
        <div className="pointer-events-auto">
          {product.badge && (
            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md shadow-xs uppercase tracking-wider ${
              product.badge === 'Deal of the Day'
                ? 'bg-rose-600 text-white'
                : product.badge === 'Bestseller'
                ? 'bg-amber-400 text-gray-900'
                : 'bg-indigo-600 text-white'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md shadow-sm transition active:scale-90 ${
            isFavorited 
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
              : 'bg-white/80 text-gray-500 hover:text-rose-500 hover:bg-white'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="relative pt-[80%] overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>

        {/* Out of Stock Ribbon */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-blue-600">{product.brand}</span>
            <span className="text-gray-400 text-[11px]">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition mb-2">
            {product.title}
          </h3>

          {/* Rating & Assured Badge */}
          <div className="flex items-center gap-2 mb-3">
            {/* Star Rating Badge (Flipkart Style Green Badge) */}
            <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>

            <span className="text-xs text-gray-500">
              ({product.reviewCount?.toLocaleString('en-IN')})
            </span>

            {/* Flipkart Assured or Prime Badge */}
            {product.isAssured && (
              <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] font-black italic text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                ⚡ Assured
              </span>
            )}
          </div>

          {/* Key Specs Highlights snippet */}
          {product.specs && product.specs.length > 0 && (
            <ul className="text-xs text-gray-500 space-y-1 mb-3 hidden sm:block">
              {product.specs.slice(0, 2).map((spec, i) => (
                <li key={i} className="flex items-start gap-1.5 truncate">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="font-medium text-gray-700">{spec.key}:</span>
                  <span className="text-gray-500 truncate">{spec.value}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Price Block */}
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className="text-lg sm:text-xl font-black text-gray-950 font-heading">
              ₹{product.discountedPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {product.discountPercent}% off
            </span>
          </div>

          {/* Free Delivery & Stock Status */}
          <div className="text-[11px] font-medium text-gray-600 mb-3 flex items-center justify-between">
            <span className="text-emerald-700 font-semibold">{product.deliveryTime || 'FREE Delivery'}</span>
            {product.inStock && product.stock <= 5 && (
              <span className="text-rose-600 font-bold flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Only {product.stock} left!
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 mt-auto">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition active:scale-95 ${
              !product.inStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : cartQty > 0
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-amber-400 hover:bg-amber-300 text-gray-950 shadow-xs'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{cartQty > 0 ? `In Cart (${cartQty})` : 'Add to Cart'}</span>
          </button>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleBuyNow}
            className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-bold transition active:scale-95 ${
              !product.inStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-xs'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
