"use client";

import { Info, X } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: "info" | "success" | "error";
}

export default function AlertModal({ isOpen, message, onClose, type = "info" }: AlertModalProps) {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case "success": return "text-[#34c759] bg-[#34c759]/10";
      case "error": return "text-[#ff3b30] bg-[#ff3b30]/10";
      default: return "text-[#6D001A] bg-[#6D001A]/10";
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[320px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#d6d1c4] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 flex items-center justify-center rounded-full ${getIconColor()}`}>
            <Info className="w-6 h-6 stroke-[2.5]" />
          </div>
          <p className="text-[14px] text-[#1A1A1A] font-medium leading-relaxed">{message}</p>
        </div>
        <div className="p-4 pt-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-[14px] font-semibold text-[#4A4A4A] bg-[#F5F1EC] rounded-xl hover:bg-[#e6e0d4] transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
