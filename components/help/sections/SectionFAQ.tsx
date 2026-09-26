import HelpSubsection from "../HelpSubsection";

export default function SectionFAQ() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Quick answers to the most common questions.
      </p>

      <HelpSubsection title="General">
        <QABlock q="Is GitH Mobile free?" a="Yes, completely free. MIT licensed and open source." />
        <QABlock q="Is it open source?" a="Yes. Full source code is on GitHub at jitendra-math/GitH-Mobile." />
        <QABlock q="What license does it use?" a="MIT License — use, modify, and distribute freely with attribution." />
        <QABlock q="Who made it?" a="Jitendra Singh, a developer from India. It's a side project built for personal use and shared with the community." />
      </HelpSubsection>

      <HelpSubsection title="Account">
        <QABlock q="Do I need a paid GitHub plan?" a="No. GitHub Free works perfectly. Paid plans aren't required." />
        <QABlock q="Which account type works?" a="Any GitHub account — personal, organization, or enterprise." />
        <QABlock q="Can I use it with organization repos?" a="Yes, as long as your token has access to those org repos." />
        <QABlock q="Can I use multiple accounts?" a="Not simultaneously. Log out and sign in with a different token to switch accounts." />
      </HelpSubsection>

      <HelpSubsection title="Technical">
        <QABlock q="Does it work on iPhone?" a="It works in Safari, but the PWA install experience is best on Android. iPhone users can bookmark the site or use Add to Home Screen." />
        <QABlock q="Does it work offline?" a="Partially. The app shell is cached by a service worker, but data operations require internet." />
        <QABlock q="What browsers are supported?" a="Chrome, Edge, Brave, Safari, Firefox. Chrome is recommended for the best PWA experience." />
        <QABlock q="Is there a Play Store version?" a="Not yet. A TWA (Trusted Web Activity) release is planned for the future." />
        <QABlock q="Can I self-host it?" a="Absolutely. Clone the GitHub repo and deploy on Vercel, Netlify, or any Node.js host." />
      </HelpSubsection>

      <HelpSubsection title="Security">
        <QABlock q="Is it safe to use?" a="Yes. There's no backend server, no analytics, no tracking. Your token stays in your browser cookie." />
        <QABlock q="Where is my token stored?" a="In a secure, httpOnly cookie on your device only. It never leaves your browser." />
        <QABlock q="What if my token leaks?" a="Revoke it immediately at github.com/settings/tokens. Then generate a new one." />
        <QABlock q="Can I revoke access?" a="Yes, at any time. Just delete the token on GitHub — the app will require a new token." />
        <QABlock q="Does the app see my password?" a="Never. It only uses Personal Access Tokens, not your GitHub password." />
      </HelpSubsection>

      <HelpSubsection title="Usage">
        <QABlock q="How many repos can I manage?" a="Up to 100 repos are loaded per page (GitHub API limit). For more, use pagination or the GitHub app." />
        <QABlock q="What's the max file size I can edit?" a="Files under 1 MB open reliably in the editor. Larger files may crash the browser." />
        <QABlock q="Can I edit binary files?" a="No, only text files. Binary files (images, PDFs) can only be downloaded, not edited." />
        <QABlock q="How does rollback work?" a="Rollback creates a new commit pointing to the old tree. Nothing is deleted — original history is preserved." />
        <QABlock q="Can I create branches?" a="Not currently. Branch creation is planned for a future release." />
        <QABlock q="Can I merge pull requests?" a="Not currently. This is a file-editing and commit-focused tool." />
        <QABlock q="Does it support Git LFS?" a="Not directly. Files over 25 MB may fail to upload via API." />
        <QABlock q="Can I commit multiple files at once?" a="Yes. Queue multiple files and commit them as one atomic commit." />
      </HelpSubsection>

      <HelpSubsection title="Bugs & Support">
        <QABlock q="Found a bug — what do I do?" a="Open an issue on GitHub with steps to reproduce, browser info, and screenshots if possible." />
        <QABlock q="How do I request a feature?" a="Same — open an issue on the GitHub repo. Describe the problem and your proposed solution." />
        <QABlock q="Can I contribute?" a="Yes! Fork the repo, make changes, and submit a pull request. See CONTRIBUTING.md for guidelines." />
        <QABlock q="Where can I ask questions?" a="GitHub Discussions or open an issue. Email is also available for security concerns." />
      </HelpSubsection>

      <HelpSubsection title="Limitations">
        <QABlock q="What can't it do?" a="It can't create branches, merge PRs, manage issues, or handle files over 25 MB. It's focused on file-level editing." />
        <QABlock q="What's the rate limit?" a="GitHub allows 5000 API calls per hour per token. Each file operation uses 1-3 calls." />
        <QABlock q="Why doesn't it have feature X?" a="Probably because it wasn't requested yet. Open an issue and let's discuss." />
        <QABlock q="Does it work with GitLab/Bitbucket?" a="No. GitH Mobile is built exclusively for GitHub's API." />
      </HelpSubsection>
    </>
  );
}

function QABlock({ q, a }: { q: string; a: string }) {
  return (
    <div className="mt-4 first:mt-0">
      <p className="text-[14px] font-semibold text-black leading-snug">
        {q}
      </p>
      <p className="text-[14px] text-black/75 leading-relaxed mt-1">{a}</p>
    </div>
  );
}