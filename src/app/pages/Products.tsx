import { useState, useEffect } from "react";
import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PromoBanner from "../components/PromoBanner";
import { getManagedProducts, getWishlist, toggleWishlist, addToCart } from "../utils/api";
import { products as defaultProducts } from "../data/mockData";
import { Button } from "../components/ui/button";
import {
  ShoppingCart, Heart, Star, Search, Filter, SlidersHorizontal,
  Grid3X3, List, ChevronDown, X, Pill
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = ["All", "Prescription Medicine", "OTC", "Baby Care", "Devices & Kits", "Vitamins & Supplements", "Women's Choice"];
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
  { value: "rating", label: "Top Rated" },
];

export default function Products() {
  const [allProducts, setAllProducts] = useState<typeof defaultProducts>([]);
  useEffect(() => { getManagedProducts(defaultProducts).then(setAllProducts) }, []);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showRxOnly, setShowRxOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getWishlist().then(list => setWishlistIds(new Set(list)));
  }, [allProducts]);

  // Filtering
  const filtered = allProducts
    .filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchStock = !showInStockOnly || p.inStock !== false;
      const matchRx = !showRxOnly || p.requiresPrescription === true;
      return matchSearch && matchCategory && matchPrice && matchStock && matchRx;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "rating": return (b.rating || 0) - (a.rating || 0);
        default: return 0;
      }
    });

  const handleAddToCart = async (product: typeof defaultProducts[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Please sign in to add items to cart");
    }
  };

  const handleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = await toggleWishlist(productId);
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (now) next.add(productId);
      else next.delete(productId);
      return next;
    });
    toast.success(now ? "Added to wishlist!" : "Removed from wishlist");
  };

  const activeFilterCount = [
    selectedCategory !== "All",
    sortBy !== "default",
    priceRange[0] > 0 || priceRange[1] < 100,
    showInStockOnly,
    showRxOnly,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedCategory("All");
    setSortBy("default");
    setPriceRange([0, 100]);
    setShowInStockOnly(false);
    setShowRxOnly(false);
    setSearch("");
  };

  const ProductCard = ({ product }: { product: typeof allProducts[0] }) => {
    const inWishlist = wishlistIds.has(product.id);
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

    if (viewMode === "list") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="flex gap-0">
            <Link to={`/products/${product.id}`} className="w-32 sm:w-48 flex-shrink-0">
              <div className="h-full bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden" style={{ minHeight: "140px" }}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            </Link>
            <div className="flex-1 p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>{product.category}</span>
                    {product.requiresPrescription && <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>Rx</span>}
                    {discount > 0 && <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>-{discount}%</span>}
                  </div>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-slate-900 hover:text-orange-600 transition-colors" style={{ fontWeight: 600 }}>{product.name}</h3>
                  </Link>
                  <p className="text-slate-400 text-xs mt-0.5">{product.brand}</p>
                  {product.rating && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-slate-600 text-xs">{product.rating} ({product.reviewCount})</span>
                    </div>
                  )}
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2 hidden sm:block">{product.description}</p>
                </div>
                <button onClick={(e) => handleWishlist(product.id, e)} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${inWishlist ? "text-red-500 bg-red-50" : "text-slate-300 hover:text-red-400 hover:bg-red-50"}`}>
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500" : ""}`} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4">
                <div>
                  <span className="text-orange-600" style={{ fontWeight: 700, fontSize: "18px" }}>${product.price.toFixed(2)}</span>
                  {product.originalPrice && <span className="text-slate-400 text-sm line-through ml-2">${product.originalPrice.toFixed(2)}</span>}
                </div>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                  onClick={(e) => handleAddToCart(product, e)}
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden group"
      >
        <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
          <Link to={`/products/${product.id}`}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </Link>
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-lg shadow-sm" style={{ fontWeight: 700 }}>-{discount}%</span>
            )}
            {product.requiresPrescription && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-lg shadow-sm" style={{ fontWeight: 600 }}>Rx</span>
            )}
          </div>
          <button
            onClick={(e) => handleWishlist(product.id, e)}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${inWishlist ? "bg-red-50 text-red-500" : "bg-white/90 text-slate-400 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100"}`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500" : ""}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>{product.category}</span>
            {product.inStock === false && <span className="text-xs text-red-500">Out of stock</span>}
          </div>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-slate-900 mb-0.5 line-clamp-1 hover:text-orange-600 transition-colors" style={{ fontWeight: 600 }}>{product.name}</h3>
          </Link>
          <p className="text-slate-400 text-xs mb-1">{product.brand}</p>
          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-slate-600 text-xs">{product.rating} ({product.reviewCount})</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-orange-600" style={{ fontWeight: 700, fontSize: "17px" }}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-slate-400 text-xs line-through ml-1.5">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-9"
              onClick={(e) => handleAddToCart(product, e)}
              disabled={product.inStock === false}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PromoBanner />
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-slate-900" style={{ fontWeight: 700, fontSize: "24px" }}>Shop Medicines & Healthcare</h1>
                <p className="text-slate-500 text-sm mt-0.5">{allProducts.length} authentic products available</p>
              </div>
              {/* Search */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search medicines, brands..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-slate-50"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm transition-all ${selectedCategory === cat ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  style={{ fontWeight: 500 }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-900 flex items-center gap-2" style={{ fontWeight: 600 }}>
                    <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                    Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <button onClick={resetFilters} className="text-xs text-orange-600 hover:text-orange-700" style={{ fontWeight: 500 }}>
                      Reset ({activeFilterCount})
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 text-slate-700"
                  >
                    {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
                    Price Range: ${priceRange[0]} – ${priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range" min={0} max={100} step={5}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-orange-500"
                    />
                    <div className="flex gap-2">
                      <input type="number" min={0} max={priceRange[1]} value={priceRange[0]} onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:border-orange-400" />
                      <span className="text-slate-400 self-center">–</span>
                      <input type="number" min={priceRange[0]} max={200} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:border-orange-400" />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <label className="block text-xs text-slate-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Availability</label>
                  {[
                    { label: "In Stock Only", key: "stock", value: showInStockOnly, setter: setShowInStockOnly },
                    { label: "Prescription Required", key: "rx", value: showRxOnly, setter: setShowRxOnly },
                  ].map(({ label, key, value, setter }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-slate-600">{label}</span>
                      <button
                        onClick={() => setter(!value)}
                        className={`w-10 h-5.5 rounded-full relative transition-all duration-200 ${value ? "bg-orange-500" : "bg-slate-200"}`}
                        style={{ height: "22px", width: "40px" }}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${value ? "left-5.5" : "left-0.5"}`} style={{ left: value ? "19px" : "2px" }}></span>
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
                    )}
                  </button>
                  <span className="text-slate-500 text-sm">{filtered.length} products</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5 overflow-hidden space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900" style={{ fontWeight: 600 }}>Filters</span>
                      <button onClick={resetFilters} className="text-xs text-orange-600" style={{ fontWeight: 500 }}>Reset all</button>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5" style={{ fontWeight: 600 }}>Sort By</label>
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                        {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-2" style={{ fontWeight: 600 }}>Max Price: ${priceRange[1]}</label>
                      <input type="range" min={0} max={100} step={5} value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-orange-500" />
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={showInStockOnly} onChange={e => setShowInStockOnly(e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
                        <span className="text-sm text-slate-600">In stock only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={showRxOnly} onChange={e => setShowRxOnly(e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
                        <span className="text-sm text-slate-600">Rx only</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Filters */}
              {(search || selectedCategory !== "All" || sortBy !== "default" || priceRange[0] > 0 || priceRange[1] < 100) && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs text-slate-500" style={{ fontWeight: 500 }}>Active filters:</span>
                  {search && <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ fontWeight: 500 }}>Search: "{search}" <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch("")} /></span>}
                  {selectedCategory !== "All" && <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ fontWeight: 500 }}>{selectedCategory} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("All")} /></span>}
                  {(priceRange[0] > 0 || priceRange[1] < 100) && <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ fontWeight: 500 }}>${priceRange[0]}–${priceRange[1]} <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, 100])} /></span>}
                </div>
              )}

              {/* Products Grid */}
              {filtered.length > 0 ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl py-20 text-center shadow-sm border border-slate-100">
                  <Pill className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-900" style={{ fontWeight: 600 }}>No products found</p>
                  <p className="text-slate-400 text-sm mt-1 mb-5">Try adjusting your search or filters</p>
                  <button onClick={resetFilters} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm transition-colors" style={{ fontWeight: 600 }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
