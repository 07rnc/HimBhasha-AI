"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, HeartHandshake, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

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
        <nav className="flex items-center gap-5">
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
            href="/contribute"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === "/contribute" ? "text-primary" : "text-gray-500 hover:text-primary"
            }`}
          >
            <HeartHandshake size={16} />
            <span>Contribute</span>
          </Link>

          <Link
            href="/admin/contributions"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname.startsWith("/admin") ? "text-primary" : "text-gray-500 hover:text-primary"
            }`}
          >
            <ShieldCheck size={16} />
            <span>Moderation</span>
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

          {/* Health Status Indicator */}
          <div className="h-6 w-px bg-border-val hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🟢 Offline Engine</span>
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
};
