"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useEditStore } from "@/store/useEditStore";
import { getRepoTree, commitMultipleFiles } from "@/actions/github";
import TreeNode from "./TreeNode";

export default function EditModal() {
  const { isOpen, owner, repo, branch, queue, closeModal, removeFromQueue, clearQueue } = useEditStore();
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setTreeData(null);
      getRepoTree(owner, repo, branch)
        .then((flatTree) => {
          // Convert flat GitHub tree to Nested Object Tree
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
    }
  }, [isOpen, owner, repo, branch]);

  const handleCommit = async () => {
    if (queue.length === 0) return alert("Queue is empty");
    if (!confirm(`Commit ${queue.length} files?`)) return;

    setCommitting(true);
    try {
      const res = await commitMultipleFiles(owner, repo, branch, queue);
      if (res.error) throw new Error(res.error);
      alert("Commit successful 🚀");
      closeModal();
    } catch (err: any) {
      alert("Commit failed: " + err.message);
    } finally {
      setCommitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-4 px-4 bg-[#1A1A1A]/35 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex flex-col bg-[#F5F1EC]/90 backdrop-blur-xl w-full max-w-[880px] max-h-[calc(100vh-48px)] rounded-[18px] shadow-[0_12px_32px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(0,0,0,0.03)] border border-white/60 overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 px-4 bg-white/60 backdrop-blur-md border-b border-[rgba(181,172,138,0.25)] sticky top-0 z-10">
          <h3 className="text-[14px] font-semibold text-[#1A1A1A] truncate hover:text-[#6D001A] transition-colors cursor-pointer">
            {owner}/{repo} <span className="text-[#8a8a8a] font-normal">({branch})</span>
          </h3>
          <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#ff3b30]/10 hover:text-[#ff3b30] text-[#8a8a8a] transition-all">
            <X className="w-5 h-5" />
          </button>
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
                  <span className="text-[12px] font-mono text-[#1A1A1A] truncate pr-4">
                    {item.isDelete && <span className="text-[#ff3b30] font-bold mr-1">[DEL]</span>}
                    {item.path}
                  </span>
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
  );
}
