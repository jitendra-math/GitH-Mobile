"use client";

import { useState, useRef } from "react";
import { X, Upload, File, Trash2, Loader2 } from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import { encodeBase64, fileToBase64 } from "@/lib/utils";
import AlertModal from "./AlertModal";

type UploadFile = {
  id: string;
  file: File;
  baseName: string;      // filename without extension
  extension: string;     // extension (without dot)
  customPath: string;    // user editable path (no extension)
};

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "", type: "info" as any });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToQueue } = useEditStore();

  const showAlert = (message: string, type: any = "info") => {
    setAlertConfig({ isOpen: true, message, type });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const newFiles: UploadFile[] = Array.from(selected).map((file) => {
      const name = file.name;
      const lastDot = name.lastIndexOf(".");
      let baseName = name;
      let extension = "";
      if (lastDot > 0) {
        baseName = name.substring(0, lastDot);
        extension = name.substring(lastDot + 1);
      }
      // Ensure extension is lowercase for consistency
      extension = extension.toLowerCase();
      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        baseName,
        extension,
        customPath: baseName, // initial path = baseName (no extension)
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
    // Reset input so same file can be re-added
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove a file from the list
  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Update custom path for a file
  const updateCustomPath = (id: string, newPath: string) => {
    // Sanitize: remove leading/trailing slashes and any dot (since extension is locked)
    let sanitized = newPath.replace(/^\/+|\/+$/g, ""); // trim slashes
    // Remove any dots (user can't add extension here)
    sanitized = sanitized.replace(/\./g, "");
    // Allow alphanumeric, slash, hyphen, underscore
    sanitized = sanitized.replace(/[^a-zA-Z0-9\/\-_]/g, "");
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, customPath: sanitized || f.baseName } : f
      )
    );
  };

  // Add all files to commit queue
  const handleAddToQueue = async () => {
    if (files.length === 0) {
      showAlert("Koi file select nahi ki!", "error");
      return;
    }

    setLoading(true);
    try {
      for (const item of files) {
        // Construct final path: customPath + extension
        let finalPath = item.customPath;
        if (item.extension) {
          finalPath += `.${item.extension}`;
        }
        // Ensure no double slashes
        finalPath = finalPath.replace(/\/+/g, "/");
        // Read file as base64 (supports binary)
        const contentBase64 = await fileToBase64(item.file);
        // Add to queue
        addToQueue({
          path: finalPath,
          sha: null, // new file
          contentBase64,
          isDelete: false,
          sizeDiff: item.file.size,
        });
      }

      showAlert(`${files.length} file(s) queue mein add ho gayi! ✅`, "success");
      setFiles([]);
      setTimeout(onClose, 1200);
    } catch (err: any) {
      showAlert("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#d6d1c4] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#1A1A1A]" />
              <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Upload Files</h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-[#8a8a8a] hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
            {/* File Selector */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="block w-full text-sm text-[#4A4A4A] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6D001A] file:text-white hover:file:bg-[#8B0022] transition-colors cursor-pointer"
                disabled={loading}
              />
            </div>

            {/* File List */}
            {files.length === 0 ? (
              <div className="text-center text-[13px] text-[#8a8a8a] py-6 border-2 border-dashed border-[#d6d1c4] rounded-xl">
                <File className="w-8 h-8 mx-auto text-[#B5AC8A] mb-2" />
                <p>Files select karein – yahan list hogi</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto">
                {files.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-[#F5F1EC] rounded-xl border border-[rgba(181,172,138,0.25)]"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <File className="w-4 h-4 text-[#6D001A] shrink-0" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[12px] font-semibold text-[#1A1A1A] truncate">
                          {item.file.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8a8a8a]">
                          <span>{item.extension ? `.${item.extension}` : 'No extension'}</span>
                          <span>• {(item.file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    </div>

                    {/* Editable Path Input (without extension) */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto sm:flex-1 min-w-[120px]">
                      <input
                        type="text"
                        value={item.customPath}
                        onChange={(e) => updateCustomPath(item.id, e.target.value)}
                        disabled={loading}
                        className="flex-1 p-1.5 bg-white border border-[#d6d1c4] rounded-lg text-[12px] font-mono text-[#1A1A1A] outline-none focus:border-[#6D001A] focus:ring-2 focus:ring-[#6D001A]/10 transition-all disabled:opacity-50"
                        placeholder="folder/subfolder/name"
                      />
                      <span className="text-[12px] font-mono text-[#8a8a8a] shrink-0">
                        {item.extension ? `.${item.extension}` : ''}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFile(item.id)}
                      disabled={loading}
                      className="p-1.5 rounded-lg bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white transition-all shrink-0 disabled:opacity-50"
                      title="Remove this file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleAddToQueue}
                disabled={files.length === 0 || loading}
                className="flex-1 py-2.5 text-[14px] font-semibold text-white bg-gradient-to-br from-[#6D001A] to-[#8B0022] rounded-xl hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${files.length} file(s) to Queue`
                )}
              </button>
              <button
                onClick={() => setFiles([])}
                disabled={loading || files.length === 0}
                className="px-4 py-2.5 text-[14px] font-semibold text-[#4A4A4A] bg-white border border-[rgba(181,172,138,0.4)] rounded-xl hover:bg-[#F5F1EC] transition-all disabled:opacity-50"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modal for notifications */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
}