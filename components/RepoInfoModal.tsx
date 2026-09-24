"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Globe,
  Lock,
  Code2,
  Calendar,
  GitCommit,
  Pencil,
} from "lucide-react";
import { fetchCommitHistory } from "@/actions/github";
import RepoSettingsModal from "./RepoSettingsModal";

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

interface RepoInfoModalProps {
  isOpen: boolean;
  repo: any;
  onClose: () => void;
}

export default function RepoInfoModal({
  isOpen,
  repo,
  onClose,
}: RepoInfoModalProps) {
  const [lastCommit, setLastCommit] = useState<{
    sha: string;
    date: string;
  } | null>(null);
  const [loadingCommit, setLoadingCommit] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && repo) {
      setLoadingCommit(true);
      setLastCommit(null);
      const branch = repo.default_branch || "main";
      fetchCommitHistory(repo.owner.login, repo.name, branch)
        .then((commits) => {
          if (commits && commits[0]) {
            setLastCommit({
              sha: commits[0].sha.substring(0, 7),
              date: commits[0].commit.author.date,
            });
          }
        })
        .catch((err) => console.error("Failed to fetch last commit:", err))
        .finally(() => setLoadingCommit(false));
    }
  }, [isOpen, repo]);

  if (!repo) return null;

  const isPrivate = repo.private;
  const language = repo.language;
  const langColor = language
    ? languageColors[language] || languageColors.default
    : null;

  const handleVisit = () => {
    window.open(repo.html_url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-[400px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* iOS Grabber (mobile) */}
              <div className="sm:hidden flex justify-center pt-2 pb-1">
                <div className="w-9 h-[5px] rounded-full bg-black/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-3">
                <h2 className="text-[16px] font-semibold text-black tracking-tight">
                  Repository
                </h2>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#007AFF]/15 text-[#007AFF] active:bg-[#007AFF]/25 transition-colors"
                    aria-label="Edit repository settings"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Scroll Body */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {/* Repo Identity Card */}
                <div className="bg-white rounded-2xl p-4 flex items-center gap-3 mb-3">
                  {repo.owner?.avatar_url ? (
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                      <Code2 className="w-6 h-6 text-[#007AFF]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-semibold text-black truncate leading-tight">
                      {repo.name}
                    </h3>
                    <p className="text-[12px] text-[#8E8E93] truncate mt-0.5">
                      {repo.owner?.login || repo.full_name}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {repo.description && (
                  <div className="bg-white rounded-2xl px-4 py-3 mb-3">
                    <p className="text-[13px] text-black leading-snug">
                      {repo.description}
                    </p>
                  </div>
                )}

                {/* Info List (iOS grouped style) */}
                <div className="bg-white rounded-2xl overflow-hidden mb-3">
                  {language && (
                    <InfoRow
                      icon={<Code2 className="w-4 h-4" />}
                      iconBg="#007AFF"
                      label="Language"
                      value={
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: langColor || "#808080" }}
                          />
                          {language}
                        </span>
                      }
                      showDivider={true}
                    />
                  )}

                  <InfoRow
                    icon={
                      isPrivate ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )
                    }
                    iconBg={isPrivate ? "#FF9500" : "#34C759"}
                    label="Visibility"
                    value={isPrivate ? "Private" : "Public"}
                    showDivider={true}
                  />

                  <InfoRow
                    icon={<Calendar className="w-4 h-4" />}
                    iconBg="#8E8E93"
                    label="Created"
                    value={formatDate(repo.created_at)}
                    showDivider={true}
                  />

                  <InfoRow
                    icon={<GitCommit className="w-4 h-4" />}
                    iconBg="#AF52DE"
                    label="Last Commit"
                    value={
                      loadingCommit ? (
                        <span className="text-[#8E8E93]">Loading…</span>
                      ) : lastCommit ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-black">
                            {lastCommit.sha}
                          </span>
                          <span className="text-[#C6C6C8]">·</span>
                          <span>{timeAgo(lastCommit.date)}</span>
                        </span>
                      ) : (
                        <span className="text-[#8E8E93]">—</span>
                      )
                    }
                    showDivider={false}
                  />
                </div>

                {/* Visit Button */}
                <button
                  onClick={handleVisit}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[15px] font-semibold rounded-2xl transition-colors"
                >
                  <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                  Open on GitHub
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repo Settings Modal */}
      <RepoSettingsModal
        isOpen={isSettingsOpen}
        repo={repo}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => {
          setIsSettingsOpen(false);
          onClose();
        }}
      />
    </>
  );
}

/* ---------- Helper components ---------- */

function InfoRow({
  icon,
  iconBg,
  label,
  value,
  showDivider,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  showDivider?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div
          className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 text-white"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <span className="text-[14px] text-black flex-1">{label}</span>
        <span className="text-[14px] text-[#8E8E93] font-medium truncate max-w-[55%]">
          {value}
        </span>
      </div>
      {showDivider && (
        <div className="absolute bottom-0 left-[56px] right-0 h-[0.5px] bg-[#C6C6C8]/50" />
      )}
    </div>
  );
}