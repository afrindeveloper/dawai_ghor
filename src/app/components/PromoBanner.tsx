import { X, Gift, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white overflow-hidden"
        >
          <div className="container mx-auto px-4 py-3 relative">
            <div className="flex items-center justify-center gap-3 text-sm md:text-base">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="w-5 h-5 flex-shrink-0" />
              </motion.div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="font-bold">Special Offer:</span>
                <span className="hidden md:inline">Get FREE delivery on orders above ৳1000</span>
                <span className="md:hidden">FREE delivery on orders ৳1000+</span>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>24/7 AI Doctor Available</span>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="absolute right-2 md:right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
