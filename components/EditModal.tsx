"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  CopyCheck,
  History,
  ArrowLeft,
  UploadCloud,
  Pencil,
} from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import {
  getRepoTree,
  commitMultipleFiles,
  fetchCommitHistory,
  rollbackToCommit,
} from "@/actions/github";
import { generateTreeText } from "@/lib/utils";
import TreeNode from "./TreeNode";
import BulkActionModal from "./BulkActionModal";
import AlertModal from "./AlertModal";
import DangerConfirmModal from "./DangerConfirmModal";
import FileUploadModal from "./FileUploadModal";
import CodeEditorModal from "./CodeEditorModal";

export default function EditModal() {
  const {
    isOpen,
    owner,
    repo,
    branch,
    queue,
    closeModal,
    removeFromQueue,
    clearQueue,
    isEditMode,
    toggleEditMode,
  } = useEditStore();

  const [treeData, setTreeData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const [view, setView] = useState<"tree" | "history">("tree");
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [copiedStructure, setCopiedStructure] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info" as any,
  });
  const [rollbackConfig, setRollbackConfig] = useState({
    isOpen: false,
    sha: "",
    msg: "",
  });
  const [isRollingBack, setIsRollingBack] = useState(false);

  const showAlert = (message: string, type: any = "info") => {
    setAlertConfig({ isOpen: true, message, type });
  };

  const formatDiff = (bytes?: number) => {
    if (bytes === undefined) return null;
    const kb = (Math.abs(bytes) / 1024).toFixed(2);
    if (bytes > 0)
      return (
        <span className="text-[#34C759] bg-[#34C759]/15 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ml-2 shrink-0">
          +{kb} KB
        </span>
      );
    if (bytes < 0)
      return (
        <span className="text-[#FF3B30] bg-[#FF3B30]/15 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ml-2 shrink-0">
          -{kb} KB
        </span>
      );
    return (
      <span className="text-[#8E8E93] bg-[#8E8E93]/15 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ml-2 shrink-0">
        0 KB
      </span>
    );
  };

  const loadTree = useCallback(() => {
    setLoading(true);
    setTreeData(null);
    getRepoTree(owner, repo, branch)
      .then((flatTree) => {
        const root: any = {};
        flatTree.forEach((item: any) => {
          if (!item.path) return;
          const parts = item.path.split("/");
          let current = root;
          parts.forEach((part: string, i: number) => {
            if (!current[part]) {
              current[part] = {
                _info:
                  i === parts.length - 1
                    ? item
                    : { type: "tree", path: parts.slice(0, i + 1).join("/") },
              };
            }
            current = current[part];
          });
        });
        setTreeData(root);
      })
      .catch(() => showAlert("Failed to load file structure.", "error"))
      .finally(() => setLoading(false));
  }, [owner, repo, branch]);

  useEffect(() => {
    if (isOpen) {
      setView("tree");
      loadTree();
    }
  }, [isOpen, loadTree]);

  const handleCommit = async () => {
    if (queue.length === 0) return showAlert("Queue is empty", "error");

    setCommitting(true);
    try {
      const res = await commitMultipleFiles(owner, repo, branch, queue);
      if (res.error) throw new Error(res.error);
      showAlert("Commit successful 🚀", "success");
      clearQueue();
      loadTree();
    } catch (err: any) {
      showAlert("Commit failed: " + err.message, "error");
    } finally {
      setCommitting(false);
    }
  };

  const handleCopyStructure = async () => {
    if (!treeData) return;
    try {
      const treeText = generateTreeText(treeData);
      await navigator.clipboard.writeText(treeText);
      setCopiedStructure(true);
      setTimeout(() => setCopiedStructure(false), 2000);
    } catch (err) {
      showAlert("Failed to copy structure", "error");
    }
  };

  const handleLoadHistory = async () => {
    setView("history");
    setLoading(true);
    try {
      const commits = await fetchCommitHistory(owner, repo, branch);
      setHistoryData(commits);
    } catch (err: any) {
      showAlert("Failed to load history: " + err.message, "error");
      setView("tree");
    } finally {
      setLoading(false);
    }
  };

  const executeRollback = async (sha: string) => {
    setIsRollingBack(true);
    try {
      const res = await rollbackToCommit(owner, repo, branch, sha);
      if (res.error) throw new Error(res.error);

      setRollbackConfig({ ...rollbackConfig, isOpen: false });
      showAlert(
        `Rollback successful! Restored to commit ${sha.substring(0, 7)}`,
        "success"
      );

      setView("tree");
      loadTree();
    } catch (err: any) {
      showAlert("Rollback failed: " + err.message, "error");
    } finally {
      setIsRollingBack(false);
    }
  };

  const rootKeys = treeData
    ? Object.keys(treeData)
        .filter((k) => k !== "_info")
        .sort((a, b) => {
          const isDirA = treeData[a]._info?.type === "tree";
          const isDirB = treeData[b]._info?.type === "tree";
          if (isDirA && !isDirB) return -1;
          if (!isDirA && isDirB) return 1;
          return a.localeCompare(b);
        })
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
          className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[880px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col h-[92vh] sm:h-auto sm:max-h-[88vh]"
          >
            {/* Grabber */}
            <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-9 h-[5px] rounded-full bg-black/20" />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#F2F2F7] border-b border-[#C6C6C8]/40 shrink-0">
              {/* Title Row */}
              <div className="flex items-center justify-between gap-3 px-4 pt-2 pb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[16px] font-semibold text-black truncate leading-tight">
                    {repo}
                  </h3>
                  <p className="text-[12px] text-[#8E8E93] truncate mt-0.5">
                    {owner} · {branch}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              {/* Tools Row */}
              <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
                {/* History / Back to Tree */}
                {view === "history" ? (
                  <button
                    onClick={() => setView("tree")}
                    className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#007AFF] active:bg-[#0062CC] text-white transition-colors text-[12px] font-semibold shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Back to Tree</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLoadHistory}
                    className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#007AFF] active:bg-[#0062CC] text-white transition-colors text-[12px] font-semibold shrink-0"
                  >
                    <History className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>History</span>
                  </button>
                )}

                <div className="w-px h-4 bg-[#C6C6C8]/60 mx-0.5 shrink-0" />

                {/* Bulk Actions */}
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#AF52DE] active:bg-[#8E42B3] text-white transition-colors text-[12px] font-semibold shrink-0"
                >
                  <CopyCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Bulk Actions</span>
                </button>

                {/* Copy Structure */}
                <button
                  onClick={handleCopyStructure}
                  className={`h-8 px-3 flex items-center gap-1.5 rounded-lg transition-colors text-[12px] font-semibold shrink-0 ${
                    copiedStructure
                      ? "bg-[#34C759] active:bg-[#2AA34A] text-white"
                      : "bg-white border border-[#C6C6C8]/60 text-black active:bg-[#E5E5EA]"
                  }`}
                >
                  {copiedStructure ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                  )}
                  <span>{copiedStructure ? "Copied!" : "Copy Structure"}</span>
                </button>

                {/* Upload */}
                <button
                  onClick={() => setIsFileUploadModalOpen(true)}
                  className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-white border border-[#C6C6C8]/60 text-black active:bg-[#E5E5EA] transition-colors text-[12px] font-semibold shrink-0"
                >
                  <UploadCloud className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Upload</span>
                </button>

                {/* Edit Mode Toggle */}
                {view === "tree" && (
                  <button
                    onClick={toggleEditMode}
                    className={`h-8 px-3 flex items-center gap-1.5 rounded-lg transition-colors text-[12px] font-semibold shrink-0 ${
                      isEditMode
                        ? "bg-[#34C759] active:bg-[#2AA34A] text-white"
                        : "bg-white border border-[#C6C6C8]/60 text-black active:bg-[#E5E5EA]"
                    }`}
                    title="Toggle Edit Mode"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Edit Mode {isEditMode ? "ON" : "OFF"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-2">
                  <svg
                    className="w-5 h-5 animate-spin text-[#8E8E93]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeOpacity="0.25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[13px] text-[#8E8E93] font-medium">
                    Loading…
                  </span>
                </div>
              ) : view === "tree" ? (
                treeData ? (
                  <ul className="text-[14px] text-black">
                    {rootKeys.map((key) => (
                      <TreeNode
                        key={key}
                        nodeName={key}
                        nodeData={treeData[key]}
                      />
                    ))}
                  </ul>
                ) : null
              ) : (
                <div className="flex flex-col gap-2">
                  {historyData.map((item, index) => {
                    const date = new Date(item.commit.author.date);
                    const formattedDate =
                      date.toLocaleDateString() +
                      " " +
                      date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    const isLatest = index === 0;

                    return (
                      <div
                        key={item.sha}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl"
                      >
                        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                          <div className="flex items-start gap-2 flex-wrap">
                            {isLatest && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#34C759] bg-[#34C759]/15 px-1.5 py-0.5 rounded-md shrink-0">
                                Latest
                              </span>
                            )}
                            <div
                              className="text-[14px] font-medium text-black leading-snug break-words"
                              title={item.commit.message}
                            >
                              {item.commit.message}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-[#8E8E93] flex-wrap">
                            <span className="font-mono font-semibold bg-[#8E8E93]/15 text-[#8E8E93] px-1.5 py-0.5 rounded-md">
                              {item.sha.substring(0, 7)}
                            </span>
                            <span>{item.commit.author.name}</span>
                            <span className="text-[#C6C6C8]">•</span>
                            <span>{formattedDate}</span>
                          </div>
                        </div>

                        {!isLatest ? (
                          <button
                            onClick={() =>
                              setRollbackConfig({
                                isOpen: true,
                                sha: item.sha,
                                msg: item.commit.message,
                              })
                            }
                            className="px-3 py-1.5 bg-[#FF9500]/15 text-[#FF9500] text-[12px] font-semibold rounded-full active:bg-[#FF9500]/25 transition-colors shrink-0 w-full sm:w-auto"
                          >
                            Rollback
                          </button>
                        ) : (
                          <span className="text-[12px] text-[#8E8E93] font-medium px-2 w-full sm:w-auto text-left sm:text-center">
                            Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Queue */}
            {view === "tree" && (
              <div className="bg-[#F2F2F7] border-t border-[#C6C6C8]/40 px-3 pt-3 pb-3 shrink-0">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                    Commit Queue
                  </span>
                  <span className="text-[12px] font-semibold text-[#007AFF] bg-[#007AFF]/12 px-2 py-0.5 rounded-full">
                    {queue.length}
                  </span>
                </div>

                <div className="max-h-[22vh] overflow-y-auto flex flex-col gap-1.5 mb-3 custom-scrollbar">
                  {queue.length === 0 ? (
                    <div className="text-center text-[13px] text-[#8E8E93] py-4 bg-white rounded-xl">
                      No files in queue
                    </div>
                  ) : (
                    queue.map((item) => (
                      <div
                        key={item.path}
                        className={`flex items-center justify-between gap-2 p-2 rounded-xl bg-white ${
                          item.isDelete
                            ? "border-l-[3px] border-l-[#FF3B30]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <span className="text-[12px] font-mono text-black truncate">
                            {item.isDelete && (
                              <span className="text-[#FF3B30] font-bold mr-1">
                                DEL
                              </span>
                            )}
                            {item.path}
                          </span>
                          {formatDiff(item.sizeDiff)}
                        </div>
                        <button
                          onClick={() => removeFromQueue(item.path)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FF3B30]/15 text-[#FF3B30] active:bg-[#FF3B30]/30 transition-colors shrink-0"
                        >
                          <X className="w-3 h-3" strokeWidth={2.5} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCommit}
                    disabled={committing || queue.length === 0}
                    className="flex-1 py-3 bg-[#007AFF] active:bg-[#0062CC] text-white text-[15px] font-semibold rounded-2xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {committing && (
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {committing ? "Committing…" : "Commit"}
                  </button>
                  <button
                    onClick={clearQueue}
                    disabled={queue.length === 0}
                    className="px-5 py-3 bg-transparent text-[#007AFF] text-[15px] font-semibold rounded-2xl active:bg-black/5 transition-colors disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* External Modals */}
      {isOpen && (
        <>
          <CodeEditorModal />
          <FileUploadModal
            isOpen={isFileUploadModalOpen}
            onClose={() => setIsFileUploadModalOpen(false)}
          />
          <BulkActionModal
            isOpen={isBulkModalOpen}
            onClose={() => setIsBulkModalOpen(false)}
            owner={owner}
            repo={repo}
            branch={branch}
            treeData={treeData}
            setTreeData={setTreeData}
          />
          <AlertModal
            isOpen={alertConfig.isOpen}
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
          />
          <DangerConfirmModal
            isOpen={rollbackConfig.isOpen}
            title="Confirm Rollback"
            description="Your repository will revert to this commit:"
            highlight={rollbackConfig.msg}
            highlightItalic={true}
            instruction="Type the commit ID below to confirm"
            expectedValue={rollbackConfig.sha.substring(0, 7)}
            caseSensitive={false}
            variant="warning"
            confirmText="Rollback"
            loading={isRollingBack}
            onCancel={() =>
              setRollbackConfig({ ...rollbackConfig, isOpen: false })
            }
            onConfirm={() => executeRollback(rollbackConfig.sha)}
          />
        </>
      )}
    </AnimatePresence>
  );
}