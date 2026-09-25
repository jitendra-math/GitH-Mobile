import Link from "next/link";
import { Github } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="px-4 py-8 max-w-screen-md mx-auto pb-safe">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4">
        <Link
          href="/privacy"
          className="text-[14px] text-[#007AFF] active:opacity-60 transition-opacity"
        >
          Privacy
        </Link>
        <span className="text-[#C6C6C8]">·</span>
        <Link
          href="/terms"
          className="text-[14px] text-[#007AFF] active:opacity-60 transition-opacity"
        >
          Terms
        </Link>
        <span className="text-[#C6C6C8]">·</span>
        <a
          href="https://github.com/jitendra-math/GitH-Mobile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-[#007AFF] active:opacity-60 transition-opacity flex items-center gap-1.5"
        >
          <Github className="w-3.5 h-3.5" strokeWidth={2.4} />
          GitHub
        </a>
      </div>
      <p className="text-[12px] text-[#8E8E93] text-center leading-relaxed">
        GitH Mobile · MIT License · Made with ❤️ in India 🇮🇳
      </p>
    </footer>
  );
}