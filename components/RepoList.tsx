import { getRepos } from "@/actions/github";
import { BookOpen, Lock, Globe, Star, GitFork } from "lucide-react";

export default async function RepoList() {
  const repos = await getRepos();

  if (!repos || repos.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
        <p className="text-sm text-slate-500">No repositories found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {repos.map((repo: any) => (
        <div 
          key={repo.id} 
          className="group flex flex-col p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm font-medium text-slate-800 hover:text-slate-600 truncate underline decoration-slate-200 underline-offset-2"
              >
                {repo.name}
              </a>
            </div>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
              {repo.private ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
            </span>
          </div>
          
          {repo.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {repo.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-0.5">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span className="text-slate-600">{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              <span>{repo.forks_count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
