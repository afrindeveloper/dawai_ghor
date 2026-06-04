import { useState, useRef } from "react";
import { Upload, FileText, Check, Clock, Trash2, Eye, AlertCircle, Bot, Loader2, Copy, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { analyzePrescription, ExtractedMedicine } from "../../utils/gemini";
import { products } from "../../data/mockData";
import { addOrder, Product, CartItem, getUser } from "../../utils/api";

interface Prescription {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
  doctorName: string;
  medicines: string;
  size: string;
}

const mockPrescriptions: Prescription[] = [];

const statusConfig = {
  pending: { label: "Under Review", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-100", icon: Check },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100", icon: AlertCircle },
};

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function UserPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [dragging, setDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    available: CartItem[];
    unavailable: ExtractedMedicine[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0]);
      setAnalysisResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCurrentFile(e.dataTransfer.files[0]);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!currentFile) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const base64 = await toBase64(currentFile);
      const extracted = await analyzePrescription(base64, currentFile.type);
      
      const available: CartItem[] = [];
      const unavailable: ExtractedMedicine[] = [];
      
      extracted.forEach(med => {
        // Simple case-insensitive matching logic against mock store data
        const match = products.find(p => 
          p.name.toLowerCase().includes(med.name.toLowerCase()) || 
          p.tags?.some(t => t.toLowerCase() === med.name.toLowerCase()) ||
          p.activeIngredient?.toLowerCase().includes(med.name.toLowerCase())
        );
        if (match) {
          if (!available.find(a => a.id === match.id)) available.push({ ...match, quantity: 1 });
        } else {
          unavailable.push(med);
        }
      });
      
      setAnalysisResult({ available, unavailable });
      
      // Save prescription record
      const newPrescription: Prescription = {
        id: `rx-${Date.now()}`,
        fileName: currentFile.name,
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "pending",
        doctorName: "Dr. DawaiAI Analyzed",
        medicines: extracted.map(e => e.name).join(", ") || "None found",
        size: (currentFile.size / 1024 / 1024).toFixed(1) + " MB",
      };
      setPrescriptions([newPrescription, ...prescriptions]);
      toast.success("Prescription analyzed successfully!");
      
    } catch (error) {
      toast.error("Failed to analyze prescription. Please check your API key.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast.success("Prescription removed");
  };

  const handleCopyUnavailable = () => {
    if (!analysisResult) return;
    const text = analysisResult.unavailable.map(m => `${m.name} - ${m.dosage}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleOrder = async () => {
    if (!analysisResult?.available.length) return;
    const user = await getUser();
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }
    
    const cartItems: CartItem[] = analysisResult.available;
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    addOrder({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: cartItems,
      subtotal: subtotal,
      shipping: 5.99,
      total: subtotal + 5.99,
      status: "pending",
      address: user.address || "DawaiGhor HQ",
      paymentMethod: "Cash on Delivery"
    });
    
    toast.success("Order placed successfully from prescription!");
    setAnalysisResult(null);
    setCurrentFile(null);
  };

  const updateQuantity = (id: string, delta: number) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      available: analysisResult.available.map(p => {
        if (p.id === id) {
          return { ...p, quantity: Math.max(1, Math.min(10, p.quantity + delta)) };
        }
        return p;
      })
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>My Prescriptions</h2>
        <p className="text-slate-500 mt-1">Upload and let AI extract medicines from your prescriptions</p>
      </div>

      {/* Upload Area */}
      <motion.div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        animate={{ scale: dragging ? 1.02 : 1 }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/50"}`}
      >
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-orange-500" />
        </div>
        <p className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Drag & drop your prescription here</p>
        <p className="text-slate-400 text-sm mb-5">Supports JPG, PNG (Max 5MB)</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          accept="image/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2.5 rounded-xl text-sm transition-colors"
          style={{ fontWeight: 600 }}
        >
          Choose File
        </button>

        {currentFile && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-slate-700 font-medium mb-3">Selected File: {currentFile.name}</p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
              style={{ fontWeight: 600 }}
            >
              {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
              {analyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>
        )}
      </motion.div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-800">AI Analysis Complete</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h4 className="text-green-800 font-semibold flex items-center gap-2 mb-3">
                <Check className="w-4 h-4" /> Available for Order ({analysisResult.available.length})
              </h4>
              {analysisResult.available.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {analysisResult.available.map(p => (
                    <li key={p.id} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg shadow-sm border border-green-50">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md" />
                        <span className="font-medium text-slate-700">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-600 font-bold">${(p.price * p.quantity).toFixed(2)}</span>
                        <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(p.id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold">-</button>
                          <span className="w-6 text-center text-xs font-bold">{p.quantity}</span>
                          <button onClick={() => updateQuantity(p.id, 1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold">+</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-600 mb-4">No matching available medicines found.</p>
              )}
              <button 
                onClick={handleOrder}
                disabled={analysisResult.available.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> Order Available Items
              </button>
            </div>

            {/* Unavailable */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-red-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Not Available ({analysisResult.unavailable.length})
                </h4>
                <button 
                  onClick={handleCopyUnavailable}
                  className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-1.5 rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {analysisResult.unavailable.length > 0 ? (
                <ul className="space-y-2">
                  {analysisResult.unavailable.map((m, i) => (
                    <li key={i} className="text-sm bg-white p-2 rounded-lg shadow-sm border border-red-50">
                      <p className="font-medium text-slate-700">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.dosage}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-600">All prescribed medicines are available!</p>
              )}
              <p className="text-xs text-red-600 mt-4 italic">
                You can copy these items to order from your local pharmacy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      {prescriptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Uploaded Prescriptions</h3>
          <AnimatePresence>
            {prescriptions.map((rx, i) => {
              const cfg = statusConfig[rx.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={rx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-slate-900 text-sm truncate" style={{ fontWeight: 600 }}>{rx.fileName}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`} style={{ fontWeight: 500 }}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-slate-400 text-xs">Uploaded: {rx.uploadedAt}</p>
                      <span className="text-slate-300">·</span>
                      <p className="text-slate-400 text-xs">{rx.size}</p>
                      <span className="text-slate-300">·</span>
                      <p className="text-slate-500 text-xs">{rx.doctorName}</p>
                    </div>
                    {rx.medicines && rx.medicines !== "Under review" && (
                      <p className="text-slate-600 text-xs mt-1">
                        <span className="text-slate-400">Medicines:</span> {rx.medicines}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(rx.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
