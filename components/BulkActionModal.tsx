"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

export default function BulkActionModal({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
  treeData,
  setTreeData,
}: BulkActionModalProps) {
  const [mode, setMode] = useState<"copy" | "create">("copy");
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    setTextInput("");
    setStatus({ message: "", type: "" });
    onClose();
  };

  const executeAction = async () => {
    const paths = textInput
      .split("\n")
      .map((p) => p.trim().replace(/^\/+/, ""))
      .filter((p) => p.length > 0);

    if (paths.length === 0) {
      setStatus({ message: "No file paths provided!", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "Processing...", type: "info" });

    if (mode === "create") {
      const newTree = JSON.parse(JSON.stringify(treeData));
      let addedCount = 0;

      paths.forEach((fullPath) => {
        const parts = fullPath.split("/");
        let current = newTree;
        parts.forEach((part, i) => {
          if (!current[part]) {
            current[part] = {
              _info:
                i === parts.length - 1
                  ? {
                      path: fullPath,
                      type: "blob",
                      sha: "dummy_" + Date.now() + "_" + i,
                      size: 0,
                    }
                  : { type: "tree", path: parts.slice(0, i + 1).join("/") },
            };
            if (i === parts.length - 1) addedCount++;
          }
          current = current[part];
        });
      });

      if (addedCount === 0) {
        setStatus({ message: "All files already exist. (Ignored)", type: "warning" });
      } else {
        setTreeData(newTree);
        setStatus({ message: `✅ ${addedCount} files added! Check "Review Files".`, type: "success" });
        setTimeout(onClose, 1500);
      }
      setLoading(false);
    } else if (mode === "copy") {
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

  const statusColor =
    status.type === "error"
      ? "text-[#FF3B30]"
      : status.type === "success"
      ? "text-[#34C759]"
      : status.type === "warning"
      ? "text-[#FF9500]"
      : "text-[#8E8E93]";

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
            className="w-full sm:max-w-[480px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Grabber */}
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <div className="w-9 h-[5px] rounded-full bg-black/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-3">
              <h2 className="text-[16px] font-semibold text-black tracking-tight">
                Bulk Actions
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors disabled:opacity-40"
                aria-label="Close"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
              {/* iOS Segmented Control */}
              <div className="bg-[#767680]/[0.12] rounded-[9px] p-[3px] flex gap-0.5">
                <button
                  onClick={() => setMode("copy")}
                  className={`flex-1 py-[7px] text-[13px] rounded-[7px] transition-all duration-150 ${
                    mode === "copy"
                      ? "bg-white text-black font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                      : "text-black/60 font-medium"
                  }`}
                >
                  Copy Files
                </button>
                <button
                  onClick={() => setMode("create")}
                  className={`flex-1 py-[7px] text-[13px] rounded-[7px] transition-all duration-150 ${
                    mode === "create"
                      ? "bg-white text-black font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                      : "text-black/60 font-medium"
                  }`}
                >
                  Create Files
                </button>
              </div>

              <p className="text-[13px] text-[#8E8E93] leading-snug px-1">
                Paste file paths below, one per line.
              </p>

              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={loading}
                className="w-full min-h-[180px] p-3 bg-white rounded-[10px] text-[13px] font-mono text-black outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition-all resize-y disabled:opacity-50"
                placeholder={"lib/utils.ts\npackage.json\napp/page.tsx"}
              />

              {/* Status */}
              <div className={`text-[12px] font-medium min-h-[18px] px-1 ${statusColor}`}>
                {status.message}
              </div>

              {/* Action Button */}
              <button
                onClick={executeAction}
                disabled={loading}
                className="w-full py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[15px] font-semibold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                )}
                {loading
                  ? "Processing..."
                  : mode === "copy"
                  ? "Fetch & Copy"
                  : "Create Files"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
