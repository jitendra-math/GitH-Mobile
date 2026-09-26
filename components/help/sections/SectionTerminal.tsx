import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";
import HelpCodeBlock from "../HelpCodeBlock";

export default function SectionTerminal() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Run real filesystem commands (mkdir, mv) with a terminal interface —
        right from your phone.
      </p>

      <HelpSubsection title="Opening the Terminal">
        <p>
          In the Edit modal toolbar, tap the black{" "}
          <strong>Terminal</strong> button.
        </p>
        <p>
          The terminal slides up with a welcome message and a command prompt.
        </p>
      </HelpSubsection>

      <HelpSubsection title="The mkdir Command">
        <p>Creates a new folder in your repository tree.</p>
        <p className="mt-2">
          <strong className="text-black font-semibold">Syntax:</strong>
        </p>
        <HelpCodeBlock code="mkdir <path>" language="Syntax" />

        <p className="mt-3">
          <strong className="text-black font-semibold">Examples:</strong>
        </p>
        <HelpCodeBlock
          code={`mkdir public
mkdir public/screenshots
mkdir src/components/ui`}
          language="Examples"
        />

        <HelpCallout type="info" title="Empty folders are UI-only">
          Git doesn't track empty folders. This mkdir creates a visual folder in
          the app — it only becomes a real GitHub folder when you add a file
          inside it.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="The mv Command">
        <p>
          Moves or renames a file. This works by creating two operations:
          delete at old path + create at new path.
        </p>
        <p className="mt-2">
          <strong className="text-black font-semibold">Syntax:</strong>
        </p>
        <HelpCodeBlock code="mv <source> <destination>" language="Syntax" />
      </HelpSubsection>

      <HelpSubsection title="mv — Three Use Cases">
        <p>
          <strong className="text-black font-semibold">1. Move to a folder:</strong>
        </p>
        <HelpCodeBlock code="mv logo.png public/images/" language="Move" />
        <p className="text-[13px] text-black/70 mt-1">
          → Creates <code className="text-[11px] font-mono bg-[#F2F2F7] px-1 py-0.5 rounded">public/images/logo.png</code>
        </p>

        <p className="mt-3">
          <strong className="text-black font-semibold">2. Rename a file:</strong>
        </p>
        <HelpCodeBlock code="mv old-name.ts new-name.ts" language="Rename" />
        <p className="text-[13px] text-black/70 mt-1">
          → File renamed in place (same folder)
        </p>

        <p className="mt-3">
          <strong className="text-black font-semibold">
            3. Move + rename together:
          </strong>
        </p>
        <HelpCodeBlock code="mv app/main.py src/app/main.py" language="Combined" />
      </HelpSubsection>

      <HelpSubsection title="Multi-Line Paste">
        <p>
          Paste multiple commands at once — each on its own line. They run
          sequentially.
        </p>
        <HelpCodeBlock
          code={`mkdir public/screenshots
mv logo-192.png public/screenshots/
mv logo-512.png public/screenshots/
mkdir assets
mv logo.png assets/`}
          language="Batch"
        />
        <p className="text-[13px] text-black/70 mt-2">
          All four commands execute one by one, in order.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Keyboard Shortcuts">
        <ul className="flex flex-col gap-2 pl-1">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Enter</strong> — Runs
              all commands currently in the input
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Shift + Enter</strong> —
              Adds a new line without running
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Reading the Output">
        <p>The terminal log is color-coded:</p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#34C759] mt-2 shrink-0" />
            <span>
              <strong className="text-black font-semibold">Green</strong> — Success
              message
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] mt-2 shrink-0" />
            <span>
              <strong className="text-black font-semibold">Red</strong> — Error
              (command failed)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#8E8E93] mt-2 shrink-0" />
            <span>
              <strong className="text-black font-semibold">Grey</strong> — Info
              message
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#F2F2F2] mt-2 shrink-0" />
            <span>
              <strong className="text-black font-semibold">White</strong> — Your
              command (shown with a green $ prefix)
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpCallout type="tip" title="Commit isn't automatic">
        Terminal operations add to the commit queue. Tap <strong>Commit</strong>{" "}
        in the Edit modal to push changes to GitHub.
      </HelpCallout>
    </>
  );
}