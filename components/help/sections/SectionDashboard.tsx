import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionDashboard() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        The dashboard is your home screen — it shows all your GitHub
        repositories in a clean iOS-style list.
      </p>

      <HelpSubsection title="Overview">
        <p>
          When you sign in, GitH Mobile fetches up to 100 of your most recently
          updated repositories from GitHub's API. Each repo is displayed as a
          card with metadata and quick actions.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Sorting Repositories">
        <p>
          At the top of the dashboard, you'll find a segmented control with two
          options:
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Latest</strong> —
              Sorts by last pushed date (most recent first)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Name (A–Z)</strong> —
              Alphabetical order by repository name
            </span>
          </li>
        </ul>
        <p className="mt-2">
          Your choice is preserved for the current session — it resets to{" "}
          <em>Latest</em> on refresh.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Understanding a Repo Card">
        <p>Each repository card contains:</p>

        <div className="mt-3 flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-[#007AFF] mt-2 shrink-0" />
            <div>
              <p className="font-semibold text-black text-[14px]">Repository Name</p>
              <p className="text-[13px] text-black/70 mt-0.5">
                Tap to open the Repo Info modal with more details
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-[#007AFF] mt-2 shrink-0" />
            <div>
              <p className="font-semibold text-black text-[14px]">Language Badge</p>
              <p className="text-[13px] text-black/70 mt-0.5">
                Shows the primary programming language with a colored dot
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-[#007AFF] mt-2 shrink-0" />
            <div>
              <p className="font-semibold text-black text-[14px]">Visibility Badge</p>
              <p className="text-[13px] text-black/70 mt-0.5">
                Private (orange lock) or Public (green globe)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-[#007AFF] mt-2 shrink-0" />
            <div>
              <p className="font-semibold text-black text-[14px]">Branch Selector</p>
              <p className="text-[13px] text-black/70 mt-0.5">
                Choose which branch to work with. Loads lazily on tap.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-[#007AFF] mt-2 shrink-0" />
            <div>
              <p className="font-semibold text-black text-[14px]">Action Buttons</p>
              <p className="text-[13px] text-black/70 mt-0.5">
                Edit (blue pencil), Download (green), Delete (red)
              </p>
            </div>
          </div>
        </div>
      </HelpSubsection>

      <HelpSubsection title="Branch Selector">
        <p>
          The branch dropdown shows the default branch initially. When you tap
          it, GitH Mobile fetches all branches from GitHub and populates the
          list.
        </p>
        <p>
          Your selected branch affects the <strong>Download ZIP</strong> action
          and the starting branch when you open the editor.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Quick Actions">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Edit</strong> — Opens
              the file editor for this repository and branch
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Download ZIP</strong> —
              Downloads a zip archive of the selected branch
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Delete</strong> —
              Permanently deletes the repo (with type-to-confirm safety)
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Empty & Error States">
        <p>
          If you have no repositories, you'll see a message:{" "}
          <em>"No repositories found."</em>
        </p>
        <p>
          If your token has expired or been revoked, you'll be redirected to the
          login page automatically.
        </p>
      </HelpSubsection>

      <HelpCallout type="tip" title="Quick tip">
        Tap anywhere on the repo <strong>name</strong> to view details without
        opening the editor. This is the fastest way to check a repo's last
        commit or visibility.
      </HelpCallout>
    </>
  );
}