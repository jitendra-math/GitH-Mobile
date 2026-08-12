"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Globe, Download, Trash2, CircleDot, Database } from "lucide-react";
import { deleteRepo } from "@/actions/github";

export default function RepoCard({ repo }: { repo: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatSize = (kb: number) => {
    return kb >= 1024 ? (kb / 1024).toFixed(1) + " MB" : kb + " KB";
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${repo.name}?`)) return;
    
    setLoading(true);
    try {
      await deleteRepo(repo.owner.login, repo.name);
      router.refresh();
    } catch (err) {
      alert("Failed to delete repo");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const defaultBranch = repo.default_branch || "main";
    window.open(`${repo.html_url}/archive/refs/heads/${defaultBranch}.zip`);
  };

  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex flex-col gap-2 overflow-hidden mr-4 w-full">
        {/* Header: Name + Visibility */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-800 truncate">{repo.name}</h3>
          <span className="text-slate-400 shrink-0">
            {repo.private ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
          </span>
        </div>

        {/* Description */}
        {repo.description && (
          <p className="text-sm text-slate-600 line-clamp-2">{repo.description}</p>
        )}

        {/* Meta Info (Stack + Size) */}
        <div className="flex items-center gap-3 mt-1">
          {repo.language && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
              <CircleDot className="h-3 w-3 text-slate-500" />
              <span className="text-[11px] font-medium text-slate-600">{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            <Database className="h-3 w-3 text-slate-500" />
            <span className="text-[11px] font-medium text-slate-600">{formatSize(repo.size)}</span>
          </div>
        </div>
      </div>

      {/* Buttons (Right side) */}
      <div className="flex flex-col gap-1 shrink-0">
        <button 
          onClick={handleDownload}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          title="Download Zip"
        >
          <Download className="h-5 w-5" />
        </button>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="Delete Repository"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
