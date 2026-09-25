import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service · GitH Mobile",
  description:
    "Terms and conditions for using GitH Mobile — the iOS-style GitHub manager for your phone.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-[13px] text-[#8E8E93] mt-1.5">
            Last updated: September 2026
          </p>
        </article>

        <Section title="Acceptance of Terms">
          <P>
            By accessing or using GitH Mobile ("the App"), you agree to be bound
            by these Terms of Service. If you do not agree with any part of
            these terms, please do not use the App.
          </P>
        </Section>

        <Section title="Description of Service">
          <P>
            GitH Mobile is a free, open-source Progressive Web App that provides
            an iOS-style interface for managing your GitHub repositories. It
            uses the GitHub REST API to list repositories, edit files, commit
            changes, and perform other Git operations on your behalf.
          </P>
          <P>
            The App is provided for personal and professional use. It is not
            affiliated with, endorsed by, or sponsored by GitHub, Inc. or
            Microsoft Corporation.
          </P>
        </Section>

        <Section title="Your Responsibilities">
          <P>
            By using the App, you agree to:
          </P>
          <Bullets
            items={[
              "Provide a valid GitHub Personal Access Token with appropriate scopes",
              "Keep your token confidential and secure",
              "Use the App only on devices you trust",
              "Comply with GitHub's Terms of Service and Acceptable Use Policies",
              "Not use the App for any illegal, harmful, or unauthorized purpose",
              "Not attempt to reverse-engineer, exploit, or abuse the App",
            ]}
          />
        </Section>

        <Section title="Your GitHub Account">
          <P>
            You retain full ownership of your GitHub account and its contents.
            The App only acts on your behalf using the permissions you grant
            through your Personal Access Token. You are solely responsible for
            any changes made to your repositories through the App.
          </P>
        </Section>

        <Section title="No Warranty">
          <P>
            <strong className="text-black font-semibold">
              The App is provided "AS IS" and "AS AVAILABLE"
            </strong>{" "}
            without warranties of any kind, either express or implied,
            including but not limited to:
          </P>
          <Bullets
            items={[
              "Merchantability or fitness for a particular purpose",
              "Non-infringement of third-party rights",
              "Uninterrupted, timely, secure, or error-free operation",
              "Accuracy or reliability of any content or data",
            ]}
          />
          <P>
            We do not guarantee that the App will always work, that it will
            always be available, or that any bugs will be fixed.
          </P>
        </Section>

        <Section title="Limitation of Liability">
          <P>
            To the maximum extent permitted by law, the author(s) of GitH Mobile
            shall not be liable for any direct, indirect, incidental, special,
            consequential, or punitive damages arising out of or related to your
            use of the App, including but not limited to:
          </P>
          <Bullets
            items={[
              "Loss of data, code, or repository contents",
              "Damages resulting from unauthorized access to your account",
              "Damages resulting from actions performed through the App",
              "Any damages arising from bugs, errors, or downtime",
            ]}
          />
          <P>
            You use the App entirely at your own risk.
          </P>
        </Section>

        <Section title="Open Source License">
          <P>
            GitH Mobile is released under the{" "}
            <strong className="text-black font-semibold">MIT License</strong>.
            You are free to use, modify, and distribute the source code subject
            to the terms of that license. See the{" "}
            <a
              href="https://github.com/jitendra-math/GitH-Mobile/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007AFF] hover:underline"
            >
              LICENSE
            </a>{" "}
            file for details.
          </P>
        </Section>

        <Section title="Termination">
          <P>
            You may stop using the App at any time by logging out and revoking
            your Personal Access Token on GitHub. We reserve the right to
            discontinue the App or any feature at any time, without notice.
          </P>
        </Section>

        <Section title="Changes to These Terms">
          <P>
            We may update these Terms of Service from time to time. Any changes
            will be reflected on this page with an updated "Last updated" date.
            Continued use of the App after changes constitutes acceptance of
            the updated terms.
          </P>
        </Section>

        <Section title="Governing Law">
          <P>
            These Terms of Service are governed by and construed in accordance
            with the laws of India, without regard to its conflict of law
            principles. Any disputes arising under these terms shall be subject
            to the exclusive jurisdiction of the courts of India.
          </P>
        </Section>

        <Section title="Contact">
          <P>
            If you have questions about these Terms of Service, please open an
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