"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface RollbackPromptModalProps {
  isOpen: boolean;
  commitSha: string;
  commitMsg: string;
  onConfirm: (sha: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function RollbackPromptModal({ isOpen, commitSha, commitMsg, onConfirm, onCancel, loading }: RollbackPromptModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const shortSha = commitSha.substring(0, 7);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim().toLowerCase() !== shortSha.toLowerCase()) {
      setErrorMsg("Commit ID match nahi hui. Sahi ID type karein.");
      return;
    }
    setErrorMsg("");
    onConfirm(commitSha);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#1A1A1A]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#d6d1c4] overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-start justify-between p-4 border-b border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Danger Zone</h3>
          </div>
          <button onClick={onCancel} disabled={loading} className="text-[#8a8a8a] hover:text-[#1A1A1A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
            Aapka repository wapas is state par chala jayega:<br/>
            <span className="font-semibold text-[#1A1A1A] bg-black/5 px-1 py-0.5 rounded mt-1 inline-block break-all">"{commitMsg}"</span>
          </p>
          
          <div className="mt-2">
            <label className="text-[12px] font-semibold text-[#8a8a8a] mb-1.5 block">
              Confirm karne ke liye niche di gayi ID type karein:
            </label>
            <div className="text-[14px] font-mono font-bold text-[#1A1A1A] mb-2 px-3 py-2 bg-[#F5F1EC] rounded-lg border border-[#d6d1c4] text-center select-all">
              {shortSha}
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setErrorMsg(""); }}
              placeholder={shortSha}
              disabled={loading}
              className="w-full p-2.5 bg-white border border-[#d6d1c4] rounded-xl text-[13px] font-mono text-center outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all uppercase"
            />
            {errorMsg && <p className="text-[11px] text-[#ff3b30] mt-1.5 font-medium text-center">{errorMsg}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 p-4 pt-2 bg-gray-50/50">
          <button onClick={onCancel} disabled={loading} className="flex-1 py-2 text-[13px] font-semibold text-[#4A4A4A] bg-white border border-[#d6d1c4] rounded-xl hover:bg-[#F5F1EC] transition-all">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading} className="flex-1 py-2 text-[13px] font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-all shadow-sm disabled:opacity-50">
            {loading ? "Rolling back..." : "Confirm Rollback"}
          </button>
        </div>

      </div>
    </div>
  );
}
