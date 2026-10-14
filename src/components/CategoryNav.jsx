import React from 'react';
import { categories } from '../data/products';
import { 
  Flame, 
  Smartphone, 
  Headphones, 
  Laptop, 
  Watch, 
  Coffee, 
  Shirt, 
  Gamepad2, 
  Layers,
  ShieldCheck,
  Truck
} from 'lucide-react';

const categoryIcons = {
  'All Categories': <Layers className="w-4 h-4" />,
  'Electronics & Audio': <Headphones className="w-4 h-4" />,
  'Mobiles & Tablets': <Smartphone className="w-4 h-4" />,
  'Laptops & Computing': <Laptop className="w-4 h-4" />,
  'Wearables': <Watch className="w-4 h-4" />,
  'Home & Kitchen': <Coffee className="w-4 h-4" />,
  'Fashion & Footwear': <Shirt className="w-4 h-4" />,
  'Gaming': <Gamepad2 className="w-4 h-4" />,
};

export const CategoryNav = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none text-xs sm:text-sm">
          {/* Categories Pill List */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition shrink-0 whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-gray-500'}>
                    {categoryIcons[cat] || <Layers className="w-4 h-4" />}
                  </span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Value Props / Badges */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-semibold text-gray-500 shrink-0 border-l border-gray-200 pl-4">
            <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>100% Genuine</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Fast 2-Day Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Super Deals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
