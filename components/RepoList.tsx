"use client";

import { useState, useMemo } from "react";
import RepoCard from "./RepoCard";

export default function RepoList({ initialRepos }: { initialRepos: any[] }) {
  const [sortBy, setSortBy] = useState<"latest" | "name">("latest");

  // useMemo ensure karta hai ki list sirf tab sort ho jab sort method ya repos change ho
  const sortedRepos = useMemo(() => {
    if (!initialRepos) return [];
    
    const reposCopy = [...initialRepos];

    if (sortBy === "name") {
      return reposCopy.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by latest pushed/updated
      return reposCopy.sort((a, b) => {
        const dateA = new Date(a.pushed_at || a.updated_at).getTime();
        const dateB = new Date(b.pushed_at || b.updated_at).getTime();
        return dateB - dateA;
      });
    }
  }, [initialRepos, sortBy]);

  return (
    <div className="flex flex-col gap-3">
      
      {/* Header Row: Title & Sort Dropdown */}
      <div className="flex items-center justify-between px-1 mb-1">
        <h1 className="text-lg font-semibold text-[#1A1A1A]">
          Repositories
          <span className="text-[#8a8a8a] text-sm ml-2 font-normal">
            ({initialRepos?.length || 0})
          </span>
        </h1>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-[13px] text-[#8a8a8a] hidden sm:block">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "name")}
            className="bg-white border border-[#d6d1c4] text-[#1A1A1A] text-[13px] font-medium rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-[#B5AC8A] transition-colors appearance-none pr-8 relative"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238a8a8a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="latest">Latest</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Repositories List */}
      {!sortedRepos || sortedRepos.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-xl border border-[#d6d1c4]">
          <p className="text-sm text-[#8a8a8a]">No repositories found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedRepos.map((repo: any) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
      
    </div>
  );
}
