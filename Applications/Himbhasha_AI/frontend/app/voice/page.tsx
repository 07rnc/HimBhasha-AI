"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Sparkles, Volume2, User, Mic, Play, Pause, 
  RotateCcw, VolumeX, Download, History, Trash2, Copy, Check 
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { VoiceRecorder } from "../../components/VoiceRecorder";
import { AppleCard } from "../../components/AppleCard";
import { VoiceService } from "../../services/voice_service";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryItem {
  id: string;
  transcription: string;
  response: string;
  confidence?: number;
  timestamp: string;
}

export default function VoiceAssistant() {
  const router = useRouter();
  const [transcription, setTranscription] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [copied, setCopied] = useState(false);

  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("himbhasha_voice_history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse voice session logs.", e);
      }
    }
  }, []);

  // Cleanup audio playback on unmount
  useEffect(() => {
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }
    };
  }, []);

  const handleVoiceComplete = (trans: string, resp: string, audioBase64: string, conf?: number) => {
    setTranscription(trans);
    setResponse(resp);
    setConfidence(conf || null);
    
    const dataUrl = `data:audio/wav;base64,${audioBase64}`;
    setAudioUrl(dataUrl);

    // Stop current playing instance if any
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
    }
    setIsPlaying(true);

    const snd = new Audio(dataUrl);
    audioInstanceRef.current = snd;
    snd.volume = isMuted ? 0 : volume;
    snd.onended = () => {
      setIsPlaying(false);
      audioInstanceRef.current = null;
    };
    snd.play().catch(e => {
      console.warn("Autoplay blocked: ", e);
      setIsPlaying(false);
    });

    // Save item in local storage session logs
    const newItem: HistoryItem = {
      id: Math.random().toString(),
      transcription: trans,
      response: resp,
      confidence: conf,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("himbhasha_voice_history", JSON.stringify(updated));
  };

  const handlePlayPause = () => {
    if (!audioUrl) return;
    
    if (audioInstanceRef.current) {
      if (isPlaying) {
        audioInstanceRef.current.pause();
        setIsPlaying(false);
      } else {
        audioInstanceRef.current.play().catch(e => console.warn(e));
        setIsPlaying(true);
      }
    } else {
      const audio = new Audio(audioUrl);
      audioInstanceRef.current = audio;
      audio.volume = isMuted ? 0 : volume;
      audio.onended = () => {
        setIsPlaying(false);
        audioInstanceRef.current = null;
      };
      audio.play().catch(e => console.warn(e));
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (!audioUrl) return;
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioInstanceRef.current = audio;
    audio.volume = isMuted ? 0 : volume;
    audio.onended = () => {
      setIsPlaying(false);
      audioInstanceRef.current = null;
    };
    audio.play().catch(e => console.warn(e));
    setIsPlaying(true);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioInstanceRef.current) {
      audioInstanceRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioInstanceRef.current) {
      audioInstanceRef.current.volume = isMuted ? 0 : val;
    }
  };

  const copyTranscript = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearTranscript = () => {
    setTranscription(null);
    setResponse(null);
    setAudioUrl(null);
    setConfidence(null);
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
    }
    setIsPlaying(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("himbhasha_voice_history");
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
        <AppleCard className="bg-white dark:bg-[#1C1C1E] p-8 flex flex-col items-center justify-center min-h-[42vh] text-center mb-6" hoverEffect={false}>
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
              className="space-y-6 mb-8"
            >
              {/* Dialogue exchange card */}
              <AppleCard className="bg-white dark:bg-[#1C1C1E] border border-border-val p-6 flex flex-col gap-5" hoverEffect={false}>
                {/* Transcription (User speech) */}
                <div className="flex items-start justify-between border-b border-border-val pb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-soft-gray dark:bg-white/10 flex items-center justify-center text-gray-500">
                      <User size={16} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">What you said</span>
                        {confidence !== null && (
                          <span className="text-[8px] font-bold bg-green-100/80 dark:bg-green-950/40 text-green-600 px-1.5 py-0.5 rounded">
                            {(confidence * 100).toFixed(1)}% confidence
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-apple-text mt-0.5">{transcription}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyTranscript}
                      className="h-8 w-8 rounded-full border border-border-val text-gray-400 hover:text-primary flex items-center justify-center transition-colors"
                      title="Copy transcript"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={clearTranscript}
                      className="h-8 w-8 rounded-full border border-border-val text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                      title="Clear transcript"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Response (Vaani speech) */}
                <div className="flex items-start justify-between gap-3 pb-2 border-b border-border-val">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Sparkles size={16} />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Vaani Response</span>
                      <p className="text-sm font-bold text-primary leading-relaxed mt-0.5">{response}</p>
                    </div>
                  </div>
                </div>

                {/* Audio controls row */}
                {audioUrl && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-2.5">
                      {/* Play/Pause */}
                      <button
                        onClick={handlePlayPause}
                        className="h-8 w-8 rounded-full bg-primary text-white hover:bg-primary-hover flex items-center justify-center transition-colors shadow-sm"
                        title={isPlaying ? "Pause audio" : "Play audio"}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </button>
                      
                      {/* Replay */}
                      <button
                        onClick={handleReplay}
                        className="h-8 w-8 rounded-full border border-border-val text-gray-500 hover:text-primary flex items-center justify-center transition-colors"
                        title="Replay audio"
                      >
                        <RotateCcw size={14} />
                      </button>

                      {/* Mute Toggle */}
                      <button
                        onClick={handleMuteToggle}
                        className="h-8 w-8 rounded-full border border-border-val text-gray-500 hover:text-primary flex items-center justify-center transition-colors"
                        title={isMuted ? "Unmute audio" : "Mute audio"}
                      >
                        {isMuted ? <VolumeX size={14} className="text-red-500" /> : <Volume2 size={14} />}
                      </button>

                      {/* Volume Slider */}
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 accent-primary bg-soft-gray dark:bg-white/10 h-1 rounded-lg cursor-pointer"
                        title="Volume level"
                      />
                    </div>

                    {/* Download link */}
                    <a
                      href={audioUrl}
                      download="vaani_response.wav"
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors bg-soft-gray dark:bg-white/10 px-3.5 py-1.5 rounded-full border border-border-val"
                      title="Download synthesized response audio file"
                    >
                      <Download size={13} />
                      <span>Download Audio</span>
                    </a>
                  </div>
                )}
              </AppleCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Local Session history logs */}
        {history.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between border-b border-border-val pb-3 mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <History size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Session Voice Log History</h3>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                title="Clear local logs"
              >
                <Trash2 size={12} />
                <span>Clear History</span>
              </button>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/45 dark:bg-[#1C1C1E]/40 border border-border-val/50 rounded-2xl p-4 flex flex-col gap-2.5 hover:bg-white/70 dark:hover:bg-[#1C1C1E]/60 transition-colors text-left"
                >
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      <span>Speech Interaction</span>
                    </span>
                    <span>{item.timestamp}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-bold text-gray-400 min-w-[32px]">You:</span>
                      <p className="text-xs font-bold text-apple-text">{item.transcription}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-bold text-primary min-w-[32px]">Vaani:</span>
                      <p className="text-xs font-bold text-primary leading-relaxed">{item.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
