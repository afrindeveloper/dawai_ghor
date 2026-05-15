import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ShoppingBag, Heart, Package, TrendingUp, ArrowRight, Clock, CheckCircle, Truck } from "lucide-react";
import { getCurrentUser, getUserOrders, getWishlist, Order } from "../../utils/localStorage";
import { motion } from "motion/react";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  processing: { label: "Processing", color: "text-blue-700", bg: "bg-blue-100", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-100", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100", icon: Clock },
};

export default function UserDashboard() {
  const user = getCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (user) {
      const userOrders = getUserOrders(user.id);
      setOrders(userOrders);
      setWishlistCount(getWishlist().length);
    }
  }, [user?.id]);

  const totalSpent = orders.reduce((sum, o) => o.status !== "cancelled" ? sum + o.total : sum, 0);
  const recentOrders = orders.slice(0, 4);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", link: "/dashboard/orders" },
    { label: "Wishlist Items", value: wishlistCount, icon: Heart, color: "text-red-500", bg: "bg-red-50", link: "/dashboard/wishlist" },
    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", link: "/dashboard/orders" },
    { label: "Active Orders", value: orders.filter(o => ["pending", "processing", "shipped"].includes(o.status)).length, icon: Package, color: "text-orange-600", bg: "bg-orange-50", link: "/dashboard/orders" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-48 h-full opacity-10">
          <div className="w-full h-full bg-gradient-to-l from-white rounded-2xl transform rotate-12 scale-125" />
        </div>
        <div className="relative">
          <p className="text-orange-100 text-sm mb-1">Welcome back,</p>
          <h2 className="text-2xl text-white" style={{ fontWeight: 700 }}>{user?.name} 👋</h2>
          <p className="text-orange-100 text-sm mt-2">You're a valued DawaiGhor member. Here's your health activity.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-xl mt-4 text-sm hover:bg-orange-50 transition-colors"
            style={{ fontWeight: 600 }}
          >
            Shop Medicines
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={stat.link}
              className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{stat.value}</p>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Recent Orders</h3>
          <Link to="/dashboard/orders" className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1" style={{ fontWeight: 500 }}>
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {recentOrders.map(order => {
              const cfg = statusConfig[order.status];
              const Icon = cfg.icon;
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 500 }}>{order.id}</p>
                    <p className="text-slate-400 text-xs">{order.createdAt} · {order.paymentMethod}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`} style={{ fontWeight: 500 }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p style={{ fontWeight: 500 }}>No orders yet</p>
            <Link to="/products" className="inline-block mt-3 text-orange-600 hover:text-orange-700 text-sm" style={{ fontWeight: 500 }}>
              Start shopping →
            </Link>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Browse Medicines", desc: "Explore 20+ products", link: "/products", icon: "💊", color: "from-orange-400 to-orange-600" },
          { title: "AI Doctor Chat", desc: "Get instant health advice", link: "/", icon: "🤖", color: "from-blue-400 to-blue-600" },
          { title: "Upload Prescription", desc: "Order from prescription", link: "/", icon: "📋", color: "from-green-400 to-green-600" },
        ].map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Link
              to={action.link}
              className={`block bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all`}
            >
              <span className="text-3xl">{action.icon}</span>
              <p className="mt-3 text-white" style={{ fontWeight: 600 }}>{action.title}</p>
              <p className="text-white/70 text-sm mt-0.5">{action.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
