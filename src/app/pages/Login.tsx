import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight,
  ShieldCheck, Sparkles, ChevronLeft, Stethoscope, Star
} from "lucide-react";
import { loginUser } from "../utils/api";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const user = await loginUser(email, password);
    setLoading(false);
    if (user) {
      window.dispatchEvent(new Event("userUpdated"));
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const fillAdmin = () => { setEmail("admin@dawai.com"); setPassword("admin123"); };
  const fillDemo = () => { setEmail("rahim@example.com"); setPassword("demo123"); };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* ══ LEFT PANEL — visible desktop only ══ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-shrink-0 overflow-hidden">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950" />

        {/* Photo overlay */}
        <img
          src="https://images.unsplash.com/photo-1758573467057-955f803660a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Healthcare"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />

        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <div className="w-5 h-5 rounded-full bg-white" />
            </div>
            <span className="text-white text-2xl" style={{ fontWeight: 800 }}>DawaiGhor</span>
          </Link>

          {/* Middle Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-300 text-xs" style={{ fontWeight: 600 }}>Premium Healthcare Platform</span>
              </div>
              <h2 className="text-4xl xl:text-5xl text-white mb-5 leading-tight" style={{ fontWeight: 800 }}>
                Your health<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                  starts here.
                </span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-10">
                Access authentic medicines, consult our AI doctor, and manage your health — all in one place.
              </p>

              {/* Feature list */}
              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, label: "100% Authentic Medicines", sub: "Verified from trusted manufacturers" },
                  { icon: Stethoscope, label: "Free AI Doctor Consultation", sub: "Get advice 24/7 instantly" },
                  { icon: Star, label: "Exclusive Member Benefits", sub: "Discounts, priority support & more" },
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

          {/* Footer stat strip */}
          <div className="grid grid-cols-3 gap-3 pt-8 border-t border-white/10">
              {[{ val: "10K+", lbl: "Happy Users" }, { val: "500+", lbl: "Medicines" }, { val: "4.9/5", lbl: "App Rating" }].map(s => (
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
          <Link to="/" className="flex items-center gap-1 text-slate-500 text-sm hover:text-slate-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Home
          </Link>
        </div>

        {/* Mobile hero strip */}
        <div className="lg:hidden mx-5 mt-4 mb-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center gap-3 overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-2 bottom-0 w-16 h-16 bg-white/10 rounded-full" />
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white text-sm" style={{ fontWeight: 700 }}>Welcome back!</p>
            <p className="text-orange-100 text-xs">Sign in for a premium health experience</p>
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 flex items-center justify-center px-5 py-8 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-sm lg:max-w-md"
          >
            {/* Desktop logo */}
            <div className="hidden lg:flex items-center justify-between mb-10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200">
                  <div className="w-4.5 h-4.5 rounded-full bg-white" />
                </div>
                <span className="text-slate-900 text-2xl" style={{ fontWeight: 800 }}>DawaiGhor</span>
              </Link>
              <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Back to site
              </Link>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl lg:text-3xl text-slate-900" style={{ fontWeight: 800 }}>Sign in to your account</h1>
              <p className="text-slate-400 mt-1.5 text-sm">Don't have an account?{" "}
                <Link to="/signup" className="text-orange-600 hover:text-orange-500 transition-colors" style={{ fontWeight: 600 }}>Create one free</Link>
              </p>
            </div>

            {/* Admin hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 mb-5 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-blue-800 text-xs" style={{ fontWeight: 700 }}>Demo Access</p>
                <p className="text-blue-600 text-xs mt-0.5">Admin: admin@dawai.com / admin123</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={fillAdmin} className="px-2.5 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors" style={{ fontWeight: 600 }}>Fill Admin</button>
                  <button onClick={fillDemo} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors" style={{ fontWeight: 600 }}>Fill User</button>
                </div>
              </div>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-3 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-slate-700" style={{ fontWeight: 600 }}>Password</label>
                  <a href="#" className="text-xs text-orange-500 hover:text-orange-600 transition-colors" style={{ fontWeight: 500 }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-3 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${rememberMe ? "bg-orange-500 border-orange-500" : "border-slate-300 hover:border-orange-400"}`}
                >
                  {rememberMe && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className="text-sm text-slate-600">Remember me for 30 days</span>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full relative overflow-hidden flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                style={{ fontWeight: 700, fontSize: "15px" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-xs px-1">or continue with</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Google",
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  icon: (
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
              ].map(s => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => toast !== undefined && window.alert(`${s.label} login coming soon!`)}
                  className="flex items-center justify-center gap-2.5 py-3.5 border border-slate-200 rounded-2xl text-slate-700 text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                  style={{ fontWeight: 500 }}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Footer */}
            <p className="mt-8 text-center text-slate-400 text-xs leading-relaxed">
              By signing in, you agree to our{" "}
              <a href="#" className="text-slate-600 underline underline-offset-2">Terms</a> &{" "}
              <a href="#" className="text-slate-600 underline underline-offset-2">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
