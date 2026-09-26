import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionTroubleshooting() {
  const issues = [
    {
      title: '"Invalid PAT" error on login',
      cause: "Token is incorrect, expired, or missing required scopes.",
      solution:
        "Regenerate a token with the repo scope. Copy the new token carefully — no extra spaces.",
    },
    {
      title: "Repositories list is empty",
      cause: "No repos, network issue, or token has no repo access.",
      solution:
        "Check if you actually have repos. Refresh the page. Verify token scopes on GitHub.",
    },
    {
      title: "Spinner keeps loading forever",
      cause: "GitHub API rate limit hit, or network blocked.",
      solution:
        "Wait 1 hour for rate limit reset. Check if GitHub is down at status.github.com.",
    },
    {
      title: '"Rate limit exceeded" on commit',
      cause: "You've made more than 5000 API calls in the last hour.",
      solution:
        "Wait for the rate limit to reset (1 hour). Batch more changes into fewer commits.",
    },
    {
      title: '"Failed to create blob" error',
      cause: "File is too large or encoding issue.",
      solution:
        "Reduce file size to under 25 MB. Avoid uploading binary files via API.",
    },
    {
      title: "Rollback fails",
      cause: "Invalid SHA, or branch was deleted.",
      solution:
        "Verify the commit SHA exists in history. Try a different commit.",
    },
    {
      title: "PWA install button not appearing",
      cause: "Already installed, or browser doesn't support PWA install.",
      solution:
        "Use Chrome on Android or desktop. Clear site data and reload.",
    },
    {
      title: "File tree won't load",
      cause: "Branch deleted, or network failure.",
      solution:
        "Try a different branch. Reload the app. Check GitHub status.",
    },
    {
      title: "Editor crashes on large files",
      cause: "File is too big for browser memory.",
      solution:
        "Edit smaller chunks. Files over 1 MB may not open in the editor.",
    },
    {
      title: "Session expired unexpectedly",
      cause: "30-day cookie expiry, or token revoked on GitHub.",
      solution:
        "Sign in again with a fresh token.",
    },
    {
      title: "Cannot delete repository",
      cause: "Token lacks delete permissions.",
      solution:
        "Ensure your token has repo scope. Regenerate if needed.",
    },
    {
      title: "Private repos not showing",
      cause: "Token missing repo scope for private access.",
      solution:
        "Regenerate your PAT with the repo scope (not just public_repo).",
    },
    {
      title: "Terminal commands silently fail",
      cause: "Wrong syntax or path issue.",
      solution:
        "Check command spelling. Use forward slashes (/). Paths are case-sensitive.",
    },
    {
      title: "Upload stuck at 'Processing'",
      cause: "Large file or unstable network.",
      solution:
        "Retry with smaller files. Ensure stable internet connection.",
    },
    {
      title: "Download ZIP doesn't work",
      cause: "Popup blocker on browser.",
      solution:
        "Allow popups for github.jssoriginals.com. Try again.",
    },
  ];

  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Common issues and how to fix them. Most problems are caused by invalid
        tokens or rate limits.
      </p>

      <HelpSubsection title="Common Issues">
        <div className="flex flex-col gap-3 mt-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#C6C6C8]/40 p-3.5"
            >
              <p className="text-[14px] font-semibold text-black leading-tight">
                {issue.title}
              </p>
              <p className="text-[13px] text-black/70 mt-2">
                <strong className="text-black font-medium">Cause:</strong>{" "}
                {issue.cause}
              </p>
              <p className="text-[13px] text-black/70 mt-1">
                <strong className="text-black font-medium">Fix:</strong>{" "}
                {issue.solution}
              </p>
            </div>
          ))}
        </div>
      </HelpSubsection>

      <HelpSubsection title="Still Not Working?">
        <p>
          If none of the above helps, try these steps:
        </p>
        <ol className="flex flex-col gap-2 pl-1 mt-2 list-none">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>Clear your browser cookies for this site</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>Sign out and sign back in</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>Check GitHub API status at status.github.com</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">4.</span>
            <span>
              Open an issue on{" "}
              <a
                href="https://github.com/jitendra-math/GitH-Mobile/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] hover:underline"
              >
                GitHub
              </a>{" "}
              with details
            </span>
          </li>
        </ol>
      </HelpSubsection>

      <HelpCallout type="tip" title="Pro tip">
        Open browser DevTools → Console. If you see red errors when something
        fails, include them in your bug report — it helps us fix issues faster.
      </HelpCallout>
    </>
  );
}