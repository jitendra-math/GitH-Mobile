"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Pencil } from "lucide-react";
import { deleteRepo } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";

export default function RepoCard({ repo }: { repo: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const openModal = useEditStore((state) => state.openModal);

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
    <div className="flex flex-col bg-white rounded-xl border border-[#d6d1c4] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),_0_0_0_1px_rgba(0,0,0,0.02)] hover:border-[rgba(181,172,138,0.4)] transition-all duration-200 overflow-hidden">
      
      {/* Upper Section: Repo Name Only (Light Ivory Background) */}
      <div className="bg-[#F5F1EC] p-4 flex items-center">
        <div className="text-[15px] font-semibold text-[#1A1A1A] leading-snug break-words">
          {repo.name}
        </div>
      </div>

      {/* Lower Section: Action Toolbar (White Background) */}
      <div className="bg-white p-2 px-3.5 flex items-center justify-end gap-2.5 border-t border-[rgba(181,172,138,0.25)]">
        
        <button 
          onClick={() => openModal(repo.owner.login, repo.name, repo.default_branch || "main")}
          className="w-8 h-8 flex items-center justify-center p-0 rounded-full bg-[#B5AC8A]/15 text-[#B5AC8A] border-none cursor-pointer transition-all duration-150 hover:bg-[#B5AC8A] hover:text-white hover:scale-[1.08]"
          title="Edit Repository"
        >
          <Pencil className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button 
          onClick={handleDownload}
          className="w-8 h-8 flex items-center justify-center p-0 rounded-full bg-[#6D001A]/10 text-[#6D001A] border-none cursor-pointer transition-all duration-150 hover:bg-[#6D001A] hover:text-white hover:scale-[1.08]"
          title="Download ZIP"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
        </button>
        
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center p-0 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] border-none cursor-pointer transition-all duration-150 hover:bg-[#ff3b30] hover:text-white hover:scale-[1.08] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Repository"
        >
          <Trash2 className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}
