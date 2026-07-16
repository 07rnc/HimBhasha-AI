"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Sparkles, HelpCircle, Activity, ChevronRight, CornerDownRight } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { FileUpload } from "../../components/FileUpload";
import { AppleCard } from "../../components/AppleCard";
import { DocumentService } from "../../services/document_service";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentUnderstanding() {
  const router = useRouter();
  const [fileData, setFileData] = useState<{ name: string; type: "pdf" | "image"; base64: string } | null>(null);
  const [action, setAction] = useState<"summarize" | "translate" | "ask">("summarize");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileSelect = (name: string, type: "pdf" | "image", base64: string) => {
    setFileData({ name, type, base64 });
    setResult(null);
    setLogs([]);
  };

  const handleClearFile = () => {
    setFileData(null);
    setResult(null);
    setLogs([]);
  };

  const simulateLogs = (callback: () => void) => {
    setLogs(["Initializing document reader...", "Running PaddleOCR text extraction..."]);
    
    setTimeout(() => {
      setLogs((prev) => [...prev, "Formatting extracted tokens...", "Querying HIMCorpus context guidelines..."]);
    }, 8000);

    setTimeout(() => {
      setLogs((prev) => [...prev, "Generating final output with Gemini API..."]);
      callback();
    }, 1800);
  };

  const runDocumentAction = async (selectedAction: "summarize" | "translate" | "ask") => {
    if (!fileData || loading) return;
    setLoading(true);
    setResult(null);
    setLogs([]);

    const apiCall = () => {
      DocumentService.processDocument(fileData.name, fileData.type, fileData.base64, selectedAction, selectedAction === "ask" ? question : undefined)
        .then((res) => {
          setResult(res.result);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setResult("Failed to process document. Please try again.");
          setLoading(false);
        });
    };

    simulateLogs(apiCall);
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
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Document OCR Workspace</h2>
        </div>

        {/* Upload Interface */}
        <div className="mb-8">
          <FileUpload
            onFileSelect={handleFileSelect}
            onClear={handleClearFile}
            loading={loading}
          />
        </div>

        {/* Actions selector panel (visible only when file uploaded) */}
        {fileData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => { setAction("summarize"); runDocumentAction("summarize"); }}
                disabled={loading}
                className={`h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  action === "summarize"
                    ? "bg-primary text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-[#1C1C1E] text-gray-500 border-border-val hover:border-gray-200 dark:hover:border-white/10"
                }`}
              >
                <Sparkles size={14} />
                <span>Summarize</span>
              </button>
              
              <button
                onClick={() => { setAction("translate"); runDocumentAction("translate"); }}
                disabled={loading}
                className={`h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  action === "translate"
                    ? "bg-primary text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-[#1C1C1E] text-gray-500 border-border-val hover:border-gray-200 dark:hover:border-white/10"
                }`}
              >
                <FileText size={14} />
                <span>Translate to Kangdi</span>
              </button>
              
              <button
                onClick={() => setAction("ask")}
                disabled={loading}
                className={`h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  action === "ask"
                    ? "bg-primary text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-[#1C1C1E] text-gray-500 border-border-val hover:border-gray-200 dark:hover:border-white/10"
                }`}
              >
                <HelpCircle size={14} />
                <span>Ask Questions</span>
              </button>
            </div>

            {/* Q&A input form */}
            {action === "ask" && (
              <AppleCard className="bg-white dark:bg-[#1C1C1E] border border-border-val p-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                    placeholder="Ask a question about the document (e.g., 'What schemes are mentioned?')..."
                    className="flex-grow h-11 px-4 bg-soft-gray border border-border-val rounded-xl text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button
                    onClick={() => runDocumentAction("ask")}
                    disabled={!question.trim() || loading}
                    className="h-11 px-5 rounded-xl bg-primary text-white text-xs font-bold disabled:bg-soft-gray disabled:text-gray-400 transition-colors"
                  >
                    Ask
                  </button>
                </div>
              </AppleCard>
            )}

            {/* Processing and result status panel */}
            <div className="min-h-[160px] relative">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-panel rounded-3xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity size={16} className="text-primary animate-pulse" />
                      <h4 className="text-xs font-bold text-apple-text">Processing Document...</h4>
                    </div>
                    {/* Log details */}
                    <div className="space-y-1.5 text-[10px] font-semibold text-gray-400 font-mono">
                      {logs.map((log, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <ChevronRight size={10} />
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                    {/* Skeleton loader bars */}
                    <div className="space-y-2 mt-2">
                      <div className="h-3 w-full shimmer-loader rounded-full" />
                      <div className="h-3 w-[85%] shimmer-loader rounded-full" />
                      <div className="h-3 w-[60%] shimmer-loader rounded-full" />
                    </div>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#1C1C1E] border border-border-val rounded-3xl p-6 shadow-sm"
                  >
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border-val pb-2 mb-4 flex items-center gap-1">
                      <Sparkles size={14} />
                      <span>{action === "summarize" ? "Summary Analysis" : action === "translate" ? "Kangdi Translation" : "Answer Response"}</span>
                    </h3>
                    
                    <p className="text-sm font-semibold text-apple-text leading-relaxed whitespace-pre-wrap">
                      {result}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
