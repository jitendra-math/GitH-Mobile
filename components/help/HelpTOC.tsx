"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { HelpSectionData } from "./HelpPage";

interface HelpTOCProps {
  sections: HelpSectionData[];
  query: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function HelpTOC({
  sections,
  query,
  isMobile = false,
  isOpen = false,
  onClose,
}: HelpTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  const matches = (s: HelpSectionData) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.subtitle?.toLowerCase().includes(q) ?? false) ||
      s.id.toLowerCase().includes(q)
    );
  };

  const visibleSections = sections.filter(matches);

  // Scroll spy — desktop only
  useEffect(() => {
    if (isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, isMobile]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
    onClose?.();
  };

  const tocContent = (
    <nav className="flex flex-col gap-0.5">
      <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider px-2 mb-2">
        Sections
      </p>
      {visibleSections.length === 0 ? (
        <p className="text-[13px] text-[#8E8E93] px-2 py-3">
          No matching sections
        </p>
      ) : (
        visibleSections.map((s) => {
          const isActive = activeId === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => handleClick(s.id)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-[#007AFF]/10 text-[#007AFF]"
                  : "text-[#4A4A4A] active:bg-black/[0.05]"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#007AFF]" : "text-[#8E8E93]"
                }`}
                strokeWidth={2.3}
              />
              <span className="text-[13px] font-medium truncate">
                {s.title}
              </span>
            </button>
          );
        })
      )}
    </nav>
  );

  // Desktop — sticky sidebar
  if (!isMobile) {
    return (
      <div className="sticky top-4 max-h-[calc(100vh-32px)] overflow-y-auto custom-scrollbar pr-1">
        {tocContent}
      </div>
    );
  }

  // Mobile — slide-in drawer
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed top-0 left-0 bottom-0 z-[101] w-[280px] bg-[#F2F2F7] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b border-[#C6C6C8]/40 shrink-0 pt-safe">
              <h2 className="text-[17px] font-semibold text-black">
                Contents
              </h2>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 pb-safe custom-scrollbar">
              {tocContent}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}