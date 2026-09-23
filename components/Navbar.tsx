"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, LogOut } from "lucide-react";
import { logoutUser } from "@/actions/github";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F2F2F7]/80 backdrop-blur-xl border-b border-[#C6C6C8]/40">
      <div className="flex h-12 items-center justify-between px-4 max-w-screen-md mx-auto w-full">
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-7 h-7 rounded-[7px] object-cover shrink-0"
          />
          <span className="text-[17px] font-semibold text-black tracking-tight truncate">
            GitHub Manager
          </span>
        </div>

        {/* Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#007AFF] active:bg-black/5 transition-colors"
            aria-label="Menu"
          >
            <MoreHorizontal className="w-[22px] h-[22px]" strokeWidth={2.5} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -6 }}
                transition={{ type: "spring", damping: 28, stiffness: 400 }}
                className="absolute right-0 mt-1.5 w-44 bg-[#F2F2F7]/95 backdrop-blur-xl rounded-[14px] shadow-2xl overflow-hidden origin-top-right"
              >
                <button
                  onClick={() => logoutUser()}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-[16px] text-[#FF3B30] active:bg-black/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2.2} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}