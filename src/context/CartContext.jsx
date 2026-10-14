import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'zapkart_cart_v1';
const WISHLIST_STORAGE_KEY = 'zapkart_wishlist_v1';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load wishlist from localStorage', e);
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((current) => (current && current.message === message ? null : current));
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product.inStock || product.stock === 0) {
      showToast(`${product.title.slice(0, 30)}... is currently Out of Stock!`, 'error');
      return false;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const item = prev[existingIndex];
        const updatedQty = item.quantity + quantity;
        if (updatedQty > product.stock) {
          showToast(`Maximum available stock is ${product.stock} units`, 'warning');
          const updated = [...prev];
          updated[existingIndex] = { ...item, quantity: product.stock };
          return updated;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...item, quantity: updatedQty };
        showToast(`Updated quantity for ${product.title.slice(0, 24)}...`);
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock);
        showToast(`Added ${product.title.slice(0, 24)}... to Cart!`);
        return [...prev, { ...product, quantity: initialQty }];
      }
    });
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          if (newQuantity > item.stock) {
            showToast(`Only ${item.stock} units available in stock`, 'warning');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) {
        showToast(`Removed from Cart`, 'info');
      }
      return prev.filter((i) => i.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Added to Wishlist! ❤️`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalMRP = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const totalDiscountedPrice = cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const totalSavings = totalMRP - totalDiscountedPrice;
  // Delivery Fee: Free over ₹500, else ₹40 (if cart is empty, 0)
  const deliveryFee = cart.length === 0 ? 0 : totalDiscountedPrice >= 500 ? 0 : 40;
  const totalPayable = totalDiscountedPrice + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        totalMRP,
        totalDiscountedPrice,
        totalSavings,
        deliveryFee,
        totalPayable,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
