import React from 'react';
import { Star, RotateCcw, Filter, Check, Zap } from 'lucide-react';
import { categories } from '../data/products';

export const ProductFilters = ({
  priceRange,
  setPriceRange,
  minPossiblePrice = 5000,
  maxPossiblePrice = 120000,
  selectedRating,
  setSelectedRating,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  availableBrands = [],
  assuredOnly,
  setAssuredOnly,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  onResetFilters,
  totalFilteredCount,
}) => {
  const handleCategoryToggle = (cat) => {
    if (cat === 'All Categories') {
      setSelectedCategories(['All Categories']);
      return;
    }
    const filtered = selectedCategories.filter((c) => c !== 'All Categories');
    if (filtered.includes(cat)) {
      const next = filtered.filter((c) => c !== cat);
      setSelectedCategories(next.length === 0 ? ['All Categories'] : next);
    } else {
      setSelectedCategories([...filtered, cat]);
    }
  };

  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs divide-y divide-gray-100">
      {/* Filters Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h2 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Filters</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {totalFilteredCount} items
          </span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Filter (Mobile / Desktop) */}
      <div className="p-4">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="featured">Featured / Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating (High to Low)</option>
          <option value="discount">Biggest Discount (%)</option>
        </select>
      </div>

      {/* Price Range Slider */}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <span>Price Range</span>
          <span className="text-blue-600 font-bold">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min={minPossiblePrice}
          max={maxPossiblePrice}
          step={1000}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-medium">
          <span>₹{minPossiblePrice.toLocaleString('en-IN')}</span>
          <span>₹{maxPossiblePrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Assured & In-stock Toggles */}
      <div className="p-4 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
          <input
            type="checkbox"
            checked={assuredOnly}
            onChange={(e) => setAssuredOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 accent-blue-600"
          />
          <span className="flex items-center gap-1 font-semibold text-blue-800">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>⚡ Assured Items Only</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 accent-blue-600"
          />
          <span>Exclude Out of Stock</span>
        </label>
      </div>

      {/* Star Ratings Filter */}
      <div className="p-4">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Customer Rating
        </label>
        <div className="space-y-1.5">
          {[
            { label: '4★ & above', value: 4 },
            { label: '3★ & above', value: 3 },
            { label: 'All Ratings', value: 0 },
          ].map((item) => (
            <label
              key={item.value}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition ${
                selectedRating === item.value
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="rating-filter"
                checked={selectedRating === item.value}
                onChange={() => setSelectedRating(item.value)}
                className="w-3.5 h-3.5 text-blue-600 accent-blue-600"
              />
              <div className="flex items-center gap-1">
                <span>{item.label}</span>
                {item.value > 0 && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategoryToggle(cat)}
                  className="w-3.5 h-3.5 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 accent-blue-600"
                />
                <span className={isChecked ? 'font-bold text-blue-600' : 'font-medium'}>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div className="p-4">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Brand
          </label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {availableBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 cursor-pointer py-1"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-3.5 h-3.5 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 accent-blue-600"
                  />
                  <span className={isChecked ? 'font-bold text-blue-600' : 'font-medium'}>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
