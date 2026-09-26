import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";
import HelpCodeBlock from "../HelpCodeBlock";

export default function SectionBulkOps() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Handle many files at once — copy content from multiple files, or create
        placeholder files for a new project structure.
      </p>

      <HelpSubsection title="Opening Bulk Actions">
        <p>
          In the Edit modal, tap the purple{" "}
          <strong>Bulk Actions</strong> button in the toolbar.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Copy Files Mode">
        <p>
          Fetches the content of multiple files from GitHub and combines them
          into your clipboard.
        </p>
        <p>How it works:</p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>Enter one file path per line in the textarea</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>
              Tap <strong className="text-black font-semibold">Fetch &amp; Copy</strong>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>Content from all files is combined and copied to clipboard</span>
          </li>
        </ul>

        <p className="mt-3">Example input:</p>
        <HelpCodeBlock
          code={`src/app/page.tsx
package.json
lib/utils.ts`}
          language="Paths"
        />

        <p className="mt-3">Output format in clipboard:</p>
        <HelpCodeBlock
          code={`Current src/app/page.tsx

// full file content here...

Current package.json

// full file content here...`}
          language="Output"
        />
      </HelpSubsection>

      <HelpSubsection title="Create Files Mode">
        <p>
          Adds multiple empty placeholder files to the file tree. Perfect for
          setting up a project structure before adding content.
        </p>

        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">1.</span>
            <span>Switch to the <strong className="text-black font-semibold">Create Files</strong> tab</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">2.</span>
            <span>Enter one file path per line</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">3.</span>
            <span>
              Tap <strong className="text-black font-semibold">Create Files</strong>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">4.</span>
            <span>Placeholder files appear in the tree — edit each to add content</span>
          </li>
        </ul>

        <HelpCallout type="info" title="Files are empty for now">
          Created files have no content yet. Open them in the editor to write
          real content, then commit.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Multi-Line Paste">
        <p>
          The textarea accepts multi-line input naturally. Paste a list from
          anywhere — VS Code, Finder, or a spreadsheet.
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Leading and trailing slashes are stripped automatically</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Empty lines are ignored</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Whitespace around paths is trimmed</span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Practical Use Cases">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Backup files</strong> —
              Copy 10 config files to clipboard in one action
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Sharing code</strong> —
              Send multiple file contents to a colleague
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Scaffolding</strong> —
              Create 20 empty files for a new project structure
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Migration</strong> —
              Copy from one repo, create in another
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpCallout type="warning" title="Rate limits apply">
        Each file fetched = 1 API call. Fetching 50 files uses 50 calls. You
        have 5000 calls per hour, so batch sensibly.
      </HelpCallout>
    </>
  );
}