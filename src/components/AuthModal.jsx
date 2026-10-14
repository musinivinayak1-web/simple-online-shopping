import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Smartphone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    activeOtpRequest, 
    resendTimer, 
    sendOtp, 
    verifyOtpAndLogin 
  } = useAuth();

  const [tab, setTab] = useState('phone'); // 'phone' | 'email'
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter contact, 2 = Enter 6-digit OTP

  const inputRefs = useRef([]);

  // Reset states when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep(1);
      setDigits(['', '', '', '', '', '']);
      setErrorMessage('');
      setPhoneInput('');
      setEmailInput('');
    }
  }, [isAuthModalOpen]);

  // Auto focus first OTP input when moving to Step 2
  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (tab === 'phone') {
      const cleanPhone = phoneInput.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setErrorMessage('Please enter a valid 10-digit Indian mobile number');
        return;
      }
      sendOtp(`+91 ${cleanPhone}`, 'phone');
    } else {
      if (!emailInput || !emailInput.includes('@') || !emailInput.includes('.')) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
      sendOtp(emailInput.trim(), 'email');
    }

    setStep(2);
  };

  const handleDigitChange = (index, value) => {
    const char = value.slice(-1).replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMessage('');

    // Advance focus to next input box
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      if (pasted.length === 6) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code');
      return;
    }

    const result = verifyOtpAndLogin(fullCode);
    if (!result.success) {
      setErrorMessage(result.error);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    const contact = tab === 'phone' ? `+91 ${phoneInput}` : emailInput;
    sendOtp(contact, tab);
    setDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in no-print">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1 text-2xl font-black italic tracking-tight font-heading mb-1">
            Zap<span className="text-amber-400">Kart</span>
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-xs text-blue-100 font-medium">
            Login or Signup with OTP for Instant Checkout & Rewards
          </p>

          <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-blue-200">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Safe & Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-300" /> No Password Needed
            </span>
          </div>
        </div>

        {/* STEP 1: Enter Phone or Email */}
        {step === 1 && (
          <div className="p-6">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setTab('phone');
                  setErrorMessage('');
                }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
                  tab === 'phone' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile Number</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('email');
                  setErrorMessage('');
                }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
                  tab === 'email' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email ID</span>
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {tab === 'phone' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Enter Mobile Number
                  </label>
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-2xs">
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-2.5 border-r border-gray-300 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      autoFocus
                      required
                      value={phoneInput}
                      onChange={(e) => {
                        setPhoneInput(e.target.value.replace(/\D/g, ''));
                        setErrorMessage('');
                      }}
                      placeholder="Enter 10-digit number"
                      className="flex-1 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    A 6-digit OTP will be sent via SMS to verify your mobile number.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Enter Email Address
                  </label>
                  <input
                    type="email"
                    autoFocus
                    required
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    We will send a 6-digit verification code to your email inbox.
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Request OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-[11px] text-gray-400">
                By continuing, you agree to ZapKart's Terms of Use and Privacy Policy.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Enter 6-digit OTP */}
        {step === 2 && activeOtpRequest && (
          <div className="p-6">
            <div className="text-center mb-5">
              <span className="text-xs text-gray-500">Verification code sent to</span>
              <div className="font-bold text-gray-900 text-sm mt-0.5">{activeOtpRequest.contact}</div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-blue-600 hover:underline font-semibold mt-1 inline-block"
              >
                Change {activeOtpRequest.type === 'phone' ? 'Number' : 'Email'}
              </button>
            </div>

            {/* Simulated SMS Notification Banner for easy testing */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-5 text-center shadow-xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                ⚡ Simulated {activeOtpRequest.type === 'phone' ? 'SMS' : 'Email'} Notification
              </span>
              <div className="text-sm font-bold text-gray-900 mt-1">
                Your ZapKart OTP is: <span className="font-mono text-base font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">{activeOtpRequest.code}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const arr = activeOtpRequest.code.split('');
                  setDigits(arr);
                }}
                className="text-[11px] font-bold text-amber-900 underline mt-1 hover:text-amber-950 cursor-pointer"
              >
                (Click here to auto-fill {activeOtpRequest.code})
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6 Individual Digit Inputs */}
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg font-bold rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900 shadow-2xs"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Log In</span>
              </button>

              {/* Resend OTP with 30s Countdown */}
              <div className="text-center text-xs text-gray-500 pt-2">
                {resendTimer > 0 ? (
                  <span>
                    Resend verification code in <strong>{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP Now</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
