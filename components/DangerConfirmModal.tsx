"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type Variant = "warning" | "destructive";

interface DangerConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  highlight: string;
  highlightItalic?: boolean;
  instructionPrefix?: string;
  instructionSuffix?: string;
  expectedValue: string;
  placeholder?: string;
  caseSensitive?: boolean;
  variant?: Variant;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_COLOR: Record<Variant, string> = {
  warning: "#FF9500",
  destructive: "#FF3B30",
};

export default function DangerConfirmModal({
  isOpen,
  title,
  description,
  highlight,
  highlightItalic = false,
  instructionPrefix = "Type",
  instructionSuffix = "below to confirm",
  expectedValue,
  placeholder,
  caseSensitive = true,
  variant = "warning",
  confirmText = "Confirm",
  loading = false,
  onConfirm,
  onCancel,
}: DangerConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");
  const color = VARIANT_COLOR[variant];

  useEffect(() => {
    if (isOpen) setInputValue("");
  }, [isOpen]);

  const isMatch = caseSensitive
    ? inputValue.trim() === expectedValue
    : inputValue.trim().toLowerCase() === expectedValue.toLowerCase();

  const handleCancel = () => {
    if (loading) return;
    setInputValue("");
    onCancel();
  };

  const handleConfirm = () => {
    if (!isMatch || loading) return;
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleCancel}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[320px] bg-[#F2F2F7]/95 backdrop-blur-xl rounded-[14px] overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-5 pb-4 flex flex-col items-center">
              {/* Warning icon */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: `${color}1A` }}
              >
                <AlertTriangle
                  className="w-6 h-6"
                  strokeWidth={2.2}
                  style={{ color }}
                />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-semibold text-black leading-tight tracking-tight text-center">
                {title}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-black/85 leading-snug mt-1.5 text-center">
                {description}
              </p>

              {/* Highlight pill */}
              <p
                className={`mt-2 px-3 py-2 bg-white rounded-lg text-[13px] text-black text-center break-words w-full ${
                  highlightItalic ? "italic" : ""
                }`}
              >
                "{highlight}"
              </p>

              {/* Instruction with inline value */}
              <p className="text-[12px] text-[#8E8E93] mt-3 text-center leading-snug">
                {instructionPrefix}{" "}
                <span className="text-[#007AFF] font-mono font-medium break-all">
                  {expectedValue}
                </span>{" "}
                {instructionSuffix}
              </p>

              {/* Input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder || expectedValue}
                disabled={loading}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="mt-3 w-full px-3 py-2.5 bg-white rounded-[10px] text-[14px] font-mono text-black tracking-[0.15em] text-center outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition-all disabled:opacity-50"
              />
            </div>

            <div className="h-[0.5px] bg-[#3C3C43]/30" />

            {/* Buttons */}
            <div className="flex relative">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 text-[17px] text-[#007AFF] active:bg-black/5 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>

              <div className="w-[0.5px] bg-[#3C3C43]/30" />

              <button
                onClick={handleConfirm}
                disabled={loading || !isMatch}
                className="flex-1 py-3 text-[17px] font-semibold active:bg-black/5 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ color }}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeOpacity="0.25"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {confirmText}
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}