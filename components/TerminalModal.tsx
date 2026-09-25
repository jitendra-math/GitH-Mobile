"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CornerDownLeft } from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import { getFileContent } from "@/actions/github";
import { decodeBase64 } from "@/lib/utils";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: string;
  repo: string;
  branch: string;
  treeData: any;
  setTreeData: (data: any) => void;
}

type LogEntry = {
  type: "command" | "success" | "error" | "info";
  text: string;
};

const INITIAL_LOGS: LogEntry[] = [
  { type: "info", text: "GitH Mobile Terminal" },
  { type: "info", text: "Available commands: mkdir, mv" },
  { type: "info", text: "Tip: Paste multiple commands — one per line." },
  { type: "info", text: "" },
];

export default function TerminalModal({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
  treeData,
  setTreeData,
}: TerminalModalProps) {
  const { queue, addToQueue } = useEditStore();
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [loading, setLoading] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 350);
    } else {
      setInput("");
      setLogs(INITIAL_LOGS);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const addLog = (entry: LogEntry) => setLogs((prev) => [...prev, entry]);

  const findNode = (path: string): any => {
    const parts = path.split("/").filter(Boolean);
    let current = treeData;
    for (let i = 0; i < parts.length; i++) {
      if (!current || !current[parts[i]]) return null;
      current = current[parts[i]];
    }
    return current?._info || null;
  };

  const folderExists = (path: string): boolean => {
    const node = findNode(path);
    return node?.type === "tree";
  };

  const createFolderInTree = (
    folderPath: string
  ): { success?: boolean; error?: string } => {
    const newTree = JSON.parse(JSON.stringify(treeData || {}));
    const parts = folderPath.split("/").filter(Boolean);
    let current = newTree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {
          _info: { type: "tree", path: parts.slice(0, i + 1).join("/") },
        };
      } else if (current[part]._info?.type !== "tree") {
        return { error: `Conflict: "${part}" is a file, not a folder` };
      }
      current = current[part];
    }
    setTreeData(newTree);
    return { success: true };
  };

  const executeMkdir = (path: string) => {
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    if (!cleanPath) {
      addLog({ type: "error", text: "Invalid path" });
      return;
    }
    if (folderExists(cleanPath)) {
      addLog({ type: "error", text: `Folder already exists: ${cleanPath}` });
      return;
    }
    const result = createFolderInTree(cleanPath);
    if (result.error) {
      addLog({ type: "error", text: result.error });
    } else {
      addLog({ type: "success", text: `✓ Folder created: ${cleanPath}/` });
      addLog({
        type: "info",
        text: "  Note: Empty folders are UI-only until you add files.",
      });
    }
  };

  const executeMv = async (source: string, dest: string) => {
    const cleanSource = source.replace(/^\/+/, "");
    let cleanDest = dest.replace(/^\/+/, "");

    if (!cleanSource || !cleanDest) {
      addLog({ type: "error", text: "Invalid paths" });
      return;
    }

    const sourceNode = findNode(cleanSource);
    if (!sourceNode || sourceNode.type !== "blob") {
      addLog({ type: "error", text: `Source not found: ${cleanSource}` });
      return;
    }

    const sourceName = cleanSource.split("/").pop() || "";
    const hasTrailingSlash = dest.endsWith("/");
    const destNode = findNode(cleanDest.replace(/\/+$/, ""));

    let finalDest: string;
    if (hasTrailingSlash) {
      if (!destNode || destNode.type !== "tree") {
        const result = createFolderInTree(cleanDest);
        if (result.error) {
          addLog({ type: "error", text: result.error });
          return;
        }
      }
      finalDest = cleanDest.replace(/\/+$/, "") + "/" + sourceName;
    } else if (destNode?.type === "tree") {
      finalDest = cleanDest + "/" + sourceName;
    } else {
      finalDest = cleanDest;
    }

    if (finalDest === cleanSource) {
      addLog({ type: "error", text: "Source and destination are the same" });
      return;
    }

    if (findNode(finalDest)) {
      addLog({
        type: "error",
        text: `Destination already exists: ${finalDest}`,
      });
      return;
    }

    setLoading(true);
    try {
      const queueItem = queue.find(
        (q) => q.path === cleanSource && !q.isDelete
      );

      let contentBase64: string;
      let newSize: number;

      if (queueItem?.contentBase64) {
        addLog({
          type: "info",
          text: `Using pending content for ${cleanSource}…`,
        });
        contentBase64 = queueItem.contentBase64;
        newSize = queueItem.sizeDiff || 0;
      } else {
        addLog({ type: "info", text: `Fetching ${cleanSource}…` });
        const data = await getFileContent(owner, repo, cleanSource, branch);
        contentBase64 = data.content.replace(/\s/g, "");
        const decoded = decodeBase64(data.content);
        newSize = new Blob([decoded]).size;
      }

      const oldSize = sourceNode.size || 0;

      addToQueue({
        path: cleanSource,
        sha: sourceNode.sha,
        isDelete: true,
        sizeDiff: -oldSize,
      });
      addToQueue({
        path: finalDest,
        sha: null,
        contentBase64,
        isDelete: false,
        sizeDiff: newSize,
      });

      const newTree = JSON.parse(JSON.stringify(treeData || {}));
      const srcParts = cleanSource.split("/");
      let cur = newTree;
      for (let i = 0; i < srcParts.length - 1; i++) {
        cur = cur[srcParts[i]];
        if (!cur) break;
      }
      if (cur) delete cur[srcParts[srcParts.length - 1]];

      const dstParts = finalDest.split("/");
      let cur2 = newTree;
      for (let i = 0; i < dstParts.length; i++) {
        const part = dstParts[i];
        if (i === dstParts.length - 1) {
          cur2[part] = {
            _info: { ...sourceNode, path: finalDest, sha: null },
          };
        } else {
          if (!cur2[part]) {
            cur2[part] = {
              _info: {
                type: "tree",
                path: dstParts.slice(0, i + 1).join("/"),
              },
            };
          }
          cur2 = cur2[part];
        }
      }
      setTreeData(newTree);

      addLog({
        type: "success",
        text: `✓ Moved ${cleanSource} → ${finalDest}`,
      });
      addLog({ type: "info", text: "  Added to commit queue." });
    } catch (err: any) {
      addLog({
        type: "error",
        text: `Failed: ${err.message || "unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    addLog({ type: "command", text: trimmed });

    if (!trimmed) {
      addLog({ type: "info", text: "" });
      return;
    }

    const parts = trimmed.split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (name === "mkdir") {
      if (args.length !== 1) {
        addLog({ type: "error", text: "Usage: mkdir <path>" });
      } else {
        executeMkdir(args[0]);
      }
    } else if (name === "mv") {
      if (args.length !== 2) {
        addLog({ type: "error", text: "Usage: mv <source> <destination>" });
      } else {
        await executeMv(args[0], args[1]);
      }
    } else {
      addLog({ type: "error", text: `Unknown command: ${name}` });
      addLog({ type: "info", text: "Available commands: mkdir, mv" });
    }
    addLog({ type: "info", text: "" });
  };

  const handleSubmit = async () => {
    if (loading || !input.trim()) return;
    // Split by newline → trim → filter empty → execute sequentially
    const commands = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    setInput("");
    for (const cmd of commands) {
      await executeCommand(cmd);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift → submit (run all commands)
    // Shift+Enter → newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setLogs(INITIAL_LOGS);
  };

  const handleClose = () => {
    if (loading) return;
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
          className="fixed inset-0 z-[10002] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[600px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col h-[80vh] sm:h-auto sm:max-h-[80vh]"
          >
            {/* Grabber */}
            <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-9 h-[5px] rounded-full bg-black/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b border-[#C6C6C8]/40 shrink-0">
              <h2 className="text-[16px] font-semibold text-black tracking-tight">
                Terminal
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="text-[12px] font-semibold text-[#007AFF] active:opacity-50 transition-opacity"
                >
                  Clear
                </button>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors disabled:opacity-40"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Output (dark terminal) */}
            <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar bg-[#1C1C1E] min-h-0">
              <div className="font-mono text-[12px] leading-relaxed">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.type === "command"
                        ? "text-[#F2F2F2]"
                        : log.type === "success"
                        ? "text-[#34C759]"
                        : log.type === "error"
                        ? "text-[#FF453A]"
                        : "text-[#8E8E93]"
                    }
                  >
                    {log.type === "command" ? (
                      <>
                        <span className="text-[#34C759] font-bold">$</span>{" "}
                        {log.text}
                      </>
                    ) : (
                      log.text || "\u00A0"
                    )}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Input (light) — textarea for multiline paste support */}
            <div className="flex items-start gap-2 px-3 py-2.5 border-t border-[#C6C6C8]/40 bg-[#F2F2F7] shrink-0">
              <span className="text-[#34C759] font-mono text-[14px] font-bold shrink-0 pt-0.5">
                $
              </span>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                placeholder={
                  loading
                    ? "Processing…"
                    : "mkdir public/screenshots"
                }
                className="flex-1 bg-transparent font-mono text-[14px] text-black outline-none placeholder:text-[#8E8E93] disabled:opacity-50 min-w-0 resize-none leading-relaxed max-h-[120px] overflow-y-auto custom-scrollbar"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#007AFF] active:bg-[#0062CC] text-white transition-colors disabled:opacity-30 shrink-0"
                aria-label="Run command"
              >
                <CornerDownLeft className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}