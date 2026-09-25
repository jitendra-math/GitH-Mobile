import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F2F2F7] flex items-center justify-center px-6 pt-safe pb-safe">
      <div className="w-full max-w-[340px] flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#007AFF]/10 flex items-center justify-center mb-6">
          <Compass
            className="w-10 h-10 text-[#007AFF]"
            strokeWidth={1.8}
          />
        </div>

        {/* Error Code */}
        <p className="text-[15px] font-semibold text-[#8E8E93] uppercase tracking-widest">
          Error 404
        </p>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-tight mt-2">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-[15px] text-[#8E8E93] mt-2 leading-snug">
          The page you're looking for doesn't exist, or may have been moved.
        </p>

        {/* Back Home Button */}
        <Link
          href="/"
          className="mt-8 w-full py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[17px] font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}