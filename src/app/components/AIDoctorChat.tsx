import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Send, Bot, User, Pill, CheckCircle, AlertTriangle,
  Sparkles, Stethoscope, Activity, Zap, ChevronRight
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: Date;
  medicines?: { name: string; dosage: string; price: string }[];
  tips?: string[];
  severity?: "low" | "moderate" | "high";
  quickReplies?: string[];
}

interface AIDoctorChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SYMPTOMS = [
  { label: "🤒 Fever", query: "I have a fever" },
  { label: "🤧 Cough", query: "I have a cough" },
  { label: "🤕 Headache", query: "I have a headache" },
  { label: "🤢 Stomach", query: "I have stomach pain" },
  { label: "😴 Fatigue", query: "I feel very tired and weak" },
  { label: "🤧 Allergy", query: "I have allergy symptoms" },
];

function getResponse(text: string): Omit<ChatMessage, "id" | "type" | "timestamp"> {
  const lower = text.toLowerCase();
  if (lower.includes("fever") || lower.includes("temperature")) {
    return {
      text: "I see you have a fever. Based on your symptoms, here are my recommendations:",
      medicines: [
        { name: "Napa 500mg (Paracetamol)", dosage: "1 tab every 6 hrs", price: "৳12" },
        { name: "Napryn 200mg (Ibuprofen)", dosage: "1 tab every 8 hrs with food", price: "৳18" },
      ],
      tips: ["Rest and hydrate well", "Monitor temp every 4 hrs", "Cool damp cloth on forehead"],
      severity: "moderate",
      quickReplies: ["Fever with body ache?", "Fever in child?", "When to go to ER?"],
    };
  }
  if (lower.includes("cough")) {
    return {
      text: "For your cough, the treatment depends on whether it's dry or wet. Here are some options:",
      medicines: [
        { name: "Tussitab Syrup (Dextromethorphan)", dosage: "2 tsp every 8 hrs", price: "৳45" },
        { name: "Ambroxol 30mg", dosage: "1 tab 3x daily", price: "৳22" },
      ],
      tips: ["Drink warm water with honey", "Use steam inhalation", "Avoid cold drinks"],
      severity: "low",
      quickReplies: ["Dry or wet cough?", "Cough with fever?", "Kids cough syrup?"],
    };
  }
  if (lower.includes("headache") || lower.includes("migraine")) {
    return {
      text: "Headaches are common and usually manageable. Based on your description:",
      medicines: [
        { name: "Napa Extra (Paracetamol+Caffeine)", dosage: "1-2 tabs as needed", price: "৳15" },
        { name: "Ibuprofen 400mg", dosage: "1 tab every 8 hrs with food", price: "৳20" },
      ],
      tips: ["Rest in a quiet, dark room", "Stay hydrated", "Apply cold compress to neck"],
      severity: "low",
      quickReplies: ["Is this a migraine?", "Morning headaches?", "Headache + nausea?"],
    };
  }
  if (lower.includes("stomach") || lower.includes("gastric") || lower.includes("acidity")) {
    return {
      text: "Stomach issues are very common. Here's what I recommend for gastric pain or acidity:",
      medicines: [
        { name: "Omeprazole 20mg", dosage: "1 capsule before breakfast", price: "৳25" },
        { name: "Antacid Plus", dosage: "2 tabs after meals", price: "৳8" },
      ],
      tips: ["Avoid spicy and oily food", "Eat smaller meals", "Don't lie down right after eating"],
      severity: "low",
      quickReplies: ["How to reduce acidity?", "Stomach cramps?", "Bloating & gas?"],
    };
  }
  if (lower.includes("tired") || lower.includes("weak") || lower.includes("fatigue") || lower.includes("vitamin")) {
    return {
      text: "Fatigue and weakness could indicate vitamin deficiency. Here are helpful supplements:",
      medicines: [
        { name: "A to Z Multivitamin", dosage: "1 tab daily with breakfast", price: "৳180" },
        { name: "Vitamin D3 1000IU", dosage: "1 capsule daily", price: "৳95" },
      ],
      tips: ["Get daily sunlight exposure", "Eat a balanced diet", "Get 7-8 hours of sleep"],
      severity: "low",
      quickReplies: ["Vitamin D deficiency signs?", "Iron deficiency?", "Best time for vitamins?"],
    };
  }
  if (lower.includes("allergy") || lower.includes("sneez") || lower.includes("watery")) {
    return {
      text: "Your symptoms suggest an allergic reaction. Antihistamines are the first line treatment:",
      medicines: [
        { name: "Fexo 120mg (Fexofenadine)", dosage: "1 tab daily — non-drowsy", price: "৳35" },
        { name: "Cetirizine 10mg", dosage: "1 tab at night", price: "৳15" },
      ],
      tips: ["Identify and avoid triggers", "Keep windows closed in pollen season", "Use air purifier indoors"],
      severity: "low",
      quickReplies: ["Allergy vs cold?", "Food allergy symptoms?", "Allergy eye drops?"],
    };
  }
  return {
    text: "I understand. To give you better advice, could you describe your main symptoms more specifically? You can also choose from the quick options below.",
    quickReplies: ["I have a fever", "I have a headache", "Stomach pain & acidity", "I feel very tired"],
  };
}

export default function AIDoctorChat({ isOpen, onClose }: AIDoctorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "init",
    type: "bot",
    text: "Hello! I'm **Dr. DawaiAI** 👋 — your intelligent health assistant. Tell me your symptoms and I'll recommend the right medicines and care tips.",
    timestamp: new Date(),
    quickReplies: ["I have a fever", "Headache", "Stomach pain", "Feeling tired"],
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, type: "user", text: msg, timestamp: new Date() }]);
    setIsTyping(true);
    setTimeout(() => {
      const res = getResponse(msg);
      setMessages(prev => [...prev, { id: `b-${Date.now()}`, type: "bot", timestamp: new Date(), ...res }]);
      setIsTyping(false);
    }, 1200);
  };

  const formatText = (text: string) =>
    text.split("**").map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
    );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:w-[480px] h-[92vh] sm:h-[640px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex-shrink-0 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 left-8 w-16 h-16 bg-white/10 rounded-full" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white text-base" style={{ fontWeight: 700 }}>Dr. DawaiAI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-orange-100 text-xs">Online · AI Powered</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-white/20 rounded-full">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-white text-xs" style={{ fontWeight: 600 }}>AI</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="relative z-10 flex gap-4 mt-3 pt-3 border-t border-white/20">
              {[{ val: "200+", lbl: "Symptoms" }, { val: "94%", lbl: "Accuracy" }, { val: "24/7", lbl: "Available" }].map(s => (
                <div key={s.lbl} className="text-center">
                  <p className="text-white text-sm" style={{ fontWeight: 700 }}>{s.val}</p>
                  <p className="text-orange-200 text-xs">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Symptom Chips */}
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {QUICK_SYMPTOMS.map(s => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.query)}
                  className="flex-shrink-0 px-3 py-1.5 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 rounded-full text-xs text-slate-600 hover:text-orange-600 transition-all shadow-sm whitespace-nowrap"
                  style={{ fontWeight: 500 }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.type === "bot" ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-slate-700"}`}>
                    {msg.type === "bot" ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[80%] ${msg.type === "user" ? "items-end" : "items-start"}`}>
                    {/* Text bubble */}
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.type === "user" ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm" : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm"}`}>
                      {msg.type === "bot" ? formatText(msg.text) : msg.text}
                    </div>

                    {/* Severity */}
                    {msg.severity && (
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${msg.severity === "moderate" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`} style={{ fontWeight: 600 }}>
                        <Activity className="w-3 h-3" />
                        {msg.severity === "moderate" ? "Moderate Severity" : "Low Severity"}
                      </div>
                    )}

                    {/* Medicine Cards */}
                    {msg.medicines?.map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                              <Pill className="w-3.5 h-3.5 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-slate-900 text-xs" style={{ fontWeight: 600 }}>{med.name}</p>
                              <p className="text-slate-400 text-xs">{med.dosage}</p>
                            </div>
                          </div>
                          <span className="text-orange-600 text-xs" style={{ fontWeight: 700 }}>{med.price}</span>
                        </div>
                      </motion.div>
                    ))}

                    {/* Tips */}
                    {msg.tips && msg.tips.length > 0 && (
                      <div className="w-full bg-green-50 border border-green-100 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          <p className="text-green-700 text-xs" style={{ fontWeight: 600 }}>Home Care Tips</p>
                        </div>
                        {msg.tips.map((tip, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-green-700 text-xs py-0.5">
                            <span className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Replies */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quickReplies.map((r, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(r)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs rounded-full transition-all"
                            style={{ fontWeight: 500 }}
                          >
                            {r}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-3 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Describe your symptoms..."
                  className="flex-1 bg-transparent py-3 text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => sendMessage()}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-400" />
                <p className="text-xs text-slate-400">DawaiGhor AI · Not for emergencies</p>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <p className="text-xs text-slate-400">Call 999 for emergencies</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
