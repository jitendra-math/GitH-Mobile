"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, ClipboardPaste, Trash2 } from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import { getPendingReviewFiles, encodeBase64 } from "@/lib/utils";
import AlertModal from "./AlertModal";

interface ReviewFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  treeData: any;
  setTreeData: (data: any) => void;
}

export default function ReviewFilesModal({
  isOpen,
  onClose,
  treeData,
  setTreeData,
}: ReviewFilesModalProps) {
  const { queue, addToQueue, setEditingFile } = useEditStore();
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error" as const,
  });

  const pendingFiles = getPendingReviewFiles(treeData, queue);

  const handleEdit = (file: any) => {
    // Open CodeEditorModal with empty content for the new file
    setEditingFile({
      path: file.path,
      sha: null,
      content: "", 
      oldSize: 0,
    });
    onClose();
  };

  const handleReplaceFromClipboard = async (file: any) => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setAlertConfig({ isOpen: true, message: "Clipboard is empty!", type: "error" });
        return;
      }
      
      const newSize = new Blob([text]).size;
      const contentBase64 = encodeBase64(text);
      
      addToQueue({
        path: file.path,
        sha: null,
        contentBase64,
        isDelete: false,
        sizeDiff: newSize,
      });

      // Automatically close if this was the last file
      if (pendingFiles.length === 1) onClose();
      
    } catch (err: any) {
      setAlertConfig({ isOpen: true, message: "Could not read clipboard. Please make sure you have granted permission.", type: "error" });
    }
  };

  const handleRemove = (file: any) => {
    // Since it's a dummy file, we just safely remove it from the UI treeData.
    const newTree = JSON.parse(JSON.stringify(treeData));
    const parts = file.path.split("/");
    let current = newTree;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) return;
      current = current[parts[i]];
    }
    
    delete current[parts[parts.length - 1]];
    setTreeData(newTree);

    if (pendingFiles.length === 1) onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-[500px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Grabber */}
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-9 h-[5px] rounded-full bg-black/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b border-[#C6C6C8]/40 shrink-0">
                <div>
                  <h2 className="text-[16px] font-semibold text-black tracking-tight">
                    Review New Files
                  </h2>
                  <p className="text-[12px] text-[#8E8E93]">
                    {pendingFiles.length} {pendingFiles.length === 1 ? "file needs" : "files need"} content
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              {/* Body List */}
              <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                {pendingFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[14px] text-[#8E8E93]">No pending files to review.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {pendingFiles.map((file: any) => (
                      <div key={file.path} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl shadow-sm">
                        
                        {/* File Name */}
                        <div className="flex items-center min-w-0 flex-1">
                          <span className="text-[13px] font-mono font-medium text-black truncate">
                            {file.path}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
                          
                          <button
                            onClick={() => handleReplaceFromClipboard(file)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#007AFF1F] text-[#007AFF] hover:bg-[#007AFF33] active:bg-[#007AFF40] transition-colors"
                            title="Paste content from clipboard"
                          >
                            <ClipboardPaste className="w-3.5 h-3.5" />
                            <span className="sm:hidden">Paste</span>
                          </button>

                          <button
                            onClick={() => handleEdit(file)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#34C7591F] text-[#34C759] hover:bg-[#34C75933] active:bg-[#34C75940] transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="sm:hidden">Edit</span>
                          </button>

                          <button
                            onClick={() => handleRemove(file)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#FF3B301F] text-[#FF3B30] hover:bg-[#FF3B3033] active:bg-[#FF3B3040] transition-colors"
                            title="Remove from tree"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertModal
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
}
