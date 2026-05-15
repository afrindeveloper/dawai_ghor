import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Star } from "lucide-react";
import { motion } from "motion/react";

const monthlyRevenue = [
  { month: "Oct'24", revenue: 4200, orders: 38, users: 12 },
  { month: "Nov'24", revenue: 5800, orders: 52, users: 18 },
  { month: "Dec'24", revenue: 8900, orders: 78, users: 25 },
  { month: "Jan'25", revenue: 6500, orders: 61, users: 14 },
  { month: "Feb'25", revenue: 7200, orders: 67, users: 22 },
  { month: "Mar'25", revenue: 9100, orders: 84, users: 31 },
  { month: "Apr'25", revenue: 11400, orders: 103, users: 38 },
];

const categoryRevenue = [
  { category: "Prescription", revenue: 3200, orders: 28, fill: "#FF6B35" },
  { category: "OTC", revenue: 2100, orders: 34, fill: "#f97316" },
  { category: "Vitamins", revenue: 1800, orders: 22, fill: "#fb923c" },
  { category: "Baby Care", revenue: 1400, orders: 18, fill: "#fdba74" },
  { category: "Devices", revenue: 2900, orders: 8, fill: "#fed7aa" },
  { category: "Women's", revenue: 1100, orders: 15, fill: "#ffedd5" },
];

const pieData = [
  { name: "Prescription", value: 35, color: "#FF6B35" },
  { name: "OTC", value: 20, color: "#f97316" },
  { name: "Vitamins", value: 20, color: "#fb923c" },
  { name: "Baby Care", value: 12, color: "#fdba74" },
  { name: "Devices", value: 8, color: "#fbbf24" },
  { name: "Women's", value: 5, color: "#34d399" },
];

const topProducts = [
  { name: "Blood Pressure Monitor", sales: 42, revenue: 1931.58, rating: 4.9 },
  { name: "Omega-3 Fish Oil", sales: 38, revenue: 873.62, rating: 4.8 },
  { name: "Pregnancy Test Kit", sales: 35, revenue: 454.65, rating: 4.8 },
  { name: "Pulse Oximeter", sales: 28, revenue: 839.72, rating: 4.8 },
  { name: "Digital Thermometer", sales: 25, revenue: 462.50, rating: 4.9 },
];

export default function AdminAnalytics() {
  const kpis = [
    { label: "Total Revenue", value: "$52,100", change: "+23%", up: true, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Orders", value: "483", change: "+18%", up: true, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "New Users", value: "160", change: "+31%", up: true, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Avg. Rating", value: "4.6 ★", change: "+0.2", up: true, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Analytics & Reports</h2>
        <p className="text-slate-500 mt-1">Performance overview for the last 7 months</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs px-2 py-1 rounded-full ${kpi.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`} style={{ fontWeight: 600 }}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{kpi.value}</p>
            <p className="text-slate-500 text-sm">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Revenue & Orders Trend</h3>
          <p className="text-slate-500 text-sm mb-6">Monthly comparison</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#FF6B35" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={2} fill="url(#ordGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Sales Mix</h3>
          <p className="text-slate-500 text-sm mb-4">By category (%)</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" isAnimationActive={false}>
                {pieData.map((entry) => (
                  <Cell key={`pie-cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-900" style={{ fontWeight: 600 }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Category Revenue Chart + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Revenue by Category</h3>
          <p className="text-slate-500 text-sm mb-6">This month's performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="revenue" name="Revenue ($)" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {categoryRevenue.map((entry) => (
                  <Cell key={`bar-cell-${entry.category}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Top Selling Products</h3>
          <p className="text-slate-500 text-sm mb-6">By revenue this month</p>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 text-xs flex-shrink-0" style={{ fontWeight: 700 }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm truncate" style={{ fontWeight: 500 }}>{product.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="h-1.5 bg-slate-100 rounded-full flex-1">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                        style={{ width: `${(product.revenue / 2000) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{product.sales} sold</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>${product.revenue.toFixed(0)}</p>
                  <p className="text-yellow-500 text-xs">★ {product.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>User Growth</h3>
        <p className="text-slate-500 text-sm mb-6">New user registrations per month</p>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
            <Line type="monotone" dataKey="users" name="New Users" stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}