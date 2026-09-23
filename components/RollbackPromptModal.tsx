"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface RollbackPromptModalProps {
  isOpen: boolean;
  commitSha: string;
  commitMsg: string;
  onConfirm: (sha: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function RollbackPromptModal({
  isOpen,
  commitSha,
  commitMsg,
  onConfirm,
  onCancel,
  loading,
}: RollbackPromptModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const shortSha = commitSha.substring(0, 7);

  const handleConfirm = () => {
    if (inputValue.trim().toLowerCase() !== shortSha.toLowerCase()) {
      setErrorMsg("Commit ID didn't match. Please check.");
      return;
    }
    setErrorMsg("");
    onConfirm(commitSha);
  };

  const handleCancel = () => {
    setInputValue("");
    setErrorMsg("");
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={loading ? undefined : handleCancel}
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
            {/* Content */}
            <div className="px-4 pt-5 pb-4 flex flex-col items-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3 bg-[#FF9500]/15">
                <AlertTriangle
                  className="w-6 h-6"
                  strokeWidth={2.2}
                  style={{ color: "#FF9500" }}
                />
              </div>

              <h3 className="text-[17px] font-semibold text-black leading-tight tracking-tight text-center">
                Confirm Rollback
              </h3>

              <p className="text-[13px] text-black/85 leading-snug mt-1.5 text-center">
                Your repository will revert to this commit:
              </p>

              <p className="text-[13px] text-black font-medium italic leading-snug mt-2 px-3 py-2 bg-white rounded-lg text-center break-words w-full">
                "{commitMsg}"
              </p>

              <p className="text-[12px] text-[#8E8E93] mt-3 text-center leading-snug">
                Type the commit ID below to confirm
              </p>

              <div className="mt-2 w-full px-3 py-2 bg-white rounded-lg text-[14px] font-mono font-semibold text-black tracking-[0.15em] text-center select-all">
                {shortSha}
              </div>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setErrorMsg("");
                }}
                placeholder={shortSha}
                disabled={loading}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="mt-2 w-full px-3 py-2.5 bg-white rounded-[10px] text-[14px] font-mono text-black tracking-[0.15em] text-center outline-none focus:ring-2 focus:ring-[#FF9500]/40 transition-all disabled:opacity-50"
              />

              {errorMsg && (
                <p className="text-[12px] text-[#FF3B30] mt-2 font-medium text-center">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Divider */}
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
                disabled={loading || !inputValue}
                className="flex-1 py-3 text-[17px] font-semibold text-[#FF9500] active:bg-black/5 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    Rolling
                  </>
                ) : (
                  "Rollback"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}