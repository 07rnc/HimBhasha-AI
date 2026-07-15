"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const typeConfig = {
    success: {
      bg: "bg-emerald-50 border-emerald-100",
      text: "text-emerald-800",
      icon: <CheckCircle2 size={18} className="text-emerald-500" />,
    },
    error: {
      bg: "bg-rose-50 border-rose-100",
      text: "text-rose-800",
      icon: <XCircle size={18} className="text-rose-500" />,
    },
    warning: {
      bg: "bg-amber-50 border-amber-100",
      text: "text-amber-800",
      icon: <AlertTriangle size={18} className="text-amber-500" />,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg ${typeConfig[type].bg}`}
          >
            <div className="flex-shrink-0 mt-0.5">{typeConfig[type].icon}</div>
            
            <div className="flex-grow">
              <p className={`text-sm font-semibold leading-relaxed ${typeConfig[type].text}`}>
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
