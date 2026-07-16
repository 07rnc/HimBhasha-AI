"use client";

import React from "react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full py-12 md:py-16 flex flex-col items-center text-center overflow-hidden">
      {/* Background soft intelligence glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl px-6 flex flex-col items-center"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
          HIMCorpus Engine
        </span>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-apple-text mb-2">
          HimBhasha <span className="text-primary">AI</span>
        </h1>
        <p className="text-sm md:text-base font-semibold text-gray-500 max-w-md mb-8">
          Preserving Himachal's Regional Languages
        </p>

        <div className="h-px w-20 bg-border-val mb-8" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-apple-text tracking-tight flex items-center gap-2 mb-2">
            👋 Hi, I'm <span className="text-primary font-extrabold intelligence-ring px-2.5 py-0.5 rounded-full bg-primary/5">Vaani</span>.
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-500">
            How can I help you today?
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};
