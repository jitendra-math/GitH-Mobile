"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function LandingFAQ() {
  const faqs = [
    {
      q: "Is GitH Mobile free?",
      a: "Yes, completely free and open source. Licensed under the MIT License — you can use, modify, and distribute it freely.",
    },
    {
      q: "Where is my GitHub token stored?",
      a: "In an httpOnly, secure cookie on your device only. It never leaves your browser — all API calls go directly from your device to GitHub.",
    },
    {
      q: "How do I install it on my phone?",
      a: "Open the site in Chrome, tap the ⋮ menu, and choose \u201CAdd to Home screen\u201D. The icon will appear on your home screen and launch as a fullscreen app.",
    },
    {
      q: "Is it safe to use?",
      a: "Yes. There is no backend server — everything happens in your browser. Your token is stored securely and automatically expires after 30 days.",
    },
    {
      q: "Does it work on iPhone?",
      a: "The app works in Safari, but the PWA install experience is best on Android. iPhone users can bookmark it and use it as a regular web app.",
    },
    {
      q: "Which GitHub scopes do I need?",
      a: "A Classic Personal Access Token with the repo scope. This gives the app permission to read and modify your repositories.",
    },
    {
      q: "Can I contribute?",
      a: "Absolutely! Open an issue or submit a pull request on our GitHub repository. Contributions of any kind are welcome.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 py-8 max-w-screen-md mx-auto">
      <h2 className="text-[22px] font-bold text-black tracking-tight px-1 mb-4">
        Frequently asked
      </h2>

      <div className="bg-white rounded-2xl overflow-hidden">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`${
                i !== faqs.length - 1 ? "border-b border-[#C6C6C8]/30" : ""
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left active:bg-black/[0.03] transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-[15px] font-medium text-black flex-1 leading-snug">
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown
                    className="w-4 h-4 text-[#8E8E93]"
                    strokeWidth={2.5}
                  />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3.5">
                      <p className="text-[14px] text-[#8E8E93] leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}