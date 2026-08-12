import RepoList from "@/components/RepoList";
import { getRepos } from "@/actions/github";

export default async function DashboardPage() {
  const repos = await getRepos();

  return (
    <div className="flex flex-col gap-3">
      <RepoList initialRepos={repos} />
    </div>
  );
}
