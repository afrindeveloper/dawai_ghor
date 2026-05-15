import { motion } from "motion/react";
import { Sparkles, Bot, ArrowRight, Activity } from "lucide-react";
import { useNavigate } from "react-router";

export default function AIHelpSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 relative overflow-hidden bg-gray-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-orange-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-blue-200/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 border border-white/60 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none"></div>
            
            <div className="grid md:grid-cols-2 gap-0 relative z-10">
              {/* Left Content */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/80 shadow-sm w-fit mb-8 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                    AI Powered Healthcare
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                  Not sure what you need? <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                    Let our AI help.
                  </span>
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Describe your symptoms to our intelligent AI doctor. Get instant recommendations, medication suggestions, and health advice—available 24/7.
                </p>
                
                <button
                  onClick={() => navigate("/ai-doctor")}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-orange-500 rounded-2xl hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] overflow-hidden w-fit"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative flex items-center gap-3">
                    Start Free Consultation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>

              {/* Right Content - Mockup */}
              <div className="relative p-8 md:p-12 bg-gradient-to-bl from-orange-500/5 to-transparent flex items-center justify-center">
                <motion.div 
                  className="w-full max-w-sm bg-white/80 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Mockup Header */}
                  <div className="px-6 py-4 border-b border-gray-100/50 bg-white/50 backdrop-blur-md flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Dr. DawaiAI</h4>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs text-gray-500 font-medium">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Mockup Body */}
                  <div className="p-6 space-y-4 bg-gray-50/50">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700">
                        Hello! How are you feeling today? Tell me your symptoms.
                      </div>
                    </div>
                    
                    <div className="flex gap-3 max-w-[85%] ml-auto justify-end">
                      <div className="bg-orange-500 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                        I have a slight fever and headache since morning.
                      </div>
                    </div>

                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700">
                        I see. Let's ask a few more questions to narrow it down. Does your throat hurt?
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full shadow-sm hover:border-orange-300 hover:text-orange-500 transition-colors cursor-pointer font-medium">Yes, it does</span>
                      <span className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full shadow-sm hover:border-orange-300 hover:text-orange-500 transition-colors cursor-pointer font-medium">No, it's fine</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Decorative blobs behind mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-orange-400/20 to-orange-200/20 blur-3xl rounded-full z-0"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}