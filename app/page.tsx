import TokenForm from "@/components/TokenForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-2">GitHub Manager</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your GitHub Personal Access Token (Classic) to continue.
        </p>
        <TokenForm />
      </div>
    </main>
  );
}
