"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={loading ? undefined : onCancel}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[280px] bg-[#F2F2F7]/95 backdrop-blur-xl rounded-[14px] overflow-hidden shadow-2xl"
          >
            {/* Text */}
            <div className="px-4 pt-5 pb-4 text-center">
              <h3 className="text-[17px] font-semibold text-black leading-tight tracking-tight">
                {title}
              </h3>
              <p className="text-[13px] text-black/85 leading-snug mt-1.5 break-words">
                {message}
              </p>
            </div>

            <div className="h-[0.5px] bg-[#3C3C43]/30" />

            {/* Buttons */}
            <div className="flex relative">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-3 text-[17px] text-[#007AFF] active:bg-black/5 transition-colors disabled:opacity-40"
              >
                {cancelText}
              </button>

              <div className="w-[0.5px] bg-[#3C3C43]/30" />

              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-3 text-[17px] font-semibold active:bg-black/5 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 ${
                  isDestructive ? "text-[#FF3B30]" : "text-[#007AFF]"
                }`}
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