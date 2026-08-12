"use client";

import { useState, useRef } from "react";
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

  if (!isOpen) return null;

  const processSelectedFiles = (selectedFiles: FileList | File[]) => {
    const newItems: UploadFileItem[] = Array.from(selectedFiles).map((file) => {
      const lastDotIndex = file.name.lastIndexOf(".");
      const hasExtension = lastDotIndex !== -1 && lastDotIndex !== 0; // Check valid extension
      
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
          sha: null, // Null is perfectly fine for new files/blobs in GitHub API
          contentBase64: base64Data,
          isDelete: false,
          sizeDiff: item.size, // Size added in bytes
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
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#d6d1c4] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#1A1A1A]">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Upload Files</h3>
          </div>
          <button onClick={handleClose} disabled={isProcessing} className="text-[#8a8a8a] hover:text-[#1A1A1A] transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging ? "border-[#6D001A] bg-[#6D001A]/5" : "border-[#d6d1c4] bg-[#F5F1EC]/50 hover:bg-[#F5F1EC]"
            }`}
          >
            <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? "text-[#6D001A]" : "text-[#B5AC8A]"}`} />
            <p className="text-[14px] font-semibold text-[#1A1A1A]">Click to browse or drag files here</p>
            <p className="text-[12px] text-[#8a8a8a] mt-1 text-center">Support multiple files. Folders can be typed below.</p>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) processSelectedFiles(e.target.files);
                e.target.value = ''; // Reset for re-selection
              }}
            />
          </div>

          {/* File List & Editing */}
          {files.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-[13px] font-semibold text-[#8a8a8a] px-1 uppercase tracking-wider">
                Selected Files ({files.length})
              </h4>
              <div className="flex flex-col gap-2">
                {files.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-2 p-2.5 bg-white border border-[#d6d1c4] rounded-xl shadow-sm">
                    
                    {/* Path & Name Input */}
                    <div className="flex flex-1 items-center border border-[#d6d1c4] rounded-lg overflow-hidden focus-within:border-[#6D001A] focus-within:ring-1 focus-within:ring-[#6D001A] transition-all">
                      <input
                        type="text"
                        value={item.baseName}
                        onChange={(e) => handleNameChange(item.id, e.target.value)}
                        placeholder="e.g. public/images/logo"
                        className="w-full text-[13px] font-mono text-[#1A1A1A] p-2 outline-none"
                      />
                      {/* Locked Extension Box */}
                      {item.extension && (
                        <div className="px-2 py-2 bg-[#F5F1EC] text-[13px] font-mono font-bold text-[#8a8a8a] border-l border-[#d6d1c4] select-none shrink-0">
                          [{item.extension}]
                        </div>
                      )}
                    </div>
                    
                    {/* Remove Action */}
                    <button
                      onClick={() => removeFile(item.id)}
                      className="h-[38px] px-3 flex items-center justify-center bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white rounded-lg transition-colors shrink-0"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(181,172,138,0.25)] bg-white">
          <button
            onClick={handleAddToQueue}
            disabled={files.length === 0 || isProcessing}
            className="w-full py-2.5 text-[14px] font-semibold text-white bg-gradient-to-br from-[#6D001A] to-[#8B0022] rounded-xl hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : `Add ${files.length > 0 ? files.length : ""} Files to Queue`}
          </button>
        </div>

      </div>
    </div>
  );
}
