import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Search, ShoppingCart, User, Upload, LogOut, LayoutDashboard, Shield, ChevronDown, X, Menu } from "lucide-react";
import { getCart, getCurrentUser, logoutUser } from "../utils/localStorage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import MobileNav from "./MobileNav";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    const updateUser = () => setUser(getCurrentUser());

    updateCartCount();
    updateUser();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setShowUserMenu(false);
    toast.success("Logged out successfully");
    navigate("/");
    window.dispatchEvent(new Event("userUpdated"));
  };

  return (
    <>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200">
                <div className="w-4 h-4 rounded-full bg-white"></div>
              </div>
              <span className="text-2xl text-gray-800" style={{ fontWeight: 700 }}>DawaiGhor</span>
            </Link>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search medicines, symptoms, or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 bg-slate-50 border-slate-200 focus:border-orange-400 rounded-xl"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-0 top-0 bottom-0 bg-orange-500 hover:bg-orange-600 text-white rounded-l-none rounded-r-xl"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Upload Prescription */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl gap-2"
                onClick={() => setShowPrescriptionDialog(true)}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline">Upload Rx</span>
              </Button>

              {/* User Menu — desktop only */}
              <div className="hidden md:block">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${user.role === "admin" ? "bg-gradient-to-br from-purple-500 to-purple-600" : "bg-gradient-to-br from-orange-400 to-orange-600"}`} style={{ fontWeight: 700 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-slate-900 text-xs leading-none" style={{ fontWeight: 600 }}>{user.name.split(" ")[0]}</p>
                        <p className="text-slate-400 text-xs mt-0.5 capitalize">{user.role}</p>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-slate-50">
                            <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                            <p className="text-slate-400 text-xs truncate">{user.email}</p>
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`} style={{ fontWeight: 500 }}>
                              {user.role === "admin" ? "Administrator" : "Member"}
                            </span>
                          </div>
                          {user.role === "admin" ? (
                            <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <Shield className="w-4 h-4 text-purple-500" />
                              Admin Dashboard
                            </Link>
                          ) : null}
                          <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-orange-500" />
                            My Dashboard
                          </Link>
                          <Link to="/dashboard/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <ShoppingCart className="w-4 h-4 text-blue-500" />
                            My Orders
                          </Link>
                          <div className="border-t border-slate-50 mt-1 pt-1">
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-slate-700 hover:text-orange-600">
                      <User className="w-5 h-5" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>

              {/* Cart — visible on all screens */}
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-slate-700" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      style={{ fontWeight: 700 }}
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </Button>
              </Link>

              {/* Mobile Search Toggle */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 overflow-hidden"
              >
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Search medicines..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-4 bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex-1 border-orange-200 text-orange-600 rounded-xl gap-2" onClick={() => { setShowPrescriptionDialog(true); setMobileMenuOpen(false); }}>
                    <Upload className="w-4 h-4" />
                    Upload Prescription
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Upload Prescription Dialog */}
      <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Prescription</DialogTitle>
            <DialogDescription>Upload your doctor's prescription to order prescription medicines.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed border-orange-200 rounded-xl p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
              onClick={() => { toast.success("File upload dialog opened"); }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <p className="text-slate-700 text-sm mb-1" style={{ fontWeight: 500 }}>Drag & drop your prescription here</p>
              <p className="text-slate-400 text-xs">or click to browse files</p>
              <Button variant="outline" className="mt-4 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl">
                Choose File
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center">Supported: JPG, PNG, PDF (Max 5MB)</p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl" onClick={() => { setShowPrescriptionDialog(false); toast.success("Prescription submitted for review!"); }}>
              Upload & Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}