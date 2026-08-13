"use client";

import { useState } from "react";
import { Folder, FolderOpen, FileText } from "lucide-react";
import { formatSize, encodeBase64, decodeBase64 } from "@/lib/utils";
import { getFileContent } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";

export default function TreeNode({ nodeName, nodeData }: { nodeName: string, nodeData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Yahan queue aur edit states ko nikal liya hai
  const { owner, repo, branch, addToQueue, queue, isEditMode, setEditingFile } = useEditStore();

  const isFolder = nodeData._info.type === "tree";
  const info = nodeData._info;

  const queuedItem = !isFolder ? queue.find(q => q.path === info.path) : null;

  // --- SMART BUTTON MATRIX LOGIC ---
  const sizeKB = (info.size || 0) / 1024;
  const isLarge = sizeKB > 100; // Scenario 2 check (> 100 KB)
  const isBinary = Boolean(
    info.path?.match(/\.(png|jpe?g|gif|ico|webp|mp4|mp3|ttf|woff2?|eot|pdf|zip|tar|gz|rar|7z)$/i)
  ); // Scenario 3 check (Media/Binary)

  const handleCopy = async () => {
    setLoading(true);
    try {
      const data = await getFileContent(owner, repo, info.path, branch);
      const decoded = decodeBase64(data.content);
      await navigator.clipboard.writeText(decoded);
    } catch (err: any) {
      alert("Copy failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const data = await getFileContent(owner, repo, info.path, branch);
      const cleanBase64 = data.content.replace(/\s/g, ''); 
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nodeName; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); 
    } catch (err: any) {
      alert("Download failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return alert("Clipboard is empty!");
      if (!confirm(`Replace "${info.path}" with clipboard content?`)) return;

      const oldSize = info.size || 0;
      const newSize = new Blob([text]).size;
      const sizeDiff = newSize - oldSize;

      const contentBase64 = encodeBase64(text);
      addToQueue({ path: info.path, sha: info.sha, contentBase64, isDelete: false, sizeDiff });
    } catch (err: any) {
      alert("Replace failed: " + err.message);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const data = await getFileContent(owner, repo, info.path, branch);
      const decoded = decodeBase64(data.content);
      
      // Store mein file bhej do taaki modal open ho jaye
      setEditingFile({ 
        path: info.path, 
        sha: info.sha, 
        content: decoded, 
        oldSize: info.size || 0 
      });
    } catch (err: any) {
      alert("Edit failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${info.path}"? It will be added to the queue.`)) return;
    const oldSize = info.size || 0;
    addToQueue({ path: info.path, sha: info.sha, isDelete: true, sizeDiff: -oldSize });
  };

  const childKeys = Object.keys(nodeData).filter(k => k !== "_info").sort((a, b) => {
    const isDirA = nodeData[a]._info.type === "tree";
    const isDirB = nodeData[b]._info.type === "tree";
    if (isDirA && !isDirB) return -1;
    if (!isDirA && isDirB) return 1;
    return a.localeCompare(b);
  });

  return (
    <li className="list-none m-0 p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-black/5 transition-all mb-0.5 group">
        
        {isFolder ? (
          <div className="flex items-center gap-2.5 flex-1 min-w-0" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FolderOpen className="w-[18px] h-[18px] text-[#B5AC8A] shrink-0" /> : <Folder className="w-[18px] h-[18px] text-[#B5AC8A] shrink-0" />}
            <span className="font-medium text-[14px] truncate text-[#1A1A1A]">{nodeName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <FileText className="w-[18px] h-[18px] text-[#8a8a8a] shrink-0 group-hover:text-[#6D001A] transition-colors" />
            <div className="flex flex-col min-w-0">
              <span className={`font-medium text-[14px] truncate ${queuedItem?.isDelete ? 'line-through text-[#ff3b30] opacity-75' : 'text-[#1A1A1A]'}`}>
                {nodeName}
              </span>
              <span className="text-[11px] text-[#8a8a8a] font-mono opacity-75">
                {formatSize(sizeKB)}
                {queuedItem && queuedItem.sizeDiff !== undefined && queuedItem.sizeDiff !== 0 && (
                  <span className={`ml-1.5 font-bold ${queuedItem.sizeDiff > 0 ? "text-[#34c759]" : "text-[#ff3b30]"}`}>
                    {queuedItem.sizeDiff > 0 ? "+" : ""}{(queuedItem.sizeDiff / 1024).toFixed(2)} KB
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        {!isFolder && (
          <div className="flex items-center gap-2 mt-2 md:mt-0 pl-[28px] md:pl-0 w-full md:w-auto md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all shrink-0">
            
            {/* COPY / DOWNLOAD */}
            {isBinary || isLarge ? (
              <button onClick={handleDownload} disabled={loading} className="flex-1 md:flex-none px-3 py-1.5 text-[12px] font-semibold text-white bg-[#6D001A] rounded-xl hover:-translate-y-px hover:shadow-sm transition-all disabled:opacity-50">
                {loading ? "..." : "Download"}
              </button>
            ) : (
              <button onClick={handleCopy} disabled={loading} className="flex-1 md:flex-none px-3 py-1.5 text-[12px] font-semibold text-white bg-[#6D001A] rounded-xl hover:-translate-y-px hover:shadow-sm transition-all disabled:opacity-50">
                {loading ? "..." : "Copy"}
              </button>
            )}

            {/* EDIT / REPLACE SWITCH */}
            {!isBinary && (
              isEditMode ? (
                <button onClick={handleEdit} disabled={loading} className="flex-1 md:flex-none px-3 py-1.5 text-[12px] font-semibold text-white bg-[#34c759] rounded-xl hover:-translate-y-px hover:shadow-sm transition-all disabled:opacity-50">
                  {loading ? "..." : "Edit"}
                </button>
              ) : (
                <button onClick={handleReplace} disabled={loading} className="flex-1 md:flex-none px-3 py-1.5 text-[12px] font-semibold text-white bg-[#B5AC8A] rounded-xl hover:-translate-y-px hover:shadow-sm transition-all disabled:opacity-50">
                  Replace
                </button>
              )
            )}

            {/* DELETE */}
            <button onClick={handleDelete} disabled={loading} className="flex-1 md:flex-none px-3 py-1.5 text-[12px] font-semibold text-white bg-gradient-to-br from-[#ff3b30] to-[#ff453a] rounded-xl hover:-translate-y-px hover:shadow-sm transition-all disabled:opacity-50">
              Delete
            </button>
          </div>
        )}
      </div>

      {isFolder && isOpen && (
        <ul className="pl-5 border-l border-[rgba(181,172,138,0.25)] ml-2 mt-0.5 animate-in fade-in slide-in-from-top-1">
          {childKeys.map(key => (
            <TreeNode key={key} nodeName={key} nodeData={nodeData[key]} />
          ))}
        </ul>
      )}
    </li>
  );
}
