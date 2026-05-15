import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "motion/react";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag,
  Truck, Shield, ChevronRight, Gift, Sparkles, Package,
  CheckCircle, X
} from "lucide-react";
import {
  getCart, updateCartQuantity, removeFromCart,
  clearCart, CartItem,
} from "../utils/localStorage";
import { toast } from "sonner";

const PROMO_CODES: Record<string, number> = {
  DAWAI10: 10,
  HEALTH20: 20,
  SAVE15: 15,
};

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => { loadCart(); }, []);

  const loadCart = () => setCartItems(getCart());

  const handleUpdateQuantity = (id: string, qty: number) => {
    updateCartQuantity(id, qty);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = async (id: string, name: string) => {
    setRemovingId(id);
    await new Promise(r => setTimeout(r, 300));
    removeFromCart(id);
    loadCart();
    setRemovingId(null);
    toast.success(`${name} removed`);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleClearCart = () => {
    clearCart();
    loadCart();
    setAppliedPromo(null);
    toast.success("Cart cleared");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const disc = PROMO_CODES[code];
    if (disc) {
      setAppliedPromo({ code, discount: disc });
      setPromoCode(code);
      setPromoError("");
      setShowPromoInput(false);
      toast.success(`Promo applied! ${disc}% off`);
    } else {
      setPromoError("Invalid promo code. Try DAWAI10, HEALTH20, or SAVE15");
    }
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : subtotal === 0 ? 0 : 5.99;
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const total = subtotal + shipping - promoDiscount;

  /* ── Empty State ── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm w-full"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-100">
              <ShoppingBag className="w-14 h-14 text-orange-400" />
            </div>
            <h2 className="text-2xl text-slate-900 mb-2" style={{ fontWeight: 700 }}>Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Add medicines and health products to get started on your order.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all"
              style={{ fontWeight: 700 }}
            >
              <Sparkles className="w-5 h-5" />
              Browse Medicines
            </Link>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "100% Authentic", color: "text-green-500 bg-green-50" },
                { icon: Truck, label: "Fast Delivery", color: "text-blue-500 bg-blue-50" },
                { icon: Gift, label: "Member Deals", color: "text-purple-500 bg-purple-50" },
              ].map(f => (
                <div key={f.label} className={`rounded-2xl p-3 text-center ${f.color.split(" ")[1]}`}>
                  <f.icon className={`w-5 h-5 mx-auto mb-1 ${f.color.split(" ")[0]}`} />
                  <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{f.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 pb-40 md:pb-12">
        <div className="container mx-auto px-4 py-5 md:py-8 max-w-6xl">

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between mb-5 md:mb-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl text-slate-900" style={{ fontWeight: 700 }}>
                  Shopping Cart
                </h1>
                <p className="text-slate-400 text-sm">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <button
              onClick={handleClearCart}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <X className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-7">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: removingId === item.id ? 0 : 1, x: removingId === item.id ? -30 : 0, y: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                  >
                    <div className="flex gap-3 p-3 sm:p-4">
                      {/* Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-slate-900 text-sm sm:text-base leading-tight line-clamp-2" style={{ fontWeight: 600 }}>
                              {item.name}
                            </h3>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-lg" style={{ fontWeight: 500 }}>
                              {item.category}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price + Qty Row */}
                        <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                          {/* Quantity stepper */}
                          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-sm text-slate-900" style={{ fontWeight: 700 }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-orange-600 text-base sm:text-lg" style={{ fontWeight: 700 }}>
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-slate-400 text-xs">৳{item.price.toFixed(2)} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prescription warning strip */}
                    {item.requiresPrescription && (
                      <div className="flex items-center gap-2 bg-amber-50 border-t border-amber-100 px-4 py-2">
                        <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <p className="text-amber-700 text-xs" style={{ fontWeight: 500 }}>Prescription required — upload before checkout</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all text-sm"
                style={{ fontWeight: 500 }}
              >
                <Plus className="w-4 h-4" />
                Add more medicines
              </Link>

              {/* Trust Badges — desktop only */}
              <div className="hidden md:grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Shield, label: "100% Authentic", sub: "Verified products", color: "text-green-500 bg-green-50 border-green-100" },
                  { icon: Truck, label: "Fast Delivery", sub: "24–48 hours", color: "text-blue-500 bg-blue-50 border-blue-100" },
                  { icon: Package, label: "Easy Returns", sub: "7-day policy", color: "text-purple-500 bg-purple-50 border-purple-100" },
                ].map(b => (
                  <div key={b.label} className={`flex items-center gap-2.5 p-3 rounded-xl border ${b.color.split(" ").slice(1).join(" ")}`}>
                    <b.icon className={`w-5 h-5 ${b.color.split(" ")[0]} flex-shrink-0`} />
                    <div>
                      <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{b.label}</p>
                      <p className="text-slate-400 text-xs">{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Order Summary — Desktop Sidebar ── */}
            <div className="hidden lg:block lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                promoDiscount={promoDiscount}
                total={total}
                appliedPromo={appliedPromo}
                promoInput={promoInput}
                setPromoInput={setPromoInput}
                promoError={promoError}
                showPromoInput={showPromoInput}
                setShowPromoInput={setShowPromoInput}
                applyPromo={applyPromo}
                removePromo={() => { setAppliedPromo(null); setPromoCode(""); }}
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="fixed bottom-16 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] px-4 pt-3 pb-3">
          {/* Promo toggle */}
          <div className="mb-3">
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-700 text-xs" style={{ fontWeight: 600 }}>{appliedPromo.code} · {appliedPromo.discount}% off</span>
                </div>
                <button onClick={() => { setAppliedPromo(null); setPromoCode(""); }} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : showPromoInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value); setPromoError(""); }}
                  placeholder="Promo code (DAWAI10)"
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 bg-white"
                  onKeyDown={e => e.key === "Enter" && applyPromo()}
                  autoFocus
                />
                <button onClick={applyPromo} className="px-3 py-2 bg-orange-500 text-white rounded-xl text-sm" style={{ fontWeight: 600 }}>Apply</button>
                <button onClick={() => { setShowPromoInput(false); setPromoError(""); }} className="px-2 py-2 border border-slate-200 rounded-xl">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPromoInput(true)}
                className="flex items-center gap-2 text-orange-600 text-sm w-full py-1.5"
                style={{ fontWeight: 500 }}
              >
                <Tag className="w-3.5 h-3.5" />
                Have a promo code?
              </button>
            )}
            {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
          </div>

          {/* Summary + CTA */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                <span>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
                <span>{shipping === 0 ? "🎉 Free delivery" : `+৳${shipping.toFixed(2)} delivery`}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-400 text-xs">Total</span>
                <span className="text-orange-600 text-xl" style={{ fontWeight: 800 }}>৳{total.toFixed(2)}</span>
                {promoDiscount > 0 && (
                  <span className="text-green-500 text-xs" style={{ fontWeight: 600 }}>-৳{promoDiscount.toFixed(2)}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => { toast.success("Proceeding to checkout..."); }}
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all flex-shrink-0"
              style={{ fontWeight: 700 }}
            >
              Checkout
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Reusable Order Summary component (desktop sidebar) ── */
function OrderSummary({
  subtotal, shipping, promoDiscount, total, appliedPromo,
  promoInput, setPromoInput, promoError, showPromoInput,
  setShowPromoInput, applyPromo, removePromo, navigate
}: {
  subtotal: number; shipping: number; promoDiscount: number; total: number;
  appliedPromo: { code: string; discount: number } | null;
  promoInput: string; setPromoInput: (v: string) => void; promoError: string;
  showPromoInput: boolean; setShowPromoInput: (v: boolean) => void;
  applyPromo: () => void; removePromo: () => void; navigate: (p: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-slate-900 text-lg" style={{ fontWeight: 700 }}>Order Summary</h2>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Line items */}
        <div className="flex justify-between text-slate-600 text-sm">
          <span>Subtotal</span>
          <span style={{ fontWeight: 600 }}>৳{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Delivery</span>
          <span className={shipping === 0 ? "text-green-600" : "text-slate-700"} style={{ fontWeight: 600 }}>
            {shipping === 0 ? "FREE 🎉" : `৳${shipping.toFixed(2)}`}
          </span>
        </div>
        {subtotal > 0 && subtotal < 50 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <p className="text-blue-700 text-xs">Add ৳{(50 - subtotal).toFixed(2)} more for free delivery</p>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1"><Tag className="w-3 h-3" />{appliedPromo?.code}</span>
            <span className="text-green-600" style={{ fontWeight: 600 }}>-৳{promoDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-slate-100 pt-3 flex justify-between">
          <span className="text-slate-900" style={{ fontWeight: 700 }}>Total</span>
          <span className="text-orange-600 text-xl" style={{ fontWeight: 800 }}>৳{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="px-5 pb-4">
        {appliedPromo ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700 text-sm" style={{ fontWeight: 600 }}>{appliedPromo.code} · {appliedPromo.discount}% off</span>
            </div>
            <button onClick={removePromo} className="text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : showPromoInput ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                onKeyDown={e => e.key === "Enter" && applyPromo()}
                autoFocus
              />
              <button onClick={applyPromo} className="px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors" style={{ fontWeight: 600 }}>
                Apply
              </button>
            </div>
            {promoError && <p className="text-red-500 text-xs">{promoError}</p>}
            <p className="text-slate-400 text-xs">Try: DAWAI10, HEALTH20, SAVE15</p>
          </div>
        ) : (
          <button
            onClick={() => setShowPromoInput(true)}
            className="flex items-center gap-2 w-full py-2.5 border border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all text-sm justify-center"
            style={{ fontWeight: 500 }}
          >
            <Tag className="w-3.5 h-3.5" />
            Apply Promo Code
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 space-y-2.5">
        <button
          onClick={() => toast.success("Proceeding to checkout...")}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all"
          style={{ fontWeight: 700 }}
        >
          Proceed to Checkout
          <ChevronRight className="w-4 h-4" />
        </button>
        <Link
          to="/products"
          className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 text-sm transition-colors"
          style={{ fontWeight: 500 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-2.5">
        {[
          { icon: Shield, text: "100% Authentic — Verified medicines", color: "text-green-500" },
          { icon: Truck, text: "Fast delivery within 24–48 hours", color: "text-blue-500" },
          { icon: Package, text: "Easy 7-day returns", color: "text-purple-500" },
        ].map(b => (
          <div key={b.text} className="flex items-center gap-2.5 text-xs text-slate-500">
            <b.icon className={`w-4 h-4 ${b.color} flex-shrink-0`} />
            {b.text}
          </div>
        ))}
      </div>
    </div>
  );
}
