import type { ReactElement } from "react";
import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionCommitHistory(): ReactElement {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Review pending changes, commit them to GitHub, browse history, and roll
        back to any previous state.
      </p>

      <HelpSubsection title="The Commit Queue">
        <p>
          Every change you make (edit, delete, upload, rename, mv) is added to a
          <strong> commit queue</strong> — a staging area at the bottom of the
          Edit modal.
        </p>
        <p>The queue shows:</p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>The file path</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">DEL</strong> label for
              deletions
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Size diff</strong> —
              green for additions, red for deletions
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Removing from Queue">
        <p>
          Tap the red <strong>×</strong> on any queue item to remove it. Use{" "}
          <strong>Clear</strong> to remove everything.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Committing Changes">
        <p>
          Tap the blue <strong>Commit</strong> button in the queue section. All
          queued changes are pushed to GitHub as a single atomic commit.
        </p>
        <p>
          GitH Mobile auto-generates a commit message like{" "}
          <em>&quot;Update via Repo Manager 🚀&quot;</em> or{" "}
          <em>&quot;Updates &amp; Deletions via Repo Manager 🚀&quot;</em>.
        </p>

        <HelpCallout type="success">
          Once committed, the queue empties and the file tree refreshes with the
          updated state.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Viewing Commit History">
        <p>
          In the Edit modal toolbar, tap the blue <strong>History</strong>{" "}
          button.
        </p>
        <p>You&apos;ll see the last 15 commits, each showing:</p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Commit message</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Short SHA (7 characters)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Author name</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Date and time</span>
          </li>
        </ul>

        <p className="mt-2">
          The most recent commit has a green <strong>Latest</strong> badge and
          can&apos;t be rolled back to (it&apos;s already active).
        </p>
      </HelpSubsection>

      <HelpSubsection title="Rolling Back">
        <p>
          Tap <strong>Rollback</strong> on any past commit. A type-to-confirm
          modal appears — type the short SHA to proceed.
        </p>

        <p className="mt-2">
          <strong className="text-black font-semibold">How it works:</strong>
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>GitH Mobile fetches the target commit&apos;s tree</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>
              It creates a{" "}
              <strong className="text-black font-semibold">new commit</strong>{" "}
              pointing to that old tree
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>The branch moves to this new commit</span>
          </li>
        </ul>

        <HelpCallout type="info" title="Rollback is non-destructive">
          The original commits stay in your history. You can always roll
          forward to a newer commit later. Nothing is deleted.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Before You Rollback">
        <HelpCallout type="warning">
          Rollback overwrites your working directory with the old state. If you
          have uncommitted queue items, commit them first or clear the queue.
        </HelpCallout>
      </HelpSubsection>

      <HelpCallout type="danger" title="Double-check the SHA">
        Type confirmation uses the short SHA (7 chars). Case-insensitive
        matching. If it doesn&apos;t match, the Rollback button stays disabled.
      </HelpCallout>
    </>
  );
}