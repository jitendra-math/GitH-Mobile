"use client";

import { Github } from "lucide-react";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <section className="px-4 pt-12 pb-8 flex flex-col items-center text-center max-w-screen-md mx-auto">
      {/* Logo */}
      <img
        src="/logo-192.png"
        alt="GitH Mobile"
        className="w-24 h-24 rounded-[24px] object-cover shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      />

      {/* Title */}
      <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight mt-6">
        GitH Mobile
      </h1>

      {/* Tagline */}
      <p className="text-[16px] text-[#8E8E93] mt-2 leading-snug max-w-[320px]">
        An iOS-style GitHub manager for your phone. Edit files, commit changes,
        roll back history — all from your pocket.
      </p>

      {/* CTA */}
      <button
        onClick={onGetStarted}
        className="mt-8 w-full max-w-[280px] py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[17px] font-semibold rounded-2xl transition-colors"
      >
        Get Started
      </button>

      {/* GitHub Link */}
      <a
        href="https://github.com/jitendra-math/GitH-Mobile"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-2 text-[15px] text-[#007AFF] active:opacity-60 transition-opacity"
      >
        <Github className="w-4 h-4" strokeWidth={2.4} />
        View on GitHub
      </a>

      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
        <Badge>MIT Licensed</Badge>
        <Badge>Next.js 14</Badge>
        <Badge>PWA Ready</Badge>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 bg-white rounded-full text-[12px] font-semibold text-[#8E8E93] border border-[#C6C6C8]/40">
      {children}
    </span>
  );
}