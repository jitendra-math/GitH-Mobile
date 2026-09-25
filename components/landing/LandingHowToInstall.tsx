export default function LandingHowToInstall() {
  const steps = [
    {
      num: "1",
      title: "Open in Chrome",
      desc: "Visit github.jssoriginals.com on your Android phone.",
    },
    {
      num: "2",
      title: "Add to Home Screen",
      desc: "Tap the ⋮ menu and choose \u201CAdd to Home screen\u201D or \u201CInstall app\u201D.",
    },
    {
      num: "3",
      title: "Launch as an app",
      desc: "Use GitH Mobile like a native app — fullscreen, no browser UI.",
    },
  ];

  return (
    <section className="px-4 py-8 max-w-screen-md mx-auto">
      <h2 className="text-[22px] font-bold text-black tracking-tight px-1 mb-4">
        Install in 3 steps
      </h2>

      <div className="bg-white rounded-2xl overflow-hidden">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-4 py-3.5 ${
              i !== steps.length - 1 ? "border-b border-[#C6C6C8]/30" : ""
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-[#007AFF] text-white text-[14px] font-bold flex items-center justify-center shrink-0">
              {s.num}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-black leading-tight">
                {s.title}
              </div>
              <div className="text-[13px] text-[#8E8E93] mt-1 leading-snug">
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-[#8E8E93] text-center mt-3 px-2">
        Works on Android and desktop Chrome. On iPhone, use it in Safari.
      </p>
    </section>
  );
}