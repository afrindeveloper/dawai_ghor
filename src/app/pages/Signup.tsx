import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Lock, User as UserIcon, Eye, EyeOff, Phone,
  AlertCircle, ArrowRight, ChevronLeft, CheckCircle,
  Sparkles, Shield, Star, Heart, Package
} from "lucide-react";
import { registerNewUser } from "../utils/localStorage";
import { toast } from "sonner";

const PASSWORD_RULES = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Contains a letter", test: (p: string) => /[a-zA-Z]/.test(p) },
];

export default function Signup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) { setError("Please enter your full name"); return; }
    if (!formData.email.trim()) { setError("Please enter your email"); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) { setError("Passwords don't match"); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!agreeToTerms) { setError("Please agree to the Terms of Service"); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    registerNewUser({ name: formData.fullName, email: formData.email, phone: formData.phone });
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/dashboard");
  };

  const pwStrength = PASSWORD_RULES.filter(r => r.test(formData.password)).length;
  const strengthColors = ["bg-red-400", "bg-amber-400", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Strong"];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* ══ LEFT PANEL ══ */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[40%] relative flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900" />
        <img
          src="https://images.unsplash.com/photo-1595432576728-94e0e94a7663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Join DawaiGhor"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <div className="w-5 h-5 rounded-full bg-white" />
            </div>
            <span className="text-white text-2xl" style={{ fontWeight: 800 }}>DawaiGhor</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-300 text-xs" style={{ fontWeight: 600 }}>Free to Join</span>
              </div>
              <h2 className="text-4xl xl:text-5xl text-white mb-5 leading-tight" style={{ fontWeight: 800 }}>
                Join{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                  DawaiGhor
                </span>{" "}
                today.
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-10">
                Create your free account and unlock exclusive health benefits, AI consultations, and much more.
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  { icon: Shield, label: "Verified Authentic Medicines", sub: "Sourced from licensed suppliers" },
                  { icon: Heart, label: "Personal Health Dashboard", sub: "Track orders, wishlist & prescriptions" },
                  { icon: Star, label: "Exclusive Member Discounts", sub: "Save up to 20% on every order" },
                  { icon: Package, label: "Priority Order Tracking", sub: "Real-time delivery updates" },
                ].map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm" style={{ fontWeight: 600 }}>{f.label}</p>
                      <p className="text-slate-400 text-xs">{f.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-8 border-t border-white/10">
            {[{ val: "Free", lbl: "Always Free" }, { val: "24/7", lbl: "AI Support" }, { val: "48h", lbl: "Delivery" }].map(s => (
              <div key={s.lbl}>
                <p className="text-white text-xl" style={{ fontWeight: 800 }}>{s.val}</p>
                <p className="text-slate-400 text-xs">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Form ══ */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            <span className="text-slate-900 text-xl" style={{ fontWeight: 800 }}>DawaiGhor</span>
          </Link>
          {step === 2 ? (
            <button onClick={() => { setStep(1); setError(""); }} className="flex items-center gap-1 text-slate-500 text-sm hover:text-slate-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-1 text-slate-500 text-sm hover:text-slate-700">
              <ChevronLeft className="w-4 h-4" /> Home
            </Link>
          )}
        </div>

        {/* Mobile hero */}
        <div className="lg:hidden mx-5 mt-4 mb-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white text-sm" style={{ fontWeight: 700 }}>Join thousands of users</p>
            <p className="text-orange-100 text-xs">Free account · No credit card needed</p>
          </div>
        </div>

        {/* Progress bar (mobile) */}
        <div className="lg:hidden mx-5 mt-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400">Step {step} of 2</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-orange-600" style={{ fontWeight: 600 }}>{step === 1 ? "Basic Info" : "Set Password"}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
              animate={{ width: step === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm lg:max-w-md"
          >

            {/* Desktop header */}
            <div className="hidden lg:flex items-center justify-between mb-10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200">
                  <div className="w-4 h-4 rounded-full bg-white" />
                </div>
                <span className="text-slate-900 text-2xl" style={{ fontWeight: 800 }}>DawaiGhor</span>
              </Link>
              <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to site
              </Link>
            </div>

            {/* Desktop step progress */}
            <div className="hidden lg:flex items-center gap-3 mb-6">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${step >= s ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`} style={{ fontWeight: 700 }}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  <span className={`text-xs transition-colors ${step >= s ? "text-slate-700" : "text-slate-400"}`} style={{ fontWeight: step === s ? 600 : 400 }}>
                    {s === 1 ? "Basic Info" : "Set Password"}
                  </span>
                  {s < 2 && <div className={`h-px w-8 transition-colors ${step > s ? "bg-orange-400" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl text-slate-900" style={{ fontWeight: 800 }}>
                {step === 1 ? "Create your account" : "Set your password"}
              </h1>
              <p className="text-slate-400 mt-1.5 text-sm">
                {step === 1 ? (
                  <>Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 hover:text-orange-500 transition-colors" style={{ fontWeight: 600 }}>Sign in</Link>
                  </>
                ) : "Choose a strong password to secure your account"}
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5 flex items-center gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                /* ── Step 1: Name, Email, Phone ── */
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleStep1}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Rahim Uddin"
                        required
                        className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-3 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-3 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>
                      Phone <span className="text-slate-400" style={{ fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880 1234 567890"
                        className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-3 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all mt-2"
                    style={{ fontWeight: 700, fontSize: "15px" }}
                  >
                    Continue
                    <ArrowRight className="w-4.5 h-4.5" />
                  </motion.button>

                  <p className="text-center text-slate-400 text-xs">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 hover:text-orange-500" style={{ fontWeight: 600 }}>Sign in</Link>
                  </p>
                </motion.form>
              ) : (
                /* ── Step 2: Passwords ── */
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Password */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-3 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {formData.password && (
                      <div className="mt-2.5 space-y-2">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < pwStrength ? strengthColors[pwStrength - 1] : "bg-slate-100"}`} />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {PASSWORD_RULES.map(rule => (
                              <div key={rule.label} className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${rule.test(formData.password) ? "bg-green-500" : "bg-slate-200"}`}>
                                  {rule.test(formData.password) && <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className={`text-xs ${rule.test(formData.password) ? "text-green-600" : "text-slate-400"}`}>{rule.label}</span>
                              </div>
                            ))}
                          </div>
                          {pwStrength > 0 && (
                            <span className={`text-xs flex-shrink-0 ml-2 ${pwStrength === 3 ? "text-green-600" : pwStrength === 2 ? "text-amber-500" : "text-red-500"}`} style={{ fontWeight: 600 }}>
                              {strengthLabels[pwStrength - 1]}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className={`w-full pl-11 pr-12 py-3.5 border rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-3 transition-all bg-slate-50 focus:bg-white ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : formData.confirmPassword && formData.password === formData.confirmPassword
                            ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                            : "border-slate-200 focus:border-orange-400 focus:ring-orange-100"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-1">
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 py-1">
                    <button
                      type="button"
                      onClick={() => setAgreeToTerms(!agreeToTerms)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${agreeToTerms ? "bg-orange-500 border-orange-500" : "border-slate-300 hover:border-orange-400"}`}
                    >
                      {agreeToTerms && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      I agree to DawaiGhor's{" "}
                      <a href="#" className="text-orange-600 hover:text-orange-500 underline underline-offset-2">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-orange-600 hover:text-orange-500 underline underline-offset-2">Privacy Policy</a>
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    style={{ fontWeight: 700, fontSize: "15px" }}
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</>
                    ) : (
                      <>Create My Account <ArrowRight className="w-4.5 h-4.5" /></>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-slate-500 hover:text-slate-700 text-sm transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to basic info
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}