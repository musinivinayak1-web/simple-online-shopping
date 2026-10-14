import React from 'react';
import { useOrder } from '../context/OrderContext';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, Heart, Zap } from 'lucide-react';

export const Footer = () => {
  const { navigateTo } = useOrder();

  return (
    <footer className="bg-gray-900 text-gray-300 text-xs no-print">
      {/* Value props bar */}
      <div className="border-b border-gray-800 bg-gray-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xs">100% Authentic</span>
            <span className="text-gray-400 text-[11px] mt-0.5">Direct from verified brands</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xs">Free Delivery</span>
            <span className="text-gray-400 text-[11px] mt-0.5">On orders above ₹500</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-900/50 text-amber-400 flex items-center justify-center mb-2">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xs">7 Days Return</span>
            <span className="text-gray-400 text-[11px] mt-0.5">Hassle-free instant refund</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-900/50 text-purple-400 flex items-center justify-center mb-2">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xs">24x7 Help Center</span>
            <span className="text-gray-400 text-[11px] mt-0.5">Dedicated customer care</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">About ZapKart</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">About Us</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Careers</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">ZapKart Stories</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Press Releases</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Corporate Information</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Help & Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Payments</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Shipping & Delivery</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Cancellation & Returns</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">FAQ & Help Desk</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Report Infringement</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Consumer Policy</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Terms Of Use</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Security & Privacy</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Sitemap</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Grievance Redressal</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">EPR Compliance</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Registered Office</h4>
          <p className="text-gray-400 leading-relaxed text-[11px]">
            ZapKart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India<br />
            CIN: U51109KA2012PTC066107<br />
            Telephone: 044-45614700 / 044-67415800
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-black italic text-white flex items-center">
              Zap<span className="text-amber-400">Kart</span>
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-0.5" />
            </span>
            <span>© 2026 ZapKart.com. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Accepted Payment Partners:</span>
            <span className="text-gray-300 font-bold">UPI</span> • 
            <span className="text-gray-300 font-bold">VISA</span> • 
            <span className="text-gray-300 font-bold">MasterCard</span> • 
            <span className="text-gray-300 font-bold">RuPay</span> • 
            <span className="text-gray-300 font-bold">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
