"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HelpSectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  children: React.ReactNode;
}

export default function HelpSection({
  id,
  icon: Icon,
  title,
  subtitle,
  defaultOpen = false,
  forceOpen = false,
  children,
}: HelpSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  return (
    <section
      id={id}
      className="bg-white rounded-2xl overflow-hidden scroll-mt-32"
    >
      {/* Header (clickable) */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.03] transition-colors"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <div className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 bg-[#007AFF] text-white">
          <Icon className="w-5 h-5" strokeWidth={2.3} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[17px] font-semibold text-black leading-tight tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13px] text-[#8E8E93] mt-0.5 leading-snug truncate">
              {subtitle}
            </p>
          )}
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[#8E8E93]" strokeWidth={2.4} />
        </motion.span>
      </button>

      {/* Content — animated height, always in DOM for SEO */}
      <motion.div
        id={`${id}-content`}
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-5 pt-4 border-t border-[#C6C6C8]/25">
          {children}
        </div>
      </motion.div>
    </section>
  );
}