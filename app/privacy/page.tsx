import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy · GitH Mobile",
  description:
    "How GitH Mobile handles your data. Your GitHub token never leaves your device.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F2F2F7]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-[#F2F2F7]/80 backdrop-blur-xl border-b border-[#C6C6C8]/40">
        <div className="flex h-12 items-center px-4 max-w-screen-md mx-auto w-full">
          <Link
            href="/"
            className="flex items-center gap-1 text-[#007AFF] text-[17px] active:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.4} />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 pt-6 pb-safe">
        <article className="bg-white rounded-2xl px-5 py-6 mb-6">
          <h1 className="text-[28px] font-bold text-black tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[13px] text-[#8E8E93] mt-1.5">
            Last updated: September 2026
          </p>
        </article>

        <Section title="Overview">
          <P>
            GitH Mobile ("the App", "we", "our") is an open-source, client-side
            Progressive Web App that lets you manage your GitHub repositories
            from your phone. This Privacy Policy explains what data the App
            accesses, how it is stored, and how it is protected.
          </P>
          <P>
            <strong className="text-black font-semibold">
              Short version: we don't collect anything.
            </strong>{" "}
            There is no backend server, no analytics, no tracking, and no data
            sharing. Everything happens between your browser and GitHub's API.
          </P>
        </Section>

        <Section title="What We Collect">
          <P>
            <strong className="text-black font-semibold">
              We do not collect any personal information.
            </strong>
          </P>
          <P>
            The App has no backend, no database, no user accounts, and no
            tracking scripts. We do not know who you are, where you are, or what
            you do inside the App.
          </P>
        </Section>

        <Section title="Your GitHub Personal Access Token (PAT)">
          <P>
            To interact with your repositories, the App requires a{" "}
            <strong className="text-black font-semibold">
              GitHub Personal Access Token
            </strong>
            . Here is exactly how it is handled:
          </P>
          <Bullets
            items={[
              <>
                <strong className="text-black font-semibold">
                  Stored locally on your device only.
                </strong>{" "}
                The token is saved in an HTTP-only, secure, SameSite cookie
                managed by your browser.
              </>,
              <>
                <strong className="text-black font-semibold">
                  Never sent to our servers.
                </strong>{" "}
                We do not have a server that receives your token. It never
                leaves your device.
              </>,
              <>
                <strong className="text-black font-semibold">
                  Used only for GitHub API calls.
                </strong>{" "}
                Every time the App needs data from GitHub, your browser sends
                the token directly to{" "}
                <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">
                  api.github.com
                </code>
                .
              </>,
              <>
                <strong className="text-black font-semibold">
                  Automatically expires after 30 days.
                </strong>{" "}
                The cookie is cleared and you will need to sign in again.
              </>,
              <>
                <strong className="text-black font-semibold">
                  You can revoke it at any time.
                </strong>{" "}
                Logging out of the App deletes the cookie. You can also revoke
                the token entirely from{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#007AFF] hover:underline"
                >
                  GitHub Settings
                </a>
                .
              </>,
            ]}
          />
        </Section>

        <Section title="Data We Do Not Collect">
          <Bullets
            items={[
              "Personal information (name, email, phone, address)",
              "Location data",
              "Device identifiers or fingerprints",
              "Analytics or usage statistics",
              "Cookies for tracking or advertising",
              "Crash reports or error logs sent to us",
            ]}
          />
        </Section>

        <Section title="Third-Party Services">
          <P>
            The App communicates directly with the{" "}
            <strong className="text-black font-semibold">
              GitHub REST API
            </strong>{" "}
            to fetch and modify your repositories. Your use of GitHub is
            governed by{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007AFF] hover:underline"
            >
              GitHub's Privacy Statement
            </a>
            .
          </P>
          <P>
            The App itself does not integrate with any advertising networks,
            analytics platforms, or other third-party services.
          </P>
        </Section>

        <Section title="Data Security">
          <P>
            Because the App is entirely client-side, the security of your data
            depends on your device and your browser. We recommend:
          </P>
          <Bullets
            items={[
              "Using the App only on trusted devices",
              "Never sharing your Personal Access Token with anyone",
              "Using a token with the minimum required scopes (repo scope)",
              "Revoking the token immediately if you suspect it has been compromised",
            ]}
          />
        </Section>

        <Section title="Your Rights">
          <P>
            Since we do not collect or store any of your data, there is nothing
            for us to delete or export. You are always in full control:
          </P>
          <Bullets
            items={[
              "Clear your browser cookies to remove the stored token",
              "Log out from the App to delete the session cookie",
              "Revoke the token on GitHub to disable it everywhere",
            ]}
          />
        </Section>

        <Section title="Children's Privacy">
          <P>
            The App is not directed at children under 13 (or the equivalent age
            in your jurisdiction). We do not knowingly collect any data from
            children.
          </P>
        </Section>

        <Section title="Changes to This Policy">
          <P>
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page with an updated "Last updated" date.
            Continued use of the App after changes constitutes acceptance of
            the updated policy.
          </P>
        </Section>

        <Section title="Contact">
          <P>
            If you have questions about this Privacy Policy, please open an
            issue on our GitHub repository:
          </P>
          <P>
            <a
              href="https://github.com/jitendra-math/GitH-Mobile/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007AFF] hover:underline"
            >
              github.com/jitendra-math/GitH-Mobile/issues
            </a>
          </P>
        </Section>

        {/* Footer */}
        <div className="mt-8 mb-4 text-center">
          <p className="text-[12px] text-[#8E8E93]">
            GitH Mobile · An open-source iOS-style GitHub manager
          </p>
        </div>
      </div>
    </main>
  );
}

/* ---------- Helper components ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl px-5 py-5 mb-3">
      <h2 className="text-[17px] font-semibold text-black tracking-tight mb-3">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] text-black/85 leading-relaxed">{children}</p>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2.5 pl-1">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-[15px] text-black/85 leading-relaxed"
        >
          <span className="text-[#007AFF] font-bold shrink-0 leading-relaxed">
            •
          </span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}