"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Save, FileCode2, Pencil } from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { langs } from '@uiw/codemirror-extensions-langs'; 
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

  // SMART LANGUAGE DETECTOR 
  const languageExtension = useMemo(() => {
    if (!currentPath) return [];
    
    const ext = currentPath.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      // 🚀 FIX: Grouped all JS/TS variants into a single robust parser
      case 'js': 
      case 'jsx': 
      case 'ts': 
      case 'tsx': 
        return [langs.javascript({ jsx: true, typescript: true })];
        
      case 'py': return [langs.python()];
      case 'html': 
      case 'htm': return [langs.html()];
      case 'css': return [langs.css()];
      case 'json': return [langs.json()];
      case 'md': return [langs.markdown()];
      case 'java': return [langs.java()];
      case 'c': 
      case 'cpp': return [langs.cpp()];
      case 'cs': return [langs.csharp()];
      case 'go': return [langs.go()];
      case 'rs': return [langs.rust()];
      case 'php': return [langs.php()];
      case 'sql': return [langs.sql()];
      case 'sh': 
      case 'bash': return [langs.shell()];
      case 'xml': return [langs.xml()];
      case 'yaml': 
      case 'yml': return [langs.yaml()];
      default: return []; // Fallback to plain text if unknown
    }
  }, [currentPath]);

  if (!editingFile) return null;

  const handleSave = () => {
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
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-[#1A1A1A]/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#1e1e1e] rounded-xl sm:rounded-2xl w-full max-w-5xl shadow-2xl border border-[#d6d1c4] overflow-hidden flex flex-col h-full max-h-[95vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#333333] bg-[#252526]">
            <div className="flex items-center gap-2.5 overflow-hidden pr-4 group cursor-pointer" onClick={() => setIsRenameModalOpen(true)}>
              <div className="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d4d4d4]">
                <FileCode2 className="w-4 h-4" />
              </div>
              <h3 className="text-[14px] font-semibold text-[#d4d4d4] truncate font-mono flex items-center gap-2">
                {currentPath}
                <button 
                  className="p-1.5 rounded-md hover:bg-white/10 text-[#8a8a8a] hover:text-white transition-all"
                  title="Rename File"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </h3>
            </div>
            
            <button 
              onClick={() => setEditingFile(null)} 
              disabled={isSaving} 
              className="text-[#8a8a8a] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg p-1.5 transition-all disabled:opacity-50 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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

          <div className="flex items-center justify-between p-3 sm:p-4 border-t border-[#333333] bg-[#252526]">
            <span className="text-[11px] text-[#8a8a8a] hidden sm:inline-block font-mono">
              Size: {(new Blob([text]).size / 1024).toFixed(2)} KB
              {currentPath !== editingFile.path && <span className="ml-2 text-amber-500 font-bold">(Will be Renamed)</span>}
            </span>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setEditingFile(null)}
                disabled={isSaving}
                className="flex-1 sm:flex-none py-2 px-4 text-[13px] font-semibold text-[#d4d4d4] bg-white/5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
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

      <RenameFileModal 
        isOpen={isRenameModalOpen} 
        onClose={() => setIsRenameModalOpen(false)} 
        currentPath={currentPath}
        onSave={(newPath) => setCurrentPath(newPath)}
      />
    </>
  );
}
