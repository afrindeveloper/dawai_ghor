import { Link } from "react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 mt-auto">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About (Span 4) */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                DawaiGhor
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 pr-4">
              Your premier digital healthcare companion. Delivering authentic medicines, expert consultations, and personalized care directly to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/10 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (Span 2) */}
          <div className="lg:col-span-2 lg:pl-8">
            <h4 className="text-white font-semibold mb-6 tracking-wide">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: "Shop Medicines", path: "/products" },
                { name: "Healthcare Devices", path: "/products" },
                { name: "Lab Tests", path: "#" },
                { name: "AI Doctor Chat", path: "/ai-doctor" },
                { name: "Consult Doctors", path: "#" }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-orange-500 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-orange-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 tracking-wide">Support</h4>
            <ul className="space-y-4">
              {["About Us", "Privacy Policy", "Terms of Service", "Return Policy", "FAQs"].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-orange-500 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-orange-500 transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (Span 4) */}
          <div className="lg:col-span-4 lg:pl-8">
            <h4 className="text-white font-semibold mb-6 tracking-wide">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Subscribe to our newsletter for premium health insights, exclusive offers, and product updates.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center px-4 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="w-full bg-transparent border-none text-sm text-white px-3 py-3.5 focus:outline-none placeholder:text-slate-600"
                />
              </div>
              <button className="w-12 h-[50px] shrink-0 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-300 font-medium">16216</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500">Available 24/7</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-slate-500 leading-relaxed">Level 4, DawaiGhor Tower,<br/>Gulshan, Dhaka 1212</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-500">
            <p>© {currentYear} DawaiGhor. All rights reserved.</p>
            <span className="hidden md:inline text-slate-700">•</span>
            <div className="flex items-center gap-2 text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Govt. Approved Pharmacy License #DG-2026-BD</span>
            </div>
          </div>

          {/* Premium Payment Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
             <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Secure Payments</span>
             <div className="flex flex-wrap justify-center gap-2">
               {["Visa", "Mastercard", "Amex", "bKash", "Nagad"].map(method => (
                 <div key={method} className="h-8 px-3 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-300 hover:border-slate-700 transition-colors cursor-default">
                   {method}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
