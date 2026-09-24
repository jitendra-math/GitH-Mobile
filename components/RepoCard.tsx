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
  ChevronDown,
} from "lucide-react";
import { deleteRepo, fetchBranches } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";
import DangerConfirmModal from "./DangerConfirmModal";
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

  // Full repo path — used for delete confirmation
  const fullRepoPath = `${repo.owner.login}/${repo.name}`;

  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]">

        {/* Upper Section: Repo Name + Badges */}
        <div className="bg-white p-3.5 flex items-center justify-between gap-3">
          <div
            onClick={() => setIsInfoModalOpen(true)}
            className="text-[15px] font-semibold text-black leading-snug truncate flex-1 min-w-0 cursor-pointer active:opacity-60 transition-opacity"
            title={`View details for ${repo.name}`}
          >
            {repo.name}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {language && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#F2F2F7] text-black/70">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: langColor || "#808080" }}
                />
                {language}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                isPrivate
                  ? "bg-[#FF9500]/10 text-[#FF9500]"
                  : "bg-[#34C759]/10 text-[#34C759]"
              }`}
            >
              {isPrivate ? (
                <Lock className="w-2.5 h-2.5" strokeWidth={2.5} />
              ) : (
                <Globe className="w-2.5 h-2.5" strokeWidth={2.5} />
              )}
              {isPrivate ? "Private" : "Public"}
            </span>
          </div>
        </div>

        {/* Lower Section: Action Toolbar */}
        <div className="bg-[#F2F2F7] p-2 px-3.5 flex items-center justify-between gap-2.5 border-t border-[#C6C6C8]/40">

          {/* Branch Selector */}
          <div className="relative flex items-center gap-1.5 bg-white border border-[#C6C6C8]/50 rounded-lg px-2 py-1 min-w-0">
            <GitBranch className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" strokeWidth={2.2} />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              onFocus={handleFetchBranches}
              onClick={handleFetchBranches}
              className="bg-transparent text-[11px] font-medium text-black outline-none cursor-pointer max-w-[100px] sm:max-w-[150px] appearance-none pr-3 truncate"
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
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-3 h-3 text-[#8E8E93]" strokeWidth={3} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openModal(repo.owner.login, repo.name, selectedBranch)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#007AFF]/15 text-[#007AFF] transition-all duration-150 active:bg-[#007AFF] active:text-white"
              title="Edit Repository"
            >
              <Pencil className="w-4 h-4" strokeWidth={2.4} />
            </button>

            <button
              onClick={handleDownload}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#34C759]/15 text-[#34C759] transition-all duration-150 active:bg-[#34C759] active:text-white"
              title="Download ZIP"
            >
              <Download className="w-4 h-4" strokeWidth={2.4} />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FF3B30]/15 text-[#FF3B30] transition-all duration-150 active:bg-[#FF3B30] active:text-white"
              title="Delete Repository"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.4} />
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
      <DangerConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Repository"
        description="This action is permanent and cannot be undone. The following repository will be deleted:"
        highlight={fullRepoPath}
        instructionPrefix="Type"
        instructionSuffix="below to confirm"
        expectedValue={fullRepoPath}
        caseSensitive={true}
        variant="destructive"
        confirmText="Delete"
        loading={isDeleting}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />
    </>
  );
}