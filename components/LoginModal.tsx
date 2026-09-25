"use client";

import { motion, AnimatePresence } from "framer-motion";
import TokenForm from "./TokenForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[380px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl"
          >
            {/* Grabber (mobile) */}
            <div className="flex justify-center pt-2 pb-1 sm:hidden">
              <div className="w-9 h-[5px] rounded-full bg-black/20" />
            </div>

            {/* Content */}
            <div className="px-5 pt-3 pb-6 sm:pt-5 sm:pb-6">
              <h2 className="text-[24px] font-semibold text-black tracking-tight leading-tight">
                GitH Mobile
              </h2>
              <p className="text-[13px] text-[#8E8E93] mt-1 leading-snug">
                Sign in to continue
              </p>

              <div className="mt-5">
                <TokenForm />
              </div>

              <p className="text-[12px] text-[#8E8E93] text-center leading-snug mt-4">
                Your token is stored securely on your device.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}