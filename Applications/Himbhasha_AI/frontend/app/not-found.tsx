"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Compass, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFBF9] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md flex flex-col items-center"
      >
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Compass size={28} className="animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        
        <h1 className="text-2xl font-black text-apple-text mb-2">Page Not Found</h1>
        <p className="text-sm font-semibold text-gray-400 max-w-xs mb-8">
          The requested workspace does not exist or has been moved to a different url.
        </p>

        <button
          onClick={() => router.push("/")}
          className="h-11 px-6 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Home size={14} />
          <span>Return to Home</span>
        </button>
      </motion.div>
    </div>
  );
}
