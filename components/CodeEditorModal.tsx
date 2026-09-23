"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, FileCode2, Pencil } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { useEditStore } from "@/store/useEditStore";
import { encodeBase64 } from "@/lib/utils";
import RenameFileModal from "./RenameFileModal";
import AlertModal from "./AlertModal";

export default function CodeEditorModal() {
  const { editingFile, setEditingFile, addToQueue } = useEditStore();

  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error" as "error" | "info" | "success",
  });

  useEffect(() => {
    if (editingFile) {
      setText(editingFile.content);
      setCurrentPath(editingFile.path);
    }
  }, [editingFile]);

  const languageExtension = useMemo(() => {
    if (!currentPath) return [];

    const ext = currentPath.split(".").pop()?.toLowerCase();

    const extMap: Record<string, any> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      html: "html",
      htm: "html",
      css: "css",
      json: "json",
      md: "markdown",
      java: "java",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      go: "go",
      rs: "rust",
      php: "php",
      kt: "kotlin",
      sql: "sql",
      sh: "shell",
      bash: "shell",
      yaml: "yaml",
      yml: "yaml",
      xml: "xml",
    };

    const langName = ext ? extMap[ext] : null;

    if (langName) {
      const loadedLang = loadLanguage(langName);
      return loadedLang ? [loadedLang] : [];
    }
    return [];
  }, [currentPath]);

  const handleSave = () => {
    if (!editingFile) return;
    setIsSaving(true);
    try {
      const newSize = new Blob([text]).size;
      const contentBase64 = encodeBase64(text);

      if (currentPath !== editingFile.path) {
        addToQueue({
          path: editingFile.path,
          sha: editingFile.sha,
          isDelete: true,
          sizeDiff: -editingFile.oldSize,
        });

        addToQueue({
          path: currentPath,
          sha: null,
          contentBase64,
          isDelete: false,
          sizeDiff: newSize,
        });
      } else {
        addToQueue({
          path: editingFile.path,
          sha: editingFile.sha,
          contentBase64,
          isDelete: false,
          sizeDiff: newSize - editingFile.oldSize,
        });
      }

      setEditingFile(null);
    } catch (err: any) {
      setAlertConfig({
        isOpen: true,
        message: "Failed to save: " + err.message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {editingFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isSaving && setEditingFile(null)}
            className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-[1000px] bg-[#1C1C1E] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col h-[92vh] sm:h-auto sm:max-h-[90vh]"
            >
              {/* Grabber */}
              <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
                <div className="w-9 h-[5px] rounded-full bg-white/25" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#2C2C2E] bg-[#1C1C1E] shrink-0">
                <button
                  onClick={() => setIsRenameModalOpen(true)}
                  className="flex items-center gap-2 min-w-0 flex-1 active:opacity-60 transition-opacity text-left"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#007AFF]/20 text-[#0A84FF] shrink-0">
                    <FileCode2 className="w-4 h-4" strokeWidth={2.3} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-[#F2F2F7] truncate font-mono">
                      {currentPath}
                    </div>
                    {currentPath !== editingFile.path && (
                      <div className="text-[11px] text-[#FF9500] font-medium truncate">
                        Will be renamed
                      </div>
                    )}
                  </div>
                  <Pencil className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" strokeWidth={2.3} />
                </button>

                <button
                  onClick={() => setEditingFile(null)}
                  disabled={isSaving}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/8 text-[#8E8E93] active:bg-white/15 transition-colors disabled:opacity-40 shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-auto bg-[#1e1e1e] min-h-0">
                <CodeMirror
                  value={text}
                  theme={vscodeDark}
                  extensions={languageExtension}
                  onChange={(val) => setText(val)}
                  editable={!isSaving}
                  height="100%"
                  className="text-[13px] font-mono h-full"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#2C2C2E] bg-[#1C1C1E] shrink-0">
                <span className="text-[11px] text-[#8E8E93] hidden sm:inline-block font-mono">
                  {(new Blob([text]).size / 1024).toFixed(2)} KB
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setEditingFile(null)}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-4 py-2 text-[15px] font-medium text-[#0A84FF] active:bg-white/5 rounded-xl transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-5 py-2 flex items-center justify-center gap-2 text-[15px] font-semibold text-white bg-[#007AFF] active:bg-[#0062CC] rounded-xl transition-colors disabled:opacity-40"
                  >
                    {isSaving ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <Save className="w-4 h-4" strokeWidth={2.3} />
                    )}
                    {isSaving ? "Saving…" : "Save to Queue"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <RenameFileModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        currentPath={currentPath}
        onSave={(newPath) => setCurrentPath(newPath)}
      />

      {/* Error Alert */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
}