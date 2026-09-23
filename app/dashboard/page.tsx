import RepoList from "@/components/RepoList";
import { getRepos } from "@/actions/github";

export default async function DashboardPage() {
  const repos = await getRepos();

  return <RepoList initialRepos={repos} />;
}