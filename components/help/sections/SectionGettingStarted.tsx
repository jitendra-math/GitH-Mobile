import HelpSubsection from "../HelpSubsection";
import HelpStep from "../HelpStep";
import HelpCallout from "../HelpCallout";
import HelpCodeBlock from "../HelpCodeBlock";

export default function SectionGettingStarted() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Welcome to GitH Mobile! This guide will walk you through everything you
        need — from creating a secure GitHub token to installing the app on your
        phone.
      </p>

      <HelpSubsection title="What is GitH Mobile?">
        <p>
          GitH Mobile is an open-source Progressive Web App (PWA) that gives you
          an iOS-style interface to manage your GitHub repositories. You can
          edit files, commit changes, roll back history, and manage repositories
          — all without opening a browser.
        </p>
        <p>
          It uses the official GitHub REST API and requires a Personal Access
          Token (PAT) to authenticate. Everything runs client-side — no backend
          server, no tracking, no analytics.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Prerequisites">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              A <strong className="text-black font-semibold">GitHub account</strong>{" "}
              (free tier works perfectly)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              A <strong className="text-black font-semibold">modern browser</strong>{" "}
              — Chrome (recommended), Edge, or Safari
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              A{" "}
              <strong className="text-black font-semibold">
                Personal Access Token
              </strong>{" "}
              with <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">repo</code>{" "}
              scope
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection id="pat-creation" title="Creating a Personal Access Token">
        <p>
          A PAT is a secure alternative to your password. Follow these steps to
          create one:
        </p>

        <div className="flex flex-col gap-1 mt-3">
          <HelpStep number={1} title="Open GitHub Token Settings">
            <p>
              Go to{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] hover:underline break-all"
              >
                github.com/settings/tokens
              </a>{" "}
              in your browser.
            </p>
          </HelpStep>

          <HelpStep number={2} title='Click "Generate new token" → "Generate new token (classic)"'>
            <p>
              Make sure you choose the <strong>classic</strong> token, not
              fine-grained. GitH Mobile currently supports classic tokens.
            </p>
          </HelpStep>

          <HelpStep number={3} title="Add a Note and Set Expiration">
            <p>
              <strong className="text-black font-semibold">Note:</strong> Enter
              something like <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">GitH Mobile</code>
            </p>
            <p>
              <strong className="text-black font-semibold">Expiration:</strong>{" "}
              Choose <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">90 days</code> or{" "}
              <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">No expiration</code>{" "}
              based on your preference.
            </p>
          </HelpStep>

          <HelpStep number={4} title="Select the repo scope">
            <p>
              Check the{" "}
              <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">repo</code>{" "}
              checkbox. This automatically enables all required sub-scopes.
            </p>
          </HelpStep>

          <HelpStep number={5} title="Generate and copy the token" last>
            <p>
              Click <strong>Generate token</strong>. Your token will look like:
            </p>
            <HelpCodeBlock code="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" language="Token" />
          </HelpStep>
        </div>

        <HelpCallout type="warning" title="Save it immediately">
          GitHub only shows your token <strong>once</strong>. Copy it and store
          it in a password manager like 1Password, Bitwarden, or your browser's
          built-in manager.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Understanding Token Scopes">
        <p>
          GitH Mobile requires the{" "}
          <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">repo</code>{" "}
          scope. Here's what it includes:
        </p>

        <div className="rounded-xl overflow-hidden border border-[#C6C6C8]/40 mt-3 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F2F2F7]">
                <th className="text-left px-3 py-2 font-semibold text-black/80">Scope</th>
                <th className="text-left px-3 py-2 font-semibold text-black/80">What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 font-mono text-[12px] text-black/85">repo</td>
                <td className="px-3 py-2 text-black/85">Full control of private and public repositories</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 font-mono text-[12px] text-black/85">public_repo</td>
                <td className="px-3 py-2 text-black/85">Read/write access to public repositories only</td>
              </tr>
              <tr className="border-t border-[#C6C6C8]/30">
                <td className="px-3 py-2 font-mono text-[12px] text-black/85">repo:status</td>
                <td className="px-3 py-2 text-black/85">Commit status access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </HelpSubsection>

      <HelpSubsection title="Installing the PWA">
        <p>
          GitH Mobile is a Progressive Web App, which means you can install it
          on your phone without visiting the App Store.
        </p>

        <div className="flex flex-col gap-1 mt-3">
          <HelpStep number={1} title="Open in Chrome">
            <p>
              Visit{" "}
              <a
                href="https://github.jssoriginals.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] hover:underline"
              >
                github.jssoriginals.com
              </a>{" "}
              on your Android phone.
            </p>
          </HelpStep>

          <HelpStep number={2} title="Add to Home screen">
            <p>
              Tap the ⋮ menu in the top-right and choose{" "}
              <strong>Add to Home screen</strong> or{" "}
              <strong>Install app</strong>.
            </p>
          </HelpStep>

          <HelpStep number={3} title="Launch as an app" last>
            <p>
              Confirm the prompt. The app icon will appear on your home screen,
              and it'll launch fullscreen — no browser UI.
            </p>
          </HelpStep>
        </div>

        <HelpCallout type="tip">
          On desktop Chrome or Edge, look for the install icon in the address
          bar. On iPhone Safari, use the Share menu → Add to Home Screen.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Signing In">
        <p>
          Once installed, tap the app icon. The login sheet will slide up. Paste
          your PAT and tap <strong>Sign In</strong>.
        </p>
        <p>
          If your token is valid, you'll be redirected to the dashboard. If not,
          you'll see an error like <em>"Invalid PAT. Please check permissions."</em>{" "}
          — regenerate your token with the correct scopes.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Signing Out">
        <p>
          Tap the red <strong>Logout</strong> button in the top-right of the
          dashboard. Your token will be cleared from the browser cookie, and
          you'll be redirected to the landing page.
        </p>
        <HelpCallout type="warning">
          Logging out doesn't revoke your token on GitHub. To fully revoke it,
          visit your{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007AFF] hover:underline"
          >
            GitHub token settings
          </a>
          .
        </HelpCallout>
      </HelpSubsection>
    </>
  );
}