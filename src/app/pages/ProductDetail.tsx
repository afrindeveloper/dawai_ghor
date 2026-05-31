import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft, Star, ShoppingCart, Heart, Shield, Truck, CheckCircle, Pill,
  Package, Tag, Minus, Plus, Share2, ChevronRight, AlertCircle
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PromoBanner from "../components/PromoBanner";
import { getWishlist, addToCart, toggleWishlist, getManagedProducts } from "../utils/api";
import { products as defaultProducts } from "../data/mockData";
import { toast } from "sonner";
import { motion } from "motion/react";

const TABS = ["Overview", "Dosage & Usage", "Side Effects", "Brand Info"];

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const [allProducts, setAllProducts] = useState<typeof defaultProducts>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getManagedProducts(defaultProducts).then(setAllProducts);
  }, []);

  const product = allProducts.find(p => p.id === id);

  useEffect(() => {
    if (id) {
       getWishlist().then(list => setWishlisted(list.includes(id)));
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <PromoBanner />
        <Header />
        <main className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center py-20">
            <Package className="w-20 h-20 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl text-slate-900 mb-2" style={{ fontWeight: 700 }}>Product not found</h2>
            <p className="text-slate-500 mb-6">The product you're looking for doesn't exist.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = async () => {
    try {
      for (let i = 0; i < quantity; i++) await addToCart(product);
      toast.success(`${quantity}x ${product.name} added to cart!`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error("Please sign in to add items to cart");
    }
  };

  const handleWishlist = async () => {
    if (!product) return;
    const now = await toggleWishlist(product.id);
    setWishlisted(now);
    toast.success(now ? "Added to wishlist!" : "Removed from wishlist");
  };

  const tabContent = [
    // Overview
    <div className="space-y-4">
      <p className="text-slate-600 leading-relaxed">{product.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Brand", value: product.brand || "N/A", icon: Tag },
          { label: "Category", value: product.category, icon: Package },
          { label: "In Stock", value: product.inStock !== false ? `${product.stock} units available` : "Out of stock", icon: Package },
          { label: "Prescription", value: product.requiresPrescription ? "Required" : "Not required", icon: Shield },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs" style={{ fontWeight: 500 }}>{label}</p>
              <p className="text-slate-900 text-sm mt-0.5" style={{ fontWeight: 500 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>
      {product.tags && product.tags.length > 0 && (
        <div>
          <p className="text-slate-700 text-sm mb-2" style={{ fontWeight: 500 }}>Tags</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-100" style={{ fontWeight: 500 }}>#{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>,

    // Dosage & Usage
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Recommended Dosage</span>
        </div>
        <p className="text-blue-700 text-sm leading-relaxed">{product.dosage || "Please consult your doctor for appropriate dosage."}</p>
      </div>
      {product.activeIngredient && (
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-slate-700 text-sm mb-1" style={{ fontWeight: 600 }}>Active Ingredient</p>
          <p className="text-slate-600 text-sm">{product.activeIngredient}</p>
        </div>
      )}
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Important Notice</span>
        </div>
        <p className="text-yellow-700 text-sm">Always follow the prescribed dosage. Do not exceed the recommended amount without consulting a healthcare professional.</p>
      </div>
    </div>,

    // Side Effects
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-red-700 mb-3">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Common Side Effects</span>
        </div>
        <ul className="space-y-2">
          {["Mild nausea or stomach upset", "Headache", "Dizziness (rarely)", "Allergic reactions in sensitive individuals"].map((effect, i) => (
            <li key={i} className="flex items-center gap-2 text-red-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
              {effect}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>When to seek medical help</p>
        <p className="text-slate-600 text-sm mt-1">If you experience severe allergic reactions, difficulty breathing, or unusual symptoms, seek immediate medical attention and discontinue use.</p>
      </div>
    </div>,

    // Brand Info
    <div className="space-y-4">
      <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <Pill className="w-7 h-7 text-orange-500" />
        </div>
        <div>
          <h4 className="text-slate-900" style={{ fontWeight: 700 }}>{product.brand || "Unknown Brand"}</h4>
          <p className="text-slate-500 text-sm mt-1">Trusted pharmaceutical manufacturer committed to quality healthcare products meeting international standards.</p>
          <div className="flex items-center gap-1.5 mt-3">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-xs" style={{ fontWeight: 500 }}>GMP Certified · FDA Registered</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Quality Standard", value: "ISO 9001:2015" },
          { label: "Manufacturing", value: "Bangladesh" },
          { label: "Shelf Life", value: "24-36 months" },
          { label: "Storage", value: "Cool, dry place" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3">
            <p className="text-slate-400 text-xs" style={{ fontWeight: 500 }}>{label}</p>
            <p className="text-slate-900 text-sm mt-0.5" style={{ fontWeight: 600 }}>{value}</p>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PromoBanner />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/products" className="hover:text-orange-600 transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 truncate max-w-48" style={{ fontWeight: 500 }}>{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 aspect-square flex items-center justify-center p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              {discount > 0 && (
                <div className="absolute top-5 left-5 bg-orange-500 text-white text-sm px-3 py-1.5 rounded-xl shadow-lg" style={{ fontWeight: 700 }}>
                  -{discount}% OFF
                </div>
              )}
              {product.requiresPrescription && (
                <div className="absolute top-5 right-5 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg" style={{ fontWeight: 600 }}>
                  <Shield className="w-3.5 h-3.5" />
                  Rx Required
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Category + Stock */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
                  {product.category}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${product.inStock !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`} style={{ fontWeight: 500 }}>
                  {product.inStock !== false ? <><CheckCircle className="w-3.5 h-3.5" /> In Stock</> : <><AlertCircle className="w-3.5 h-3.5" /> Out of Stock</>}
                </span>
              </div>

              {/* Name */}
              <div>
                <h1 className="text-slate-900" style={{ fontWeight: 700, fontSize: "28px", lineHeight: "1.2" }}>{product.name}</h1>
                {product.brand && (
                  <p className="text-slate-400 text-sm mt-1">by <span className="text-slate-600" style={{ fontWeight: 500 }}>{product.brand}</span></p>
                )}
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(product.rating!) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{product.rating}</span>
                  <span className="text-slate-400 text-sm">({product.reviewCount} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-orange-600" style={{ fontWeight: 800, fontSize: "32px" }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-slate-400 line-through text-lg mb-0.5">${product.originalPrice.toFixed(2)}</span>
                )}
                {discount > 0 && (
                  <span className="bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded-lg mb-0.5" style={{ fontWeight: 600 }}>
                    Save ${(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed">{product.description}</p>

              {/* Active Ingredient */}
              {product.activeIngredient && (
                <div className="bg-orange-50 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-orange-600 text-xs" style={{ fontWeight: 600 }}>Active Ingredient:</span>
                  <span className="text-slate-700 text-sm">{product.activeIngredient}</span>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-slate-900" style={{ fontWeight: 700 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl transition-colors shadow-md shadow-orange-200"
                  style={{ fontWeight: 700 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${wishlisted ? "border-red-300 bg-red-50 text-red-500" : "border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-400"}`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                <button className="w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "100% Authentic", color: "text-green-600 bg-green-50" },
                  { icon: Truck, label: "Fast Delivery", color: "text-blue-600 bg-blue-50" },
                  { icon: Package, label: "Sealed Package", color: "text-purple-600 bg-purple-50" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                    <Icon className="w-5 h-5 mx-auto mb-1.5" />
                    <p className="text-xs" style={{ fontWeight: 600 }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-10"
          >
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-shrink-0 px-6 py-4 text-sm transition-all border-b-2 ${activeTab === i ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                  style={{ fontWeight: activeTab === i ? 600 : 400 }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6">
              {tabContent[activeTab]}
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-slate-900" style={{ fontWeight: 700, fontSize: "20px" }}>Related Products</h3>
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-orange-600 hover:text-orange-700 text-sm" style={{ fontWeight: 500 }}>
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="text-slate-900 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors" style={{ fontWeight: 600 }}>{p.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{p.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-orange-600" style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</span>
                        {p.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-slate-500 text-xs">{p.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
