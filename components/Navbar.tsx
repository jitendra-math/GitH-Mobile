"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical, LogOut } from "lucide-react";
import { logoutUser } from "@/actions/github";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 max-w-screen-md mx-auto w-full">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.png" 
            alt="Brand Logo" 
            className="w-6 h-6 object-cover rounded-sm"
          />
          <span className="font-bold text-gray-900 tracking-tight">GitHub Manager</span>
        </div>
        
        {/* Actions (Kebab Menu) */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Popup */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-1">
                <button
                  onClick={() => logoutUser()}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
