"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../app/context/AppContext";
import { Settings, Info, Home, ShieldCheck, ShieldAlert } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { apiStatus } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-t-0 border-x-0 rounded-none bg-opacity-70">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
          <span className="text-xl font-extrabold tracking-tight text-primary flex items-center gap-1.5">
            🏔️ HimBhasha <span className="text-accent font-black">AI</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === "/" ? "text-primary" : "text-gray-500 hover:text-primary"
            }`}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === "/about" ? "text-primary" : "text-gray-500 hover:text-primary"
            }`}
          >
            <Info size={16} />
            <span>About</span>
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === "/settings" ? "text-primary" : "text-gray-500 hover:text-primary"
            }`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>

          {/* Health Status Indicator */}
          <div className="h-6 w-px bg-border-val" />
          <div className="flex items-center gap-2" title={`Server status: ${apiStatus}`}>
            {apiStatus === "online" && (
              <span className="flex items-center gap-1 text-xs font-semibold text-leaf-green">
                <ShieldCheck size={14} />
                <span className="hidden sm:inline">Vaani Active</span>
              </span>
            )}
            {apiStatus === "checking" && (
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
            )}
            {apiStatus === "offline" && (
              <span className="flex items-center gap-1 text-xs font-semibold text-soft-red">
                <ShieldAlert size={14} />
                <span className="hidden sm:inline">Offline Mode</span>
              </span>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
