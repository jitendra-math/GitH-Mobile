"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Save, FileCode2, Pencil } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import {
  langs,
  loadLanguage,
} from "@uiw/codemirror-extensions-langs";
import { useEditStore } from "@/store/useEditStore";
import { encodeBase64 } from "@/lib/utils";
import RenameFileModal from "./RenameFileModal";

export default function CodeEditorModal() {
  const { editingFile, setEditingFile, addToQueue } = useEditStore();

  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  useEffect(() => {
    if (editingFile) {
      setText(editingFile.content);
      setCurrentPath(editingFile.path);
    }
  }, [editingFile]);

  // Smart language detector
  const languageExtension = useMemo(() => {
    if (!currentPath) return [];

    const ext = currentPath.split(".").pop()?.toLowerCase();

    switch (ext) {
      // JavaScript
      case "js":
      case "mjs":
      case "cjs":
        return [loadLanguage("javascript")];

      // JSX
      case "jsx":
        return [loadLanguage("jsx")];

      // TypeScript
      case "ts":
      case "mts":
      case "cts":
        return [loadLanguage("typescript")];

      // TSX
      case "tsx":
        return [loadLanguage("tsx")];

      case "py":
        return [langs.python()];

      case "html":
      case "htm":
        return [langs.html()];

      case "css":
        return [langs.css()];

      case "json":
        return [langs.json()];

      case "md":
      case "markdown":
        return [langs.markdown()];

      case "java":
        return [langs.java()];

      case "c":
        return [langs.c()];

      case "cpp":
      case "cc":
      case "cxx":
      case "hpp":
        return [langs.cpp()];

      case "cs":
        return [langs.csharp()];

      case "go":
        return [langs.go()];

      case "rs":
        return [langs.rust()];

      case "php":
        return [langs.php()];

      case "sql":
        return [langs.sql()];

      case "sh":
      case "bash":
        return [langs.shell()];

      case "xml":
        return [langs.xml()];

      case "yaml":
      case "yml":
        return [langs.yaml()];

      default:
        return [];
    }
  }, [currentPath]);

  if (!editingFile) return null;

  const handleSave = () => {
    setIsSaving(true);

    try {
      const newSize = new Blob([text]).size;
      const contentBase64 = encodeBase64(text);

      // File was renamed
      if (currentPath !== editingFile.path) {
        // Delete old file
        addToQueue({
          path: editingFile.path,
          sha: editingFile.sha,
          isDelete: true,
          sizeDiff: -editingFile.oldSize,
        });

        // Create new file
        addToQueue({
          path: currentPath,
          sha: null,
          contentBase64,
          isDelete: false,
          sizeDiff: newSize,
        });
      } else {
        // Normal file edit
        addToQueue({
          path: editingFile.path,
          sha: editingFile.sha,
          contentBase64,
          isDelete: false,
          sizeDiff: newSize - editingFile.oldSize,
        });
      }

      setEditingFile(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";

      alert("Failed to save: " + message);
    } finally {
      setIsSaving(false);
    }
  };

  // Header mein sirf file ka naam dikhane ke liye
  // Example: "main.py" instead of "src/app/main.py"
  const fileName = currentPath.split("/").pop() || currentPath;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-[#1A1A1A]/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#F5F1EC] rounded-xl sm:rounded-2xl w-full max-w-5xl shadow-2xl border border-[#d6d1c4] overflow-hidden flex flex-col h-full max-h-[95vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[rgba(181,172,138,0.25)] bg-white">
            <div
              className="flex items-center gap-2.5 overflow-hidden pr-4 group cursor-pointer"
              onClick={() => setIsRenameModalOpen(true)}
            >
              <div className="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-[#6D001A]/10 text-[#6D001A]">
                <FileCode2 className="w-4 h-4" />
              </div>

              <h3 className="text-[14px] font-semibold text-[#1A1A1A] truncate font-mono flex items-center gap-2">
                {fileName}

                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-[#F5F1EC] text-[#8a8a8a] hover:text-[#1A1A1A] transition-all"
                  title="Rename File"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenameModalOpen(true);
                  }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setEditingFile(null)}
              disabled={isSaving}
              className="text-[#8a8a8a] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg p-1.5 transition-all disabled:opacity-50 shrink-0"
              aria-label="Close editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-auto bg-[#1e1e1e]">
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
          <div className="flex items-center justify-between p-3 sm:p-4 border-t border-[rgba(181,172,138,0.25)] bg-white">
            <span className="text-[11px] text-[#8a8a8a] hidden sm:inline-block font-mono">
              Size: {(new Blob([text]).size / 1024).toFixed(2)} KB

              {currentPath !== editingFile.path && (
                <span className="ml-2 text-amber-600 font-bold">
                  (Will be Renamed)
                </span>
              )}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setEditingFile(null)}
                disabled={isSaving}
                className="flex-1 sm:flex-none py-2 px-4 text-[13px] font-semibold text-[#4A4A4A] bg-[#F5F1EC] rounded-xl hover:bg-[#e6e0d4] transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
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

      <RenameFileModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        currentPath={currentPath}
        onSave={(newPath) => setCurrentPath(newPath)}
      />
    </>
  );
}