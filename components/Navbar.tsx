"use client";

import { LogOut } from "lucide-react";
import { logoutUser } from "@/actions/github";

export default function Navbar() {
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

        {/* Direct Logout Button */}
        <button
          onClick={() => logoutUser()}
          className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] text-[13px] font-semibold transition-colors active:bg-[#FF3B30]/20 shrink-0"
          aria-label="Logout"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={2.4} />
          Logout
        </button>
      </div>
    </header>
  );
}