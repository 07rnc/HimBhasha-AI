"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Languages, Volume2, Type, RefreshCw, Radio } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Navbar } from "../../components/Navbar";
import { AppleCard } from "../../components/AppleCard";

export default function Settings() {
  const router = useRouter();
  const {
    appLanguage,
    setAppLanguage,
    voiceAutoplay,
    setVoiceAutoplay,
    fontSize,
    setFontSize,
    apiStatus,
    checkApiStatus,
  } = useApp();

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
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">System Settings</h2>
        </div>

        {/* Apple Settings style panel */}
        <div className="space-y-6">
          <AppleCard className="bg-white dark:bg-[#1C1C1E] p-0 divide-y divide-border-val overflow-hidden" hoverEffect={false}>
            
            {/* Setting Row 1: App Interface Language */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center">
                  <Languages size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-apple-text">Interface Language</h3>
                  <p className="text-xs font-semibold text-gray-400">Set the default interface text translation</p>
                </div>
              </div>
              <select
                value={appLanguage}
                onChange={(e) => setAppLanguage(e.target.value as any)}
                className="h-9 px-3 bg-soft-gray border border-border-val rounded-lg text-xs font-bold text-apple-text cursor-pointer focus:outline-none"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="kangdi">Kangdi</option>
              </select>
            </div>

            {/* Setting Row 2: Voice Autoplay */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
                  <Volume2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-apple-text">Voice Autoplay Response</h3>
                  <p className="text-xs font-semibold text-gray-400">Play spoken audio answers automatically</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={voiceAutoplay}
                onChange={(e) => setVoiceAutoplay(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            {/* Setting Row 3: Font Size */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center">
                  <Type size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-apple-text">Display Font Size</h3>
                  <p className="text-xs font-semibold text-gray-400">Adjust the readability of conversation bubbles</p>
                </div>
              </div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as any)}
                className="h-9 px-3 bg-soft-gray border border-border-val rounded-lg text-xs font-bold text-apple-text cursor-pointer focus:outline-none"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

          </AppleCard>

          {/* Connection diagnostics card */}
          <AppleCard className="bg-white dark:bg-[#1C1C1E] p-6 flex items-center justify-between" hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                apiStatus === "online" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500" : "bg-rose-50 dark:bg-rose-950/20 text-rose-500"
              }`}>
                <Radio size={18} className={apiStatus === "checking" ? "animate-pulse" : ""} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-apple-text">API Diagnostic Connection</h3>
                <p className="text-xs font-semibold text-gray-400">
                  Status: <span className="font-bold">{apiStatus.toUpperCase()}</span> (http://localhost:8000/api)
                </p>
              </div>
            </div>

            <button
              onClick={checkApiStatus}
              className="h-9 w-9 rounded-lg bg-soft-gray hover:opacity-85 flex items-center justify-center text-gray-400 transition-colors"
              title="Test connection status"
            >
              <RefreshCw size={14} className={apiStatus === "checking" ? "animate-spin" : ""} />
            </button>
          </AppleCard>
        </div>
      </main>
    </div>
  );
}
