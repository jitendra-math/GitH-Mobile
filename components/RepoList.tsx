"use client";

import { useState, useMemo } from "react";
import RepoCard from "./RepoCard";

export default function RepoList({ initialRepos }: { initialRepos: any[] }) {
  const [sortBy, setSortBy] = useState<"latest" | "name">("latest");

  const sortedRepos = useMemo(() => {
    if (!initialRepos) return [];

    const reposCopy = [...initialRepos];

    if (sortBy === "name") {
      return reposCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return reposCopy.sort((a, b) => {
      const dateA = new Date(a.pushed_at || a.updated_at).getTime();
      const dateB = new Date(b.pushed_at || b.updated_at).getTime();
      return dateB - dateA;
    });
  }, [initialRepos, sortBy]);

  return (
    <div className="flex flex-col gap-3">
      {/* iOS Large Title */}
      <div className="px-1 pt-1">
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-tight">
          Repositories
        </h1>
        <p className="text-[13px] text-[#8E8E93] mt-0.5">
          {initialRepos?.length || 0}{" "}
          {initialRepos?.length === 1 ? "repository" : "repositories"}
        </p>
      </div>

      {/* iOS Segmented Control */}
      <div className="bg-[#767680]/[0.12] rounded-[9px] p-[3px] flex gap-0.5">
        <button
          onClick={() => setSortBy("latest")}
          className={`flex-1 py-[7px] text-[13px] rounded-[7px] transition-all duration-150 ${
            sortBy === "latest"
              ? "bg-white text-black font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              : "text-black/60 font-medium"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => setSortBy("name")}
          className={`flex-1 py-[7px] text-[13px] rounded-[7px] transition-all duration-150 ${
            sortBy === "name"
              ? "bg-white text-black font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              : "text-black/60 font-medium"
          }`}
        >
          Name (A–Z)
        </button>
      </div>

      {/* List */}
      {!sortedRepos || sortedRepos.length === 0 ? (
        <div className="bg-white rounded-2xl py-12 px-4 text-center">
          <p className="text-[15px] text-[#8E8E93]">No repositories found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sortedRepos.map((repo: any) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}