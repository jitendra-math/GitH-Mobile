"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Copy, CopyCheck, History, ArrowLeft, Upload } from "lucide-react"; // <-- Upload added
import { useEditStore } from "@/store/useEditStore";
import { getRepoTree, commitMultipleFiles, fetchCommitHistory, rollbackToCommit } from "@/actions/github";
import { generateTreeText } from "@/lib/utils";
import TreeNode from "./TreeNode";
import BulkActionModal from "./BulkActionModal";
import AlertModal from "./AlertModal";
import RollbackPromptModal from "./RollbackPromptModal";
import UploadModal from "./UploadModal"; // <-- new import

export default function EditModal() {
  const { isOpen, owner, repo, branch, queue, closeModal, removeFromQueue, clearQueue } = useEditStore();
  
  // Data States
  const [treeData, setTreeData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  
  // UI/Flow States
  const [view, setView] = useState<"tree" | "history">("tree");
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [copiedStructure, setCopiedStructure] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // <-- new state

  // Custom Modal States
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "", type: "info" as any });
  const [rollbackConfig, setRollbackConfig] = useState({ isOpen: false, sha: "", msg: "" });
  const [isRollingBack, setIsRollingBack] = useState(false);

  const showAlert = (message: string, type: any = "info") => {
    setAlertConfig({ isOpen: true, message, type });
  };

  const formatDiff = (bytes?: number) => {
    if (bytes === undefined) return null;
    const kb = (Math.abs(bytes) / 1024).toFixed(2);
    if (bytes > 0) return <span className="text-[#34c759] bg-[#34c759]/10 px-1.5 py-0.5 rounded text-[10px] ml-2">+{kb} KB</span>;
    if (bytes < 0) return <span className="text-[#ff3b30] bg-[#ff3b30]/10 px-1.5 py-0.5 rounded text-[10px] ml-2">-{kb} KB</span>;
    return <span className="text-[#8a8a8a] bg-black/5 px-1.5 py-0.5 rounded text-[10px] ml-2">0 KB</span>;
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
              current[part] = { _info: i === parts.length - 1 ? item : { type: "tree", path: parts.slice(0, i + 1).join("/") } };
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
      showAlert(`Rollback successful! Restored to commit ${sha.substring(0,7)}`, "success");
      
      // Go back to tree and refresh
      setView("tree");
      loadTree();
    } catch (err: any) {
      showAlert("Rollback failed: " + err.message, "error");
    } finally {
      setIsRollingBack(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-start justify-center pt-8 pb-4 px-4 bg-[#1A1A1A]/35 backdrop-blur-md animate-in fade-in duration-200">
        <div className="flex flex-col bg-[#F5F1EC]/90 backdrop-blur-xl w-full max-w-[880px] max-h-[calc(100vh-48px)] rounded-[18px] shadow-[0_12px_32px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(0,0,0,0.03)] border border-white/60 overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          
          {/* Header Container */}
          <div className="sticky top-0 z-10 flex flex-col bg-white/60 backdrop-blur-md border-b border-[rgba(181,172,138,0.25)]">
            
            {/* Top Row: Title & Close */}
            <div className="flex items-center justify-between p-3.5 px-4 border-b border-[rgba(181,172,138,0.15)]">
              <h3 className="text-[14px] font-semibold text-[#1A1A1A] truncate pr-4">
                {owner}/{repo} <span className="text-[#8a8a8a] font-normal">({branch})</span>
              </h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ff3b30]/10 hover:text-[#ff3b30] text-[#8a8a8a] transition-all shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Row: Tools Bar */}
            <div className="flex items-center gap-2 p-2 px-4 bg-[#F5F1EC]/50 overflow-x-auto custom-scrollbar">
              
              {view === "history" ? (
                <button onClick={() => setView("tree")} className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-white border border-[#d6d1c4] text-[#4A4A4A] hover:bg-[#e6e0d4] transition-colors text-[12px] font-semibold shadow-sm shrink-0">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Tree</span>
                </button>
              ) : (
                <button onClick={handleLoadHistory} className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#B5AC8A] text-white hover:bg-[#a39976] transition-colors text-[12px] font-semibold shadow-sm shrink-0">
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                </button>
              )}

              <div className="w-px h-4 bg-[#d6d1c4] mx-0.5 shrink-0"></div>

              <button onClick={() => setIsBulkModalOpen(true)} className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#6D001A] text-white hover:bg-[#8B0022] transition-colors text-[12px] font-semibold shadow-sm shrink-0">
                <CopyCheck className="w-3.5 h-3.5" />
                <span>Bulk Actions</span>
              </button>

              {/* 👇 NEW UPLOAD BUTTON */}
              <button 
                onClick={() => setIsUploadModalOpen(true)} 
                className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#6D001A] text-white hover:bg-[#8B0022] transition-colors text-[12px] font-semibold shadow-sm shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>

              <button onClick={handleCopyStructure} className={`h-8 px-3 flex items-center gap-1.5 rounded-lg transition-colors text-[12px] font-semibold shadow-sm shrink-0 ${copiedStructure ? 'bg-[#34c759] text-white' : 'bg-white border border-[rgba(181,172,138,0.4)] text-[#4A4A4A] hover:bg-[#e6e0d4]'}`}>
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedStructure ? "Copied!" : "Copy Structure"}</span>
              </button>
            </div>
          </div>

          {/* Body Area */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {loading ? (
              <div className="text-center text-[13px] text-[#8a8a8a] py-10 font-medium">Loading data...</div>
            ) : view === "tree" ? (
              treeData ? (
                <ul className="text-[14px] text-[#1A1A1A]">
                  {Object.keys(treeData).filter(k => k !== "_info").map(key => (
                    <TreeNode key={key} nodeName={key} nodeData={treeData[key]} />
                  ))}
                </ul>
              ) : null
            ) : (
              <div className="flex flex-col gap-2">
                {historyData.map((item, index) => {
                  const date = new Date(item.commit.author.date);
                  const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  const isLatest = index === 0;

                  return (
                    <div key={item.sha} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-[#d6d1c4] rounded-xl hover:border-[#B5AC8A] transition-colors">
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-[#1A1A1A] truncate" title={item.commit.message}>
                          {isLatest && <span className="text-[#34c759] text-[11px] mr-1.5">[LATEST]</span>}
                          {item.commit.message}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[#8a8a8a] flex-wrap">
                          <span className="font-mono bg-black/5 px-1.5 py-0.5 rounded text-[#4A4A4A] font-bold">{item.sha.substring(0, 7)}</span>
                          <span>by <strong className="text-[#4A4A4A]">{item.commit.author.name}</strong></span>
                          <span>• {formattedDate}</span>
                        </div>
                      </div>
                      
                      {!isLatest ? (
                        <button 
                          onClick={() => setRollbackConfig({ isOpen: true, sha: item.sha, msg: item.commit.message })}
                          className="px-3 py-1.5 bg-[#B5AC8A] text-white text-[12px] font-semibold rounded-lg hover:bg-[#a39976] transition-all shrink-0 w-full sm:w-auto"
                        >
                          Rollback Here ⏪
                        </button>
                      ) : (
                        <span className="text-[12px] text-[#8a8a8a] font-semibold px-2 w-full sm:w-auto text-left sm:text-center">Active State</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Queue System (Only visible in tree view) */}
          {view === "tree" && (
            <div className="bg-white border-t border-[rgba(181,172,138,0.25)] p-3">
              <div className="text-[13px] font-semibold text-[#1A1A1A] mb-2 px-1">Commit Queue ({queue.length})</div>
              
              <div className="max-h-[25vh] overflow-y-auto flex flex-col gap-2 mb-3">
                {queue.length === 0 ? (
                  <div className="text-center text-[12px] text-[#8a8a8a] py-3">No files in queue</div>
                ) : (
                  queue.map((item) => (
                    <div key={item.path} className={`flex items-center justify-between p-2 rounded-lg bg-[#F5F1EC] border border-[rgba(181,172,138,0.25)] ${item.isDelete ? "border-l-2 border-l-[#ff3b30]" : ""}`}>
                      <div className="flex items-center truncate pr-4">
                        <span className="text-[12px] font-mono text-[#1A1A1A] truncate">
                          {item.isDelete && <span className="text-[#ff3b30] font-bold mr-1">[DEL]</span>}
                          {item.path}
                        </span>
                        {formatDiff(item.sizeDiff)}
                      </div>
                      <button onClick={() => removeFromQueue(item.path)} className="w-6 h-6 flex items-center justify-center rounded-md bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white transition-all shrink-0">
                        <X className="w-[14px] h-[14px]" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleCommit} disabled={committing || queue.length === 0} className="flex-1 py-2.5 text-[14px] font-semibold text-white bg-gradient-to-br from-[#6D001A] to-[#8B0022] rounded-xl hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-50">
                  {committing ? "Committing..." : "Commit"}
                </button>
                <button onClick={clearQueue} disabled={queue.length === 0} className="flex-1 py-2.5 text-[14px] font-semibold text-[#4A4A4A] bg-white border border-[rgba(181,172,138,0.4)] rounded-xl hover:bg-[#F5F1EC] transition-all disabled:opacity-50">
                  Clear
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* External Modals */}
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
      <RollbackPromptModal 
        isOpen={rollbackConfig.isOpen}
        commitSha={rollbackConfig.sha}
        commitMsg={rollbackConfig.msg}
        loading={isRollingBack}
        onCancel={() => setRollbackConfig({ ...rollbackConfig, isOpen: false })}
        onConfirm={executeRollback}
      />
      
      {/* 👇 NEW UPLOAD MODAL */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </>
  );
}