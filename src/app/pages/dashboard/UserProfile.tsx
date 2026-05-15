import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Save, Lock, Eye, EyeOff } from "lucide-react";
import { getCurrentUser, saveCurrentUser, saveAllUsers, getAllUsers } from "../../utils/localStorage";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function UserProfile() {
  const user = getCurrentUser();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const handleSaveProfile = () => {
    if (!profile.name || !profile.email) { toast.error("Name and email are required"); return; }
    if (!user) return;
    const updatedUser = { ...user, ...profile };
    saveCurrentUser(updatedUser);
    // Also update in the all users list
    const users = getAllUsers();
    const updated = users.map(u => u.id === user.id ? updatedUser : u);
    saveAllUsers(updated);
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (!passwords.newPass || passwords.newPass.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (passwords.newPass !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    setPasswords({ current: "", newPass: "", confirm: "" });
    toast.success("Password updated successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Profile Settings</h2>
        <p className="text-slate-500 mt-1">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200" style={{ fontWeight: 700, fontSize: "28px" }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-slate-900" style={{ fontWeight: 700 }}>{profile.name}</h3>
            <p className="text-slate-400 text-sm">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>Member</span>
              <span className="text-slate-400 text-xs">Since {user?.joinedAt}</span>
            </div>
          </div>
        </div>

        <h4 className="text-slate-900 mb-5" style={{ fontWeight: 600 }}>Personal Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: "Full Name", key: "name", icon: User, type: "text" },
            { label: "Email Address", key: "email", icon: Mail, type: "email" },
            { label: "Phone Number", key: "phone", icon: Phone, type: "tel" },
          ].map(({ label, key, icon: Icon, type }) => (
            <div key={key}>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={type}
                  value={(profile as any)[key]}
                  onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Delivery Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                rows={2}
                placeholder="Enter your full delivery address"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </motion.div>

      {/* Password Change */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-orange-500" />
          <h4 className="text-slate-900" style={{ fontWeight: 600 }}>Change Password</h4>
        </div>
        <div className="space-y-4 max-w-md">
          {[
            { label: "Current Password", key: "current" as const, show: showPasswords.current, toggle: () => setShowPasswords(s => ({ ...s, current: !s.current })) },
            { label: "New Password", key: "newPass" as const, show: showPasswords.new, toggle: () => setShowPasswords(s => ({ ...s, new: !s.new })) },
            { label: "Confirm New Password", key: "confirm" as const, show: showPasswords.confirm, toggle: () => setShowPasswords(s => ({ ...s, confirm: !s.confirm })) },
          ].map(({ label, key, show, toggle }) => (
            <div key={key}>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={show ? "text" : "password"}
                  value={passwords[key]}
                  onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={handleChangePassword}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Lock className="w-4 h-4" />
            Update Password
          </button>
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <h4 className="text-slate-900 mb-5" style={{ fontWeight: 600 }}>Account Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Account ID", value: user?.id || "N/A", icon: User },
            { label: "Member Since", value: user?.joinedAt || "N/A", icon: Calendar },
            { label: "Account Status", value: user?.isActive ? "Active" : "Inactive", icon: Calendar, highlight: user?.isActive },
          ].map(({ label, value, icon: Icon, highlight }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 text-xs" style={{ fontWeight: 500 }}>{label}</span>
              </div>
              <p className={`text-sm ${highlight !== undefined ? (highlight ? "text-green-600" : "text-red-600") : "text-slate-900"}`} style={{ fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
