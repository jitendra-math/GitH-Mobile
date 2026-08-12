"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Code2 } from "lucide-react";
import { deleteRepo } from "@/actions/github";

export default function RepoCard({ repo }: { repo: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatSize = (kb: number) => {
    if (!kb || kb === 0) return '0 KB';
    if (kb < 1024) return `${Number(kb.toFixed(2))} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
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

  // Stack/Language ke hisaab se premium pastel colors
  const languageColors: Record<string, string> = {
    TypeScript: "text-blue-600 bg-blue-50 border border-blue-100",
    JavaScript: "text-amber-600 bg-amber-50 border border-amber-100",
    Python: "text-emerald-600 bg-emerald-50 border border-emerald-100",
    HTML: "text-orange-600 bg-orange-50 border border-orange-100",
    CSS: "text-indigo-600 bg-indigo-50 border border-indigo-100",
    Java: "text-red-600 bg-red-50 border border-red-100",
    PHP: "text-purple-600 bg-purple-50 border border-purple-100",
  };

  const langStyle = repo.language 
    ? (languageColors[repo.language] || "text-[#4A4A4A] bg-black/5 border border-transparent") 
    : "";

  return (
    <div className="p-4 bg-white rounded-xl border border-[#d6d1c4] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),_0_0_0_1px_rgba(0,0,0,0.02)] hover:border-[rgba(181,172,138,0.4)] transition-all duration-200">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        
        {/* Left Side: Details */}
        <div className="flex flex-col gap-2 min-w-0">
          
          {/* Header: Name + Visibility Badge */}
          <div className="flex items-center gap-2.5">
            <div className="text-[15px] font-semibold text-[#1A1A1A] truncate leading-none">
              {repo.name}
            </div>
            {repo.private ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase whitespace-nowrap leading-none shrink-0 text-[#ff3b30] bg-[#ff3b30]/10 border border-[#ff3b30]/20">
                Private
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase whitespace-nowrap leading-none shrink-0 text-[#34c759] bg-[#34c759]/10 border border-[#34c759]/20">
                Public
              </span>
            )}
          </div>
          
          {/* Bottom: Stack & Size */}
          <div className="flex flex-wrap items-center gap-2">
            {repo.language && (
              <span className={`flex items-center gap-1 text-[11px] px-[10px] py-[3.5px] rounded-full font-semibold whitespace-nowrap leading-none shrink-0 ${langStyle}`}>
                <Code2 className="w-3 h-3" />
                {repo.language}
              </span>
            )}
            
            <span className="text-[11px] px-[10px] py-[3.5px] rounded-full font-semibold whitespace-nowrap leading-none shrink-0 text-[#4A4A4A] bg-black/5 border border-transparent">
              {formatSize(repo.size)}
            </span>
          </div>
        </div>

        {/* Right Side: Action Buttons (Fully Rounded) */}
        <div className="flex items-center gap-2 shrink-0 justify-end">
          <button 
            onClick={handleDownload}
            className="w-10 h-10 flex items-center justify-center p-0 rounded-full bg-black/5 text-[#4A4A4A] border-none cursor-pointer transition-all duration-150 hover:bg-[#6D001A]/10 hover:text-[#6D001A] hover:scale-[1.08]"
            title="Download ZIP"
          >
            <Download className="w-[18px] h-[18px] stroke-[2.5]" />
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center p-0 rounded-full bg-black/5 text-[#4A4A4A] border-none cursor-pointer transition-all duration-150 hover:bg-[#ff3b30]/10 hover:text-[#ff3b30] hover:scale-[1.08] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Repository"
          >
            <Trash2 className="w-[18px] h-[18px] stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
}
