"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Trash2 } from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import { fileToBase64 } from "@/lib/utils";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UploadFileItem = {
  id: string;
  file: File;
  baseName: string;
  extension: string;
  size: number;
};

export default function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const { addToQueue } = useEditStore();
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSelectedFiles = (selectedFiles: FileList | File[]) => {
    const newItems: UploadFileItem[] = Array.from(selectedFiles).map((file) => {
      const lastDotIndex = file.name.lastIndexOf(".");
      const hasExtension = lastDotIndex !== -1 && lastDotIndex !== 0;

      const baseName = hasExtension ? file.name.substring(0, lastDotIndex) : file.name;
      const extension = hasExtension ? file.name.substring(lastDotIndex) : "";

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        baseName,
        extension,
        size: file.size,
      };
    });
    setFiles((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleNameChange = (id: string, newName: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, baseName: newName } : f)));
  };

  const handleAddToQueue = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      for (const item of files) {
        const base64Data = await fileToBase64(item.file);
        const finalPath = `${item.baseName}${item.extension}`;

        addToQueue({
          path: finalPath,
          sha: null,
          contentBase64: base64Data,
          isDelete: false,
          sizeDiff: item.size,
        });
      }

      setFiles([]);
      onClose();
    } catch (err) {
      alert("Error processing files!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setFiles([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[520px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Grabber */}
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <div className="w-9 h-[5px] rounded-full bg-black/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-3">
              <h2 className="text-[16px] font-semibold text-black tracking-tight">
                Upload Files
              </h2>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors disabled:opacity-40"
                aria-label="Close"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4 custom-scrollbar">
              {/* Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed ${
                  isDragging
                    ? "border-[#007AFF] bg-[#007AFF]/5"
                    : "border-[#C6C6C8] bg-white active:bg-[#F2F2F7]"
                }`}
              >
                <UploadCloud
                  className={`w-10 h-10 mb-3 transition-colors ${
                    isDragging ? "text-[#007AFF]" : "text-[#8E8E93]"
                  }`}
                  strokeWidth={1.8}
                />
                <p className="text-[15px] font-semibold text-black text-center">
                  Tap to browse or drag files
                </p>
                <p className="text-[12px] text-[#8E8E93] mt-1 text-center">
                  Multiple files supported. Folders can be typed below.
                </p>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) processSelectedFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-[12px] font-semibold text-[#8E8E93] px-1 uppercase tracking-wider">
                    Selected Files ({files.length})
                  </h4>

                  <div className="flex flex-col gap-2">
                    {files.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 bg-white rounded-2xl"
                      >
                        <div className="flex flex-1 items-center bg-[#F2F2F7] rounded-[10px] overflow-hidden focus-within:ring-2 focus-within:ring-[#007AFF]/40 transition-all">
                          <input
                            type="text"
                            value={item.baseName}
                            onChange={(e) => handleNameChange(item.id, e.target.value)}
                            placeholder="e.g. public/images/logo"
                            className="w-full text-[13px] font-mono text-black bg-transparent px-3 py-2 outline-none"
                          />
                          {item.extension && (
                            <div className="px-2.5 py-2 bg-[#E5E5EA] text-[12px] font-mono font-semibold text-[#8E8E93] select-none shrink-0">
                              {item.extension}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeFile(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FF3B30]/15 text-[#FF3B30] active:bg-[#FF3B30]/25 transition-colors shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2.2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Button */}
            <div className="p-4 border-t border-[#C6C6C8]/40">
              <button
                onClick={handleAddToQueue}
                disabled={files.length === 0 || isProcessing}
                className="w-full py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[15px] font-semibold rounded-2xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isProcessing && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                )}
                {isProcessing
                  ? "Processing..."
                  : `Add ${files.length > 0 ? files.length : ""} ${
                      files.length === 1 ? "File" : "Files"
                    } to Queue`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}