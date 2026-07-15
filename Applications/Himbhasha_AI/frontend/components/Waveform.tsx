"use client";

import React from "react";
import { motion } from "framer-motion";

interface WaveformProps {
  isActive: boolean;
  color?: string;
  count?: number;
}

export const Waveform: React.FC<WaveformProps> = ({
  isActive,
  color = "bg-primary",
  count = 9,
}) => {
  const bars = Array.from({ length: count });

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 w-full">
      {bars.map((_, i) => {
        // Generate different heights for the wave pattern
        const baseHeight = 6 + (i % 3) * 6; // static height
        const activeDuration = 0.5 + (i % 4) * 0.15;
        const activeDelay = i * 0.05;

        return (
          <motion.div
            key={i}
            initial={{ height: baseHeight }}
            animate={
              isActive
                ? {
                    height: [baseHeight, 32 + (i % 3) * 8, baseHeight],
                  }
                : {
                    height: baseHeight,
                  }
            }
            transition={
              isActive
                ? {
                    duration: activeDuration,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: activeDelay,
                    ease: "easeInOut",
                  }
                : {
                    duration: 0.3,
                  }
            }
            className={`w-1 rounded-full opacity-80 ${color}`}
          />
        );
      })}
    </div>
  );
};
