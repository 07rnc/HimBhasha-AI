"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (fileName: string, fileType: "pdf" | "image", contentBase64: string) => void;
  onClear: () => void;
  loading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onClear,
  loading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: "pdf" | "image" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    if (!isImage && !isPDF) {
      alert("Unsupported file format! Please upload a PDF or an Image.");
      return;
    }

    const type = isPDF ? "pdf" : "image";
    const sizeKB = (file.size / 1024).toFixed(1);
    setSelectedFile({ name: file.name, size: `${sizeKB} KB`, type });

    // Read file as base64 for API
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1] || "";
      onFileSelect(file.name, type, base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    onClear();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {!selectedFile ? (
        <motion.div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileBrowser}
          whileHover={{ scale: 0.995 }}
          className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 ${
            dragActive
              ? "border-accent bg-accent/5"
              : "border-border-val bg-white dark:bg-white/5 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-white/10"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <UploadCloud size={28} />
          </div>
          <h3 className="text-base font-bold text-apple-text mb-1">
            Upload document or image
          </h3>
          <p className="text-xs font-medium text-gray-400 text-center max-w-xs">
            Drag and drop your PDF or image here, or tap to browse your local files
          </p>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-[#1C1C1E] border border-border-val rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
              selectedFile.type === "pdf" ? "bg-red-50 dark:bg-red-950/20 text-red-500" : "bg-blue-50 dark:bg-blue-950/20 text-blue-500"
            }`}>
              {selectedFile.type === "pdf" ? <FileText size={22} /> : <ImageIcon size={22} />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-apple-text line-clamp-1 max-w-[200px] sm:max-w-xs">
                {selectedFile.name}
              </h4>
              <p className="text-xs font-semibold text-gray-400">
                {selectedFile.type.toUpperCase()} • {selectedFile.size}
              </p>
            </div>
          </div>

          <button
            onClick={clearFile}
            disabled={loading}
            className="h-8 w-8 rounded-full bg-soft-gray hover:opacity-85 flex items-center justify-center text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
