import { getRepos } from "@/actions/github";
import RepoCard from "./RepoCard";

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
    <div className="flex flex-col gap-3">
      {repos.map((repo: any) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
