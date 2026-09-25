"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging (no external service)
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#F2F2F7] flex items-center justify-center px-6 pt-safe pb-safe">
      <div className="w-full max-w-[340px] flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mb-6">
          <AlertTriangle
            className="w-10 h-10 text-[#FF3B30]"
            strokeWidth={1.8}
          />
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-tight">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-[15px] text-[#8E8E93] mt-2 leading-snug">
          An unexpected error occurred. Please try again, or go back to the
          home page.
        </p>

        {/* Error digest (dev only) */}
        {error.digest && (
          <p className="text-[11px] text-[#8E8E93] font-mono mt-3 opacity-60">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 w-full flex flex-col gap-2.5">
          <button
            onClick={reset}
            className="w-full py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[17px] font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" strokeWidth={2.5} />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full py-3.5 bg-transparent text-[#007AFF] text-[17px] font-semibold rounded-2xl active:bg-black/5 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}