import { useState, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2, UserCheck, UserX,
  Mail, Phone, MapPin, Calendar, Shield, User, Users
} from "lucide-react";
import { getAllUsers, saveAllUsers, User as UserType } from "../../utils/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "admin">("all");
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", address: "", role: "user" as "user" | "admin" });

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return matchSearch && u.isActive;
    if (filter === "inactive") return matchSearch && !u.isActive;
    if (filter === "admin") return matchSearch && u.role === "admin";
    return matchSearch;
  });

  const toggleStatus = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u);
    setUsers(updated);
    saveAllUsers(updated);
    toast.success("User status updated");
  };

  const deleteUser = (id: string) => {
    if (id === "admin-001") { toast.error("Cannot delete admin user"); return; }
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveAllUsers(updated);
    toast.success("User deleted");
  };

  const handleEdit = () => {
    if (!editUser) return;
    const updated = users.map(u => u.id === editUser.id ? editUser : u);
    setUsers(updated);
    saveAllUsers(updated);
    setShowModal(false);
    setEditUser(null);
    toast.success("User updated successfully");
  };

  const handleAdd = () => {
    if (!newUser.name || !newUser.email) { toast.error("Name and email are required"); return; }
    const user: UserType = {
      id: `user-${Date.now()}`,
      ...newUser,
      joinedAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    const updated = [...users, user];
    setUsers(updated);
    saveAllUsers(updated);
    setShowAddModal(false);
    setNewUser({ name: "", email: "", phone: "", address: "", role: "user" });
    toast.success("User added successfully");
  };

  const roleColor = (role: string) => role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Users Management</h2>
          <p className="text-slate-500 mt-1">{users.length} total users registered</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl transition-colors text-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-slate-50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "inactive", "admin"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${filter === f ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              style={{ fontWeight: 500 }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User", "Contact", "Role", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-slate-500 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${user.role === "admin" ? "bg-gradient-to-br from-purple-500 to-purple-600" : "bg-gradient-to-br from-orange-400 to-orange-600"}`} style={{ fontWeight: 700 }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-900 text-sm" style={{ fontWeight: 500 }}>{user.name}</p>
                        <p className="text-slate-400 text-xs">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs capitalize ${roleColor(user.role)}`} style={{ fontWeight: 500 }}>
                      {user.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      {user.joinedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`} style={{ fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditUser({ ...user }); setShowModal(true); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`p-1.5 rounded-lg transition-colors ${user.isActive ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-slate-400 hover:text-green-600 hover:bg-green-50"}`}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg text-slate-900 mb-5" style={{ fontWeight: 700 }}>Edit User</h3>
              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name" as const, icon: User },
                  { label: "Email", key: "email" as const, icon: Mail },
                  { label: "Phone", key: "phone" as const, icon: Phone },
                  { label: "Address", key: "address" as const, icon: MapPin },
                ].map(({ label, key, icon: Icon }) => (
                  <div key={key}>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={(editUser[key] as string) || ""}
                        onChange={e => setEditUser({ ...editUser, [key]: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Status</label>
                  <select
                    value={editUser.isActive ? "active" : "inactive"}
                    onChange={e => setEditUser({ ...editUser, isActive: e.target.value === "active" })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm" style={{ fontWeight: 500 }}>Cancel</button>
                <button onClick={handleEdit} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors" style={{ fontWeight: 600 }}>Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg text-slate-900 mb-5" style={{ fontWeight: 700 }}>Add New User</h3>
              <div className="space-y-4">
                {[
                  { label: "Full Name *", key: "name" as const },
                  { label: "Email *", key: "email" as const },
                  { label: "Phone", key: "phone" as const },
                  { label: "Address", key: "address" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{label}</label>
                    <input
                      type="text"
                      value={newUser[key] || ""}
                      onChange={e => setNewUser({ ...newUser, [key]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Role</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value as "user" | "admin" })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm" style={{ fontWeight: 500 }}>Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors" style={{ fontWeight: 600 }}>Add User</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}