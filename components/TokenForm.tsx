"use client";

import { useState } from "react";
import { saveToken } from "@/actions/github";
import { ArrowRight, KeyRound } from "lucide-react";

export default function TokenForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await saveToken(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="token" className="text-sm font-medium text-gray-700">
          Personal Access Token
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="password"
            name="token"
            id="token"
            required
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm transition-all"
          />
        </div>
      </div>
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2.5 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Continue"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
