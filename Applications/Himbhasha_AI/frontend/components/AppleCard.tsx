"use client";

import React from "react";
import { motion } from "framer-motion";

interface AppleCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const AppleCard: React.FC<AppleCardProps> = ({
  children,
  className = "",
  onClick,
  hoverEffect = true,
}) => {
  const hoverAnims = hoverEffect
    ? {
        whileHover: { y: -4, shadow: "0 20px 40px rgba(0,0,0,0.04)" },
        whileTap: { scale: 0.99 },
      }
    : {};

  return (
    <motion.div
      {...hoverAnims}
      onClick={onClick}
      className={`glass-panel rounded-3xl p-6 transition-shadow duration-300 ${
        onClick ? "cursor-pointer select-none" : ""
      } ${className}`}
      style={{
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)",
      }}
    >
      {children}
    </motion.div>
  );
};
