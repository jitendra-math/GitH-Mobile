import {
  Palette,
  FileCode2,
  History,
  CopyCheck,
  Terminal,
  Smartphone,
} from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      icon: Palette,
      color: "#007AFF",
      title: "iOS-Native Design",
      desc: "Bottom sheets, spring animations, SF Pro font, safe areas — all Apple style.",
    },
    {
      icon: FileCode2,
      color: "#34C759",
      title: "Full Code Editor",
      desc: "Syntax highlighting for 20+ languages with a VS Code dark theme.",
    },
    {
      icon: History,
      color: "#FF9500",
      title: "Commit & Rollback",
      desc: "Full commit history with one-tap rollback and type-to-confirm safety.",
    },
    {
      icon: CopyCheck,
      color: "#AF52DE",
      title: "Bulk Operations",
      desc: "Create or fetch multiple files at once. Perfect for big edits.",
    },
    {
      icon: Terminal,
      color: "#1C1C1E",
      title: "Built-in Terminal",
      desc: "Run mkdir and mv commands with a real terminal feel on mobile.",
    },
    {
      icon: Smartphone,
      color: "#FF3B30",
      title: "PWA Ready",
      desc: "Install on your home screen — no app store needed. Offline-friendly.",
    },
  ];

  return (
    <section className="px-4 py-8 max-w-screen-md mx-auto">
      <h2 className="text-[22px] font-bold text-black tracking-tight px-1 mb-4">
        Everything you need
      </h2>

      <div className="bg-white rounded-2xl overflow-hidden">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 px-4 py-3.5 ${
                i !== features.length - 1 ? "border-b border-[#C6C6C8]/30" : ""
              }`}
            >
              <div
                className="w-9 h-9 rounded-[9px] flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: f.color }}
              >
                <Icon className="w-5 h-5" strokeWidth={2.3} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-black leading-tight">
                  {f.title}
                </div>
                <div className="text-[13px] text-[#8E8E93] mt-1 leading-snug">
                  {f.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}