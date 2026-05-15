import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, ArrowLeft, Bot, User, Sparkles, Clock, ShieldCheck,
  Heart, Thermometer, Pill, Activity, Brain, Eye, Stethoscope,
  AlertTriangle, CheckCircle, ChevronRight, Mic, Paperclip,
  Trash2, Plus, Star, Zap, Info, X
} from "lucide-react";
import Header from "../components/Header";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: Date;
  medicines?: MedicineCard[];
  tips?: string[];
  severity?: "low" | "moderate" | "high";
  seeDoctor?: string;
  quickReplies?: string[];
}

interface MedicineCard {
  name: string;
  generic: string;
  dosage: string;
  price: string;
  uses: string;
  warning?: string;
}

interface SessionHistory {
  id: string;
  title: string;
  preview: string;
  date: string;
  messageCount: number;
}

const SYMPTOM_CATEGORIES = [
  { icon: Thermometer, label: "Fever & Flu", color: "text-red-500", bg: "bg-red-50", query: "I have a fever of 101°F and body aches" },
  { icon: Brain, label: "Headache", color: "text-purple-500", bg: "bg-purple-50", query: "I have a severe headache" },
  { icon: Heart, label: "Heart & BP", color: "text-pink-500", bg: "bg-pink-50", query: "I have chest discomfort and palpitations" },
  { icon: Activity, label: "Stomach", color: "text-green-500", bg: "bg-green-50", query: "I have stomach pain and acidity" },
  { icon: Eye, label: "Allergy", color: "text-blue-500", bg: "bg-blue-50", query: "I have allergy symptoms — sneezing and watery eyes" },
  { icon: Pill, label: "Vitamins", color: "text-orange-500", bg: "bg-orange-50", query: "I feel tired and weak, possibly vitamin deficiency" },
];

const AI_KNOWLEDGE: Record<string, Omit<ChatMessage, "id" | "type" | "text" | "timestamp">> = {
  fever: {
    medicines: [
      { name: "Napa 500mg", generic: "Paracetamol", dosage: "1 tablet every 6 hrs", price: "৳12", uses: "Fever & mild pain relief", warning: "Do not exceed 4g/day" },
      { name: "Ace 500mg", generic: "Paracetamol", dosage: "1 tablet every 8 hrs", price: "৳10", uses: "Fever reducer, analgesic" },
      { name: "Napryn 200mg", generic: "Ibuprofen", dosage: "1 tablet every 8 hrs with food", price: "৳18", uses: "Fever + body ache relief", warning: "Avoid on empty stomach" },
    ],
    tips: ["Rest and sleep adequately", "Drink at least 2–3 litres of water/day", "Use a cool damp cloth on forehead", "Wear light, breathable clothing", "Monitor temperature every 4 hours"],
    severity: "moderate",
    seeDoctor: "If fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by rash, stiff neck, or breathing difficulty.",
    quickReplies: ["How to bring fever down fast?", "Can I take Napa and Napryn together?", "My child has fever — what to give?"],
  },
  headache: {
    medicines: [
      { name: "Napa Extra", generic: "Paracetamol + Caffeine", dosage: "1–2 tablets as needed", price: "৳15", uses: "Tension & migraine headache" },
      { name: "Ibuprofen 400mg", generic: "Ibuprofen", dosage: "1 tablet every 8 hrs", price: "৳20", uses: "Inflammatory headache", warning: "Take with food" },
      { name: "Migratine", generic: "Naratriptan", dosage: "As prescribed by doctor", price: "৳85", uses: "Migraine attacks", warning: "Prescription required" },
    ],
    tips: ["Rest in a quiet, dark room", "Apply cold/warm compress to neck", "Stay hydrated", "Limit screen time", "Practice deep breathing exercises"],
    severity: "low",
    seeDoctor: "If headache is sudden and severe ('thunderclap'), accompanied by vision changes, weakness, or lasts more than 72 hours.",
    quickReplies: ["Is this a migraine?", "What causes morning headaches?", "Headache and neck pain together"],
  },
  stomach: {
    medicines: [
      { name: "Antacid Plus", generic: "Aluminium Hydroxide + Mg", dosage: "2 tablets after meals", price: "৳8", uses: "Acidity & heartburn" },
      { name: "Omeprazole 20mg", generic: "Omeprazole", dosage: "1 capsule before breakfast", price: "৳25", uses: "GERD & ulcer treatment" },
      { name: "Buscopan 10mg", generic: "Hyoscine", dosage: "1 tablet when needed", price: "৳30", uses: "Stomach cramps & spasms", warning: "Avoid in glaucoma" },
    ],
    tips: ["Eat smaller, frequent meals", "Avoid spicy, oily, or acidic foods", "Don't lie down immediately after eating", "Drink warm water or ginger tea", "Avoid carbonated drinks"],
    severity: "low",
    seeDoctor: "If pain is severe, persistent for over 24hrs, accompanied by blood in stool, vomiting, or significant weight loss.",
    quickReplies: ["Foods to avoid for gastric pain", "How to treat bloating?", "Is this food poisoning?"],
  },
  cough: {
    medicines: [
      { name: "Tussitab Syrup", generic: "Dextromethorphan", dosage: "2 tsp every 6–8 hrs", price: "৳45", uses: "Dry cough suppressant" },
      { name: "Ambroxol 30mg", generic: "Ambroxol HCl", dosage: "1 tablet 3x daily", price: "৳22", uses: "Productive/wet cough — loosens mucus" },
      { name: "Azithromycin 500mg", generic: "Azithromycin", dosage: "1 tablet daily for 3 days", price: "৳80", uses: "Bacterial respiratory infection", warning: "Prescription required" },
    ],
    tips: ["Drink warm water with honey and lemon", "Use steam inhalation", "Avoid cold drinks and ice cream", "Keep throat moist with lozenges", "Elevate head while sleeping"],
    severity: "low",
    seeDoctor: "If cough lasts more than 2 weeks, produces blood-tinged sputum, or is accompanied by high fever and chest pain.",
    quickReplies: ["Dry vs wet cough treatment?", "Cough syrup for children?", "Is this bronchitis?"],
  },
  allergy: {
    medicines: [
      { name: "Fexo 120mg", generic: "Fexofenadine", dosage: "1 tablet daily", price: "৳35", uses: "Non-drowsy antihistamine for allergies" },
      { name: "Cetirizine 10mg", generic: "Cetirizine HCl", dosage: "1 tablet at night", price: "৳15", uses: "Allergy, hives, hay fever", warning: "May cause drowsiness" },
      { name: "Nasocort Spray", generic: "Triamcinolone", dosage: "2 sprays per nostril daily", price: "৳220", uses: "Nasal allergy congestion" },
    ],
    tips: ["Identify and avoid allergen triggers", "Keep windows closed during pollen season", "Use air purifiers indoors", "Wear sunglasses outdoors", "Shower after outdoor activity"],
    severity: "low",
    seeDoctor: "If you experience severe swelling, difficulty breathing, or anaphylaxis symptoms — seek emergency care immediately.",
    quickReplies: ["How to find my allergen?", "Allergy vs common cold?", "Can allergies be cured?"],
  },
  vitamin: {
    medicines: [
      { name: "A to Z Multivitamin", generic: "Multivitamin Complex", dosage: "1 tablet daily with breakfast", price: "৳180", uses: "General vitamin & mineral deficiency" },
      { name: "Vitamin D3 1000IU", generic: "Cholecalciferol", dosage: "1 capsule daily", price: "৳95", uses: "Bone health, immunity, fatigue" },
      { name: "Ferrous + B12", generic: "Iron + Cyanocobalamin", dosage: "1 tablet daily", price: "৳65", uses: "Anemia, weakness, tiredness" },
    ],
    tips: ["Get 15–20 minutes of sunlight daily", "Eat a balanced diet with leafy greens", "Include eggs, dairy, and lean meats", "Stay hydrated", "Get 7–8 hours of quality sleep"],
    severity: "low",
    seeDoctor: "Consider a blood test to confirm vitamin levels before starting high-dose supplementation.",
    quickReplies: ["Signs of Vitamin D deficiency?", "Best time to take vitamins?", "Iron-rich foods list?"],
  },
};

function getAIResponse(userText: string): { text: string } & Omit<ChatMessage, "id" | "type" | "text" | "timestamp"> {
  const lower = userText.toLowerCase();
  let key = "default";
  if (lower.includes("fever") || lower.includes("temperature") || lower.includes("flu") || lower.includes("body ache")) key = "fever";
  else if (lower.includes("headache") || lower.includes("migraine") || lower.includes("head pain")) key = "headache";
  else if (lower.includes("stomach") || lower.includes("gastric") || lower.includes("acidity") || lower.includes("abdomen") || lower.includes("nausea")) key = "stomach";
  else if (lower.includes("cough") || lower.includes("throat") || lower.includes("respiratory") || lower.includes("bronchitis")) key = "cough";
  else if (lower.includes("allergy") || lower.includes("sneez") || lower.includes("watery") || lower.includes("hives") || lower.includes("rash")) key = "allergy";
  else if (lower.includes("vitamin") || lower.includes("tired") || lower.includes("weak") || lower.includes("fatigue") || lower.includes("energy")) key = "vitamin";

  if (key === "default") {
    return {
      text: "Thank you for sharing that. To give you better advice, could you describe your main symptoms in more detail? For example: location of pain, duration, severity (1–10), and any associated symptoms like fever or nausea.",
      quickReplies: ["I have fever and body aches", "I have a headache", "Stomach pain and acidity", "I feel very tired and weak"],
    };
  }

  const responses: Record<string, string> = {
    fever: `Based on your symptoms, you appear to be experiencing a **fever**. This could be due to a viral infection (like the flu or common cold), bacterial infection, or other causes.\n\nHere are some **recommended medications** available at DawaiGhor:`,
    headache: `Your symptoms suggest a **tension headache** or possibly a **migraine**. These are very common and usually manageable with OTC medication and lifestyle adjustments.\n\nHere are some **recommended medications**:`,
    stomach: `Your symptoms indicate **gastric discomfort or acidity (GERD)**. This is very common and can be managed effectively with the right medication and dietary changes.\n\nHere are **recommended medications**:`,
    cough: `Based on your description, you may have a **viral upper respiratory infection** causing your cough. Let's identify the type of cough first to recommend the right medicine.\n\nHere are **recommended medications**:`,
    allergy: `Your symptoms are consistent with **allergic rhinitis** or a general **allergic reaction**. Antihistamines are typically the first line of treatment.\n\nHere are **recommended medications**:`,
    vitamin: `Your symptoms of fatigue and weakness may indicate a **vitamin or mineral deficiency** — very common, especially Vitamin D, B12, or Iron deficiency.\n\nHere are **recommended supplements**:`,
  };

  return {
    text: responses[key],
    ...AI_KNOWLEDGE[key],
  };
}

const MOCK_HISTORY: SessionHistory[] = [
  { id: "h1", title: "Fever & Body Aches", preview: "Recommended Napa 500mg and rest...", date: "Today", messageCount: 6 },
  { id: "h2", title: "Migraine Consultation", preview: "Ibuprofen and dark room rest...", date: "Yesterday", messageCount: 4 },
  { id: "h3", title: "Stomach Acidity", preview: "Omeprazole before meals...", date: "Apr 17", messageCount: 8 },
];

export default function AIDoctorPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      type: "bot",
      text: "Hello! I'm **Dr. DawaiAI** 👋 — your intelligent health assistant, available 24/7.\n\nI can help you identify symptoms, recommend medications, and advise when to see a doctor. Please describe how you're feeling today, or choose a symptom category below.",
      timestamp: new Date(),
      quickReplies: ["I have a fever", "Headache since morning", "Stomach pain", "Feeling very tired"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSession] = useState("current");
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, type: "user", text: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(msg);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        type: "bot",
        timestamp: new Date(),
        ...response,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1400);
  };

  const formatText = (text: string) => {
    return text.split("**").map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-900">{part}</strong> : part
    );
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>

        {/* ── Left Sidebar ── */}
        <aside className="w-72 bg-white border-r border-slate-100 flex flex-col hidden lg:flex flex-shrink-0">
          {/* Doctor Profile */}
          <div className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                  <Bot className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white" style={{ fontWeight: 700 }}>Dr. DawaiAI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-orange-100 text-xs">Online Now</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[{ label: "Accuracy", val: "94%" }, { label: "Symptoms", val: "200+" }, { label: "Rating", val: "4.9★" }].map(s => (
                  <div key={s.label} className="bg-white/20 rounded-xl p-2 text-center">
                    <p className="text-white text-sm" style={{ fontWeight: 700 }}>{s.val}</p>
                    <p className="text-orange-100 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Symptom Quick Picks */}
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Quick Symptom Check</p>
            <div className="space-y-1.5">
              {SYMPTOM_CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => sendMessage(cat.query)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className={`w-8 h-8 ${cat.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <span className="text-slate-700 text-sm group-hover:text-slate-900">{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>Recent Sessions</p>
              <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-2">
              {MOCK_HISTORY.map(session => (
                <div
                  key={session.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${activeSession === session.id ? "border-orange-200 bg-orange-50" : "border-transparent hover:bg-slate-50"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-800 text-sm line-clamp-1" style={{ fontWeight: 500 }}>{session.title}</p>
                    <span className="text-slate-400 text-xs flex-shrink-0">{session.date}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{session.preview}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-slate-300 text-xs">{session.messageCount} messages</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">AI advice is informational only. For emergencies, call <strong>999</strong>.</p>
            </div>
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">

          {/* Chat Header */}
          <div className="bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Dr. DawaiAI</h2>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600 text-xs">Active · Ready to help</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-orange-600 text-xs" style={{ fontWeight: 600 }}>AI Powered</span>
              </div>
              <button
                onClick={() => { setMessages([{ id: "init2", type: "bot", text: "Hello again! I'm ready to help. What symptoms are you experiencing today?", timestamp: new Date(), quickReplies: ["I have a fever", "Headache since morning", "Stomach pain", "Feeling very tired"] }]); }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="New session"
              >
                <Trash2 className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <AnimatePresence>
            {showDisclaimer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-5 py-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <p className="text-blue-700 text-xs">This AI provides general health information only — not a substitute for professional medical advice.</p>
                </div>
                <button onClick={() => setShowDisclaimer(false)} className="p-1 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0">
                  <X className="w-3.5 h-3.5 text-blue-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.type === "bot" ? "bg-gradient-to-br from-orange-400 to-orange-600 shadow-md" : "bg-gradient-to-br from-slate-600 to-slate-800"}`}>
                    {msg.type === "bot" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>

                  <div className={`flex flex-col gap-2 max-w-[75%] ${msg.type === "user" ? "items-end" : "items-start"}`}>
                    {/* Bubble */}
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${msg.type === "user"
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm"
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                      }`}>
                      <p className="text-sm leading-relaxed">
                        {msg.type === "bot" ? formatText(msg.text) : msg.text}
                      </p>
                    </div>

                    {/* Severity Badge */}
                    {msg.severity && (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${msg.severity === "high" ? "bg-red-100 text-red-700" : msg.severity === "moderate" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`} style={{ fontWeight: 600 }}>
                        <Activity className="w-3 h-3" />
                        {msg.severity === "high" ? "High Severity" : msg.severity === "moderate" ? "Moderate" : "Low Severity"}
                      </div>
                    )}

                    {/* Medicine Cards */}
                    {msg.medicines && msg.medicines.length > 0 && (
                      <div className="w-full space-y-2">
                        {msg.medicines.map((med, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                  <Pill className="w-4.5 h-4.5 text-orange-500" />
                                </div>
                                <div>
                                  <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{med.name}</p>
                                  <p className="text-slate-400 text-xs">{med.generic} · {med.dosage}</p>
                                  <p className="text-slate-500 text-xs mt-0.5">{med.uses}</p>
                                  {med.warning && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                                      <p className="text-amber-600 text-xs">{med.warning}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <p className="text-orange-600 text-sm" style={{ fontWeight: 700 }}>{med.price}</p>
                                <Link to="/products" className="text-xs text-blue-500 hover:underline mt-0.5 block">Buy →</Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Tips */}
                    {msg.tips && msg.tips.length > 0 && (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3.5 w-full">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          <p className="text-green-700 text-xs" style={{ fontWeight: 600 }}>Home Care Tips</p>
                        </div>
                        <ul className="space-y-1">
                          {msg.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-green-700 text-xs">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* See Doctor */}
                    {msg.seeDoctor && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 w-full">
                        <div className="flex items-start gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-red-700 text-xs" style={{ fontWeight: 600 }}>When to See a Doctor</p>
                            <p className="text-red-600 text-xs mt-0.5">{msg.seeDoctor}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Replies */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(reply)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs rounded-full transition-all shadow-sm"
                            style={{ fontWeight: 500 }}
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className={`text-xs text-slate-400 ${msg.type === "user" ? "text-right" : ""}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex gap-3 items-end"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full bg-orange-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ── */}
          <div className="bg-white border-t border-slate-100 p-4 shadow-lg">
            {/* Symptom Chips — Mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 lg:hidden scrollbar-none">
              {SYMPTOM_CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => sendMessage(cat.query)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 ${cat.bg} rounded-full flex-shrink-0 text-xs`}
                  style={{ fontWeight: 500 }}
                >
                  <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  <span className="text-slate-700">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0">
                <Paperclip className="w-4.5 h-4.5 text-slate-400" />
              </button>
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Describe your symptoms..."
                  className="flex-1 bg-transparent py-3 text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
                <button className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                  <Mic className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() && !isTyping}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all disabled:opacity-50 flex-shrink-0"
              >
                <Send className="w-4.5 h-4.5 text-white" />
              </motion.button>
            </div>

            <div className="flex items-center justify-between mt-2.5 px-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-orange-400" />
                <p className="text-xs text-slate-400">Powered by DawaiGhor AI</p>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />)}
                <span className="text-xs text-slate-400 ml-1">4.9 rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel (Stats) — large screens ── */}
        <aside className="w-64 bg-white border-l border-slate-100 flex-col hidden xl:flex flex-shrink-0 p-4 space-y-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Health Snapshot</p>
            {[
              { label: "Consultations Today", val: "12K+", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Accuracy Rate", val: "94%", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
              { label: "Symptoms Covered", val: "200+", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
              { label: "Avg Response", val: "< 2s", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{item.val}</p>
                  <p className="text-slate-400 text-xs">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Common Conditions</p>
            <div className="space-y-2">
              {[
                { name: "Fever & Flu", pct: 34 },
                { name: "Headache", pct: 22 },
                { name: "Gastric Issues", pct: 18 },
                { name: "Allergies", pct: 14 },
                { name: "Other", pct: 12 },
              ].map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="text-slate-400" style={{ fontWeight: 600 }}>{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
            <Stethoscope className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-sm" style={{ fontWeight: 700 }}>Need Real Doctor?</p>
            <p className="text-orange-100 text-xs mt-1 mb-3">Connect with certified physicians online</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs transition-colors" style={{ fontWeight: 600 }}>
              Book Appointment →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
