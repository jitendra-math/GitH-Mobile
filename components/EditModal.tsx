"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Copy, CopyCheck } from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import { getRepoTree, commitMultipleFiles } from "@/actions/github";
import { generateTreeText } from "@/lib/utils";
import TreeNode from "./TreeNode";
import BulkActionModal from "./BulkActionModal";

export default function EditModal() {
  const { isOpen, owner, repo, branch, queue, closeModal, removeFromQueue, clearQueue } = useEditStore();
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  
  // States for new features
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [copiedStructure, setCopiedStructure] = useState(false);

  // Helper function to format byte differences
  const formatDiff = (bytes?: number) => {
    if (bytes === undefined) return null;
    const kb = (Math.abs(bytes) / 1024).toFixed(2);
    if (bytes > 0) return <span className="text-[#34c759] bg-[#34c759]/10 px-1.5 py-0.5 rounded text-[10px] ml-2">+{kb} KB</span>;
    if (bytes < 0) return <span className="text-[#ff3b30] bg-[#ff3b30]/10 px-1.5 py-0.5 rounded text-[10px] ml-2">-{kb} KB</span>;
    return <span className="text-[#8a8a8a] bg-black/5 px-1.5 py-0.5 rounded text-[10px] ml-2">0 KB</span>;
  };

  // Reusable function to fetch/refresh the tree
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
      .catch(() => alert("Failed to load file structure."))
      .finally(() => setLoading(false));
  }, [owner, repo, branch]);

  useEffect(() => {
    if (isOpen) {
      loadTree();
    }
  }, [isOpen, loadTree]);

  const handleCommit = async () => {
    if (queue.length === 0) return alert("Queue is empty");
    if (!confirm(`Commit ${queue.length} files?`)) return;

    setCommitting(true);
    try {
      const res = await commitMultipleFiles(owner, repo, branch, queue);
      if (res.error) throw new Error(res.error);
      alert("Commit successful 🚀");
      clearQueue();
      loadTree(); 
    } catch (err: any) {
      alert("Commit failed: " + err.message);
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
      alert("Failed to copy structure");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-start justify-center pt-8 pb-4 px-4 bg-[#1A1A1A]/35 backdrop-blur-md animate-in fade-in duration-200">
        <div className="flex flex-col bg-[#F5F1EC]/90 backdrop-blur-xl w-full max-w-[880px] max-h-[calc(100vh-48px)] rounded-[18px] shadow-[0_12px_32px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(0,0,0,0.03)] border border-white/60 overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 px-4 bg-white/60 backdrop-blur-md border-b border-[rgba(181,172,138,0.25)] sticky top-0 z-10">
            <h3 className="text-[14px] font-semibold text-[#1A1A1A] truncate flex-1 pr-4">
              {owner}/{repo} <span className="text-[#8a8a8a] font-normal">({branch})</span>
            </h3>
            
            {/* Header Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={() => setIsBulkModalOpen(true)} 
                className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg bg-[#6D001A] text-white hover:bg-[#8B0022] transition-colors text-[12px] font-semibold shadow-sm"
                title="Bulk Actions"
              >
                <CopyCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bulk Actions</span>
              </button>

              <button 
                onClick={handleCopyStructure} 
                className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg transition-colors text-[12px] font-semibold shadow-sm ${copiedStructure ? 'bg-[#34c759] text-white' : 'bg-[#B5AC8A] text-white hover:bg-[#a39976]'}`}
                title="Copy Structure"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copiedStructure ? "Copied!" : "Structure"}</span>
              </button>

              <div className="w-[1px] h-4 bg-[#d6d1c4] mx-1"></div>

              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ff3b30]/10 hover:text-[#ff3b30] text-[#8a8a8a] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {loading ? (
              <div className="text-center text-[13px] text-[#8a8a8a] py-10 font-medium">Folder structure load ho raha hai...</div>
            ) : treeData ? (
              <ul className="text-[14px] text-[#1A1A1A]">
                {Object.keys(treeData).filter(k => k !== "_info").map(key => (
                  <TreeNode key={key} nodeName={key} nodeData={treeData[key]} />
                ))}
              </ul>
            ) : null}
          </div>

          {/* Queue System */}
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

        </div>
      </div>

      <BulkActionModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        owner={owner}
        repo={repo}
        branch={branch}
        treeData={treeData}
        setTreeData={setTreeData}
      />
    </>
  );
}
