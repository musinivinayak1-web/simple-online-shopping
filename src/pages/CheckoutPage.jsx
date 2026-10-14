import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { AddressForm } from '../components/AddressForm';
import { 
  MapPin, 
  PackageCheck, 
  CreditCard, 
  Check, 
  Plus, 
  Edit3, 
  ShieldCheck, 
  Smartphone, 
  Banknote, 
  Lock, 
  AlertCircle, 
  RefreshCw, 
  Loader2,
  ArrowLeft,
  Truck,
  User,
  Home,
  Briefcase
} from 'lucide-react';

export const CheckoutPage = () => {
  const {
    cart,
    totalItemsCount,
    totalMRP,
    totalDiscountedPrice,
    totalSavings,
    deliveryFee,
    totalPayable,
    clearCart
  } = useCart();

  const {
    addresses,
    selectedAddress,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    updateAddress,
    placeOrder,
    navigateTo
  } = useOrder();

  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();

  // Active step in checkout accordion: 1 = Address, 2 = Order Summary, 3 = Payment
  const [activeStep, setActiveStep] = useState(1);

  // Address editing / adding modal or form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState(null);

  // Payment method selection & inputs
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  
  // UPI states
  const [upiId, setUpiId] = useState('vinay@oksbi');
  const [upiError, setUpiError] = useState('');

  // Card states
  const [cardNumber, setCardNumber] = useState('4532 8920 1823 9012');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [cardName, setCardName] = useState(user?.name || 'VINAY KUMAR');
  const [cardError, setCardError] = useState('');

  // COD Captcha state
  const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState('');
  const [codError, setCodError] = useState('');

  // Payment processing loading state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
    setCardError('');
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
    setCardError('');
  };

  const handleSaveAddress = (addrData) => {
    if (editingAddressData) {
      updateAddress(editingAddressData.id, addrData);
    } else {
      addAddress(addrData);
    }
    setShowAddressForm(false);
    setEditingAddressData(null);
  };

  // Final Payment Processing Simulation
  const handleProcessPayment = () => {
    // Validate according to paymentMethod
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setUpiError('Please enter a valid UPI ID (e.g. yourname@okaxis)');
        return;
      }
      setUpiError('');
    } else if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 16) {
        setCardError('Please enter a complete 16-digit card number.');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setCardError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setCardError('Please enter a valid 3-digit CVV.');
        return;
      }
      setCardError('');
    } else if (paymentMethod === 'cod') {
      if (captchaInput !== captchaCode) {
        setCodError('Incorrect Captcha code. Please enter the 4 digits shown.');
        setCaptchaCode(generateCaptcha());
        return;
      }
      setCodError('');
    }

    // Trigger 2-second realistic loading state
    setIsProcessing(true);
    setProcessingStatus('Verifying payment details with bank...');

    setTimeout(() => {
      setProcessingStatus('Securing transaction & dispatching automated invoice emails...');
    }, 1000);

    setTimeout(() => {
      // Create order in OrderContext (dispatches both Customer & Admin emails)
      placeOrder({
        items: cart,
        pricing: {
          totalMRP,
          totalDiscountedPrice,
          totalSavings,
          deliveryFee,
          totalPayable
        },
        address: selectedAddress,
        paymentMethod: paymentMethod.toUpperCase(),
        userEmail: user?.email || 'customer@zapkart.in'
      });

      // Clear the cart
      clearCart();

      // Navigate to confirmation page
      setIsProcessing(false);
      navigateTo('confirmation');
    }, 2200);
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border text-center max-w-md shadow-xs">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Items to Checkout</h2>
          <p className="text-xs text-gray-500 mb-4">Please add products to your cart before proceeding to checkout.</p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <button
              onClick={() => navigateTo('cart')}
              className="flex items-center gap-1 hover:text-blue-600 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
            </button>
            <span>/</span>
            <span className="text-gray-900 font-bold">Secure Multi-Step Checkout</span>
          </div>

          {/* User Sign-In status */}
          <div className="text-xs">
            {isAuthenticated ? (
              <span className="text-gray-600">
                Ordering as: <strong className="text-blue-700">{user.name}</strong> ({user.email})
              </span>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-blue-600 hover:underline font-bold"
              >
                Sign in with OTP for faster checkout
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Multi-Step Accordion Flow */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* STEP 1: DELIVERY ADDRESS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div 
                className={`p-4 flex items-center justify-between border-b ${
                  activeStep === 1 ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-50 text-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === 1 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}>
                    {activeStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </span>
                  <h2 className="font-bold text-sm uppercase tracking-wider font-heading">
                    Delivery Address
                  </h2>
                </div>
                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3 py-1 rounded shadow-xs"
                  >
                    CHANGE
                  </button>
                )}
              </div>

              {/* Step 1 Content */}
              {activeStep === 1 && (
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Saved Addresses List */}
                  {!showAddressForm && (
                    <div className="space-y-3">
                      {addresses.map((addr) => {
                        const isSelected = addr.id === selectedAddressId;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="delivery-address"
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1 w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-bold text-sm text-gray-900">{addr.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-gray-200 text-gray-700 flex items-center gap-1">
                                  {addr.type === 'WORK' ? <Briefcase className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                                  {addr.type || 'HOME'}
                                </span>
                                <span className="text-xs font-semibold text-gray-700 ml-2">{addr.phone}</span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {addr.addressLine}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                              </p>
                              
                              {/* Action Buttons */}
                              <div className="mt-3 flex items-center gap-4">
                                {isSelected && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveStep(2);
                                    }}
                                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-xs transition active:scale-95 uppercase tracking-wider"
                                  >
                                    Deliver Here
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingAddressData(addr);
                                    setShowAddressForm(true);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add New Address Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddressData(null);
                          setShowAddressForm(true);
                        }}
                        className="w-full py-3 px-4 rounded-xl border border-dashed border-blue-400 bg-blue-50/40 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Indian Delivery Address</span>
                      </button>
                    </div>
                  )}

                  {/* Address Form (Add / Edit) with All 28 States & UTs */}
                  {showAddressForm && (
                    <AddressForm
                      initialData={editingAddressData}
                      onSave={handleSaveAddress}
                      onCancel={() => {
                        setShowAddressForm(false);
                        setEditingAddressData(null);
                      }}
                    />
                  )}
                </div>
              )}

              {/* Collapsed Step 1 summary when step > 1 */}
              {activeStep > 1 && selectedAddress && (
                <div className="p-4 text-xs text-gray-600 bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{selectedAddress.name}</span>
                    <span className="ml-2 text-gray-500">({selectedAddress.phone})</span>
                    <p className="text-gray-600 truncate max-w-md">
                      {selectedAddress.addressLine}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded">
                    ✓ Verified
                  </span>
                </div>
              )}
            </div>


            {/* STEP 2: ORDER SUMMARY */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div 
                className={`p-4 flex items-center justify-between border-b ${
                  activeStep === 2 ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-50 text-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === 2 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}>
                    {activeStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </span>
                  <h2 className="font-bold text-sm uppercase tracking-wider font-heading">
                    Order Summary ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                  </h2>
                </div>
                {activeStep > 2 && (
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3 py-1 rounded shadow-xs"
                  >
                    CHANGE
                  </button>
                )}
              </div>

              {/* Step 2 Content */}
              {activeStep === 2 && (
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center gap-4 bg-white">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-contain bg-gray-50 p-1 rounded-md shrink-0 border"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Qty: <strong className="text-gray-800">{item.quantity}</strong> • Brand: {item.brand}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-gray-900">
                            ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-emerald-600 font-semibold">
                            Saved ₹{((item.originalPrice - item.discountedPrice) * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs text-blue-900">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Estimated Express Delivery: <strong>Tomorrow by 8 PM</strong></span>
                    </div>
                    <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded shadow-2xs">
                      {deliveryFee === 0 ? 'FREE Shipping' : 'Standard ₹40'}
                    </span>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-md transition active:scale-95 uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Payment</span>
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeStep > 2 && (
                <div className="p-4 text-xs text-gray-600 bg-white flex items-center justify-between">
                  <span>{totalItemsCount} items confirmed for delivery</span>
                  <span className="font-bold text-gray-900">Total: ₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>


            {/* STEP 3: PAYMENT OPTIONS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div 
                className={`p-4 flex items-center justify-between border-b ${
                  activeStep === 3 ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-50 text-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === 3 ? 'bg-white text-blue-600' : 'bg-gray-300 text-gray-600'
                  }`}>
                    3
                  </span>
                  <h2 className="font-bold text-sm uppercase tracking-wider font-heading">
                    Payment Options
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-100">
                  <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Secured
                </div>
              </div>

              {/* Step 3 Content */}
              {activeStep === 3 && (
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Payment Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                        paymentMethod === 'upi' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                        paymentMethod === 'card' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                        paymentMethod === 'cod' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>

                  {/* 1. UPI Payment Simulation */}
                  {paymentMethod === 'upi' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Instant UPI Transfer
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">GPay</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">PhonePe</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Paytm</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Enter your UPI ID / VPA
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiError('');
                            }}
                            placeholder="username@okhdfcbank"
                            className="flex-1 text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setUpiId('vinay@okhdfcbank')}
                            className="text-xs bg-gray-200 hover:bg-gray-300 font-semibold px-3 py-2 rounded-lg text-gray-700"
                          >
                            Sample UPI
                          </button>
                        </div>
                        {upiError && <p className="text-xs text-rose-600 mt-1 font-medium">{upiError}</p>}
                        <p className="text-[11px] text-gray-500 mt-1.5">
                          A payment request will be sent to your UPI App after clicking Pay.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 2. Credit/Debit Card Simulation */}
                  {paymentMethod === 'card' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Credit / Debit / ATM Card
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                          <span className="text-blue-800">VISA</span> • <span className="text-red-600">MasterCard</span> • <span className="text-green-700">RuPay</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 8920 1823 9012"
                          className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-bold tracking-wider"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Valid Thru (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="08/28"
                            className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-bold text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">CVV (3 digits)</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => {
                              setCardCvv(e.target.value.replace(/\D/g, ''));
                              setCardError('');
                            }}
                            placeholder="•••"
                            className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="VINAY KUMAR"
                          className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase font-medium"
                        />
                      </div>

                      {cardError && <p className="text-xs text-rose-600 font-medium">{cardError}</p>}
                    </div>
                  )}

                  {/* 3. Cash on Delivery (COD) with Captcha */}
                  {paymentMethod === 'cod' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Pay cash or UPI to delivery agent
                        </span>
                      </div>

                      <p className="text-xs text-gray-600">
                        To prevent automated bot orders, please enter the 4-digit verification code below:
                      </p>

                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 max-w-xs">
                        <div className="bg-gray-900 text-amber-400 font-mono font-black text-xl px-4 py-1.5 rounded tracking-widest select-none italic line-through decoration-emerald-400">
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCaptchaCode(generateCaptcha())}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition"
                          title="Generate new code"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="max-w-xs">
                        <input
                          type="text"
                          maxLength={4}
                          value={captchaInput}
                          onChange={(e) => {
                            setCaptchaInput(e.target.value.replace(/\D/g, ''));
                            setCodError('');
                          }}
                          placeholder="Enter 4 digits above"
                          className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-bold tracking-widest text-center"
                        />
                        {codError && <p className="text-xs text-rose-600 font-medium mt-1">{codError}</p>}
                      </div>
                    </div>
                  )}

                  {/* Pay Button / Loading State */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleProcessPayment}
                      className={`w-full py-4 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98 uppercase tracking-wider ${
                        isProcessing
                          ? 'bg-gray-400 text-white cursor-wait'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{processingStatus || 'Processing Payment...'}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ₹{totalPayable.toLocaleString('en-IN')} & Confirm Order</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Right Column: Price Breakdown Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Payment Summary
                </h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({totalItemsCount} items)</span>
                  <span className="text-gray-900 font-medium">₹{totalMRP.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-semibold">- ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <div>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      <span className="font-medium text-gray-900">₹40</span>
                    )}
                  </div>
                </div>
                <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-base font-heading">Amount Payable</span>
                  <span className="text-xl font-black text-gray-950 font-heading">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold border-t border-emerald-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Total Savings: ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Reassurance list */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-xs text-gray-500 shadow-xs">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>100% Secure Transaction via 256-Bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Express courier tracking link sent on SMS & Email</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
