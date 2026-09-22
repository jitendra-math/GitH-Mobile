"use client";

import { X, ExternalLink, Star, GitFork, Eye, Calendar, GitBranch, HardDrive, User, Clock, Globe, Lock, AlertCircle } from "lucide-react";

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

export default function RepoInfoModal({ isOpen, repo, onClose }: RepoInfoModalProps) {
  if (!isOpen || !repo) return null;

  const isPrivate = repo.private;
  const language = repo.language;
  const langColor = language ? languageColors[language] || languageColors.default : null;

  const formatSize = (kb: number) => {
    if (!kb || kb === 0) return "0 KB";
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const timeAgo = (iso: string) => {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  const handleVisit = () => {
    window.open(repo.html_url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1A1A1A]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-[0_12px_32px_rgba(0,0,0,0.15)] border border-[#d6d1c4] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 border-b border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {repo.owner?.avatar_url ? (
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-10 h-10 rounded-full border border-[rgba(181,172,138,0.4)] shrink-0 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#B5AC8A]/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#B5AC8A]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#1A1A1A] truncate leading-tight" title={repo.name}>
                {repo.name}
              </h3>
              <p className="text-[11px] text-[#8a8a8a] font-mono truncate mt-0.5" title={repo.full_name}>
                {repo.full_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8a8a8a] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg p-1.5 transition-all shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Description */}
          <div className="px-4 py-3 border-b border-[rgba(181,172,138,0.15)]">
            {repo.description ? (
              <p className="text-[13px] text-[#4A4A4A] leading-relaxed">{repo.description}</p>
            ) : (
              <p className="text-[13px] text-[#8a8a8a] italic">No description provided.</p>
            )}
          </div>

          {/* Badges: Language + Visibility */}
          <div className="px-4 py-3 border-b border-[rgba(181,172,138,0.15)] flex items-center gap-2 flex-wrap">
            {language && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[#F5F1EC] border border-[rgba(181,172,138,0.3)]">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: langColor || "#808080" }}
                />
                {language}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
                isPrivate
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200"
              }`}
            >
              {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {isPrivate ? "Private" : "Public"}
            </span>
            {repo.archived && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                <AlertCircle className="w-3 h-3" />
                Archived
              </span>
            )}
          </div>

          {/* Stats Grid */}
          <div className="px-4 py-3 border-b border-[rgba(181,172,138,0.15)] grid grid-cols-3 gap-2">
            <Stat icon={<Star className="w-3.5 h-3.5" />} label="Stars" value={repo.stargazers_count ?? 0} />
            <Stat icon={<GitFork className="w-3.5 h-3.5" />} label="Forks" value={repo.forks_count ?? 0} />
            <Stat icon={<Eye className="w-3.5 h-3.5" />} label="Watchers" value={repo.watchers_count ?? 0} />
          </div>

          {/* Details List */}
          <div className="px-4 py-3 flex flex-col gap-2.5">
            <DetailRow
              icon={<GitBranch className="w-3.5 h-3.5" />}
              label="Default Branch"
              value={repo.default_branch || "main"}
              mono
            />
            <DetailRow
              icon={<HardDrive className="w-3.5 h-3.5" />}
              label="Size"
              value={formatSize(repo.size || 0)}
            />
            <DetailRow
              icon={<Calendar className="w-3.5 h-3.5" />}
              label="Created"
              value={formatDate(repo.created_at)}
            />
            <DetailRow
              icon={<Clock className="w-3.5 h-3.5" />}
              label="Last Pushed"
              value={`${formatDate(repo.pushed_at)} (${timeAgo(repo.pushed_at)})`}
            />
            {repo.open_issues_count > 0 && (
              <DetailRow
                icon={<AlertCircle className="w-3.5 h-3.5" />}
                label="Open Issues"
                value={String(repo.open_issues_count)}
              />
            )}
          </div>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="px-4 pb-3">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a8a8a] mb-2">
                Topics
              </div>
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 8).map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#6D001A]/8 text-[#6D001A] border border-[#6D001A]/15"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 p-4 pt-3 border-t border-[rgba(181,172,138,0.25)] bg-[#F5F1EC]/50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-[13px] font-semibold text-[#4A4A4A] bg-white border border-[#d6d1c4] rounded-xl hover:bg-[#F5F1EC] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleVisit}
            className="flex-1 py-2.5 flex items-center justify-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-br from-[#6D001A] to-[#8B0022] rounded-xl hover:-translate-y-px hover:shadow-md transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Visit on GitHub
          </button>
        </div>

      </div>
    </div>
  );
}

/* ---------- Small helper components ---------- */

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#F5F1EC] border border-[rgba(181,172,138,0.25)]">
      <div className="flex items-center gap-1 text-[#B5AC8A]">
        {icon}
        <span className="text-[14px] font-bold text-[#1A1A1A]">{value}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-[#8a8a8a] font-semibold mt-0.5">
        {label}
      </span>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-[#8a8a8a]">
        {icon}
        <span className="text-[12px] font-medium">{label}</span>
      </div>
      <span
        className={`text-[12px] font-semibold text-[#1A1A1A] text-right truncate max-w-[60%] ${
          mono ? "font-mono" : ""
        }`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}