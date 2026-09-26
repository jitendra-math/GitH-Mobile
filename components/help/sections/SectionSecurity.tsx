import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionSecurity() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        GitH Mobile is designed with a privacy-first approach. Your data never
        touches our servers because there are none.
      </p>

      <HelpSubsection title="How Your Token Is Stored">
        <p>
          Your GitHub Personal Access Token is saved in a browser cookie with
          these security attributes:
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">httpOnly</code>{" "}
              — JavaScript can't read it (XSS protection)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">secure</code>{" "}
              — Only sent over HTTPS in production
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">sameSite=lax</code>{" "}
              — CSRF protection
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">30-day expiry</strong> —
              Auto-cleared after a month
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Data Flow">
        <p>
          There's no backend server. All API calls go directly from your browser
          to GitHub.
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>You interact with the app in your browser</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>
              The app calls{" "}
              <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">api.github.com</code>{" "}
              directly with your token
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>GitHub responds with the data</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">4.</span>
            <span>The app renders it locally</span>
          </li>
        </ul>

        <HelpCallout type="success" title="Zero data collection">
          No analytics. No tracking. No cookies for ads. Nothing is ever sent to
          us — because there is no "us" server.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Best Practices">
        <p>
          <strong className="text-black font-semibold">Do:</strong>
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#34C759] font-bold shrink-0">✓</span>
            <span>Use a token with the minimum required scope (repo)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#34C759] font-bold shrink-0">✓</span>
            <span>Store tokens in a password manager</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#34C759] font-bold shrink-0">✓</span>
            <span>Revoke tokens you no longer use</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#34C759] font-bold shrink-0">✓</span>
            <span>Only use GitH Mobile on trusted devices</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#34C759] font-bold shrink-0">✓</span>
            <span>Set expiration dates on your tokens</span>
          </li>
        </ul>

        <p className="mt-3">
          <strong className="text-black font-semibold">Don't:</strong>
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#FF3B30] font-bold shrink-0">✗</span>
            <span>Share your token with anyone (even friends)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#FF3B30] font-bold shrink-0">✗</span>
            <span>Paste tokens into untrusted sites or extensions</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#FF3B30] font-bold shrink-0">✗</span>
            <span>Use GitH Mobile on public/shared computers</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#FF3B30] font-bold shrink-0">✗</span>
            <span>Use the same token across many apps</span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Revoking a Token">
        <p>If your token is compromised, revoke it immediately:</p>
        <ol className="flex flex-col gap-2 pl-1 mt-2 list-none">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>
              Visit{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] hover:underline"
              >
                github.com/settings/tokens
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>Find the token (look for the note "GitH Mobile")</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>Click <strong className="text-black font-semibold">Delete</strong></span>
          </li>
        </ol>
        <p className="mt-2">
          Revocation takes effect immediately — any open session will be logged
          out.
        </p>
      </HelpSubsection>

      <HelpCallout type="danger" title="Compromised token = full access">
        If someone gets your token, they can read, modify, and delete your
        repos. Revoke it the moment you suspect compromise.
      </HelpCallout>
    </>
  );
}