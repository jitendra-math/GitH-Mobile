"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Trash2,
  Pencil,
  Globe,
  Lock,
  GitBranch,
  ChevronRight,
} from "lucide-react";
import { deleteRepo, fetchBranches } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";
import DeleteConfirmModal from "./DeleteConfirmModal";
import RepoInfoModal from "./RepoInfoModal";

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const defaultBranch = repo.default_branch || "main";
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState([{ name: defaultBranch }]);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);

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

  const isPrivate = repo.private;
  const language = repo.language || null;
  const langColor = language ? languageColors[language] || languageColors.default : null;

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Top Row: Repo info (tappable) */}
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="w-full flex items-center justify-between gap-3 px-4 pt-3.5 pb-3 active:bg-black/[0.03] transition-colors text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-[16px] font-semibold text-black truncate leading-tight">
                {repo.name}
              </h3>
              {isPrivate ? (
                <Lock className="w-3 h-3 text-[#FF9500] shrink-0" strokeWidth={2.5} />
              ) : (
                <Globe className="w-3 h-3 text-[#8E8E93] shrink-0" strokeWidth={2.5} />
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {language && (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-[#8E8E93]">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: langColor || "#808080" }}
                  />
                  {language}
                </span>
              )}
              {language && <span className="text-[#C6C6C8] text-[10px]">·</span>}
              <span className="text-[12px] text-[#8E8E93]">
                {isPrivate ? "Private" : "Public"}
              </span>
            </div>
          </div>

          <ChevronRight
            className="w-4 h-4 text-[#C6C6C8] shrink-0"
            strokeWidth={2.5}
          />
        </button>

        {/* Bottom Row: Branch selector + Actions */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-[#C6C6C8]/25 bg-[#F2F2F7]/40">
          {/* Branch Selector */}
          <div className="relative flex items-center gap-1.5 bg-white rounded-lg pl-2 pr-1 py-1.5 border border-[#C6C6C8]/50 min-w-0 max-w-[55%]">
            <GitBranch className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" strokeWidth={2.2} />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              onFocus={handleFetchBranches}
              onClick={handleFetchBranches}
              className="bg-transparent text-[12px] font-medium text-black outline-none cursor-pointer appearance-none truncate w-full"
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
            <div className="pointer-events-none pr-1 shrink-0">
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#8E8E93]"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => openModal(repo.owner.login, repo.name, selectedBranch)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#007AFF]/10 text-[#007AFF] active:bg-[#007AFF]/20 transition-colors"
              title="Edit Repository"
            >
              <Pencil className="w-4 h-4" strokeWidth={2.2} />
            </button>

            <button
              onClick={handleDownload}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#34C759]/10 text-[#34C759] active:bg-[#34C759]/20 transition-colors"
              title="Download ZIP"
            >
              <Download className="w-4 h-4" strokeWidth={2.2} />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FF3B30]/10 text-[#FF3B30] active:bg-[#FF3B30]/20 transition-colors"
              title="Delete Repository"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <RepoInfoModal
        isOpen={isInfoModalOpen}
        repo={repo}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Delete Confirm */}
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