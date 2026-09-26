"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface HelpCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function HelpCodeBlock({
  code,
  language,
  filename,
}: HelpCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Silent fail
    }
  };

  const label = filename || language || "code";

  return (
    <div className="rounded-xl overflow-hidden bg-[#1C1C1E] mt-3">
      {/* Header with copy button */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-[#2C2C2E]">
        <span className="text-[11px] font-mono text-[#8E8E93] truncate">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="w-6 h-6 flex items-center justify-center rounded-md text-[#8E8E93] active:bg-white/10 transition-colors shrink-0"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#34C759]" strokeWidth={2.5} />
          ) : (
            <Copy className="w-3.5 h-3.5" strokeWidth={2.3} />
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="px-3 py-3 text-[12.5px] font-mono text-[#F2F2F7] leading-relaxed overflow-x-auto custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
}