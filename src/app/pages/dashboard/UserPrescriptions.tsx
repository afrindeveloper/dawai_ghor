import { useState } from "react";
import { Upload, FileText, Check, Clock, Trash2, Eye, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface Prescription {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
  doctorName: string;
  medicines: string;
  size: string;
}

const mockPrescriptions: Prescription[] = [
  { id: "rx-001", fileName: "Prescription_April2025.jpg", uploadedAt: "2025-04-15", status: "approved", doctorName: "Dr. Rahman", medicines: "Amoxicillin 500mg, Napa 500mg", size: "1.2 MB" },
  { id: "rx-002", fileName: "Doctor_Note_March.pdf", uploadedAt: "2025-03-28", status: "pending", doctorName: "Dr. Fatema", medicines: "Under review", size: "0.8 MB" },
];

const statusConfig = {
  pending: { label: "Under Review", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-100", icon: Check },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100", icon: AlertCircle },
};

export default function UserPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [dragging, setDragging] = useState(false);

  const handleUpload = () => {
    const newPrescription: Prescription = {
      id: `rx-${Date.now()}`,
      fileName: `Prescription_${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}.jpg`,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "pending",
      doctorName: "Pending verification",
      medicines: "Under review",
      size: "1.0 MB",
    };
    setPrescriptions([newPrescription, ...prescriptions]);
    toast.success("Prescription uploaded successfully! We'll review it within 24 hours.");
  };

  const handleDelete = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast.success("Prescription removed");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>My Prescriptions</h2>
        <p className="text-slate-500 mt-1">Upload and manage your medical prescriptions</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-900 text-sm" style={{ fontWeight: 600 }}>How it works</p>
          <p className="text-blue-700 text-sm mt-0.5">Upload your doctor's prescription. Our pharmacist will verify it within 24 hours and approve your order for prescription medicines.</p>
        </div>
      </div>

      {/* Upload Area */}
      <motion.div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleUpload(); }}
        animate={{ scale: dragging ? 1.02 : 1 }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/50"}`}
      >
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-orange-500" />
        </div>
        <p className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>Drag & drop your prescription here</p>
        <p className="text-slate-400 text-sm mb-5">Supports JPG, PNG, PDF (Max 5MB)</p>
        <button
          onClick={handleUpload}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
          style={{ fontWeight: 600 }}
        >
          Choose File to Upload
        </button>
      </motion.div>

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
