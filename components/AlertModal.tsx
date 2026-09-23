"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

type AlertType = "info" | "success" | "error" | "warning";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: AlertType;
  title?: string;
}

const ICON_MAP = {
  info: { Icon: Info, color: "#007AFF" },
  success: { Icon: CheckCircle2, color: "#34C759" },
  error: { Icon: XCircle, color: "#FF3B30" },
  warning: { Icon: AlertTriangle, color: "#FF9500" },
} as const;

export default function AlertModal({
  isOpen,
  message,
  onClose,
  type = "info",
  title,
}: AlertModalProps) {
  const { Icon, color } = ICON_MAP[type];
  const showIcon = type !== "info" || !!title;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[280px] bg-[#F2F2F7]/95 backdrop-blur-xl rounded-[14px] overflow-hidden shadow-2xl"
          >
            {/* Content Block */}
            <div className="px-4 pt-5 pb-4 text-center flex flex-col items-center">
              {showIcon && (
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${color}1A` }}
                >
                  <Icon
                    className="w-6 h-6"
                    strokeWidth={2.2}
                    style={{ color }}
                  />
                </div>
              )}

              {title ? (
                <>
                  <h3 className="text-[17px] font-semibold text-black leading-tight tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[13px] text-black/85 leading-snug mt-1.5 whitespace-pre-line">
                    {message}
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-black font-medium leading-snug whitespace-pre-line">
                  {message}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-[0.5px] bg-[#3C3C43]/30" />

            {/* OK Button */}
            <button
              onClick={onClose}
              className="w-full py-3 text-[17px] font-semibold text-[#007AFF] active:bg-black/5 transition-colors"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}