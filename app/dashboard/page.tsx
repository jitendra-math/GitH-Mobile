import RepoList from "@/components/RepoList";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-semibold text-slate-800 px-1">Repositories</h1>
      <RepoList />
    </div>
  );
}
