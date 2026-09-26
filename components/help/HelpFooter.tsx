import Link from "next/link";
import { Github, Mail } from "lucide-react";

export default function HelpFooter() {
  return (
    <footer className="max-w-screen-md mx-auto px-4 pb-8 pb-safe pt-6">
      <div className="bg-white rounded-2xl px-5 py-6 text-center">
        <h3 className="text-[17px] font-semibold text-black tracking-tight">
          Still have questions?
        </h3>
        <p className="text-[13px] text-[#8E8E93] mt-1 leading-snug">
          Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-4">
          <a
            href="https://github.com/jitendra-math/GitH-Mobile/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[15px] font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" strokeWidth={2.4} />
            Open an Issue
          </a>
          <a
            href="mailto:i.jitendra.singh0@gmail.com"
            className="w-full sm:w-auto px-5 py-2.5 bg-transparent text-[#007AFF] text-[15px] font-semibold rounded-2xl active:bg-black/5 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" strokeWidth={2.4} />
            Email Us
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-6">
        <Link
          href="/"
          className="text-[13px] text-[#007AFF] active:opacity-60 transition-opacity"
        >
          Home
        </Link>
        <span className="text-[#C6C6C8]">·</span>
        <Link
          href="/privacy"
          className="text-[13px] text-[#007AFF] active:opacity-60 transition-opacity"
        >
          Privacy
        </Link>
        <span className="text-[#C6C6C8]">·</span>
        <Link
          href="/terms"
          className="text-[13px] text-[#007AFF] active:opacity-60 transition-opacity"
        >
          Terms
        </Link>
        <span className="text-[#C6C6C8]">·</span>
        <a
          href="https://github.com/jitendra-math/GitH-Mobile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#007AFF] active:opacity-60 transition-opacity"
        >
          GitHub
        </a>
      </div>

      <p className="text-[12px] text-[#8E8E93] text-center mt-4 leading-relaxed">
        GitH Mobile · MIT License · Made with ❤️ in India 🇮🇳
      </p>
    </footer>
  );
}