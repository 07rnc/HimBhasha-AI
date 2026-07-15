"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Compass, Shield, Heart } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { AppleCard } from "../../components/AppleCard";

export default function About() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-6 flex flex-col justify-start">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">About HimBhasha</h2>
        </div>

        {/* Content details */}
        <div className="space-y-6">
          <AppleCard className="bg-white p-8" hoverEffect={false}>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
              Linguistic AI Preservation
            </span>
            <h1 className="text-2xl font-black text-apple-text mt-4 mb-3">HimBhasha AI & HIMCorpus</h1>
            <p className="text-sm font-semibold text-gray-500 leading-relaxed mb-6">
              HimBhasha AI is a production-ready translation, voice-synthesis, and document OCR platform specifically designed to digitize and preserve the endangered regional languages of Himachal Pradesh. Beginning with **Kangdi** as the MVP, the system coordinates custom linguistic context dictionaries with large language models to enable highly natural communication.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
              <div className="flex flex-col gap-1.5">
                <Compass size={18} className="text-[#2A7AD0]" />
                <h4 className="text-xs font-bold text-apple-text">Vaani AI</h4>
                <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                  Your voice and text companion fluent in Himachali regional dialects.
                </p>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <BookOpen size={18} className="text-[#1B6B4A]" />
                <h4 className="text-xs font-bold text-apple-text">HIMCorpus</h4>
                <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                  The semantic knowledge dataset grounding language translation pairs.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Shield size={18} className="text-amber-500" />
                <h4 className="text-xs font-bold text-apple-text">Preservation</h4>
                <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                  Open-source contributions protected by Creative Commons (CC-BY-4.0).
                </p>
              </div>
            </div>
          </AppleCard>

          {/* Mission Details */}
          <AppleCard className="bg-emerald-50/15 border border-emerald-100/20 p-6 flex gap-4" hoverEffect={false}>
            <div className="p-3 rounded-2xl bg-white text-primary self-start">
              <Heart size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-apple-text mb-1">Our Linguistic Mission</h3>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Technology should adapt to people—not force people to adapt to technology. We envision a future where every speaker of Himachal Pradesh's regional languages can interact with conversational artificial intelligence confidently in their native dialect.
              </p>
            </div>
          </AppleCard>
        </div>
      </main>
    </div>
  );
}
