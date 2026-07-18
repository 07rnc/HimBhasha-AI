"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  Copy,
  Volume2,
  Trash2,
  Loader2,
  ClipboardCheck,
  Star,
  Download,
  FileText,
  FileJson,
  Sparkles,
  AlertCircle,
  Clock,
  Tag,
  BookOpen,
} from "lucide-react";
import { TranslationService } from "../../services/translation_service";
import { Navbar } from "../../components/Navbar";
import { AppleCard } from "../../components/AppleCard";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_CHIPS = [
  "बंदगी",
  "धाम",
  "तुसा किद्दा ओ?",
  "Hello",
];

const LOADING_MESSAGES = [
  "Detecting Language...",
  "Searching Dictionary...",
  "Searching Phrasebook...",
  "Preparing Translation...",
];

interface HistoryItem {
  id: string;
  original: string;
  translated: string;
  srcLang: string;
  targetLang: string;
  confidence?: number;
  timestamp: string;
  isFavorite?: boolean;
}

export default function Translate() {
  const router = useRouter();
  
  const [srcText, setSrcText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [pos, setPos] = useState("");
  const [sourceBackend, setSourceBackend] = useState("Offline Dictionary");
  const [matchType, setMatchType] = useState("");
  const [procTime, setProcTime] = useState<number | null>(null);
  const [relatedWords, setRelatedWords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [srcLang, setSrcLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("kangri");
  const [detectedLang, setDetectedLang] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"history" | "favorites">("history");

  // Load local history & favorites on render
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedHistory = localStorage.getItem("translate_history");
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedFavs = localStorage.getItem("translate_favorites");
        if (savedFavs) setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed loading local translation storage:", e);
      }
    }
  }, []);

  // Cycle loading messages when translating
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 500);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const saveToHistory = (item: HistoryItem) => {
    if (typeof window === "undefined") return;
    setHistory((prev) => {
      const updated = [item, ...prev.filter((h) => h.original !== item.original)].slice(0, 20);
      localStorage.setItem("translate_history", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = useCallback((item?: HistoryItem) => {
    if (typeof window === "undefined") return;
    const targetItem = item || {
      id: Math.random().toString(),
      original: srcText,
      translated: translatedText,
      srcLang: detectedLang,
      targetLang: targetLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!targetItem.original || !targetItem.translated) return;

    setFavorites((prev) => {
      const exists = prev.some((f) => f.original === targetItem.original);
      let updated: HistoryItem[];
      if (exists) {
        updated = prev.filter((f) => f.original !== targetItem.original);
      } else {
        updated = [{ ...targetItem, isFavorite: true }, ...prev];
      }
      localStorage.setItem("translate_favorites", JSON.stringify(updated));
      return updated;
    });
  }, [srcText, translatedText, detectedLang, targetLang]);

  const handleTranslate = useCallback(async (queryText?: string) => {
    const textToTranslate = queryText || srcText;
    if (!textToTranslate.trim() || loading) return;

    setLoading(true);
    setCopied(false);
    setErrorMsg(null);

    try {
      const apiSrcLang = srcLang === "auto" ? undefined : srcLang;
      const res = await TranslationService.translateText(
        textToTranslate,
        apiSrcLang as any,
        targetLang as any
      );

      if (res && res.translated_text) {
        setTranslatedText(res.translated_text);
        setDetectedLang(res.source_language || (res.source_lang as string) || "Auto");
        setConfidence(res.confidence || 95);
        setCategory(res.category || "General");
        setSourceBackend(res.source || res.source_dataset || "Offline Dictionary");
        setPronunciation(res.pronunciation || "");
        setMatchType(res.match_type || "exact");
        setProcTime(res.processing_time_ms || 12.5);
        setRelatedWords(res.related_words || []);
        setSuggestions(res.suggestions || []);

        const newItem: HistoryItem = {
          id: Math.random().toString(),
          original: textToTranslate,
          translated: res.translated_text,
          srcLang: res.source_language || (res.source_lang as string) || srcLang,
          targetLang: res.target_language || (res.target_lang as string) || targetLang,
          confidence: res.confidence || 95,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        saveToHistory(newItem);
      } else {
        setTranslatedText("");
        setErrorMsg("Translation unavailable in the offline knowledge base.");
        setSuggestions(res?.suggestions || ["Check spelling", "Search Dictionary", "Browse Phrasebook"]);
      }
    } catch (e) {
      console.error(e);
      setTranslatedText("");
      setErrorMsg("Translation service error. Ensure offline backend is active.");
      setSuggestions(["Check spelling", "Search Dictionary", "Browse Phrasebook"]);
    } finally {
      setLoading(false);
    }
  }, [srcText, srcLang, targetLang, loading]);

  const handleClear = useCallback(() => {
    setSrcText("");
    setTranslatedText("");
    setPronunciation("");
    setConfidence(null);
    setCategory("");
    setPos("");
    setMatchType("");
    setProcTime(null);
    setRelatedWords([]);
    setSuggestions([]);
    setErrorMsg(null);
    setCopied(false);
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter without shift triggers translate
      if (e.key === "Enter" && !e.shiftKey && srcText.trim()) {
        const activeElem = document.activeElement;
        if (activeElem?.tagName === "TEXTAREA" || activeElem?.tagName === "INPUT") {
          e.preventDefault();
          handleTranslate();
        }
      }
      // Ctrl + L clears text
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        handleClear();
      }
      // Ctrl + Shift + S toggles favorite
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        toggleFavorite();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [srcText, handleTranslate, handleClear, toggleFavorite]);

  const handleSwap = () => {
    if (srcLang === "auto") return;
    const tempLang = srcLang;
    setSrcLang(targetLang);
    setTargetLang(tempLang);

    const tempText = srcText;
    setSrcText(translatedText);
    setTranslatedText(tempText);
    setPronunciation("");
    setErrorMsg(null);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translatedText) return;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang === "kangri" || targetLang === "hindi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const exportAsTxt = () => {
    if (!translatedText) return;
    const content = `Original (${detectedLang}): ${srcText}\nTranslated (${targetLang}): ${translatedText}\nConfidence: ${confidence}%\nSource: ${sourceBackend}`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `translation_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowExportMenu(false);
  };

  const exportAsJson = () => {
    if (!translatedText) return;
    const data = {
      original_text: srcText,
      translated_text: translatedText,
      source_language: detectedLang,
      target_language: targetLang,
      confidence: confidence,
      pronunciation: pronunciation,
      category: category,
      source_dataset: sourceBackend,
      match_type: matchType,
      processing_time_ms: procTime
    };
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `translation_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowExportMenu(false);
  };

  const currentIsFavorite = favorites.some((f) => f.original === srcText);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-6 flex flex-col justify-start">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          {/* Always Visible Offline Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/50 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🟢 Offline Translation Engine Active</span>
            </span>
          </div>
        </div>

        {/* Quick Example Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 flex-shrink-0">Try Examples:</span>
          {QUICK_CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => {
                setSrcText(chip);
                handleTranslate(chip);
              }}
              className="px-3 py-1 rounded-full bg-white dark:bg-[#1C1C1E] border border-border-val text-xs font-medium text-apple-text hover:border-primary/50 hover:text-primary hover:scale-105 transition-all flex-shrink-0 shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Translation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
          
          {/* Source Input Panel */}
          <AppleCard className="flex flex-col justify-between h-88 bg-white dark:bg-[#1C1C1E]" hoverEffect={false}>
            {/* Header Language Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-border-val">
              <select
                value={srcLang}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === targetLang) {
                    setTargetLang(srcLang === "auto" ? "kangri" : srcLang);
                  }
                  setSrcLang(val);
                }}
                className="bg-transparent text-xs font-bold text-apple-text focus:outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="auto">✨ Auto Detect</option>
                <option value="kangri">Kangri</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
              
              {srcText && (
                <button onClick={handleClear} className="text-gray-400 hover:text-soft-red transition-colors" title="Clear text (Ctrl+L)">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Input Body */}
            <textarea
              value={srcText}
              onChange={(e) => setSrcText(e.target.value)}
              placeholder="Enter word or phrase to translate (Press Enter to translate)..."
              maxLength={400}
              className="flex-grow w-full py-4 text-base font-medium text-apple-text resize-none bg-transparent placeholder-gray-300 focus:outline-none"
            />

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border-val">
              <span className="text-[10px] font-bold text-gray-400">
                {srcText.length}/400 chars • Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-[9px]">Enter</kbd>
              </span>
              
              <button
                onClick={() => handleTranslate()}
                disabled={!srcText.trim() || loading}
                className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 disabled:bg-soft-gray disabled:text-gray-400 hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>Translate</span>
              </button>
            </div>
          </AppleCard>

          {/* Swap Divider Button */}
          <div className="md:hidden flex justify-center">
            <button
              onClick={handleSwap}
              disabled={srcLang === "auto"}
              className="h-12 w-12 rounded-full bg-white dark:bg-[#1C1C1E] border border-border-val flex items-center justify-center text-primary shadow-sm hover:shadow-md transition-shadow disabled:opacity-40"
            >
              <ArrowLeftRight size={18} className="rotate-90" />
            </button>
          </div>

          {/* Target Output Panel */}
          <AppleCard className="flex flex-col justify-between h-88 bg-white dark:bg-[#1C1C1E]" hoverEffect={false}>
            {/* Header Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-border-val">
              <select
                value={targetLang}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === srcLang) {
                    setSrcLang(targetLang);
                  }
                  setTargetLang(val);
                }}
                className="bg-transparent text-xs font-bold text-apple-text focus:outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="kangri">Kangri</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>

              <div className="hidden md:block">
                <button
                  onClick={handleSwap}
                  disabled={srcLang === "auto"}
                  className="h-8 w-8 rounded-lg bg-soft-gray border border-border-val flex items-center justify-center text-gray-500 hover:text-primary transition-colors disabled:opacity-40"
                  title="Swap languages"
                >
                  <ArrowLeftRight size={14} />
                </button>
              </div>
            </div>

            {/* Output Body */}
            <div className="flex-grow py-3 flex flex-col justify-start overflow-y-auto space-y-3">
              {loading ? (
                <div className="my-auto flex items-center gap-2 text-primary text-xs font-semibold animate-pulse">
                  <Loader2 size={16} className="animate-spin" />
                  <span>{LOADING_MESSAGES[loadingMsgIdx]}</span>
                </div>
              ) : translatedText ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {/* Translated Main Text */}
                  <p className="text-xl font-bold text-primary whitespace-pre-wrap leading-relaxed">
                    {translatedText}
                  </p>
                  
                  {/* Translation Statistics & Badges Bar */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {detectedLang && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-[10px] font-bold">
                        {detectedLang} ➔ {targetLang.toUpperCase()}
                      </span>
                    )}
                    {confidence !== null && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold">
                        Confidence {confidence}%
                      </span>
                    )}
                    {category && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold">
                        {category}
                      </span>
                    )}
                    {procTime !== null && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-[10px] font-bold flex items-center gap-1">
                        <Clock size={10} />
                        <span>{procTime}ms</span>
                      </span>
                    )}
                  </div>

                  {/* 1. Pronunciation Card */}
                  {pronunciation && (
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 p-2.5 rounded-xl">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                        Pronunciation Guide
                      </p>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 tracking-wide mt-0.5">
                        🗣️ {pronunciation}
                      </p>
                    </div>
                  )}

                  {/* 3. Related Words Chips */}
                  {relatedWords.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Related Words:</p>
                      <div className="flex flex-wrap gap-1">
                        {relatedWords.map((rw, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSrcText(rw);
                              handleTranslate(rw);
                            }}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/10 text-apple-text hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {rw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Low Confidence Suggestions */}
                  {confidence !== null && confidence < 80 && suggestions.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 p-2.5 rounded-xl text-xs">
                      <span className="font-bold text-orange-700 dark:text-orange-300">Did you mean:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSrcText(sug);
                              handleTranslate(sug);
                            }}
                            className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-semibold text-[11px] hover:bg-orange-200"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : errorMsg ? (
                <div className="my-auto p-4 bg-rose-50 dark:bg-rose-950/10 border border-rose-100/20 text-rose-800 dark:text-rose-200 text-xs font-semibold rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-soft-red font-bold">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium pt-1">Suggestions:</p>
                  <ul className="list-disc list-inside text-[11px] text-gray-400 space-y-0.5">
                    {suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs font-medium text-gray-400 my-auto">
                  Translation result will appear here...
                </p>
              )}
            </div>

            {/* Output Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border-val relative">
              <div className="flex gap-1.5">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className="h-9 px-2.5 rounded-lg bg-soft-gray border border-border-val flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary disabled:opacity-50 transition-all"
                  title="Copy translation"
                >
                  {copied ? <ClipboardCheck size={14} className="text-leaf-green" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                
                {/* Audio Pronunciation */}
                <button
                  onClick={handleSpeak}
                  disabled={!translatedText}
                  className="h-9 w-9 rounded-lg bg-soft-gray border border-border-val flex items-center justify-center text-gray-500 hover:text-primary disabled:opacity-50 transition-all"
                  title="Listen pronunciation"
                >
                  <Volume2 size={14} />
                </button>

                {/* Bookmark Favorite */}
                <button
                  onClick={() => toggleFavorite()}
                  disabled={!translatedText}
                  className={`h-9 w-9 rounded-lg border border-border-val flex items-center justify-center disabled:opacity-50 transition-all ${
                    currentIsFavorite ? "bg-amber-50 text-amber-500 border-amber-200" : "bg-soft-gray text-gray-500 hover:text-primary"
                  }`}
                  title="Bookmark favorite (Ctrl+Shift+S)"
                >
                  <Star size={14} className={currentIsFavorite ? "fill-amber-400" : ""} />
                </button>

                {/* Export Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={!translatedText}
                    className="h-9 px-2.5 rounded-lg bg-soft-gray border border-border-val flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-primary disabled:opacity-50 transition-all"
                    title="Export translation"
                  >
                    <Download size={14} />
                    <span>Export</span>
                  </button>

                  {showExportMenu && (
                    <div className="absolute left-0 bottom-11 w-32 bg-white dark:bg-[#1C1C1E] border border-border-val rounded-xl p-1.5 shadow-lg z-20 space-y-1">
                      <button
                        onClick={exportAsTxt}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-apple-text hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                      >
                        <FileText size={14} />
                        <span>TXT File</span>
                      </button>
                      <button
                        onClick={exportAsJson}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-apple-text hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                      >
                        <FileJson size={14} />
                        <span>JSON File</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <span className="text-[10px] font-bold text-gray-400">{sourceBackend}</span>
            </div>
          </AppleCard>
        </div>

        {/* History & Favorites Tabs */}
        <AppleCard className="bg-white/70 dark:bg-[#1C1C1E]/70">
          <div className="flex items-center justify-between border-b border-border-val pb-3 mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("history")}
                className={`text-xs font-bold transition-colors ${
                  activeTab === "history" ? "text-primary border-b-2 border-primary pb-1" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Recent History ({history.length})
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`text-xs font-bold transition-colors ${
                  activeTab === "favorites" ? "text-primary border-b-2 border-primary pb-1" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Bookmarks ({favorites.length})
              </button>
            </div>

            {activeTab === "history" && history.length > 0 && (
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("translate_history");
                }}
                className="text-[10px] text-gray-400 hover:text-soft-red transition-colors font-bold"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="space-y-2">
            {(activeTab === "history" ? history : favorites).length > 0 ? (
              (activeTab === "history" ? history : favorites).slice(0, 10).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSrcText(item.original);
                    setTranslatedText(item.translated);
                  }}
                  className="flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-border-val"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-apple-text">
                      "{item.original}" ➔ "{item.translated}"
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {item.srcLang} to {item.targetLang} • Confidence {item.confidence}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{item.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-xs font-medium text-gray-400 py-3 text-center">
                {activeTab === "history" ? "No translation history yet." : "No bookmarked translations yet."}
              </p>
            )}
          </div>
        </AppleCard>
      </main>
    </div>
  );
}
