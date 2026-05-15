import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users, ShoppingBag, DollarSign, MessageSquare,
  TrendingUp, Package, ArrowUpRight, ArrowDownRight,
  Eye, Clock, CheckCircle, AlertCircle
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { getAllUsers, getOrders, getMessages, getOrders as getOrdersData } from "../../utils/localStorage";
import { motion } from "motion/react";

const revenueData = [
  { month: "Oct", revenue: 4200, orders: 38 },
  { month: "Nov", revenue: 5800, orders: 52 },
  { month: "Dec", revenue: 8900, orders: 78 },
  { month: "Jan", revenue: 6500, orders: 61 },
  { month: "Feb", revenue: 7200, orders: 67 },
  { month: "Mar", revenue: 9100, orders: 84 },
  { month: "Apr", revenue: 11400, orders: 103 },
];

const categoryData = [
  { name: "Prescription", value: 35, color: "#FF6B35" },
  { name: "OTC", value: 25, color: "#f97316" },
  { name: "Vitamins", value: 20, color: "#fb923c" },
  { name: "Baby Care", value: 12, color: "#fdba74" },
  { name: "Devices", value: 8, color: "#fed7aa" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0, orders: 0, revenue: 0, messages: 0,
    pendingOrders: 0, unreadMessages: 0,
  });
  const [recentOrders, setRecentOrders] = useState<ReturnType<typeof getOrdersData>>([]);
  const [recentMessages, setRecentMessages] = useState<ReturnType<typeof getMessages>>([]);

  useEffect(() => {
    const users = getAllUsers().filter(u => u.role === "user");
    const orders = getOrders();
    const messages = getMessages();
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
    const unreadMessages = messages.filter(m => !m.read).length;
    setStats({ users: users.length, orders: orders.length, revenue, messages: messages.length, pendingOrders, unreadMessages });
    setRecentOrders(orders.slice(0, 5));
    setRecentMessages(messages.slice(0, 4));
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, change: "+12%", up: true, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, change: "+8%", up: true, color: "from-orange-500 to-orange-600", bg: "bg-orange-50", iconColor: "text-orange-600" },
    { label: "Revenue", value: `$${stats.revenue.toFixed(0)}`, icon: DollarSign, change: "+23%", up: true, color: "from-green-500 to-green-600", bg: "bg-green-50", iconColor: "text-green-600" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, change: `${stats.unreadMessages} new`, up: null, color: "from-purple-500 to-purple-600", bg: "bg-purple-50", iconColor: "text-purple-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Welcome back, Admin! 👋</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with DawaiGhor today.</p>
        </div>
        <Link to="/admin/orders" className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm" style={{ fontWeight: 600 }}>
          <Eye className="w-4 h-4" />
          View All Orders
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${card.up === true ? "bg-green-100 text-green-700" : card.up === false ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`} style={{ fontWeight: 600 }}>
                {card.up === true ? <ArrowUpRight className="w-3 h-3" /> : card.up === false ? <ArrowDownRight className="w-3 h-3" /> : null}
                {card.change}
              </span>
            </div>
            <p className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{card.value}</p>
            <p className="text-slate-500 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Revenue Overview</h3>
              <p className="text-slate-500 text-sm">Last 7 months performance</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm" style={{ fontWeight: 600 }}>
              <TrendingUp className="w-4 h-4" />
              +23% this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} fill="url(#revenueGradDash)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-slate-900 mb-2" style={{ fontWeight: 600 }}>Sales by Category</h3>
          <p className="text-slate-500 text-sm mb-6">Distribution this month</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryData} layout="vertical" barCategoryGap="20%">
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#FF6B35" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Recent Orders</h3>
            <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm" style={{ fontWeight: 500 }}>View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm truncate" style={{ fontWeight: 500 }}>{order.userName}</p>
                  <p className="text-slate-400 text-xs">{order.id}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`} style={{ fontWeight: 500 }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Recent Messages</h3>
            <Link to="/admin/messages" className="text-orange-600 hover:text-orange-700 text-sm" style={{ fontWeight: 500 }}>View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentMessages.map(msg => (
              <div key={msg.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold ${msg.read ? "bg-slate-300" : "bg-orange-500"}`}>
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 text-sm truncate" style={{ fontWeight: 500 }}>{msg.name}</p>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>}
                  </div>
                  <p className="text-slate-400 text-xs truncate">{msg.subject}</p>
                </div>
                <div className="flex-shrink-0">
                  {msg.replied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Orders", value: stats.pendingOrders, icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", link: "/admin/orders" },
          { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50", link: "/admin/messages" },
          { label: "Active Users", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50", link: "/admin/users" },
          { label: "Total Products", value: 20, icon: Package, color: "text-green-600", bg: "bg-green-50", link: "/admin/medicines" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.link}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{item.value}</p>
            <p className="text-slate-500 text-sm">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}