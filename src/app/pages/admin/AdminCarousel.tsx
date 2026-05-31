import { useState, useEffect } from "react";
import { getCarousel, saveCarousel, CarouselSlide } from "../../utils/api";
import { toast } from "sonner";
import { 
  Plus, Layers, CheckCircle, EyeOff, GripVertical, 
  ChevronUp, ChevronDown, ImageIcon, Tag, Link as LinkIcon, 
  Monitor, Eye, Edit2, Trash2, X, Save, Type, AlignLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const EMPTY_SLIDE: Omit<CarouselSlide, "id" | "order"> = {
  title: "",
  subtitle: "",
  image: "",
  badge: "",
  ctaText: "Shop Now",
  ctaLink: "/products",
  active: true,
};

export default function AdminCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editSlide, setEditSlide] = useState<CarouselSlide | null>(null);
  const [formData, setFormData] = useState<Omit<CarouselSlide, "id" | "order">>(EMPTY_SLIDE);
  const [previewSlide, setPreviewSlide] = useState<CarouselSlide | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    getCarousel().then(loaded => {
      setSlides(loaded.sort((a, b) => a.order - b.order));
    });
  }, []);

  const persist = (updated: CarouselSlide[]) => {
    const reordered = updated.map((s, i) => ({ ...s, order: i }));
    setSlides(reordered);
    saveCarousel(reordered);
  };

  const openAdd = () => {
    setEditSlide(null);
    setFormData(EMPTY_SLIDE);
    setImageError(false);
    setShowModal(true);
  };

  const openEdit = (slide: CarouselSlide) => {
    setEditSlide(slide);
    setFormData({ title: slide.title, subtitle: slide.subtitle, image: slide.image, badge: slide.badge, ctaText: slide.ctaText, ctaLink: slide.ctaLink, active: slide.active });
    setImageError(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!formData.image.trim()) { toast.error("Image URL is required"); return; }

    if (editSlide) {
      const updated = slides.map(s => s.id === editSlide.id ? { ...editSlide, ...formData } : s);
      persist(updated);
      toast.success("Slide updated successfully!");
    } else {
      const newSlide: CarouselSlide = { ...formData, id: `slide-${Date.now()}`, order: slides.length };
      persist([...slides, newSlide]);
      toast.success("Slide added successfully!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    persist(slides.filter(s => s.id !== id));
    toast.success("Slide deleted");
  };

  const toggleActive = (id: string) => {
    persist(slides.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...slides];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    persist(arr);
  };

  const moveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const arr = [...slides];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    persist(arr);
  };

  const activeCount = slides.filter(s => s.active).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Carousel Management</h2>
          <p className="text-slate-500 mt-1">{slides.length} total slides · {activeCount} active</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl transition-colors text-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Slides", value: slides.length, icon: Layers, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active", value: activeCount, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Inactive", value: slides.length - activeCount, icon: EyeOff, color: "text-slate-400", bg: "bg-slate-50" },
          { label: "Display Order", value: "Drag/Sort", icon: GripVertical, color: "text-orange-600", bg: "bg-orange-50" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xl text-slate-900" style={{ fontWeight: 700 }}>{stat.value}</p>
            <p className="text-slate-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Slides List */}
      <div className="space-y-3">
        <AnimatePresence>
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`bg-white rounded-2xl shadow-sm border transition-all ${slide.active ? "border-slate-100 hover:shadow-md" : "border-slate-100 opacity-60"}`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Order Buttons */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <span className="text-center text-xs text-slate-400" style={{ fontWeight: 700 }}>#{index + 1}</span>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === slides.length - 1}
                    className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                {/* Preview Image */}
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x56?text=No+Image"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {slide.badge && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full" style={{ fontWeight: 600 }}>
                        {slide.badge}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${slide.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 500 }}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${slide.active ? "bg-green-500" : "bg-slate-400"}`} />
                      {slide.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-slate-900 text-sm truncate" style={{ fontWeight: 600 }}>{slide.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{slide.subtitle}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Tag className="w-3 h-3" />
                      CTA: <span className="text-slate-600" style={{ fontWeight: 500 }}>{slide.ctaText}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <LinkIcon className="w-3 h-3" />
                      <span className="text-slate-600">{slide.ctaLink}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setPreviewSlide(slide)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(slide.id)}
                    className={`p-2 rounded-xl transition-colors ${slide.active ? "text-green-500 hover:text-green-600 hover:bg-green-50" : "text-slate-400 hover:text-green-600 hover:bg-green-50"}`}
                    title={slide.active ? "Deactivate" : "Activate"}
                  >
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="p-2 rounded-xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {slides.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Layers className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500" style={{ fontWeight: 500 }}>No carousel slides yet</p>
            <p className="text-slate-400 text-sm mt-1">Add your first slide to get started</p>
            <button onClick={openAdd} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 transition-colors" style={{ fontWeight: 600 }}>
              Add First Slide
            </button>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <div>
                  <h3 className="text-slate-900 text-lg" style={{ fontWeight: 700 }}>{editSlide ? "Edit Slide" : "Add New Slide"}</h3>
                  <p className="text-slate-400 text-sm">Configure your carousel slide</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Preview */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200">
                  {formData.image && !imageError ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">Image preview will appear here</p>
                    </div>
                  )}
                  {formData.image && !imageError && (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-end p-4">
                      <div>
                        {formData.badge && <span className="block text-xs text-orange-300 mb-1" style={{ fontWeight: 600 }}>{formData.badge}</span>}
                        <p className="text-white text-sm" style={{ fontWeight: 700 }}>{formData.title || "Slide Title"}</p>
                        <p className="text-gray-300 text-xs mt-0.5 line-clamp-1">{formData.subtitle || "Slide subtitle..."}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
                      <Type className="w-3.5 h-3.5 text-slate-400" /> Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Your Health, Just a Click Away"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
                      <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Subtitle
                    </label>
                    <textarea
                      value={formData.subtitle}
                      onChange={e => setFormData(p => ({ ...p, subtitle: e.target.value }))}
                      placeholder="Brief description shown under the title..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Image URL *
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={e => { setFormData(p => ({ ...p, image: e.target.value })); setImageError(false); }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                    <p className="text-slate-400 text-xs mt-1">Use high-res landscape images (1280×720 recommended)</p>
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
                      <Tag className="w-3.5 h-3.5 text-slate-400" /> Badge Label
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={e => setFormData(p => ({ ...p, badge: e.target.value }))}
                      placeholder="e.g. Premium Care"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* CTA Text */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
                      <Type className="w-3.5 h-3.5 text-slate-400" /> Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={e => setFormData(p => ({ ...p, ctaText: e.target.value }))}
                      placeholder="e.g. Shop Now"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* CTA Link */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400" /> Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={e => setFormData(p => ({ ...p, ctaLink: e.target.value }))}
                      placeholder="e.g. /products"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, active: !p.active }))}
                      className={`flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm transition-all w-full ${formData.active ? "border-green-300 bg-green-50 text-green-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}
                      style={{ fontWeight: 500 }}
                    >
                      <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.active ? "bg-green-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.active ? "translate-x-4" : "translate-x-0.5"}`} />
                      </div>
                      {formData.active ? "Active — Visible on homepage" : "Inactive — Hidden from homepage"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3 rounded-b-3xl">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm transition-colors" style={{ fontWeight: 500 }}>
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
                  <Save className="w-4 h-4" />
                  {editSlide ? "Save Changes" : "Add Slide"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewSlide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80" onClick={() => setPreviewSlide(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <button onClick={() => setPreviewSlide(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="relative h-72 sm:h-96">
                <img src={previewSlide.image} alt={previewSlide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                  <div className="p-8 max-w-lg">
                    {previewSlide.badge && (
                      <span className="inline-block px-3 py-1 mb-3 bg-white/15 border border-white/30 text-orange-300 text-xs rounded-full" style={{ fontWeight: 600 }}>
                        {previewSlide.badge}
                      </span>
                    )}
                    <h2 className="text-white text-2xl sm:text-3xl mb-3" style={{ fontWeight: 800 }}>{previewSlide.title}</h2>
                    <p className="text-gray-300 text-sm sm:text-base mb-5">{previewSlide.subtitle}</p>
                    {previewSlide.ctaText && (
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm cursor-pointer" style={{ fontWeight: 700 }}>
                        {previewSlide.ctaText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Preview Mode</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${previewSlide.active ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}`} style={{ fontWeight: 600 }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${previewSlide.active ? "bg-green-400" : "bg-slate-500"}`} />
                  {previewSlide.active ? "Active" : "Inactive"}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}