import { getRepos } from "@/actions/github";
import { Book, Lock, Globe, Star, GitFork } from "lucide-react";

export default async function RepoList() {
  const repos = await getRepos();

  if (!repos || repos.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
        <p className="text-gray-500">No repositories found on this account.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-2 pb-6">
      {repos.map((repo: any) => (
        <div 
          key={repo.id} 
          className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-2.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Book className="h-4 w-4 text-gray-500 shrink-0" />
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-[15px] font-semibold text-blue-600 hover:underline break-all"
              >
                {repo.name}
              </a>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-gray-200 bg-gray-50 text-gray-600 uppercase tracking-wider">
                {repo.private ? (
                  <><Lock className="h-3 w-3 mr-1" /> Private</>
                ) : (
                  <><Globe className="h-3 w-3 mr-1" /> Public</>
                )}
              </span>
            </div>
          </div>
          
          {repo.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {repo.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" />
              <span>{repo.forks_count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
