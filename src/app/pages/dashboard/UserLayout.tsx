import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, ShoppingBag, Heart, FileText,
  Settings, LogOut, Menu, X, User, ChevronRight, Home, Bot
} from "lucide-react";
import { getCurrentUser, logoutUser } from "../../utils/api";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/ai-doctor", label: "AI Doctor Chat", icon: Bot },
  { path: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
  { path: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { path: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
  { path: "/dashboard/profile", label: "Profile Settings", icon: Settings },
];

export default function UserLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    }); 
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  if (loading || !user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Profile Card */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 700, fontSize: "18px" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 truncate" style={{ fontWeight: 600 }}>{user.name}</p>
            <p className="text-slate-400 text-xs truncate">{user.email}</p>
            <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full mt-1" style={{ fontWeight: 500 }}>Member</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-orange-500"}`} />
              <span className="text-sm" style={{ fontWeight: 500 }}>{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto text-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Links */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all text-sm">
          <Home className="w-4 h-4" />
          Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-100 flex-shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white text-sm" style={{ fontWeight: 700 }}>D</span>
            </div>
            <span className="text-slate-900" style={{ fontWeight: 700 }}>DawaiGhor</span>
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-slate-900" style={{ fontWeight: 700 }}>My Account</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <span className="text-slate-900" style={{ fontWeight: 600 }}>My Dashboard</span>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm" style={{ fontWeight: 700 }}>
            {user?.name?.charAt(0)}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
