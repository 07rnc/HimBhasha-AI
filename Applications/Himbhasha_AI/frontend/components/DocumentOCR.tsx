"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { api } from "../lib/api";

export const DocumentOCR: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [action, setAction] = useState<"summarize" | "translate" | "ask">("summarize");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ result: string; pages_processed: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
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

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-border-val rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={18} />
          </div>
          <h3 className="text-base font-bold text-apple-text">PaddleOCR Document Scanner</h3>
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-200/40">
          Sprint 4 Component
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

      {/* OCR Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Action Target</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
            className="w-full h-10 px-3 bg-white dark:bg-[#2C2C2E] border border-border-val rounded-xl text-xs font-medium text-apple-text focus:outline-none focus:border-primary"
          >
            <option value="summarize">Summarize Document</option>
            <option value="translate">Translate Extracted Text</option>
            <option value="ask">Ask Question about Document</option>
          </select>
        </div>

        {action === "ask" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Your Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What details are in this document?"
              className="w-full h-10 px-3 bg-white dark:bg-[#2C2C2E] border border-border-val rounded-xl text-xs font-medium text-apple-text focus:outline-none focus:border-primary"
            />
          </div>
        )}
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
            <span>Processing OCR Extraction...</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>Process Document with PaddleOCR</span>
          </>
        )}
      </button>

      {/* Result Presentation */}
      {result && (
        <div className="mt-4 p-4 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-apple-text">
            <span>OCR Extraction & Analysis Result</span>
            <span className="text-[10px] font-normal text-gray-400">Pages Processed: {result.pages_processed}</span>
          </div>
          <div className="text-xs text-apple-text/90 leading-relaxed whitespace-pre-wrap font-medium">
            {result.result}
          </div>
        </div>
      )}
    </div>
  );
};
