import { useState, useEffect } from "react";
import { Search, Eye, ChevronDown, Package } from "lucide-react";
import { getOrders, saveOrders, Order } from "../../utils/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100" },
  processing: { label: "Processing", color: "text-blue-700", bg: "bg-blue-100" },
  shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-100" },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-100" },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.userName.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: Order["status"]) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    // Assuming API has an endpoint to update single order, but saveOrders is handled per order.
    // updateOrder in api.ts could be added here if needed
    // Let's just update local state and toast for now, actually we should update backend.
    await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    toast.success(`Order status updated to ${status}`);
  };

  const totalRevenue = filtered.reduce((sum, o) => o.status !== "cancelled" ? sum + o.total : sum, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Orders Management</h2>
          <p className="text-slate-500 mt-1">{orders.length} total orders · Revenue: ${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUS_OPTIONS.map(status => {
          const count = orders.filter(o => o.status === status).length;
          const cfg = statusConfig[status];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              className={`bg-white rounded-xl p-4 border-2 text-left transition-all hover:shadow-md ${statusFilter === status ? "border-orange-400 shadow-md" : "border-slate-100"}`}
            >
              <p className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{count}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${cfg.bg} ${cfg.color}`} style={{ fontWeight: 500 }}>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-slate-50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-slate-50 text-slate-600"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{statusConfig[s].label}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Order ID", "Customer", "Date", "Amount", "Payment", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-slate-500 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order, i) => {
                const cfg = statusConfig[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-slate-900 text-sm font-mono" style={{ fontWeight: 600 }}>{order.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 text-sm" style={{ fontWeight: 500 }}>{order.userName}</p>
                      <p className="text-slate-400 text-xs">{order.userEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{order.createdAt}</p>
                      <p className="text-slate-400 text-xs">{order.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</p>
                      {order.shipping === 0 && <p className="text-green-600 text-xs">Free shipping</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-xs">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value as Order["status"])}
                          className={`text-xs px-3 py-1.5 rounded-full border-0 cursor-pointer appearance-none pr-6 ${cfg.bg} ${cfg.color}`}
                          style={{ fontWeight: 600 }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{statusConfig[s].label}</option>
                          ))}
                        </select>
                        <ChevronDown className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${cfg.color}`} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-slate-900" style={{ fontWeight: 700 }}>Order Details</h3>
                <span className={`text-xs px-3 py-1.5 rounded-full capitalize ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].color}`} style={{ fontWeight: 600 }}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Order ID</span>
                    <span className="text-slate-900 font-mono" style={{ fontWeight: 600 }}>{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Customer</span>
                    <span className="text-slate-900" style={{ fontWeight: 500 }}>{selectedOrder.userName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Email</span>
                    <span className="text-slate-900">{selectedOrder.userEmail}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Address</span>
                    <span className="text-slate-900 text-right max-w-48">{selectedOrder.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Payment</span>
                    <span className="text-slate-900">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-900">{selectedOrder.createdAt}</span>
                  </div>
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
                <div>
                  <label className="block text-sm text-slate-700 mb-2" style={{ fontWeight: 500 }}>Update Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={e => updateStatus(selectedOrder.id, e.target.value as Order["status"])}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm transition-colors" style={{ fontWeight: 500 }}>
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
