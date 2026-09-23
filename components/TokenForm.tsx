"use client";

import { useState } from "react";
import { saveToken } from "@/actions/github";
import { KeyRound, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function TokenForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <KeyRound className="w-[18px] h-[18px] text-[#8E8E93]" strokeWidth={2.2} />
        </div>
        <input
          type={showToken ? "text" : "password"}
          name="token"
          id="token"
          required
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="block w-full pl-11 pr-11 py-3.5 bg-white rounded-[10px] text-[15px] text-black placeholder:text-[#8E8E93] outline-none focus:ring-2 focus:ring-[#007AFF66] transition-all"
        />
        <button
          type="button"
          onClick={() => setShowToken(!showToken)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8E8E93] active:text-black transition-colors"
          aria-label={showToken ? "Hide token" : "Show token"}
          tabIndex={-1}
        >
          {showToken ? (
            <EyeOff className="w-[18px] h-[18px]" strokeWidth={2.2} />
          ) : (
            <Eye className="w-[18px] h-[18px]" strokeWidth={2.2} />
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-[#FF3B301A] rounded-[10px]">
          <AlertCircle
            className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5"
            strokeWidth={2.4}
          />
          <p className="text-[13px] text-[#FF3B30] leading-snug font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[17px] font-semibold rounded-2xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {loading && (
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeOpacity="0.3"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
        {loading ? "Signing in…" : "Sign In"}
      </button>

      {/* Footnote */}
      <p className="text-[12px] text-[#8E8E93] text-center leading-snug mt-1">
        Your token is stored securely on your device.
      </p>
    </form>
  );
}