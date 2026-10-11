"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileCode2 } from "lucide-react";
import { fetchFileBatch, getRepoFileList } from "@/actions/github";
import { decodeBase64, buildExportHtml } from "@/lib/utils";
import IOSToggle from "./IOSToggle";

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: string;
  repo: string;
  branch: string;
}

const DEFAULT_EXCLUDED_FOLDERS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".cache",
  "__pycache__",
].join("\n");

const BATCH_SIZE = 10;
const SOFT_FILE_LIMIT = 500;

export default function ExportHtmlModal({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
}: ExportHtmlModalProps) {
  const [maxSizeKB, setMaxSizeKB] = useState(500);
  const [skipBinary, setSkipBinary] = useState(true);
  const [skipEmpty, setSkipEmpty] = useState(true);
  const [excludedFolders, setExcludedFolders] = useState(DEFAULT_EXCLUDED_FOLDERS);

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, path: "" });
  const [status, setStatus] = useState<{ type: "" | "success" | "error" | "info"; message: string }>({
    type: "",
    message: "",
  });

  const cancelRef = useRef(false);

  const handleClose = () => {
    if (isExporting) {
      cancelRef.current = true;
    }
    onClose();
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setStatus({ type: "", message: "" });
      cancelRef.current = false;

      // Parse excluded folders
      const excludeList = excludedFolders
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      // 1. Get filtered file list
      const files = await getRepoFileList(owner, repo, branch, {
        maxSizeKB,
        skipBinary,
        skipEmpty,
        excludeFolders: excludeList,
      });

      if (files.length === 0) {
        setStatus({
          type: "error",
          message: "No files to export with current filters.",
        });
        setIsExporting(false);
        return;
      }

      if (files.length > SOFT_FILE_LIMIT) {
        setStatus({
          type: "error",
          message: `Too many files (${files.length}). Max ${SOFT_FILE_LIMIT} supported. Increase size limit or exclude more folders.`,
        });
        setIsExporting(false);
        return;
      }

      setProgress({ current: 0, total: files.length, path: "" });

      // 2. Fetch in batches
      const decoded: Array<{ path: string; content: string }> = [];
      let skipped = 0;

      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        if (cancelRef.current) {
          setStatus({ type: "info", message: "Export cancelled." });
          setIsExporting(false);
          return;
        }

        const batch = files.slice(i, i + BATCH_SIZE);
        const paths = batch.map((f) => f.path);

        setProgress({
          current: i,
          total: files.length,
          path: paths[0],
        });

        const results = await fetchFileBatch(owner, repo, branch, paths);

        for (const r of results) {
          if (cancelRef.current) break;
          if (r.content) {
            try {
              const text = decodeBase64(r.content);
              if (text && !text.startsWith("Error decoding")) {
                decoded.push({ path: r.path, content: text });
              } else {
                skipped++;
              }
            } catch {
              skipped++;
            }
          } else {
            skipped++;
          }
        }

        setProgress({
          current: Math.min(i + BATCH_SIZE, files.length),
          total: files.length,
          path: paths[paths.length - 1],
        });
      }

      if (cancelRef.current) {
        setStatus({ type: "info", message: "Export cancelled." });
        setIsExporting(false);
        return;
      }

      if (decoded.length === 0) {
        setStatus({
          type: "error",
          message: "All files failed to decode. Nothing to export.",
        });
        setIsExporting(false);
        return;
      }

      // 3. Build HTML
      const html = buildExportHtml(decoded);

      // 4. Copy to clipboard
      try {
        await navigator.clipboard.writeText(html);
      } catch {
        setStatus({
          type: "error",
          message: "Failed to copy. Output may be too large for clipboard.",
        });
        setIsExporting(false);
        return;
      }

      // 5. Success
      const sizeKB = (html.length / 1024).toFixed(1);
      const sizeLabel =
        html.length > 1024 * 1024
          ? `${(html.length / 1024 / 1024).toFixed(2)} MB`
          : `${sizeKB} KB`;

      const skipMsg = skipped > 0 ? ` · ${skipped} skipped` : "";

      setStatus({
        type: "success",
        message: `✅ Copied ${decoded.length} files (${sizeLabel}) to clipboard${skipMsg}`,
      });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 2200);
    } catch (err: any) {
      setStatus({
        type: "error",
        message: "Export failed: " + (err.message || "unknown error"),
      });
      setIsExporting(false);
    }
  };

  const percent =
    progress.total > 0 ? Math.min((progress.current / progress.total) * 100, 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[10002] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[480px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Grabber */}
            <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-9 h-[5px] rounded-full bg-black/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-3 shrink-0">
              <h2 className="text-[16px] font-semibold text-black tracking-tight">
                Export HTML
              </h2>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3 custom-scrollbar">
              {!isExporting && !status.message ? (
                <>
                  <p className="text-[13px] text-[#8E8E93] leading-snug px-1">
                    Fetch all text files from this repo, escape them, and copy
                    as HTML to your clipboard.
                  </p>

                  {/* Options Card */}
                  <div className="bg-white rounded-2xl overflow-hidden">
                    {/* Max file size */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#C6C6C8]/30">
                      <span className="text-[14px] text-black">Max file size</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={maxSizeKB}
                          min={1}
                          max={5000}
                          onChange={(e) =>
                            setMaxSizeKB(
                              Math.max(1, Math.min(5000, Number(e.target.value) || 500))
                            )
                          }
                          className="w-16 bg-[#F2F2F7] rounded-md px-2 py-1 text-[13px] font-mono text-black text-right outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition-all"
                        />
                        <span className="text-[12px] text-[#8E8E93] font-medium">
                          KB
                        </span>
                      </div>
                    </div>

                    {/* Skip binary */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#C6C6C8]/30">
                      <div className="min-w-0">
                        <div className="text-[14px] text-black">Skip binary files</div>
                        <div className="text-[11px] text-[#8E8E93] mt-0.5">
                          Images, fonts, archives, lock files
                        </div>
                      </div>
                      <IOSToggle checked={skipBinary} onChange={setSkipBinary} />
                    </div>

                    {/* Skip empty */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="text-[14px] text-black">Skip empty files</div>
                        <div className="text-[11px] text-[#8E8E93] mt-0.5">
                          Files with 0 bytes
                        </div>
                      </div>
                      <IOSToggle checked={skipEmpty} onChange={setSkipEmpty} />
                    </div>
                  </div>

                  {/* Excluded folders */}
                  <div className="bg-white rounded-2xl p-3">
                    <label className="text-[12px] text-[#8E8E93] font-medium block mb-1.5">
                      Exclude folders (one per line)
                    </label>
                    <textarea
                      value={excludedFolders}
                      onChange={(e) => setExcludedFolders(e.target.value)}
                      rows={5}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="w-full bg-[#F2F2F7] rounded-lg p-2.5 text-[12px] font-mono text-black outline-none resize-none leading-relaxed focus:ring-2 focus:ring-[#007AFF]/40 transition-all"
                    />
                  </div>
                </>
              ) : null}

              {/* Progress */}
              {isExporting ? (
                <div className="bg-white rounded-2xl p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#8E8E93] font-medium">
                      Fetching files…
                    </span>
                    <span className="text-[13px] text-[#007AFF] font-semibold font-mono">
                      {progress.current} / {progress.total}
                    </span>
                  </div>
                  <div className="h-2 bg-[#E5E5EA] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#007AFF]"
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  {progress.path ? (
                    <p className="text-[11px] text-[#8E8E93] font-mono truncate">
                      {progress.path}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Status */}
              {status.message ? (
                <div
                  className={`rounded-xl p-3 text-[13px] font-medium leading-snug ${
                    status.type === "success"
                      ? "bg-[#34C759]/10 text-[#34C759]"
                      : status.type === "error"
                      ? "bg-[#FF3B30]/10 text-[#FF3B30]"
                      : "bg-[#8E8E93]/10 text-[#8E8E93]"
                  }`}
                >
                  {status.message}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-4 pt-3 pb-4 border-t border-[#C6C6C8]/40 shrink-0">
              {!isExporting && !status.message ? (
                <button
                  onClick={handleExport}
                  className="w-full py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[15px] font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <FileCode2 className="w-4 h-4" strokeWidth={2.4} />
                  Export &amp; Copy
                </button>
              ) : isExporting ? (
                <button
                  onClick={handleClose}
                  className="w-full py-3.5 bg-transparent text-[#FF3B30] text-[15px] font-semibold rounded-2xl active:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}