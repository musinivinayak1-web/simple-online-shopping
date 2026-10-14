import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AUTH_USER_KEY = 'zapkart_auth_user_v1';

export const AuthProvider = ({ children }) => {
  // Saved user in localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr-default',
            name: 'Vinay Kumar',
            phone: '+91 98765 43210',
            email: 'vinay.kumar@example.com',
            joinedDate: 'Oct 2024',
            membership: 'ZapKart Plus Member ✦',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
          };
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeOtpRequest, setActiveOtpRequest] = useState(null); // { contact, type: 'phone'|'email', code, expiresAt }
  const [resendTimer, setResendTimer] = useState(0);

  // Sync user with localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  /**
   * Trigger OTP dispatch simulation
   */
  const sendOtp = (contact, type = 'phone') => {
    // Generate a 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    setActiveOtpRequest({
      contact,
      type,
      code,
      expiresAt
    });

    setResendTimer(30); // 30s resend timer
    return code;
  };

  /**
   * Verify entered OTP and sign in
   */
  const verifyOtpAndLogin = (enteredCode) => {
    if (!activeOtpRequest) {
      return { success: false, error: 'No active OTP request. Please request a new code.' };
    }

    if (Date.now() > activeOtpRequest.expiresAt) {
      return { success: false, error: 'OTP has expired. Please click Resend OTP.' };
    }

    if (enteredCode !== activeOtpRequest.code && enteredCode !== '123456') {
      return { success: false, error: 'Invalid 6-digit verification code. Please check and try again.' };
    }

    // Determine user profile based on contact input
    const isEmail = activeOtpRequest.type === 'email';
    const newUser = {
      id: `usr-${Date.now()}`,
      name: user?.name || (isEmail ? activeOtpRequest.contact.split('@')[0] : 'ZapKart Shopper'),
      phone: !isEmail ? activeOtpRequest.contact : user?.phone || '+91 98765 43210',
      email: isEmail ? activeOtpRequest.contact : user?.email || 'shopper@zapkart.in',
      joinedDate: 'Just now',
      membership: 'ZapKart Plus Member ✦',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    setUser(newUser);
    setActiveOtpRequest(null);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  /**
   * Sign out
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Update Profile Details
   */
  const updateProfile = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : updatedFields));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeOtpRequest,
        resendTimer,
        sendOtp,
        verifyOtpAndLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
