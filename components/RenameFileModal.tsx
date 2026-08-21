"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import AlertModal from "./AlertModal";

interface RenameFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onSave: (newPath: string) => void;
}

export default function RenameFileModal({ isOpen, onClose, currentPath, onSave }: RenameFileModalProps) {
  const [newPath, setNewPath] = useState(currentPath);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "", type: "error" as const });

  useEffect(() => {
    if (isOpen) setNewPath(currentPath);
  }, [isOpen, currentPath]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Extension nikalne ka logic
    const getExt = (p: string) => {
      const parts = p.split('.');
      return parts.length > 1 ? parts.pop()?.toLowerCase() : '';
    };

    const oldExt = getExt(currentPath);
    const nextExt = getExt(newPath);

    if (oldExt !== nextExt) {
      setAlertConfig({
        isOpen: true,
        message: `Extension change not allowed! Your file must end with ${oldExt ? `.${oldExt}` : "no extension"}.`,
        type: "error"
      });
      return;
    }

    if (newPath.trim() === "") {
      setAlertConfig({ isOpen: true, message: "Path cannot be empty!", type: "error" });
      return;
    }

    onSave(newPath.trim());
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#d6d1c4] overflow-hidden">
          
          <div className="flex items-center justify-between p-4 border-b border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]">
            <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Edit File Path</h3>
            <button onClick={onClose} className="text-[#8a8a8a] hover:text-[#1A1A1A] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#8a8a8a]">Full Path</label>
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#d6d1c4] rounded-xl text-[13px] font-mono text-[#1A1A1A] outline-none focus:border-[#6D001A] focus:ring-1 focus:ring-[#6D001A] transition-all"
              placeholder="e.g. src/app/main.py"
            />
            <p className="text-[11px] text-[#8a8a8a] mt-1">Folders will be automatically created if they don't exist.</p>
          </div>

          <div className="flex items-center justify-end gap-2 p-4 pt-2">
            <button onClick={onClose} className="py-2 px-4 text-[13px] font-semibold text-[#4A4A4A] bg-[#F5F1EC] rounded-xl hover:bg-[#e6e0d4] transition-all">
              Cancel
            </button>
            <button onClick={handleSave} className="py-2 px-4 text-[13px] font-semibold text-white bg-gradient-to-br from-[#6D001A] to-[#8B0022] rounded-xl hover:-translate-y-px hover:shadow-md transition-all">
              Update Path
            </button>
          </div>

        </div>
      </div>

      {/* Reusing existing AlertModal for errors */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
}
