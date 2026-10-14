import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { ProductQuickView } from '../components/ProductQuickView';
import { 
  Sparkles, 
  Flame, 
  ArrowUpDown, 
  SlidersHorizontal, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Zap, 
  X,
  Search
} from 'lucide-react';

export const HomePage = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState(120000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([selectedCategory]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [assuredOnly, setAssuredOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Sync selectedCategory prop from header if user picked a category in header
  React.useEffect(() => {
    setSelectedCategories([selectedCategory]);
  }, [selectedCategory]);

  // Extract unique brands for brand filter
  const availableBrands = useMemo(() => {
    const brandSet = new Set(products.map((p) => p.brand));
    return Array.from(brandSet);
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setPriceRange(120000);
    setSelectedRating(0);
    setSelectedCategories(['All Categories']);
    setSelectedCategory('All Categories');
    setSelectedBrands([]);
    setAssuredOnly(false);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchTerm('');
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchBrand = p.brand.toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          if (!matchTitle && !matchBrand && !matchCategory) return false;
        }

        // Category filter
        if (!selectedCategories.includes('All Categories') && selectedCategories.length > 0) {
          if (!selectedCategories.includes(p.category)) return false;
        }

        // Price range filter
        if (p.discountedPrice > priceRange) return false;

        // Rating filter
        if (selectedRating > 0 && p.rating < selectedRating) return false;

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

        // Assured filter
        if (assuredOnly && !p.isAssured) return false;

        // In-stock filter
        if (inStockOnly && (!p.inStock || p.stock === 0)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice;
        if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        return 0; // featured default
      });
  }, [
    searchTerm,
    selectedCategories,
    priceRange,
    selectedRating,
    selectedBrands,
    assuredOnly,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Hero Promotional Banner Strip */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-gray-950 text-xs font-black uppercase px-3 py-1 rounded-full mb-3 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-gray-950" /> Big Festival Bonanza
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight mb-2">
              Unbeatable Deals on <span className="text-amber-400">Flagship Tech & Fashion</span>
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">
              Up to 65% off on Sony, Apple, Samsung & more. Guaranteed 2-day delivery on all Assured items.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20 text-center text-xs">
            <div>
              <div className="text-lg sm:text-xl font-black text-amber-400">100%</div>
              <div className="text-blue-200 text-[10px] sm:text-xs">Genuine Products</div>
            </div>
            <div className="border-x border-white/20 px-2 sm:px-4">
              <div className="text-lg sm:text-xl font-black text-amber-400">₹0</div>
              <div className="text-blue-200 text-[10px] sm:text-xs">Free Delivery &gt;₹500</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-amber-400">7 Days</div>
              <div className="text-blue-200 text-[10px] sm:text-xs">Easy Returns</div>
            </div>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Results Bar / Active Filter Chips */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 font-heading">
              Showing <span className="text-blue-600">{filteredProducts.length}</span> Results
            </h2>

            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-200">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {!selectedCategories.includes('All Categories') && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
                {selectedCategories.join(', ')}
                <button
                  onClick={() => {
                    setSelectedCategories(['All Categories']);
                    setSelectedCategory('All Categories');
                  }}
                  className="hover:text-gray-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {assuredOnly && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium border border-amber-200">
                ⚡ Assured Only
                <button onClick={() => setAssuredOnly(false)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>

          {/* Mobile Filter Toggle & Desktop Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filters Drawer Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-lg text-xs font-bold transition"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Desktop Quick Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Layout: Sidebar + Product Grid */}
        <div className="flex items-start gap-6">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20">
            <ProductFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              availableBrands={availableBrands}
              assuredOnly={assuredOnly}
              setAssuredOnly={setAssuredOnly}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredProducts.length}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setSelectedQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                  No matching products found
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                  Try adjusting your price range, clearing brand or category filters, or search for another keyword.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition active:scale-95 shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-gray-900 text-base">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                availableBrands={availableBrands}
                assuredOnly={assuredOnly}
                setAssuredOnly={setAssuredOnly}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onResetFilters={handleResetFilters}
                totalFilteredCount={filteredProducts.length}
              />
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow-md"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
};
