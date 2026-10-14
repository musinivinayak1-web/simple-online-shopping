import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider, useOrder } from './context/OrderContext';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';

const AppContent = () => {
  const { activePage } = useOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 font-sans selection:bg-amber-400 selection:text-gray-900">
      {/* Primary Sticky Header with Search, Pincode Locator & User Account */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Secondary Horizontal Category Bar */}
      {activePage === 'home' && (
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      )}

      {/* Main Page Router */}
      <div className="flex-1">
        {activePage === 'home' && (
          <HomePage
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'confirmation' && <OrderConfirmationPage />}
        {activePage === 'orders' && <MyOrdersPage />}
        {activePage === 'profile' && <ProfilePage />}
        {activePage === 'wishlist' && <WishlistPage />}
      </div>

      {/* Global E-commerce Footer */}
      <Footer />

      {/* Floating Animated Toast Feedback */}
      <Toast />

      {/* Global Flipkart-style OTP Login Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
