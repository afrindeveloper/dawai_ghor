import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ShoppingBag, Package, Truck, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { getCurrentUser, getUserOrders, Order } from "../../utils/localStorage";
import { motion, AnimatePresence } from "motion/react";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  processing: { label: "Processing", color: "text-blue-700", bg: "bg-blue-100", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-100", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100", icon: XCircle },
};

export default function UserOrders() {
  const user = getCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) setOrders(getUserOrders(user.id));
  }, [user?.id]);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>My Orders</h2>
        <p className="text-slate-500 mt-1">{orders.length} total orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${filter === f ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
            style={{ fontWeight: 500 }}
          >
            {f === "all" ? "All Orders" : (statusConfig[f]?.label || f)}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((order, i) => {
            const cfg = statusConfig[order.status];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-slate-900 font-mono text-sm" style={{ fontWeight: 700 }}>{order.id}</p>
                      <p className="text-slate-400 text-xs">{order.createdAt}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full capitalize ${cfg.bg} ${cfg.color}`} style={{ fontWeight: 600 }}>
                    {cfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-50">
                  {[
                    { label: "Payment", value: order.paymentMethod },
                    { label: "Shipping", value: order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}` },
                    { label: "Subtotal", value: `$${order.subtotal.toFixed(2)}` },
                    { label: "Total", value: `$${order.total.toFixed(2)}`, highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label}>
                      <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                      <p className={`text-sm ${highlight ? "text-orange-600" : "text-slate-900"}`} style={{ fontWeight: highlight ? 700 : 500 }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Package className="w-3.5 h-3.5" />
                    <span>{order.address}</span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-sm transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>

                {/* Progress Bar for non-cancelled orders */}
                {order.status !== "cancelled" && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      {["Pending", "Processing", "Shipped", "Delivered"].map((step, idx) => (
                        <span key={step} className={["pending", "processing", "shipped", "delivered"].indexOf(order.status) >= idx ? "text-orange-600" : ""}
                          style={{ fontWeight: ["pending", "processing", "shipped", "delivered"].indexOf(order.status) >= idx ? 500 : 400 }}>
                          {step}
                        </span>
                      ))}
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${(["pending", "processing", "shipped", "delivered"].indexOf(order.status) + 1) * 25}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
          <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-900" style={{ fontWeight: 600 }}>No orders found</p>
          <p className="text-slate-400 text-sm mt-1 mb-5">
            {filter !== "all" ? `No ${filter} orders` : "You haven't placed any orders yet"}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            Shop Now
          </Link>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg text-slate-900 mb-5" style={{ fontWeight: 700 }}>Order {selectedOrder.id}</h3>
              <div className="space-y-3 bg-slate-50 rounded-xl p-4 mb-4">
                {[
                  { label: "Status", value: statusConfig[selectedOrder.status].label },
                  { label: "Date", value: selectedOrder.createdAt },
                  { label: "Delivery Address", value: selectedOrder.address },
                  { label: "Payment Method", value: selectedOrder.paymentMethod },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-900" style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-slate-900">{selectedOrder.shipping === 0 ? "Free" : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between border-t border-orange-200 pt-2">
                  <span className="text-slate-900" style={{ fontWeight: 700 }}>Total</span>
                  <span className="text-orange-600" style={{ fontWeight: 700 }}>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-full mt-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors" style={{ fontWeight: 600 }}>
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
