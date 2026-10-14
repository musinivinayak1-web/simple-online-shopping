import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleAddresses } from '../data/products';
import { checkPincodeServiceability } from '../utils/pincodeData';
import { 
  dispatchOrderPlacedEmails, 
  dispatchOrderCancelledEmails 
} from '../services/emailService';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

const ORDERS_STORAGE_KEY = 'zapkart_orders_v1';
const ADDRESSES_STORAGE_KEY = 'zapkart_addresses_v1';
const PINCODE_STORAGE_KEY = 'zapkart_pincode_v1';

export const OrderProvider = ({ children }) => {
  // Navigation State: 'home' | 'cart' | 'checkout' | 'confirmation' | 'orders' | 'profile' | 'wishlist'
  const [activePage, setActivePage] = useState('home');
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState(null);

  // Addresses
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : sampleAddresses;
    } catch {
      return sampleAddresses;
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return addresses[0]?.id || 'addr-1';
  });

  // Pincode & Delivery Area
  const [pincodeInfo, setPincodeInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(PINCODE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { pincode: '110001', city: 'New Delhi', state: 'Delhi', speed: 'Tomorrow, by 11 AM' };
    } catch {
      return { pincode: '110001', city: 'New Delhi', state: 'Delhi', speed: 'Tomorrow, by 11 AM' };
    }
  });

  // Orders History & Current Order
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {
      console.error(e);
    }
  }, [addresses]);

  useEffect(() => {
    try {
      localStorage.setItem(PINCODE_STORAGE_KEY, JSON.stringify(pincodeInfo));
    } catch (e) {
      console.error(e);
    }
  }, [pincodeInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const navigateTo = (page, product = null) => {
    setActivePage(page);
    if (product) {
      setSelectedProductForQuickView(product);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const addAddress = (newAddr) => {
    const id = `addr-${Date.now()}`;
    const addressWithId = { ...newAddr, id };
    setAddresses((prev) => [addressWithId, ...prev]);
    setSelectedAddressId(id);
    return addressWithId;
  };

  const updateAddress = (id, updatedData) => {
    setAddresses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
    if (selectedAddressId === id && addresses.length > 1) {
      setSelectedAddressId(addresses.find((a) => a.id !== id)?.id || '');
    }
  };

  const updatePincode = (pincode, city, state) => {
    const serviceability = checkPincodeServiceability(pincode);
    setPincodeInfo({
      pincode,
      city: city || serviceability.city,
      state: state || serviceability.state,
      speed: serviceability.speed
    });
  };

  /**
   * Place Order & Dispatch Automated HTML Invoices to Customer & Admin
   */
  const placeOrder = ({ items, pricing, address, paymentMethod, userEmail = 'vinay.kumar@example.com' }) => {
    const orderNumber = Math.floor(10000000 + Math.random() * 90000000);
    const orderId = `OD${orderNumber}`;

    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 2);
    const formattedDeliveryDate = deliveryDateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      estimatedDelivery: formattedDeliveryDate,
      items: [...items],
      pricing: { ...pricing },
      address: { ...address },
      paymentMethod,
      status: 'Ordered', // 'Ordered' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
      trackingTimeline: [
        { status: 'Ordered', date: 'Just now', completed: true },
        { status: 'Processing', date: 'Within 4 Hours', completed: false },
        { status: 'Shipped', date: 'Tomorrow, 9 AM', completed: false },
        { status: 'Out for Delivery', date: formattedDeliveryDate, completed: false },
        { status: 'Delivered', date: formattedDeliveryDate, completed: false }
      ]
    };

    setCurrentOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);

    // Dispatch automated confirmation emails (Customer + Admin)
    dispatchOrderPlacedEmails(newOrder, userEmail);

    return newOrder;
  };

  /**
   * Cancel Order Workflow & Dispatch Automated Cancellation Emails
   */
  const cancelOrder = async (orderId, reason, comments = '', userEmail = 'vinay.kumar@example.com') => {
    let targetOrder = null;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          targetOrder = {
            ...ord,
            status: 'Cancelled',
            cancellationReason: reason,
            cancellationComments: comments,
            cancelledAt: new Date().toISOString()
          };
          return targetOrder;
        }
        return ord;
      })
    );

    if (currentOrder && currentOrder.orderId === orderId) {
      setCurrentOrder((prev) => ({
        ...prev,
        status: 'Cancelled',
        cancellationReason: reason,
        cancellationComments: comments,
        cancelledAt: new Date().toISOString()
      }));
    }

    if (targetOrder) {
      // Dispatch cancellation emails to customer and admin
      await dispatchOrderCancelledEmails(targetOrder, reason, userEmail);
    }

    return targetOrder;
  };

  /**
   * Testing Helper: Advance Order Status
   */
  const advanceOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (currentOrder?.orderId === orderId) {
      setCurrentOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <OrderContext.Provider
      value={{
        activePage,
        navigateTo,
        addresses,
        selectedAddress,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        pincodeInfo,
        updatePincode,
        orders,
        currentOrder,
        placeOrder,
        cancelOrder,
        advanceOrderStatus,
        selectedProductForQuickView,
        setSelectedProductForQuickView
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
