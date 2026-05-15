import { useState } from "react";
import { Save, Store, Bell, Shield, Truck, CreditCard, Globe } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

const sections = [
  { id: "store", label: "Store Settings", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("store");
  const [storeSettings, setStoreSettings] = useState({
    storeName: "DawaiGhor",
    storeEmail: "support@dawai.com",
    storePhone: "+880 1700 000000",
    storeAddress: "123 Healthcare Street, Dhaka 1000",
    currency: "USD",
    language: "English",
    freeShippingThreshold: 50,
    shippingCost: 5.99,
  });
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newMessages: true,
    userRegistrations: false,
    reviewAlerts: true,
    dailyReport: false,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Settings</h2>
        <p className="text-slate-500 mt-1">Manage your store configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeSection === section.id ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "text-slate-600 hover:bg-slate-50"}`}
                style={{ fontWeight: 500 }}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
          >
            {activeSection === "store" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Store Information</h3>
                  <p className="text-slate-500 text-sm">Basic information about your pharmacy store</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Store Name", key: "storeName" },
                    { label: "Support Email", key: "storeEmail" },
                    { label: "Phone Number", key: "storePhone" },
                    { label: "Store Address", key: "storeAddress" },
                  ].map(({ label, key }) => (
                    <div key={key} className={key === "storeAddress" ? "sm:col-span-2" : ""}>
                      <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{label}</label>
                      <input
                        type="text"
                        value={(storeSettings as any)[key]}
                        onChange={e => setStoreSettings({ ...storeSettings, [key]: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Currency</label>
                    <select value={storeSettings.currency} onChange={e => setStoreSettings({ ...storeSettings, currency: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                      <option>USD</option><option>BDT</option><option>EUR</option><option>GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Language</label>
                    <select value={storeSettings.language} onChange={e => setStoreSettings({ ...storeSettings, language: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                      <option>English</option><option>Bengali</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Shipping Settings</h3>
                  <p className="text-slate-500 text-sm">Configure delivery rates and thresholds</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Standard Shipping Cost ($)</label>
                    <input type="number" value={storeSettings.shippingCost} onChange={e => setStoreSettings({ ...storeSettings, shippingCost: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Free Shipping Threshold ($)</label>
                    <input type="number" value={storeSettings.freeShippingThreshold} onChange={e => setStoreSettings({ ...storeSettings, freeShippingThreshold: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                  </div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-700 mb-1">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm" style={{ fontWeight: 600 }}>Current Policy</span>
                  </div>
                  <p className="text-orange-600 text-sm">Orders above ${storeSettings.freeShippingThreshold} get free shipping. Otherwise ${storeSettings.shippingCost} flat rate.</p>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Notification Preferences</h3>
                  <p className="text-slate-500 text-sm">Choose which events trigger notifications</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: "newOrders", label: "New Order Notifications", desc: "Get notified when a new order is placed" },
                    { key: "lowStock", label: "Low Stock Alerts", desc: "Alert when product stock falls below 10 units" },
                    { key: "newMessages", label: "New Message Alerts", desc: "Get notified on new customer messages" },
                    { key: "userRegistrations", label: "User Registration Alerts", desc: "Notify on every new user signup" },
                    { key: "reviewAlerts", label: "Review Notifications", desc: "Alert on new product reviews" },
                    { key: "dailyReport", label: "Daily Summary Report", desc: "Receive daily analytics summary via email" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                      <div>
                        <p className="text-slate-900 text-sm" style={{ fontWeight: 500 }}>{label}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !(notifications as any)[key] })}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${(notifications as any)[key] ? "bg-orange-500" : "bg-slate-200"}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${(notifications as any)[key] ? "left-6" : "left-0.5"}`}></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Payment Methods</h3>
                  <p className="text-slate-500 text-sm">Configure accepted payment options</p>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Cash on Delivery", desc: "Accept cash payments upon delivery", enabled: true },
                    { name: "bKash Mobile Banking", desc: "Accept payments via bKash", enabled: true },
                    { name: "Nagad", desc: "Accept payments via Nagad", enabled: true },
                    { name: "Credit/Debit Card", desc: "Accept Visa, Mastercard payments", enabled: false },
                    { name: "Rocket", desc: "Accept payments via Rocket (DBBL)", enabled: false },
                  ].map((method, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                      <div>
                        <p className="text-slate-900 text-sm" style={{ fontWeight: 500 }}>{method.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{method.desc}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${method.enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`} style={{ fontWeight: 500 }}>
                        {method.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Security Settings</h3>
                  <p className="text-slate-500 text-sm">Keep your admin account secure</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm" style={{ fontWeight: 600 }}>Admin Credentials</span>
                    </div>
                    <p className="text-blue-600 text-sm">Email: admin@dawai.com | Password: admin123</p>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
