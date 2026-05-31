import { useState, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2, Package, Star, Tag,
  AlertCircle, CheckCircle, Filter
} from "lucide-react";
import { getManagedProducts, saveAdminProducts, Product, updateProduct, addProduct } from "../../utils/api";
import { products as defaultProducts } from "../../data/mockData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = ["Prescription Medicine", "OTC", "Baby Care", "Devices & Kits", "Vitamins & Supplements", "Women's Choice"];

const emptyProduct: Omit<Product, "id"> = {
  name: "", price: 0, originalPrice: undefined, image: "", category: "OTC",
  description: "", brand: "", stock: 0, rating: 4.5, reviewCount: 0,
  dosage: "", activeIngredient: "", requiresPrescription: false, inStock: true,
};

export default function AdminMedicines() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>(emptyProduct);

  useEffect(() => {
    getManagedProducts(defaultProducts).then(setProducts);
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) { toast.error("Name and price are required"); return; }
    let updated: Product[];
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? { ...formData, id: editingProduct.id } : p);
      await updateProduct(editingProduct.id, formData);
      toast.success("Medicine updated successfully");
    } else {
      const added = await addProduct(formData);
      updated = [...products, added];
      toast.success("Medicine added successfully");
    }
    setProducts(updated);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    // Ideally await deleteProduct(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(() => {});
    toast.success("Medicine removed");
  };

  const toggleStock = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const inStock = !target.inStock;
    const updated = products.map(p => p.id === id ? { ...p, inStock } : p);
    setProducts(updated);
    await updateProduct(id, { inStock });
    toast.success("Stock status updated");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Medicine Management</h2>
          <p className="text-slate-500 mt-1">{products.length} products in catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl transition-colors text-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicines, brands, categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-slate-50 text-slate-600"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full backdrop-blur-sm ${product.inStock ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}`} style={{ fontWeight: 600 }}>
                  {product.inStock ? "In Stock" : "Out"}
                </span>
                {product.requiresPrescription && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/90 text-white backdrop-blur-sm" style={{ fontWeight: 600 }}>Rx</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>{product.category}</span>
              <h3 className="text-slate-900 mt-2 mb-1 line-clamp-1 text-sm" style={{ fontWeight: 600 }}>{product.name}</h3>
              <p className="text-slate-400 text-xs mb-2">{product.brand}</p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-slate-600">{product.rating} ({product.reviewCount})</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-orange-600" style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-slate-400 text-xs line-through ml-1">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <span className="text-xs text-slate-400">Stock: {product.stock}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => openEdit(product)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => toggleStock(product.id)}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs transition-colors ${product.inStock ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
              >
                {product.inStock ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Package className="w-14 h-14 mx-auto mb-3 opacity-30" />
          <p style={{ fontWeight: 500 }}>No medicines found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg text-slate-900 mb-6" style={{ fontWeight: 700 }}>
                {editingProduct ? "Edit Medicine" : "Add New Medicine"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Product Name *", key: "name", type: "text" },
                  { label: "Brand", key: "brand", type: "text" },
                  { label: "Price ($) *", key: "price", type: "number" },
                  { label: "Original Price ($)", key: "originalPrice", type: "number" },
                  { label: "Stock Quantity", key: "stock", type: "number" },
                  { label: "Rating (0-5)", key: "rating", type: "number" },
                  { label: "Review Count", key: "reviewCount", type: "number" },
                  { label: "Image URL", key: "image", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{label}</label>
                    <input
                      type={type}
                      value={(formData as any)[key] || ""}
                      onChange={e => setFormData({ ...formData, [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Dosage</label>
                  <input type="text" value={formData.dosage || ""} onChange={e => setFormData({ ...formData, dosage: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Active Ingredient</label>
                  <input type="text" value={formData.activeIngredient || ""} onChange={e => setFormData({ ...formData, activeIngredient: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.requiresPrescription || false} onChange={e => setFormData({ ...formData, requiresPrescription: e.target.checked })} className="w-4 h-4 text-orange-500 rounded" />
                    <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>Requires Prescription</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.inStock !== false} onChange={e => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4 text-orange-500 rounded" />
                    <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>In Stock</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm" style={{ fontWeight: 500 }}>Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors" style={{ fontWeight: 600 }}>
                  {editingProduct ? "Save Changes" : "Add Medicine"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
