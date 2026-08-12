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

  // Language ke hisaab se dynamic colors
  const languageColors: Record<string, string> = {
    TypeScript: "bg-blue-50 text-blue-600 border-blue-200",
    JavaScript: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Python: "bg-emerald-50 text-emerald-600 border-emerald-200",
    HTML: "bg-orange-50 text-orange-600 border-orange-200",
    CSS: "bg-indigo-50 text-indigo-600 border-indigo-200",
    Java: "bg-red-50 text-red-600 border-red-200",
  };
  
  // Agar koi aur language ho toh default color
  const langStyle = repo.language 
    ? (languageColors[repo.language] || "bg-slate-50 text-slate-600 border-slate-200") 
    : "";

  return (
    <div className="flex items-start justify-between p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex flex-col gap-1.5 overflow-hidden mr-3 w-full">
        {/* Header: Name + Visibility */}
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-slate-800 truncate">{repo.name}</h3>
          <span className="shrink-0">
            {repo.private ? <Lock className="h-3 w-3 text-amber-500" /> : <Globe className="h-3 w-3 text-blue-500" />}
          </span>
        </div>

        {/* Description */}
        {repo.description && (
          <p className="text-[13px] text-slate-500 line-clamp-1">{repo.description}</p>
        )}

        {/* Meta Info (Stack + Size) with Colors */}
        <div className="flex items-center gap-2 mt-1">
          {repo.language && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${langStyle}`}>
              <CircleDot className="h-2.5 w-2.5" />
              <span className="text-[10px] font-semibold tracking-wide uppercase">{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">
            <Database className="h-2.5 w-2.5" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">{formatSize(repo.size)}</span>
          </div>
        </div>
      </div>

      {/* Buttons (Right side) */}
      <div className="flex flex-col gap-2 shrink-0 pt-0.5">
        <button 
          onClick={handleDownload}
          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          title="Download Zip"
        >
          <Download className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="Delete Repository"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
