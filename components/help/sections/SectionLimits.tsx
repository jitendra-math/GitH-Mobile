import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionLimits() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        GitH Mobile operates within GitHub's API and file limits. Here's what
        you need to know.
      </p>

      <HelpSubsection title="GitHub API Limits">
        <div className="rounded-xl border border-[#C6C6C8]/40 overflow-hidden mt-2">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F2F2F7]">
                <th className="text-left px-3 py-2 font-semibold text-black/80">Type</th>
                <th className="text-left px-3 py-2 font-semibold text-black/80">Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Authenticated requests</td>
                <td className="px-3 py-2 text-black/85 font-medium">5000 / hour</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Search API</td>
                <td className="px-3 py-2 text-black/85 font-medium">30 / minute</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Concurrent requests</td>
                <td className="px-3 py-2 text-black/85 font-medium">~100 simultaneous</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-black/70 mt-2">
          Rate limit resets every hour. No permanent block.
        </p>
      </HelpSubsection>

      <HelpSubsection title="File Limits">
        <div className="rounded-xl border border-[#C6C6C8]/40 overflow-hidden mt-2">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F2F2F7]">
                <th className="text-left px-3 py-2 font-semibold text-black/80">Type</th>
                <th className="text-left px-3 py-2 font-semibold text-black/80">Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Max file size in Git</td>
                <td className="px-3 py-2 text-black/85 font-medium">100 MB</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Recommended via API</td>
                <td className="px-3 py-2 text-black/85 font-medium">&lt; 25 MB</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Editor performance</td>
                <td className="px-3 py-2 text-black/85 font-medium">&lt; 1 MB ideal</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Base64 encoding overhead</td>
                <td className="px-3 py-2 text-black/85 font-medium">+33% size</td>
              </tr>
            </tbody>
          </table>
        </div>
      </HelpSubsection>

      <HelpSubsection title="Repository Limits">
        <div className="rounded-xl border border-[#C6C6C8]/40 overflow-hidden mt-2">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F2F2F7]">
                <th className="text-left px-3 py-2 font-semibold text-black/80">Type</th>
                <th className="text-left px-3 py-2 font-semibold text-black/80">Free Plan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Repository size</td>
                <td className="px-3 py-2 text-black/85 font-medium">5 GB (soft)</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Repos per account</td>
                <td className="px-3 py-2 text-black/85 font-medium">Unlimited</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Branches per repo</td>
                <td className="px-3 py-2 text-black/85 font-medium">Unlimited</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Commits per hour</td>
                <td className="px-3 py-2 text-black/85 font-medium">~100 safe</td>
              </tr>
            </tbody>
          </table>
        </div>
      </HelpSubsection>

      <HelpSubsection title="App Limits">
        <div className="rounded-xl border border-[#C6C6C8]/40 overflow-hidden mt-2">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F2F2F7]">
                <th className="text-left px-3 py-2 font-semibold text-black/80">Feature</th>
                <th className="text-left px-3 py-2 font-semibold text-black/80">Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Repos loaded per page</td>
                <td className="px-3 py-2 text-black/85 font-medium">100</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Commits in history</td>
                <td className="px-3 py-2 text-black/85 font-medium">15 recent</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">Session duration</td>
                <td className="px-3 py-2 text-black/85 font-medium">30 days</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 text-black/85">File queue</td>
                <td className="px-3 py-2 text-black/85 font-medium">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </HelpSubsection>

      <HelpSubsection title="Practical Limits">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Batch edits into fewer commits to save API calls</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Upload files in groups of 10 or fewer</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Large trees (10,000+ files) may load slowly</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Extremely large files may fail silently</span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpCallout type="warning" title="Rate limits reset hourly">
        If you hit the rate limit, wait 1 hour. There's no permanent block. The
        limit resets at the top of each hour.
      </HelpCallout>

      <HelpCallout type="tip">
        Check your current rate limit at{" "}
        <a
          href="https://api.github.com/rate_limit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#007AFF] hover:underline"
        >
          api.github.com/rate_limit
        </a>{" "}
        (opens JSON with your token's remaining quota).
      </HelpCallout>
    </>
  );
}