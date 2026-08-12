"use client";

import { useState } from "react";
import { X, CopyCheck } from "lucide-react";
import { getFileContent } from "@/actions/github";
import { decodeBase64 } from "@/lib/utils";

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: string;
  repo: string;
  branch: string;
  treeData: any;
  setTreeData: (data: any) => void;
}

export default function BulkActionModal({ isOpen, onClose, owner, repo, branch, treeData, setTreeData }: BulkActionModalProps) {
  const [mode, setMode] = useState<"copy" | "create">("copy");
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const executeAction = async () => {
    const paths = textInput.split('\n').map(p => p.trim().replace(/^\/+/, '')).filter(p => p.length > 0);
    
    if (paths.length === 0) {
      setStatus({ message: "Koi file path nahi dala!", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "Processing...", type: "info" });

    if (mode === 'create') {
      // Create new dummy nodes in the tree state
      const newTree = JSON.parse(JSON.stringify(treeData)); // Deep copy
      let addedCount = 0;

      paths.forEach(fullPath => {
        const parts = fullPath.split("/");
        let current = newTree;
        parts.forEach((part, i) => {
          if (!current[part]) {
            current[part] = {
              _info: i === parts.length - 1 
                ? { path: fullPath, type: "blob", sha: "dummy_" + Date.now() + "_" + i, size: 0 } 
                : { type: "tree", path: parts.slice(0, i + 1).join("/") }
            };
            if (i === parts.length - 1) addedCount++;
          }
          current = current[part];
        });
      });

      if (addedCount === 0) {
        setStatus({ message: "Saari files pehle se exist karti hain. (Ignored)", type: "warning" });
      } else {
        setTreeData(newTree); // Update UI Tree immediately
        setStatus({ message: `✅ ${addedCount} nayi files add ho gayi!`, type: "success" });
        setTimeout(onClose, 1500);
      }
      setLoading(false);
    } 
    
    else if (mode === 'copy') {
      try {
        let finalText = "";
        let successCount = 0;

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          setStatus({ message: `Fetching ${i + 1}/${paths.length}: ${path}`, type: "info" });
          try {
            const data = await getFileContent(owner, repo, path, branch);
            const content = decodeBase64(data.content);
            finalText += `Current ${path}\n\n${content}\n\n`;
            successCount++;
          } catch (err: any) {
            finalText += `Current ${path}\n\n// Error fetching file: ${err.message}\n\n`;
          }
        }

        await navigator.clipboard.writeText(finalText.trim());
        setStatus({ message: `✅ Copied ${successCount} files to clipboard!`, type: "success" });
        setTimeout(onClose, 2000);
      } catch (err: any) {
        setStatus({ message: `Error: ${err.message}`, type: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#d6d1c4] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]">
          <div className="flex items-center gap-2">
            <CopyCheck className="w-4 h-4 text-[#1A1A1A]" />
            <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Bulk Actions</h3>
          </div>
          <button onClick={onClose} disabled={loading} className="text-[#8a8a8a] hover:text-[#1A1A1A] transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
          
          {/* Toggle */}
          <div className="flex bg-[#F5F1EC] rounded-lg p-1">
            <button 
              onClick={() => setMode("copy")}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-md transition-all ${mode === 'copy' ? 'bg-white shadow-sm text-[#6D001A]' : 'text-[#8a8a8a] hover:text-[#4A4A4A]'}`}
            >
              Copy Files
            </button>
            <button 
              onClick={() => setMode("create")}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-md transition-all ${mode === 'create' ? 'bg-white shadow-sm text-[#6D001A]' : 'text-[#8a8a8a] hover:text-[#4A4A4A]'}`}
            >
              Create Files
            </button>
          </div>

          <p className="text-[12px] text-[#8a8a8a] leading-tight">
            File paths yahan paste karein (ek line mein ek path).
          </p>

          <textarea 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={loading}
            className="w-full min-h-[160px] p-3 bg-white border border-[#d6d1c4] rounded-xl text-[13px] font-mono text-[#1A1A1A] outline-none focus:border-[#6D001A] focus:ring-2 focus:ring-[#6D001A]/10 transition-all resize-y disabled:opacity-50"
            placeholder="lib/utils.ts&#10;package.json&#10;app/page.tsx"
          />

          {/* Status Message */}
          <div className={`text-[12px] font-medium min-h-[18px] ${status.type === 'error' ? 'text-[#ff3b30]' : status.type === 'success' ? 'text-[#34c759]' : status.type === 'warning' ? 'text-[#B5AC8A]' : 'text-[#1A1A1A]'}`}>
            {status.message}
          </div>

          <button
            onClick={executeAction}
            disabled={loading}
            className="w-full mt-2 py-2.5 text-[14px] font-semibold text-white bg-gradient-to-br from-[#6D001A] to-[#8B0022] rounded-xl hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : mode === 'copy' ? "Fetch & Copy" : "Create Files"}
          </button>
        </div>

      </div>
    </div>
  );
}
