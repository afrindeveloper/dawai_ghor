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
import { getDoctorChatResponse, ChatMessageData } from "../utils/gemini";

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
      text: "Hello! I'm **Dr. DawaiAI** — your intelligent health assistant, available 24/7.\n\nI can help you identify symptoms, recommend medications, and advise when to see a doctor. Please describe how you're feeling today, or choose a symptom category below.",
      timestamp: new Date(),
      quickReplies: ["I have a fever", "Headache since morning", "Stomach pain", "Feeling very tired"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSession] = useState("current");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, type: "user", text: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Map current messages to Gemini history format
      const history: ChatMessageData[] = messages
        .filter(m => m.id !== "init" && m.id !== "init2") // ignore init
        .map(m => ({
          role: m.type === "bot" ? "model" : "user",
          parts: [{ text: m.text }],
        }));

      const aiText = await getDoctorChatResponse(history, msg);

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        type: "bot",
        text: aiText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text: string) => {
    return text.split("**").map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-900">{part}</strong> : part
    );
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-[100dvh] bg-slate-50 flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Sidebar (Simplified) ── */}
        <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col shrink-0 h-full">
          {/* Simple Doctor Profile */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-slate-900" style={{ fontWeight: 700 }}>Dr. DawaiAI</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-slate-500 text-xs">Online & Ready</span>
              </div>
            </div>
          </div>

          {/* Symptom Quick Picks */}
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Quick Check</p>
            <div className="space-y-1">
              {SYMPTOM_CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => sendMessage(cat.query)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className={`w-7 h-7 ${cat.bg} rounded-md flex items-center justify-center shrink-0`}>
                    <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  </div>
                  <span className="text-slate-700 text-sm group-hover:text-slate-900">{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>Recent Chats</p>
              <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {MOCK_HISTORY.map(session => (
                <div
                  key={session.id}
                  className={`p-3 rounded-xl cursor-pointer transition-colors border ${activeSession === session.id ? "bg-orange-50 border-orange-100" : "border-transparent hover:bg-slate-50"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm line-clamp-1 ${activeSession === session.id ? "text-orange-900 font-semibold" : "text-slate-700 font-medium"}`}>{session.title}</p>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-1">{session.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* Chat Header */}
          <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-slate-900 text-base flex items-center gap-2" style={{ fontWeight: 700 }}>
                  Consultation
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-600 text-[10px] rounded-full font-semibold">
                    <Sparkles className="w-3 h-3" /> AI Powered
                  </span>
                </h2>
              </div>
            </div>
            <button
              onClick={() => { setMessages([{ id: "init2", type: "bot", text: "Hello again! I'm ready to help. What symptoms are you experiencing today?", timestamp: new Date(), quickReplies: ["I have a fever", "Headache since morning", "Stomach pain", "Feeling very tired"] }]); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-sm transition-colors border border-slate-200"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar bg-slate-50/50">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-3xl mx-auto w-full ${msg.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.type === "bot" ? "bg-orange-500 text-white shadow-sm" : "bg-slate-800 text-white shadow-sm"}`}>
                    {msg.type === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`flex flex-col gap-2 flex-1 min-w-0 ${msg.type === "user" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-5 py-3.5 shadow-sm max-w-[90%] sm:max-w-[80%] text-[15px] leading-relaxed ${msg.type === "user"
                        ? "bg-slate-800 text-white rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                      }`}>
                      <div className="whitespace-pre-wrap">{msg.type === "bot" ? formatText(msg.text) : msg.text}</div>
                    </div>

                    {msg.medicines && msg.medicines.length > 0 && (
                      <div className="w-full max-w-[90%] sm:max-w-[80%] grid gap-2 mt-1">
                        {msg.medicines.map((med, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                <Pill className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                <p className="text-slate-900 font-semibold text-sm">{med.name}</p>
                                <p className="text-slate-500 text-xs">{med.dosage}</p>
                              </div>
                            </div>
                            <Link to="/products" className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold rounded-lg transition-colors border border-orange-100">
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.tips && msg.tips.length > 0 && (
                      <div className="w-full max-w-[90%] sm:max-w-[80%] bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 mt-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <p className="text-emerald-800 text-xs font-semibold uppercase tracking-wide">Care Tips</p>
                        </div>
                        <ul className="space-y-1.5">
                          {msg.tips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-emerald-700 text-sm">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(reply)}
                            className="px-4 py-2 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-sm rounded-full transition-all shadow-sm font-medium"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className={`text-[10px] text-slate-400 mt-0.5 ${msg.type === "user" ? "mr-1" : "ml-1"}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex gap-3 max-w-3xl mx-auto w-full">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} className="w-2 h-2 rounded-full bg-slate-300" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-slate-200 p-3 pb-24 md:pb-5 lg:p-5 shrink-0 z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            
            {/* Mobile Categories (Scrollable) */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 lg:hidden custom-scrollbar">
              {SYMPTOM_CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => sendMessage(cat.query)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 ${cat.bg} border border-slate-100 rounded-full shrink-0`}
                >
                  <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  <span className="text-slate-700 text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="max-w-3xl mx-auto w-full flex items-center gap-2 sm:gap-3">
              <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors shrink-0 text-slate-400 lg:hidden">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 flex items-center bg-slate-100 border border-transparent rounded-2xl px-4 focus-within:bg-white focus-within:border-orange-300 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask anything about your health..."
                  className="flex-1 bg-transparent py-3.5 text-[15px] text-slate-800 placeholder-slate-400 outline-none"
                />
                <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 ml-1">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() && !isTyping}
                className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-center transition-all disabled:opacity-50 shrink-0 shadow-md"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
            
            <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-3 max-w-2xl mx-auto">
              AI-generated medical advice is for informational purposes only. Do not use for emergencies. Call 999 immediately if you are experiencing a medical emergency.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
