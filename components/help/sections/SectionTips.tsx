import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";
import HelpCodeBlock from "../HelpCodeBlock";

export default function SectionTips() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Power-user workflows and shortcuts to get the most out of GitH Mobile.
      </p>

      <HelpSubsection title="Workflow: Bulk Migration">
        <p>Move files from one repo to another in minutes:</p>
        <ol className="flex flex-col gap-2 pl-1 mt-2 list-none">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>Open the source repo → Bulk Actions → Copy Files</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>Paste all paths, tap Fetch &amp; Copy</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>Open the target repo → Bulk Actions → Create Files</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">4.</span>
            <span>Paste same paths, tap Create Files</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">5.</span>
            <span>Edit each new file, paste the content, save</span>
          </li>
        </ol>
      </HelpSubsection>

      <HelpSubsection title="Workflow: Batch Rename with mv">
        <p>
          Use the terminal to rename many files in one command:
        </p>
        <HelpCodeBlock
          code={`mv old-config.ts new-config.ts
mv old-utils.ts new-utils.ts
mv old-types.ts new-types.ts`}
          language="Batch rename"
        />
        <p className="text-[13px] text-black/70 mt-2">
          Paste all three lines at once. They run sequentially.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Workflow: Quick Config Edit">
        <p>
          Fix a typo or config value without leaving your phone:
        </p>
        <ol className="flex flex-col gap-2 pl-1 mt-2 list-none">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>Dashboard → Edit repo</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>Toggle Edit Mode ON</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>Find the file, tap Edit</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">4.</span>
            <span>Make the change, save to queue</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">5.</span>
            <span>Commit</span>
          </li>
        </ol>
      </HelpSubsection>

      <HelpSubsection title="Workflow: Safe Rollback">
        <p>Before rolling back, take a snapshot:</p>
        <ol className="flex flex-col gap-2 pl-1 mt-2 list-none">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>Note the current commit SHA from History</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>Do the rollback</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>If you regret it, roll forward to the noted SHA</span>
          </li>
        </ol>
      </HelpSubsection>

      <HelpSubsection title="Keyboard Shortcuts">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">/</strong> — Focus
              search on Help page
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Esc</strong> — Close
              modal / clear search
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Shift + Enter</strong>{" "}
              — New line in Terminal
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Token Management">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Create separate tokens per device</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Set expiration dates (90 days recommended)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Rotate tokens every few months</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Revoke unused tokens immediately</span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Speed Tips">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Commit less often — batch 10 changes into one commit</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Use Bulk Actions for repetitive tasks</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Terminal is faster than multiple taps</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Install the PWA for fullscreen mode</span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpCallout type="tip" title="Bookmark this">
        Save the Help page URL (<code className="text-[12px] font-mono bg-white px-1.5 py-0.5 rounded">/help</code>)
        so you can quickly jump back when you forget a step.
      </HelpCallout>
    </>
  );
}