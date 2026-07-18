"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Sparkles,
  AlertCircle,
  Mic,
  MicOff,
  History,
  BookOpen,
  Globe,
  Building,
  Sprout,
  HeartPulse,
  Mountain,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ChatService } from "../../services/chat_service";
import { Message } from "../../types";
import { Navbar } from "../../components/Navbar";
import { ChatBubble } from "../../components/ChatBubble";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_CHIPS = [
  { label: "📖 Dictionary", query: "बंदगी" },
  { label: "🌐 Translate", query: "Translate बंदगी in Hindi" },
  { label: "🏛 Government", query: "PM Kisan" },
  { label: "🌾 Agriculture", query: "Himachal Apple" },
  { label: "🏥 Healthcare", query: "Fever symptoms" },
  { label: "🏔 Culture", query: "Kangra Dham" },
];

const LOADING_MESSAGES = [
  "Searching Offline Knowledge...",
  "Searching Dictionary...",
  "Searching Government...",
  "Searching Agriculture...",
  "Searching FAQ...",
];

export default function MeetVaani() {
  const router = useRouter();
  const { chatHistory, addChatMessage, clearChatHistory } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Load search history from localStorage on client render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ask_vaani_history");
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved));
        } catch (e) {
          console.error("Failed parsing search history:", e);
        }
      }
    }
  }, []);

  // Save query to localStorage search history
  const saveSearchToHistory = (query: string) => {
    if (typeof window === "undefined" || !query.trim()) return;
    setSearchHistory((prev) => {
      const updated = [query.trim(), ...prev.filter((q) => q !== query.trim())].slice(0, 10);
      localStorage.setItem("ask_vaani_history", JSON.stringify(updated));
      return updated;
    });
  };

  // Cycle loading messages when loading is active
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 700);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Handle browser speech input trigger
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error("Failed to start speech recognition:", e);
      setError("Failed to initialize speech recognition.");
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSend = customQuery || input;
    if (!queryToSend.trim() || loading) return;

    saveSearchToHistory(queryToSend);

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addChatMessage(userMessage);
    setInput("");
    setLoading(true);
    setError(null);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const response = await ChatService.sendMessage(userMessage.text);
      
      const vaaniMessage: Message = {
        id: Math.random().toString(),
        sender: "vaani",
        text: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      addChatMessage(vaaniMessage);

      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response.response);
        utterance.lang = "hi-IN";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to reach offline engine. Ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-6 flex flex-col justify-between">
        {/* Header toolbar with Offline Mode Indicator */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>

            {/* Offline Mode Indicator Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🟢 Offline Knowledge Engine Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {searchHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <History size={14} />
                <span>History ({searchHistory.length})</span>
              </button>
            )}

            <button
              onClick={clearChatHistory}
              className="text-[11px] font-bold text-gray-400 hover:text-soft-red transition-colors px-2 py-1"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Local History Dropdown Drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-white dark:bg-[#1C1C1E] border border-border-val rounded-2xl p-4 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-apple-text">Recent Local Searches</span>
                <button onClick={() => setShowHistory(false)} className="text-[10px] text-gray-400 hover:text-gray-600">Close</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q);
                      setShowHistory(false);
                    }}
                    className="text-xs font-medium px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-white/10 text-apple-text hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Workspace Panel */}
        <div className="flex-grow bg-white dark:bg-[#1C1C1E] border border-border-val rounded-3xl p-6 shadow-sm flex flex-col h-[52vh] overflow-y-auto mb-4 relative">
          <div className="flex-grow space-y-4">
            {/* Empty State Presentation */}
            {chatHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto"
              >
                <div className="h-14 w-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-apple-text">Welcome to Ask Vaani</h2>
                  <p className="text-xs text-gray-400 mt-1">Your Offline Himalayan Knowledge Assistant</p>
                </div>
                
                <div className="w-full max-w-sm pt-2">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Try asking:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["• बंदगी", "• PM Kisan", "• Kangra Dham", "• Wheat Disease"].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubmit(null as any, prompt.replace("• ", ""))}
                        className="p-2.5 rounded-xl border border-border-val text-xs font-medium text-apple-text hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Render Conversation Messages */}
            {chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatBubble
                  sender={msg.sender}
                  text={msg.text}
                  timestamp={msg.timestamp}
                />
              </motion.div>
            ))}
            
            {/* Animated Loading Experience */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3.5 bg-soft-gray dark:bg-white/5 border border-border-val/50 rounded-2xl rounded-tl-none max-w-sm"
              >
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs font-semibold text-primary animate-pulse">
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </span>
              </motion.div>
            )}
            
            {error && (
              <div className="flex items-start gap-2.5 p-4 bg-rose-50 dark:bg-rose-950/10 border border-rose-100/20 text-rose-800 dark:text-rose-200 text-xs font-semibold rounded-2xl">
                <AlertCircle size={16} className="text-soft-red flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Quick Action Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setInput(chip.query)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1C1C1E] border border-border-val text-xs font-medium text-apple-text hover:border-primary/50 hover:text-primary hover:scale-105 transition-all flex-shrink-0 shadow-2xs"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSubmit} className="relative flex items-center mt-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask Vaani in Kangri, Hindi, or English..."
            className="w-full h-14 pl-6 pr-24 bg-white dark:bg-[#1C1C1E] border border-border-val rounded-2xl text-sm font-medium text-apple-text shadow-sm focus:outline-none focus:border-primary/50 focus:shadow-md transition-all"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={startListening}
              disabled={loading}
              className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/15 hover:text-primary"
              }`}
              title="Speak message using voice recognition"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center disabled:bg-soft-gray disabled:text-gray-400 hover:opacity-90 active:scale-95 transition-all shadow-sm"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
