"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Globe, Download, Trash2 } from "lucide-react";
import { deleteRepo } from "@/actions/github";

export default function RepoCard({ repo }: { repo: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <div className="flex items-center justify-between p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex flex-col gap-1 overflow-hidden mr-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">
            {repo.private ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
          </span>
          <h3 className="text-base font-semibold text-slate-800 truncate">{repo.name}</h3>
        </div>
        {repo.description && (
          <p className="text-xs text-slate-500 truncate">{repo.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={handleDownload}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          title="Download Zip"
        >
          <Download className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="Delete Repository"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
