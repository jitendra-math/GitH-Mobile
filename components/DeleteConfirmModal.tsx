"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  repoName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  repoName,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#d6d1c4] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff3b30]/10 text-[#ff3b30]">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Delete Repository</h3>
          </div>
          <button 
            onClick={onCancel}
            disabled={loading}
            className="text-[#8a8a8a] hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-[#1A1A1A]">{repoName}</span>? This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 p-4 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 text-[13px] font-semibold text-[#4A4A4A] bg-white border border-[#d6d1c4] rounded-xl hover:bg-[#F5F1EC] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 text-[13px] font-semibold text-white bg-gradient-to-br from-[#ff3b30] to-[#ff453a] rounded-xl hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}
