"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Sparkles, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../../lib/api";
import { Message } from "../../types";
import { Navbar } from "../../components/Navbar";
import { ChatBubble } from "../../components/ChatBubble";
import { motion } from "framer-motion";

export default function MeetVaani() {
  const router = useRouter();
  const { chatHistory, addChatMessage, clearChatHistory } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Initialize welcome message from Vaani if history is empty
  useEffect(() => {
    if (chatHistory.length === 0) {
      addChatMessage({
        id: "welcome",
        sender: "vaani",
        text: "बंदगी! मैं वाणी हूँ। मैं कांगड़ी सीखने और अनुवाद करने में आपकी मदद कर सकती हूँ। आज हम क्या बातचीत करेंगे?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }, [chatHistory, addChatMessage]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addChatMessage(userMessage);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await api.chat(userMessage.text);
      
      const vaaniMessage: Message = {
        id: Math.random().toString(),
        sender: "vaani",
        text: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      addChatMessage(vaaniMessage);
    } catch (err) {
      console.error(err);
      setError("Unable to reach Vaani. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-6 flex flex-col justify-between">
        {/* Header toolbar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          <button
            onClick={clearChatHistory}
            className="text-[10px] font-bold text-gray-400 hover:text-soft-red transition-colors"
          >
            Clear Conversation
          </button>
        </div>

        {/* Chat Workspace Panel */}
        <div className="flex-grow bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col h-[55vh] overflow-y-auto mb-6">
          <div className="flex-grow space-y-4">
            {chatHistory.map((msg) => (
              <ChatBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
              />
            ))}
            
            {loading && (
              <div className="flex items-center gap-1.5 p-3 bg-primary/10 rounded-2xl rounded-tl-none w-20 text-white justify-center">
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold rounded-2xl">
                <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask Vaani something in Kangdi, Hindi, or English..."
            className="w-full h-14 pl-6 pr-16 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-apple-text shadow-sm focus:outline-none focus:border-primary/50 focus:shadow-md transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center disabled:bg-gray-100 disabled:text-gray-300 hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </main>
    </div>
  );
}
