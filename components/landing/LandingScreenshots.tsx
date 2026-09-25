export default function LandingScreenshots() {
  const screenshots = [
    { src: "/screenshots/dashboard.jpg", alt: "Manage all your repositories" },
    { src: "/screenshots/repo-info.jpg", alt: "View repository details" },
    { src: "/screenshots/edit-modal.jpg", alt: "Edit files and commit changes" },
    { src: "/screenshots/upload-files.jpg", alt: "Upload files to your repo" },
  ];

  return (
    <section className="py-8">
      <h2 className="text-[22px] font-bold text-black tracking-tight px-5 mb-4 max-w-screen-md mx-auto">
        See it in action
      </h2>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="overflow-x-auto no-scrollbar px-4 sm:hidden">
        <div className="flex gap-3 w-max">
          {screenshots.map((s, i) => (
            <div
              key={i}
              className="w-[220px] shrink-0 bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <img src={s.src} alt={s.alt} className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-4 gap-3 max-w-screen-md mx-auto px-4">
        {screenshots.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <img src={s.src} alt={s.alt} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </section>
  );
}