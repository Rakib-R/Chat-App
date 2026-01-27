
'use client'
import { motion } from "framer-motion";
export function Loader () {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-transparent">
      {/* The Animated Icon */}
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5, // "Moderate" speed
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* The Pulsing Text */}
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="font-roboto text-lg font-semibold text-slate-700"
      >
        Loading ChatApp...
      </motion.p>
    </div>
  );
};

