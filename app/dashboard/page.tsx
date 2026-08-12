import RepoList from "@/components/RepoList";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Your Repositories</h1>
      </div>
      <RepoList />
    </div>
  );
}
