import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionFileEditing() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        The Edit Modal is the heart of GitH Mobile — browse your file tree, edit
        files with a full code editor, and commit changes.
      </p>

      <HelpSubsection title="Opening the Editor">
        <p>
          Tap the <strong>blue pencil icon</strong> on any repo card. The Edit
          modal slides up, showing the repository's file tree.
        </p>
      </HelpSubsection>

      <HelpSubsection title="File Tree Navigation">
        <p>
          Files and folders are organized in a tree structure:
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Folders first</strong>,
              then files — both sorted alphabetically
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              Tap a folder to <strong className="text-black font-semibold">expand or collapse</strong>{" "}
              it
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              Nested folders show <strong className="text-black font-semibold">indentation guides</strong>{" "}
              on the left
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              Each file shows its <strong className="text-black font-semibold">size</strong>{" "}
              below the name
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Edit Mode Toggle">
        <p>
          In the top toolbar, there's an{" "}
          <strong>Edit Mode ON/OFF</strong> button. This controls whether
          destructive actions appear on file rows.
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Edit Mode OFF</strong> —
              Copy/Replace/Delete actions (safe browsing)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Edit Mode ON</strong> —
              Copy/Edit/Delete actions (full editing)
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="File Actions Explained">
        <div className="flex flex-col gap-3 mt-2">
          <div>
            <p className="font-semibold text-black text-[14px]">Copy</p>
            <p className="text-[13px] text-black/75 mt-0.5">
              Fetches the file's content from GitHub and copies it to your
              clipboard. Available for text files.
            </p>
          </div>

          <div>
            <p className="font-semibold text-black text-[14px]">Download</p>
            <p className="text-[13px] text-black/75 mt-0.5">
              Downloads the file directly. Used for binary files (images, PDFs,
              archives) and files larger than 100 KB.
            </p>
          </div>

          <div>
            <p className="font-semibold text-black text-[14px]">Edit</p>
            <p className="text-[13px] text-black/75 mt-0.5">
              Opens the file in the CodeMirror editor with syntax highlighting.
              Only shown when Edit Mode is ON.
            </p>
          </div>

          <div>
            <p className="font-semibold text-black text-[14px]">Replace</p>
            <p className="text-[13px] text-black/75 mt-0.5">
              Replaces the file's content with the current clipboard content.
              Only shown when Edit Mode is OFF. Perfect for quick pastes.
            </p>
          </div>

          <div>
            <p className="font-semibold text-black text-[14px]">Delete</p>
            <p className="text-[13px] text-black/75 mt-0.5">
              Adds the file to the deletion queue. Nothing is deleted until you
              commit.
            </p>
          </div>
        </div>
      </HelpSubsection>

      <HelpSubsection title="The Code Editor">
        <p>
          When you tap <strong>Edit</strong> on a text file, the CodeMirror
          editor opens:
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Syntax highlighting</strong>{" "}
              for 20+ languages (JS, TS, Python, Go, Rust, etc.)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">VS Code dark theme</strong>{" "}
              for comfortable editing
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Auto language detection</strong>{" "}
              based on file extension
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Live file size</strong>{" "}
              displayed in the footer
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Renaming a File">
        <p>
          In the editor, tap the <strong>file path</strong> at the top to open
          the Rename dialog.
        </p>
        <p>
          You can change the folder and filename, but <strong className="text-black font-semibold">not
          the extension</strong>. If you try, you'll see an error.
        </p>
        <HelpCallout type="warning" title="Extension is locked">
          Changing <code className="text-[12px] font-mono bg-white px-1.5 py-0.5 rounded">.ts</code>{" "}
          to <code className="text-[12px] font-mono bg-white px-1.5 py-0.5 rounded">.js</code>{" "}
          isn't allowed — it prevents accidental type changes. Delete and
          recreate the file if you truly need a different extension.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="Saving Changes">
        <p>
          Tap <strong>Save to Queue</strong> in the editor footer. The file is
          added to the commit queue — nothing has been pushed to GitHub yet.
        </p>
        <p>
          To push, tap <strong>Commit</strong> at the bottom of the Edit modal
          (after reviewing the queue).
        </p>
      </HelpSubsection>

      <HelpCallout type="tip">
        Every change you make is queued. You can edit 10 files, then commit them
        all in one atomic commit — just like using Git locally.
      </HelpCallout>
    </>
  );
}