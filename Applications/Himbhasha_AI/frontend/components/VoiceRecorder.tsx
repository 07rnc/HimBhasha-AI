"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Volume2, Loader2, RefreshCw } from "lucide-react";
import { Waveform } from "./Waveform";

interface VoiceRecorderProps {
  onRecordingComplete: (transcription: string, response: string, audioBase64: string) => void;
  apiCall: (audioBase64: string) => Promise<{ transcription: string; response: string; audio_response_base64: string }>;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  apiCall,
}) => {
  const [state, setState] = useState<"idle" | "recording" | "thinking" | "speaking">("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const startTimer = () => {
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = () => {
    setState("recording");
    startTimer();
    // Simulate auto-stop after 8 seconds of recording
    setTimeout(() => {
      if (state === "recording") {
        stopRecording();
      }
    }, 8000);
  };

  const stopRecording = async () => {
    stopTimer();
    setState("thinking");

    try {
      // Mock base64 voice payload
      const mockVoiceBase64 = "UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA";
      const result = await apiCall(mockVoiceBase64);
      
      setState("speaking");
      onRecordingComplete(result.transcription, result.response, result.audio_response_base64);

      // Play audio response (synthesized base64 wav)
      const snd = new Audio(`data:audio/wav;base64,${result.audio_response_base64}`);
      setAudioUrl(`data:audio/wav;base64,${result.audio_response_base64}`);
      
      snd.onended = () => {
        setState("idle");
      };
      
      snd.play().catch(e => {
        console.warn("Audio autoplay blocked or failed: ", e);
        // Fallback to idle if play is blocked by browser autoplay policy
        setTimeout(() => setState("idle"), 3000);
      });
    } catch (error) {
      console.error("Voice processing failed: ", error);
      setState("idle");
    }
  };

  const handleMicClick = () => {
    if (state === "idle") {
      startRecording();
    } else if (state === "recording") {
      stopRecording();
    } else if (state === "speaking") {
      // Replay audio
      if (audioUrl) {
        const snd = new Audio(audioUrl);
        setState("speaking");
        snd.onended = () => setState("idle");
        snd.play().catch(() => setState("idle"));
      }
    }
  };

  const resetState = () => {
    setState("idle");
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-sm mx-auto">
      {/* Microphone Trigger Container */}
      <div className="relative flex items-center justify-center h-44 w-44 mb-6">
        <AnimatePresence>
          {state === "recording" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-accent/25"
            />
          )}
          {state === "speaking" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-primary/25"
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleMicClick}
          disabled={state === "thinking"}
          className={`h-32 w-32 rounded-full flex items-center justify-center shadow-lg transition-all border duration-300 ${
            state === "recording"
              ? "bg-[#EA580C] text-white border-transparent"
              : state === "speaking"
              ? "bg-primary text-white border-transparent"
              : "bg-white dark:bg-white/10 text-primary border-border-val hover:shadow-xl"
          }`}
          whileHover={{ scale: state === "thinking" ? 1 : 1.03 }}
          whileTap={{ scale: state === "thinking" ? 1 : 0.97 }}
        >
          {state === "idle" && <Mic size={40} className="stroke-[2]" />}
          {state === "recording" && <Square size={36} fill="currentColor" />}
          {state === "speaking" && <Volume2 size={40} />}
          {state === "thinking" && (
            <Loader2 size={40} className="animate-spin text-gray-400" />
          )}
        </motion.button>
      </div>

      {/* Waveform and helper text */}
      <div className="w-full text-center h-16 flex flex-col items-center justify-center">
        {state === "idle" && (
          <p className="text-sm font-semibold text-gray-400">Tap to start speaking</p>
        )}
        {state === "recording" && (
          <div className="flex flex-col items-center gap-1">
            <Waveform isActive={true} color="bg-accent" />
            <p className="text-xs font-bold text-accent">Recording... 0:0{seconds}s</p>
          </div>
        )}
        {state === "thinking" && (
          <p className="text-sm font-semibold text-gray-400 animate-pulse">Vaani is processing...</p>
        )}
        {state === "speaking" && (
          <div className="flex flex-col items-center gap-1">
            <Waveform isActive={true} color="bg-primary" />
            <p className="text-xs font-bold text-primary">Listening to response</p>
          </div>
        )}
      </div>

      {/* Manual state reset */}
      {state !== "idle" && (
        <button
          onClick={resetState}
          className="mt-6 flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw size={12} />
          <span>Reset recorder</span>
        </button>
      )}
    </div>
  );
};
