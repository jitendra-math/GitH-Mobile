"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Pencil, Globe, Lock } from "lucide-react";
import { deleteRepo } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";

// Language colors (common ones) – fallback grey
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
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  React: "#61dafb", // not official but fine
};

// Get a readable color for the language dot
function getLanguageColor(lang: string | null): string {
  if (!lang) return "#8a8a8a";
  return languageColors[lang] || "#8a8a8a";
}

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

  const isPrivate = repo.private;
  const language = repo.language || null;
  const description = repo.description || null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-gray-300/70 transition-all duration-300 overflow-hidden">
      
      {/* Main content */}
      <div className="p-4 pb-2">
        {/* Row: Name + Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {repo.name}
            </h3>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Visibility badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isPrivate
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isPrivate ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Globe className="w-3 h-3" />
              )}
              {isPrivate ? "Private" : "Public"}
            </span>

            {/* Language badge (if exists) */}
            {language && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getLanguageColor(language) }}
                />
                {language}
              </span>
            )}
          </div>
        </div>

        {/* Description (if any) */}
        {description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Action toolbar */}
      <div className="flex items-center justify-end gap-1 px-4 py-2 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={() => openModal(repo.owner.login, repo.name, repo.default_branch || "main")}
          className="p-2 rounded-full text-gray-500 hover:text-[#B5AC8A] hover:bg-[#B5AC8A]/10 transition-all duration-200"
          title="Edit Repository"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={handleDownload}
          className="p-2 rounded-full text-gray-500 hover:text-[#6D001A] hover:bg-[#6D001A]/10 transition-all duration-200"
          title="Download ZIP"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Repository"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}