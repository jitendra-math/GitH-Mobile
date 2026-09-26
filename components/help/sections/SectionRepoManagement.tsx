import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionRepoManagement() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Manage your repository metadata — rename, update description, change
        visibility, or delete entirely.
      </p>

      <HelpSubsection title="Opening the Info Modal">
        <p>
          Tap on any repository name in the dashboard. The Repo Info modal
          slides up from the bottom, showing:
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Owner avatar and repo name</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Description (if set)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Language, Visibility, Created date, Last commit</span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Opening Repository Settings">
        <p>
          In the Repo Info modal, tap the <strong>blue pencil icon</strong> in
          the top-right. The Repository Settings sheet appears with editable
          fields.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Renaming a Repository">
        <p>
          Edit the <strong>Name</strong> field and tap{" "}
          <strong>Save Changes</strong>. A confirmation modal appears.
        </p>
        <p>
          Type the current <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">owner/repo</code>{" "}
          to confirm. GitHub will redirect the old URL to the new one
          automatically.
        </p>
        <HelpCallout type="warning">
          Renaming may break external links, CI/CD pipelines, or webhooks.
          Update your bookmarks and integrations.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Editing the Description">
        <p>
          Update the <strong>Description</strong> field (max 350 characters).
          A live character counter appears in the corner.
        </p>
        <p>
          Description changes take effect immediately without confirmation —
          they're non-destructive.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Changing Visibility">
        <p>
          Toggle the <strong>Private</strong> switch to flip between Public and
          Private.
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Public → Private</strong>{" "}
              — Hides the repo from everyone. Only you can access it.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Private → Public</strong>{" "}
              — Makes the repo and its entire history visible to the world.
            </span>
          </li>
        </ul>

        <HelpCallout type="danger" title="Visibility changes need confirmation">
          Both directions require typing{" "}
          <code className="text-[12px] font-mono bg-white px-1.5 py-0.5 rounded">owner/repo</code>{" "}
          to confirm. This prevents accidental exposure.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Deleting a Repository">
        <p>
          Tap the red <strong>Delete</strong> button on the repo card (not the
          settings sheet). A type-to-confirm modal appears.
        </p>
        <p>
          Type the full{" "}
          <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">owner/repo</code>{" "}
          exactly. Only then will the Delete button activate.
        </p>

        <HelpCallout type="danger" title="Deletion is permanent">
          GitHub Free accounts <strong>cannot restore</strong> deleted
          repositories. Paid plans may recover them within 90 days. Back up
          anything important first.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Type-to-Confirm — Why?">
        <p>
          Destructive actions (delete repo, rename, visibility change) require
          you to type an exact value. This is intentional:
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Prevents accidental deletion with a single tap</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Forces a moment of reflection before an irreversible action</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Case-sensitive matching prevents typos from succeeding</span>
          </li>
        </ul>
      </HelpSubsection>
    </>
  );
}