"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Languages, Mic, FileText, Heart, Compass } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { AppleCard } from "../components/AppleCard";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash was already shown in this tab session
    const hasShown = sessionStorage.getItem("himbhasha_splash_shown");
    if (hasShown) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("himbhasha_splash_shown", "true");
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  const features = [
    {
      id: "meet-vaani",
      title: "Meet Vaani",
      desc: "Talk with your personal regional language AI companion.",
      icon: <MessageSquare size={32} className="text-[#1B6B4A]" />,
      route: "/meet-vaani",
      bgClass: "bg-emerald-50/30 hover:bg-emerald-50/50",
    },
    {
      id: "translate",
      title: "Translate",
      desc: "Convert text instantly between Kangdi, Hindi, and English.",
      icon: <Languages size={32} className="text-[#2A7AD0]" />,
      route: "/translate",
      bgClass: "bg-blue-50/30 hover:bg-blue-50/50",
    },
    {
      id: "voice",
      title: "Voice Assistant",
      desc: "Speak directly in local dialects and hear spoken responses.",
      icon: <Mic size={32} className="text-amber-600" />,
      route: "/voice",
      bgClass: "bg-amber-50/30 hover:bg-amber-50/50",
    },
    {
      id: "document",
      title: "Understand Documents",
      desc: "Extract text, summarize, and ask questions of PDFs/images.",
      icon: <FileText size={32} className="text-rose-600" />,
      route: "/document",
      bgClass: "bg-rose-50/30 hover:bg-rose-50/50",
    },
    {
      id: "preserve",
      title: "Preserve Our Language",
      desc: "Contribute native vocabulary, local proverbs, and audio records.",
      icon: <Heart size={32} className="text-[#10B981]" />,
      route: "/preserve",
      bgClass: "bg-teal-50/30 hover:bg-teal-50/50",
    },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAFBF9]"
          >
            {/* Splash Animation Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1, 0.95], opacity: [0, 1, 1] }}
              transition={{ duration: 1.6, times: [0, 0.7, 1], ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {/* Mountain Motif SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100" height="80" className="mb-4">
                <circle cx="50" cy="45" r="22" fill="#FCD34D" opacity="0.8" />
                <polygon points="15,70 45,25 75,70" fill="#2D9F6C" opacity="0.9" />
                <polygon points="40,70 65,35 90,70" fill="#1B6B4A" />
                <polygon points="58,45 65,35 72,45 68,42 65,46 62,42" fill="#FFFFFF" />
              </svg>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-2xl font-black tracking-tight text-apple-text"
              >
                HimBhasha <span className="text-primary font-black">AI</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1"
              >
                Vaani Voice Engine
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col"
          >
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-6 py-6 flex-grow w-full flex flex-col items-center">
              <Hero />

              {/* Cards Grid */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {features.map((feature) => (
                  <AppleCard
                    key={feature.id}
                    onClick={() => router.push(feature.route)}
                    className={`${feature.bgClass} flex flex-col justify-between h-48 group`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-50 group-hover:shadow-md transition-shadow">
                        {feature.icon}
                      </div>
                      <Compass size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-apple-text mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </AppleCard>
                ))}
              </div>
            </main>

            <footer className="w-full py-8 text-center text-[10px] font-semibold text-gray-400">
              © 2026 HimBhasha AI • Preserving Himachal's Cultural & Linguistic Heritage
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
