"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Volume2, Loader2, RefreshCw, X, AlertCircle, Play } from "lucide-react";
import { Waveform } from "./Waveform";

interface VoiceRecorderProps {
  onRecordingComplete: (transcription: string, response: string, audioBase64: string, confidence?: number) => void;
  apiCall: (audioBase64: string) => Promise<{ transcription: string; response: string; audio_response_base64: string; confidence?: number }>;
}

export type RecorderState = 
  | "idle" 
  | "listening" 
  | "uploading" 
  | "transcribing" 
  | "thinking" 
  | "speaking" 
  | "completed" 
  | "error";

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  apiCall,
}) => {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<any[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopTimer();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
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

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the test stream tracks immediately
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      console.warn("Microphone permission denied: ", err);
      setErrorMessage(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Microphone access denied. Please enable mic permissions in your browser settings to talk to Vaani."
          : "Microphone is unavailable or busy on your system."
      );
      setState("error");
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) return;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setState("listening");
    startTimer();
    audioChunksRef.current = [];

    // Simulate standard Web Audio MediaRecorder setup
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
    } catch (e) {
      console.warn("MediaRecorder instantiation failed, using simulated audio buffer.", e);
    }

    // Auto-stop after 15 seconds to prevent memory overflow
    timeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 15000);
  };

  const cancelRecording = () => {
    stopTimer();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
        // Stop stream tracks
        mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
      } catch (e) {
        console.error(e);
      }
    }
    
    setState("idle");
    setSeconds(0);
    audioChunksRef.current = [];
  };

  const stopRecording = async () => {
    stopTimer();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
      } catch (e) {
        console.error(e);
      }
    }

    setState("uploading");
    
    // Simulate uploading sequence
    setTimeout(() => {
      setState("transcribing");
      
      // Simulate transcribing sequence
      setTimeout(async () => {
        setState("thinking");
        
        try {
          // Mock Kangdi audio base64 payload
          const mockVoiceBase64 = "UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA";
          const result = await apiCall(mockVoiceBase64);
          
          setState("speaking");
          onRecordingComplete(
            result.transcription,
            result.response,
            result.audio_response_base64,
            result.confidence
          );

          // Play synthesized speech response WAV stream
          const snd = new Audio(`data:audio/wav;base64,${result.audio_response_base64}`);
          currentAudioRef.current = snd;
          setAudioUrl(`data:audio/wav;base64,${result.audio_response_base64}`);
          
          snd.onended = () => {
            setState("completed");
            currentAudioRef.current = null;
          };
          
          snd.play().catch(e => {
            console.warn("Audio autoplay blocked by browser policy: ", e);
            setState("completed");
          });
        } catch (error) {
          console.error("Voice processing pipeline error: ", error);
          setErrorMessage("Failed to process voice request. The speech translation server timed out.");
          setState("error");
        }
      }, 1000);
    }, 7000 - 6200); // Quick uploading transitions (approx 800ms total)
  };

  const handleMicClick = () => {
    if (state === "idle" || state === "completed" || state === "error") {
      startRecording();
    } else if (state === "listening") {
      stopRecording();
    } else if (state === "speaking") {
      if (audioUrl) {
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
        }
        const snd = new Audio(audioUrl);
        currentAudioRef.current = snd;
        setState("speaking");
        snd.onended = () => setState("completed");
        snd.play().catch(() => setState("completed"));
      }
    }
  };

  const resetState = () => {
    cancelRecording();
    setErrorMessage(null);
    setState("idle");
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-sm mx-auto w-full">
      {/* Microphone Trigger Circle */}
      <div className="relative flex items-center justify-center h-44 w-44 mb-6">
        <AnimatePresence>
          {state === "listening" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-accent/25"
            />
          )}
          {state === "speaking" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-primary/25"
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleMicClick}
          disabled={state === "uploading" || state === "transcribing" || state === "thinking"}
          className={`h-32 w-32 rounded-full flex items-center justify-center shadow-lg transition-all border duration-300 ${
            state === "listening"
              ? "bg-[#EA580C] text-white border-transparent"
              : state === "speaking"
              ? "bg-primary text-white border-transparent"
              : state === "error"
              ? "bg-red-500 text-white border-transparent"
              : "bg-white dark:bg-white/10 text-primary border-border-val hover:shadow-xl"
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {state === "idle" && <Mic size={40} className="stroke-[2]" />}
          {state === "listening" && <Square size={36} fill="currentColor" />}
          {state === "speaking" && <Volume2 size={40} className="animate-pulse" />}
          {state === "completed" && <Mic size={40} className="stroke-[2] opacity-80" />}
          {state === "error" && <AlertCircle size={40} />}
          {(state === "uploading" || state === "transcribing" || state === "thinking") && (
            <Loader2 size={40} className="animate-spin text-gray-400" />
          )}
        </motion.button>
      </div>

      {/* Dynamic Waveform & Helper Status Indicators */}
      <div className="w-full text-center h-16 flex flex-col items-center justify-center">
        {state === "idle" && (
          <p className="text-sm font-semibold text-gray-400">Tap to start speaking</p>
        )}
        {state === "listening" && (
          <div className="flex flex-col items-center gap-1.5 w-full">
            <Waveform isActive={true} color="bg-accent" />
            <p className="text-xs font-bold text-accent">Listening... {seconds}s</p>
            {/* Live Stop/Cancel row */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={cancelRecording}
                className="flex items-center gap-1 px-3 py-1 rounded-full border border-red-200/50 bg-red-50/20 text-red-500 text-[10px] font-bold hover:bg-red-50/40 transition-colors"
              >
                <X size={10} />
                <span>Cancel</span>
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-1 px-3 py-1 rounded-full border border-accent/25 bg-accent/10 text-accent text-[10px] font-bold hover:bg-accent/20 transition-colors"
              >
                <Square size={8} fill="currentColor" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        )}
        {state === "uploading" && (
          <p className="text-sm font-semibold text-gray-400 animate-pulse">Uploading audio payload...</p>
        )}
        {state === "transcribing" && (
          <p className="text-sm font-semibold text-primary animate-pulse">Transcribing regional speech...</p>
        )}
        {state === "thinking" && (
          <p className="text-sm font-semibold text-gray-400 animate-pulse">Vaani is processing...</p>
        )}
        {state === "speaking" && (
          <div className="flex flex-col items-center gap-1 w-full">
            <Waveform isActive={true} color="bg-primary" />
            <p className="text-xs font-bold text-primary">Speaking response</p>
          </div>
        )}
        {state === "completed" && (
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-green-500">Interaction Completed</p>
            <p className="text-[10px] text-gray-400 font-bold">Tap mic to speak again</p>
          </div>
        )}
        {state === "error" && (
          <div className="max-w-xs text-center">
            <p className="text-xs font-bold text-red-500 leading-normal">{errorMessage || "An error occurred during transcription."}</p>
          </div>
        )}
      </div>

      {/* State recovery buttons */}
      {state !== "idle" && (
        <button
          onClick={resetState}
          className="mt-6 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-primary transition-colors"
        >
          <RefreshCw size={10} />
          <span>Reset recorder</span>
        </button>
      )}
    </div>
  );
};
