import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, ShoppingBag, Bot, ShoppingCart, User, X,
  LogOut, LayoutDashboard, Shield, Heart, FileText,
  ChevronRight, Settings, Package, Star, Bell,
  LogIn, UserPlus, Sparkles
} from "lucide-react";
import { getCurrentUser, logoutUser, getCart } from "../utils/localStorage";
import { toast } from "sonner";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Home", exact: true },
  { path: "/products", icon: ShoppingBag, label: "Shop" },
  { path: "/ai-doctor", icon: Bot, label: "AI Doc", special: true },
  { path: "/cart", icon: ShoppingCart, label: "Cart" },
  { path: "/__profile__", icon: User, label: "Profile", isProfile: true },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [cartCount, setCartCount] = useState(0);
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  useEffect(() => {
    const update = () => {
      setUser(getCurrentUser());
      const cart = getCart();
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("cartUpdated", update);
    window.addEventListener("userUpdated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("userUpdated", update);
    };
  }, []);

  // Close sheet when route changes
  useEffect(() => { setShowProfileSheet(false); }, [location.pathname]);

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.isProfile) return showProfileSheet;
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setShowProfileSheet(false);
    toast.success("Logged out successfully");
    navigate("/");
    window.dispatchEvent(new Event("userUpdated"));
  };

  // Don't show on admin or dashboard pages
  const hide = location.pathname.startsWith("/admin") || location.pathname.startsWith("/dashboard");
  if (hide) return null;

  return (
    <>
      {/* ── Bottom Nav Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Frosted glass bar */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-2 pb-safe">
          <div className="flex items-end justify-around h-16">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);

              if (item.special) {
                // AI Doc — center pill button
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex flex-col items-center -mt-5 relative"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-300/40 relative ${
                        active
                          ? "bg-gradient-to-br from-orange-400 to-orange-600"
                          : "bg-gradient-to-br from-orange-500 to-orange-600"
                      }`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                      {/* Pulse ring */}
                      <span className="absolute inset-0 rounded-2xl bg-orange-400 animate-ping opacity-20 pointer-events-none" />
                    </motion.div>
                    <span className="text-[10px] mt-1 text-orange-500" style={{ fontWeight: 600 }}>
                      {item.label}
                    </span>
                  </Link>
                );
              }

              if (item.isProfile) {
                return (
                  <button
                    key="profile"
                    onClick={() => setShowProfileSheet(true)}
                    className="flex flex-col items-center gap-1 py-2 px-3 relative"
                  >
                    <motion.div whileTap={{ scale: 0.85 }} className="relative">
                      {user ? (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${
                          user.role === "admin"
                            ? "bg-gradient-to-br from-purple-500 to-purple-600"
                            : "bg-gradient-to-br from-orange-400 to-orange-600"
                        }`} style={{ fontWeight: 700 }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <item.icon className={`w-6 h-6 ${active || showProfileSheet ? "text-orange-500" : "text-slate-400"}`} />
                      )}
                      {user && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                      )}
                    </motion.div>
                    <span className={`text-[10px] ${showProfileSheet || active ? "text-orange-500" : "text-slate-400"}`} style={{ fontWeight: showProfileSheet ? 700 : 500 }}>
                      {user ? user.name.split(" ")[0] : "Account"}
                    </span>
                    {(showProfileSheet || active) && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500"
                      />
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-1 py-2 px-3 relative"
                >
                  <motion.div whileTap={{ scale: 0.85 }} className="relative">
                    {item.path === "/cart" && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full flex items-center justify-center z-10" style={{ fontWeight: 700 }}>
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                    <item.icon className={`w-6 h-6 transition-colors ${active ? "text-orange-500" : "text-slate-400"}`} />
                  </motion.div>
                  <span className={`text-[10px] transition-colors ${active ? "text-orange-500" : "text-slate-400"}`} style={{ fontWeight: active ? 700 : 500 }}>
                    {item.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Profile Bottom Sheet ── */}
      <AnimatePresence>
        {showProfileSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setShowProfileSheet(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-slate-200" />
              </div>

              {user ? (
                /* ── Logged-in Profile Sheet ── */
                <>
                  {/* User Card */}
                  <div className="px-5 pt-3 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg ${
                        user.role === "admin"
                          ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200"
                          : "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-200"
                      }`} style={{ fontWeight: 700 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 text-base truncate" style={{ fontWeight: 700 }}>{user.name}</p>
                        <p className="text-slate-400 text-sm truncate">{user.email}</p>
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full mt-1 ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }`} style={{ fontWeight: 600 }}>
                          {user.role === "admin" ? (
                            <><Shield className="w-3 h-3" /> Administrator</>
                          ) : (
                            <><Star className="w-3 h-3" /> Premium Member</>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowProfileSheet(false)}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {user.role !== "admin" && (
                    <div className="grid grid-cols-3 gap-3 px-5 py-4 border-b border-slate-100">
                      {[
                        { label: "Orders", val: "0", icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Wishlist", val: "0", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
                        { label: "Rx Files", val: "0", icon: FileText, color: "text-green-500", bg: "bg-green-50" },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
                          <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                          <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{s.val}</p>
                          <p className="text-slate-500 text-xs">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="px-3 py-2">
                    {user.role === "admin" && (
                      <SheetMenuItem
                        icon={<Shield className="w-5 h-5 text-purple-500" />}
                        label="Admin Dashboard"
                        sub="Manage site & users"
                        to="/admin"
                        color="bg-purple-50"
                        onClose={() => setShowProfileSheet(false)}
                      />
                    )}
                    <SheetMenuItem
                      icon={<LayoutDashboard className="w-5 h-5 text-orange-500" />}
                      label="My Dashboard"
                      sub="Overview & summary"
                      to="/dashboard"
                      color="bg-orange-50"
                      onClose={() => setShowProfileSheet(false)}
                    />
                    <SheetMenuItem
                      icon={<Package className="w-5 h-5 text-blue-500" />}
                      label="My Orders"
                      sub="Track your deliveries"
                      to="/dashboard/orders"
                      color="bg-blue-50"
                      onClose={() => setShowProfileSheet(false)}
                    />
                    <SheetMenuItem
                      icon={<Heart className="w-5 h-5 text-red-500" />}
                      label="Wishlist"
                      sub="Saved medicines"
                      to="/dashboard/wishlist"
                      color="bg-red-50"
                      onClose={() => setShowProfileSheet(false)}
                    />
                    <SheetMenuItem
                      icon={<FileText className="w-5 h-5 text-green-500" />}
                      label="Prescriptions"
                      sub="Uploaded Rx files"
                      to="/dashboard/prescriptions"
                      color="bg-green-50"
                      onClose={() => setShowProfileSheet(false)}
                    />
                    <SheetMenuItem
                      icon={<Bell className="w-5 h-5 text-indigo-500" />}
                      label="Notifications"
                      sub="Alerts & updates"
                      to="/dashboard"
                      color="bg-indigo-50"
                      onClose={() => setShowProfileSheet(false)}
                    />
                    <SheetMenuItem
                      icon={<Settings className="w-5 h-5 text-slate-500" />}
                      label="Account Settings"
                      sub="Edit profile & preferences"
                      to="/dashboard/profile"
                      color="bg-slate-100"
                      onClose={() => setShowProfileSheet(false)}
                    />
                  </div>

                  {/* Logout */}
                  <div className="px-5 pb-8 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                /* ── Guest Account Sheet ── */
                <div className="px-5 pt-4 pb-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-slate-900 text-lg" style={{ fontWeight: 700 }}>Your Account</h3>
                      <p className="text-slate-400 text-sm">Sign in for a better experience</p>
                    </div>
                    <button onClick={() => setShowProfileSheet(false)} className="p-2 rounded-xl hover:bg-slate-100">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Illustration */}
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-orange-400" />
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2.5 mb-6">
                    {[
                      { icon: Package, label: "Track your orders in real-time", color: "text-blue-500", bg: "bg-blue-50" },
                      { icon: Heart, label: "Save medicines to wishlist", color: "text-red-500", bg: "bg-red-50" },
                      { icon: Sparkles, label: "AI Doctor consultations", color: "text-orange-500", bg: "bg-orange-50" },
                      { icon: Star, label: "Exclusive member discounts", color: "text-yellow-500", bg: "bg-yellow-50" },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${b.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <b.icon className={`w-4 h-4 ${b.color}`} />
                        </div>
                        <p className="text-slate-600 text-sm">{b.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setShowProfileSheet(false)}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200"
                      style={{ fontWeight: 700 }}
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In to Your Account
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setShowProfileSheet(false)}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 border-2 border-slate-200 bg-white text-slate-700 rounded-2xl"
                      style={{ fontWeight: 600 }}
                    >
                      <UserPlus className="w-5 h-5 text-orange-500" />
                      Create New Account
                    </Link>
                  </div>

                  <p className="text-center text-slate-400 text-xs mt-4">
                    By signing in you agree to our Terms & Privacy Policy
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Safe area spacer so page content isn't hidden behind nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}

/* Helper: Sheet Menu Item */
function SheetMenuItem({
  icon, label, sub, to, color, onClose
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  to: string;
  color: string;
  onClose: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors"
    >
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{label}</p>
        <p className="text-slate-400 text-xs">{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
    </Link>
  );
}
