"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Pencil, Globe, Lock } from "lucide-react";
import { deleteRepo } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";

// Common language colors (fallback #808080 for unknown)
const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  React: "#61dafb", // not official but common
  default: "#808080",
};

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

  // Visibility badge
  const isPrivate = repo.private;
  const visibilityLabel = isPrivate ? "Private" : "Public";
  const visibilityIcon = isPrivate ? (
    <Lock className="w-2.5 h-2.5" />
  ) : (
    <Globe className="w-2.5 h-2.5" />
  );
  const visibilityColor = isPrivate
    ? "bg-amber-100 text-amber-800 border-amber-200"
    : "bg-emerald-100 text-emerald-800 border-emerald-200";

  // Language badge
  const language = repo.language || null;
  const langColor = language ? languageColors[language] || languageColors.default : null;

  return (
    <div className="flex flex-col bg-white rounded-xl border border-[#d6d1c4] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),_0_0_0_1px_rgba(0,0,0,0.02)] hover:border-[rgba(181,172,138,0.4)] transition-all duration-200 overflow-hidden">
      
      {/* Upper Section: Repo Name + Badges Inline (Light Ivory Background) */}
      <div className="bg-[#F5F1EC] p-3.5 flex flex-wrap items-center gap-2">
        
        {/* Repo Name */}
        <div className="text-[15px] font-semibold text-[#1A1A1A] leading-snug break-words mr-1">
          {repo.name}
        </div>

        {/* Language Badge */}
        {language && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white/80 border border-[rgba(181,172,138,0.3)] shadow-sm">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: langColor || "#808080" }}
            />
            {language}
          </span>
        )}

        {/* Visibility Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${visibilityColor} shadow-sm`}
        >
          {visibilityIcon}
          {visibilityLabel}
        </span>

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
