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
  FolderGit2,
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
      if (data && Array.isArray(data)) setBranches(data);
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

  // iOS Settings style — blue for public, orange for private
  const iconColor = isPrivate ? "#FF9500" : "#007AFF";

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Main Row — tap opens Info modal */}
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 active:bg-black/[0.04] transition-colors text-left"
        >
          {/* iOS App Icon style square */}
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconColor }}
          >
            <FolderGit2 className="w-[22px] h-[22px] text-white" strokeWidth={2.2} />
          </div>

          {/* Text block */}
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
            <div className="flex items-center gap-1.5 mt-0.5">
              {language && (
                <>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: langColor || "#808080" }}
                  />
                  <span className="text-[13px] text-[#8E8E93] truncate">{language}</span>
                  <span className="text-[#C6C6C8] text-[11px]">·</span>
                </>
              )}
              <span className="text-[13px] text-[#8E8E93]">
                {isPrivate ? "Private" : "Public"}
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#C6C6C8] shrink-0" strokeWidth={2.5} />
        </button>

        {/* Actions Row */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-[#C6C6C8]/25">
          {/* Branch chip */}
          <div className="relative flex items-center gap-1 bg-[#F2F2F7] rounded-lg pl-2 pr-1 py-1 min-w-0 max-w-[50%]">
            <GitBranch className="w-3 h-3 text-[#8E8E93] shrink-0" strokeWidth={2.2} />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              onFocus={handleFetchBranches}
              onClick={handleFetchBranches}
              className="bg-transparent text-[12px] font-medium text-black outline-none cursor-pointer appearance-none truncate w-full pr-3"
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
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
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

          {/* Action icons — plain, iOS style */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => openModal(repo.owner.login, repo.name, selectedBranch)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#007AFF] active:bg-[#007AFF]/10 transition-colors"
              title="Edit Repository"
            >
              <Pencil className="w-4 h-4" strokeWidth={2.2} />
            </button>

            <button
              onClick={handleDownload}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8E8E93] active:bg-black/5 transition-colors"
              title="Download ZIP"
            >
              <Download className="w-4 h-4" strokeWidth={2.2} />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#FF3B30] active:bg-[#FF3B30]/10 transition-colors"
              title="Delete Repository"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <RepoInfoModal
        isOpen={isInfoModalOpen}
        repo={repo}
        onClose={() => setIsInfoModalOpen(false)}
      />

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