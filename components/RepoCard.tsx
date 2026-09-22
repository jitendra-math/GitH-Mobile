"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Pencil, Globe, Lock, GitBranch } from "lucide-react";
import { deleteRepo, fetchBranches } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";
import DeleteConfirmModal from "./DeleteConfirmModal";
import RepoInfoModal from "./RepoInfoModal";

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
  React: "#61dafb",
  default: "#808080",
};

export default function RepoCard({ repo }: { repo: any }) {
  const router = useRouter();
  const openModal = useEditStore((state) => state.openModal);

  // States for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for Info Modal
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // States for Branch Selector
  const defaultBranch = repo.default_branch || "main";
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState([{ name: defaultBranch }]);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);

  // Lazy load branches on focus/click
  const handleFetchBranches = async () => {
    if (branches.length > 1 || isFetchingBranches) return;

    setIsFetchingBranches(true);
    try {
      const data = await fetchBranches(repo.owner.login, repo.name);
      if (data && Array.isArray(data)) {
        setBranches(data);
      }
    } catch (err) {
      console.error("Failed to fetch branches", err);
    } finally {
      setIsFetchingBranches(false);
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRepo(repo.owner.login, repo.name);
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (err) {
      alert("Failed to delete repo");
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    window.open(`${repo.html_url}/archive/refs/heads/${selectedBranch}.zip`);
  };

  // Visibility & Language Badges
  const isPrivate = repo.private;
  const visibilityLabel = isPrivate ? "Private" : "Public";
  const visibilityIcon = isPrivate ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />;
  const visibilityColor = isPrivate
    ? "bg-amber-100 text-amber-800 border-amber-200"
    : "bg-emerald-100 text-emerald-800 border-emerald-200";

  const language = repo.language || null;
  const langColor = language ? languageColors[language] || languageColors.default : null;

  return (
    <>
      <div className="flex flex-col bg-white rounded-xl border border-[#d6d1c4] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),_0_0_0_1px_rgba(0,0,0,0.02)] hover:border-[rgba(181,172,138,0.4)] transition-all duration-200 overflow-hidden">

        {/* Upper Section: Repo Name (clickable → opens Info Modal) + Badges (Fixed Right) */}
        <div className="bg-[#F5F1EC] p-3.5 flex items-center justify-between gap-3">
          <div
            onClick={() => setIsInfoModalOpen(true)}
            className="text-[15px] font-semibold text-[#1A1A1A] leading-snug truncate flex-1 min-w-0 cursor-pointer hover:text-[#6D001A] transition-colors"
            title={`View details for ${repo.name}`}
          >
            {repo.name}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {language && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white/80 border border-[rgba(181,172,138,0.3)] shadow-sm">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: langColor || "#808080" }}
                />
                {language}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${visibilityColor} shadow-sm`}
            >
              {visibilityIcon}
              {visibilityLabel}
            </span>
          </div>
        </div>

        {/* Lower Section: Action Toolbar (Branch Selector + Buttons) */}
        <div className="bg-white p-2 px-3.5 flex items-center justify-between gap-2.5 border-t border-[rgba(181,172,138,0.25)]">

          {/* Branch Selector (Left Side) */}
          <div className="relative flex items-center gap-1.5 bg-[#F5F1EC] border border-[rgba(181,172,138,0.3)] rounded-lg px-2 py-1">
            <GitBranch className="w-3.5 h-3.5 text-[#8a8a8a] shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              onFocus={handleFetchBranches}
              onClick={handleFetchBranches}
              className="bg-transparent text-[11px] font-medium text-[#4A4A4A] outline-none cursor-pointer max-w-[100px] sm:max-w-[150px] appearance-none pr-3 truncate"
              title="Select Branch"
            >
              {isFetchingBranches && branches.length === 1 ? (
                <option value={defaultBranch}>Loading...</option>
              ) : (
                branches.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))
              )}
            </select>
            {/* Custom dropdown arrow to replace native appearance */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#8a8a8a]">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Action Buttons (Right Side) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openModal(repo.owner.login, repo.name, selectedBranch)}
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
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center p-0 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] border-none cursor-pointer transition-all duration-150 hover:bg-[#ff3b30] hover:text-white hover:scale-[1.08]"
              title="Delete Repository"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal (opens on repo name click) */}
      <RepoInfoModal
        isOpen={isInfoModalOpen}
        repo={repo}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        repoName={repo.name}
        loading={isDeleting}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />
    </>
  );
}