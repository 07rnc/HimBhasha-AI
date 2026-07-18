"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, MessageSquare, Send, HelpCircle, History } from "lucide-react";
import { api } from "../lib/api";

const PRESET_QUESTIONS = [
  "Summarize this document.",
  "Who is eligible?",
  "What are the benefits?",
  "What documents are required?",
  "Translate this paragraph.",
];

interface QAItem {
  question: string;
  answer: string;
  matched_section?: string;
  confidence?: number;
  timestamp: string;
}

export const DocumentOCR: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [action, setAction] = useState<"summarize" | "translate" | "ask">("summarize");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([
    "Who is eligible?",
    "What are the benefits?",
    "What documents are required?"
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
      setQaHistory([]);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please select an image or PDF file to process.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = reader.result as string;
        const fileType = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "image";

        try {
          const res = await api.document(
            file.name,
            fileType,
            base64Content,
            action,
            action === "ask" ? question : undefined
          );
          setResult(res);
        } catch (err: any) {
          console.error("Document OCR error:", err);
          setError("Failed to extract text from document. Ensure backend is running.");
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setLoading(false);
      };
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred while reading the file.");
      setLoading(false);
    }
  };

  const handleAskQuestion = async (qText?: string) => {
    const textToAsk = qText || question;
    if (!textToAsk.trim() || !result || qaLoading) return;

    setQaLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/document/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToAsk,
          doc_data: result
        })
      });

      if (res.ok) {
        const data = await res.json();
        const newItem: QAItem = {
          question: textToAsk,
          answer: data.answer || "No answer generated.",
          matched_section: data.matched_section || "Document Text",
          confidence: data.confidence || 94,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setQaHistory((prev) => [newItem, ...prev].slice(0, 10));
        if (data.related_questions && data.related_questions.length > 0) {
          setRelatedQuestions(data.related_questions);
        }
        setQuestion("");
      }
    } catch (e) {
      console.error("QA error:", e);
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-border-val rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={18} />
          </div>
          <h3 className="text-base font-bold text-apple-text">Offline Document Reader</h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-200/40">
          🟢 Offline Reader Active
        </span>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border-val rounded-2xl p-6 text-center hover:border-primary/50 transition-colors bg-soft-gray/30 dark:bg-white/5">
        <input
          type="file"
          id="ocr-file-input"
          accept="image/png, image/jpeg, image/jpg, application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="ocr-file-input" className="cursor-pointer flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Upload size={20} />
          </div>
          {file ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-apple-text">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>{file.name}</span>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-apple-text">Click or drag file to upload</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, JPEG, or PDF documents</p>
            </div>
          )}
        </label>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/10 border border-rose-200/30 text-rose-800 dark:text-rose-200 text-xs rounded-xl font-medium">
          <AlertCircle size={16} className="text-soft-red flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleProcess}
        disabled={!file || loading}
        className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Scanning Document with Offline Reader...</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>Scan & Analyze Document</span>
          </>
        )}
      </button>

      {/* Result Presentation */}
      {result && (
        <div className="space-y-6 pt-2">
          {/* Summary Card */}
          <div className="p-4 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-apple-text">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px]">
                  {result.document_type || "Document"}
                </span>
                <span>{result.title || "Document Overview"}</span>
              </div>
              <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                Confidence {result.confidence}%
              </span>
            </div>
            
            <p className="text-xs text-apple-text/90 leading-relaxed whitespace-pre-wrap font-medium pt-1">
              {result.summary || result.result}
            </p>
          </div>

          {/* Ask this Document Panel */}
          <div className="border border-border-val rounded-2xl p-4 bg-white dark:bg-[#2C2C2E] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" />
                <h4 className="text-xs font-bold text-apple-text">Ask this Document</h4>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Offline QA Engine</span>
            </div>

            {/* Quick Example Question Chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUESTIONS.map((pq, i) => (
                <button
                  key={i}
                  onClick={() => handleAskQuestion(pq)}
                  className="px-2.5 py-1 rounded-lg bg-soft-gray border border-border-val text-[11px] font-medium text-apple-text hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {pq}
                </button>
              ))}
            </div>

            {/* Question Input Box */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                placeholder="Ask any question about this document..."
                className="flex-grow h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-medium text-apple-text focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => handleAskQuestion()}
                disabled={!question.trim() || qaLoading}
                className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {qaLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Ask</span>
              </button>
            </div>

            {/* Related Question Suggestions */}
            {relatedQuestions.length > 0 && (
              <div className="pt-2 border-t border-border-val">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suggested Questions:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {relatedQuestions.map((rq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(rq)}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 text-[10px] font-semibold hover:bg-blue-100"
                    >
                      {rq}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QA Conversation History List */}
            {qaHistory.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-border-val">
                <div className="flex items-center gap-1.5 text-xs font-bold text-apple-text">
                  <History size={14} />
                  <span>Question History ({qaHistory.length})</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {qaHistory.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-soft-gray/40 dark:bg-white/5 border border-border-val space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-primary">
                        <span>Q: {item.question}</span>
                        <span className="text-[9px] text-gray-400 font-normal">{item.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium text-apple-text/90 leading-relaxed whitespace-pre-wrap">
                        {item.answer}
                      </p>
                      {item.matched_section && (
                        <div className="text-[9px] font-semibold text-gray-400 pt-0.5">
                          Section: {item.matched_section} • Confidence {item.confidence}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
