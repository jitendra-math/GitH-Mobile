"use client";

import { useState, useEffect } from "react";
import { X, Save, FileCode2 } from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import { encodeBase64 } from "@/lib/utils";

export default function CodeEditorModal() {
  const { editingFile, setEditingFile, addToQueue } = useEditStore();
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingFile) {
      setText(editingFile.content);
    }
  }, [editingFile]);

  if (!editingFile) return null;

  const handleSave = () => {
    setIsSaving(true);
    try {
      // Calculate size difference
      const newSize = new Blob([text]).size;
      const sizeDiff = newSize - editingFile.oldSize;
      
      const contentBase64 = encodeBase64(text);

      addToQueue({
        path: editingFile.path,
        sha: editingFile.sha,
        contentBase64,
        isDelete: false,
        sizeDiff,
      });

      setEditingFile(null); // Close modal
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-[#1A1A1A]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F1EC] rounded-xl sm:rounded-2xl w-full max-w-4xl shadow-2xl border border-[#d6d1c4] overflow-hidden flex flex-col h-full max-h-[95vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[rgba(181,172,138,0.25)] bg-white">
          <div className="flex items-center gap-2.5 overflow-hidden pr-4">
            <div className="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-[#6D001A]/10 text-[#6D001A]">
              <FileCode2 className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#1A1A1A] truncate font-mono">
              {editingFile.path}
            </h3>
          </div>
          <button 
            onClick={() => setEditingFile(null)} 
            disabled={isSaving} 
            className="text-[#8a8a8a] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg p-1 transition-all disabled:opacity-50 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-2 sm:p-3 overflow-hidden bg-[#1e1e1e]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSaving}
            wrap="off"
            spellCheck={false}
            className="w-full h-full bg-transparent text-[#d4d4d4] font-mono text-[13px] leading-relaxed resize-none outline-none custom-scrollbar p-2"
            placeholder="File content is empty..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-t border-[rgba(181,172,138,0.25)] bg-white">
          <span className="text-[11px] text-[#8a8a8a] hidden sm:inline-block font-mono">
            Size: {(new Blob([text]).size / 1024).toFixed(2)} KB
          </span>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setEditingFile(null)}
              disabled={isSaving}
              className="flex-1 sm:flex-none py-2 px-4 text-[13px] font-semibold text-[#4A4A4A] bg-[#F5F1EC] rounded-xl hover:bg-[#e6e0d4] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none py-2 px-6 flex items-center justify-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-br from-[#6D001A] to-[#8B0022] rounded-xl hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save to Queue"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
