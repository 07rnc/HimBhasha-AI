"use client";

import React from "react";
import { motion } from "framer-motion";
import { useApp } from "../app/context/AppContext";

interface ChatBubbleProps {
  sender: "user" | "vaani";
  text: string;
  timestamp: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  timestamp,
}) => {
  const { fontSize } = useApp();
  const isUser = sender === "user";

  const sizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4 w-full`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {isUser ? "You" : "Vaani"}
        </span>
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-[#E5E7EB] text-apple-text rounded-tr-none"
            : "bg-primary text-white rounded-tl-none border border-primary/20"
        } ${sizeClasses[fontSize]}`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>

      <span className="text-[9px] font-semibold text-gray-400 mt-1 px-1">
        {timestamp}
      </span>
    </motion.div>
  );
};
