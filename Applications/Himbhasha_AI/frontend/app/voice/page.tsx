"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Volume2, User, Mic } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { VoiceRecorder } from "../../components/VoiceRecorder";
import { AppleCard } from "../../components/AppleCard";
import { VoiceService } from "../../services/voice_service";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceAssistant() {
  const router = useRouter();
  const [transcription, setTranscription] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleVoiceComplete = (trans: string, resp: string, audioBase64: string) => {
    setTranscription(trans);
    setResponse(resp);
    setAudioUrl(`data:audio/wav;base64,${audioBase64}`);
  };

  const handleReplay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.warn("Audio play blocked", e));
    }
  };

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
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Vaani Voice Workspace</h2>
        </div>

        {/* Large Central Voice Canvas Card */}
        <AppleCard className="bg-white dark:bg-[#1C1C1E] p-8 flex flex-col items-center justify-center min-h-[50vh] text-center mb-6">
          <VoiceRecorder
            onRecordingComplete={handleVoiceComplete}
            apiCall={VoiceService.processVoiceStream}
          />
        </AppleCard>

        {/* Dynamic speech conversation display card */}
        <AnimatePresence>
          {transcription && response && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Dialogue exchange card */}
              <AppleCard className="bg-white/80 dark:bg-[#1C1C1E]/80 border border-border-val p-6 flex flex-col gap-4">
                {/* Transcription (User speech) */}
                <div className="flex items-start gap-3 border-b border-border-val pb-4">
                  <div className="h-8 w-8 rounded-full bg-soft-gray flex items-center justify-center text-gray-500">
                    <User size={16} />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">What you said</span>
                    <p className="text-sm font-bold text-apple-text mt-0.5">{transcription}</p>
                  </div>
                </div>

                {/* Response (Vaani speech) */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Sparkles size={16} />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Vaani Response</span>
                      <p className="text-sm font-bold text-primary leading-relaxed mt-0.5">{response}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleReplay}
                    className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                    title="Replay spoken audio response"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              </AppleCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
