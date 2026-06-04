import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity } from "lucide-react";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate system preparation time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          <div className="relative flex items-center justify-center mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-24 h-24 border-t-4 border-orange-500 border-solid rounded-full"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [360, 180, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-16 h-16 border-b-4 border-blue-500 border-solid rounded-full"
            />
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-blue-600 mb-2">
              DawaiGhor
            </h2>
            <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
              Preparing your experience...
            </p>
          </motion.div>
          
          {/* Progress bar line */}
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
