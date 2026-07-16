"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowLeftRight, Copy, Volume2, Trash2, Loader2, ClipboardCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { TranslationService } from "../../services/translation_service";
import { Language } from "../../types";
import { Navbar } from "../../components/Navbar";
import { AppleCard } from "../../components/AppleCard";
import { motion } from "framer-motion";

export default function Translate() {
  const router = useRouter();
  const { appLanguage } = useApp();

  const [srcText, setSrcText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [srcLang, setSrcLang] = useState<Language>("english");
  const [targetLang, setTargetLang] = useState<Language>("kangdi");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!srcText.trim() || loading) return;
    setLoading(true);
    setCopied(false);

    try {
      const res = await TranslationService.translateText(srcText, srcLang, targetLang);
      setTranslatedText(res.translated_text);
      if (res.pronunciation) {
        setPronunciation(res.pronunciation);
      } else {
        setPronunciation("");
      }
    } catch (e) {
      console.error(e);
      setTranslatedText("Translation failed. Please verify API connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = srcLang;
    setSrcLang(targetLang);
    setTargetLang(temp);
    setSrcText(translatedText);
    setTranslatedText(srcText);
    setPronunciation("");
    setCopied(false);
  };

  const handleClear = () => {
    setSrcText("");
    setTranslatedText("");
    setPronunciation("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translatedText) return;
    const textToSpeak = translatedText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = targetLang === "kangdi" || targetLang === "hindi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-6 flex flex-col justify-start">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">HIMCorpus Translator</h2>
        </div>

        {/* Translation Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
          
          {/* Source input panel */}
          <AppleCard className="flex flex-col justify-between h-80 bg-white dark:bg-[#1C1C1E]" hoverEffect={false}>
            {/* Lang Header selector */}
            <div className="flex items-center justify-between pb-3 border-b border-border-val">
              <select
                value={srcLang}
                onChange={(e) => setSrcLang(e.target.value as Language)}
                className="bg-transparent text-sm font-bold text-apple-text focus:outline-none cursor-pointer"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="kangdi">Kangdi</option>
              </select>
              
              {srcText && (
                <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Input body */}
            <textarea
              value={srcText}
              onChange={(e) => setSrcText(e.target.value)}
              placeholder="Enter text to translate here..."
              maxLength={400}
              className="flex-grow w-full py-4 text-base font-medium text-apple-text resize-none bg-transparent placeholder-gray-300 focus:outline-none"
            />

            {/* Translate action row */}
            <div className="flex items-center justify-between pt-3 border-t border-border-val">
              <span className="text-[10px] font-bold text-gray-400">
                {srcText.length}/400 characters
              </span>
              
              <button
                onClick={handleTranslate}
                disabled={!srcText.trim() || loading}
                className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 disabled:bg-soft-gray disabled:text-gray-400 transition-colors shadow-sm"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>Translate</span>
              </button>
            </div>
          </AppleCard>

          {/* Swap divider */}
          <div className="md:hidden flex justify-center">
            <button
              onClick={handleSwap}
              className="h-12 w-12 rounded-full bg-white dark:bg-[#1C1C1E] border border-border-val flex items-center justify-center text-primary shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeftRight size={18} className="rotate-90" />
            </button>
          </div>

          {/* Target output panel */}
          <AppleCard className="flex flex-col justify-between h-80 bg-white dark:bg-[#1C1C1E]" hoverEffect={false}>
            {/* Lang Header selector */}
            <div className="flex items-center justify-between pb-3 border-b border-border-val">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as Language)}
                className="bg-transparent text-sm font-bold text-apple-text focus:outline-none cursor-pointer"
              >
                <option value="kangdi">Kangdi</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>

              <div className="hidden md:block">
                <button
                  onClick={handleSwap}
                  className="h-8 w-8 rounded-lg bg-soft-gray border border-border-val flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                >
                  <ArrowLeftRight size={14} />
                </button>
              </div>
            </div>

            {/* Output body */}
            <div className="flex-grow py-4 flex flex-col justify-start overflow-y-auto">
              {translatedText ? (
                <div className="space-y-4">
                  <p className="text-base font-bold text-primary whitespace-pre-wrap leading-relaxed">
                    {translatedText}
                  </p>
                  
                  {pronunciation && (
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/10 p-2.5 rounded-xl">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                        Pronunciation Guide
                      </p>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 tracking-wide mt-0.5">
                        {pronunciation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-300">
                  Translation will appear here...
                </p>
              )}
            </div>

            {/* Output footer toolbar */}
            <div className="flex items-center justify-between pt-3 border-t border-border-val">
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className="h-9 px-3 rounded-lg bg-soft-gray border border-border-val flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary disabled:opacity-50 transition-all"
                >
                  {copied ? <ClipboardCheck size={14} className="text-leaf-green" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                
                <button
                  onClick={handleSpeak}
                  disabled={!translatedText}
                  className="h-9 w-9 rounded-lg bg-soft-gray border border-border-val flex items-center justify-center text-gray-500 hover:text-primary disabled:opacity-50 transition-all"
                >
                  <Volume2 size={14} />
                </button>
              </div>
              
              <span className="text-[10px] font-bold text-gray-400">CC-BY-4.0</span>
            </div>
          </AppleCard>
        </div>

        {/* Translation History Placeholder */}
        <AppleCard className="bg-white/60 dark:bg-[#1C1C1E]/60">
          <h3 className="text-sm font-bold text-apple-text mb-3">Translation History</h3>
          <div className="space-y-2 text-xs font-semibold text-gray-400">
            <div className="flex justify-between items-center py-2 border-b border-border-val">
              <span>"What are you doing" ➔ "तूं क्या करदा है?"</span>
              <span className="text-[10px]">English to Kangdi</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>"Water" ➔ "पाणी"</span>
              <span className="text-[10px]">English to Kangdi</span>
            </div>
          </div>
        </AppleCard>
      </main>
    </div>
  );
}
