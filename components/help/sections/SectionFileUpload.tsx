import HelpSubsection from "../HelpSubsection";
import HelpCallout from "../HelpCallout";

export default function SectionFileUpload() {
  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Upload files from your device directly to your repository.
      </p>

      <HelpSubsection title="Opening the Upload Modal">
        <p>
          In the Edit modal toolbar, tap the <strong>Upload</strong> button
          (cloud icon).
        </p>
      </HelpSubsection>

      <HelpSubsection title="Drag & Drop">
        <p>
          On desktop, drag files from your file manager directly into the drop
          zone.
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>The zone highlights blue when you drag over it</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>Multiple files are supported — drop them all at once</span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Tap to Browse (Mobile)">
        <p>
          On mobile, tap the drop zone to open your device's file picker. Select
          one or more files.
        </p>
        <p>
          Once selected, each file appears in a list below with an editable path.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Editing the Path">
        <p>
          Every uploaded file has two parts: the <strong>base name/path</strong>{" "}
          (editable) and the <strong>extension</strong> (locked).
        </p>
        <p>For example:</p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">public/images/logo</code>{" "}
              + <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">.png</code>
            </span>
          </li>
        </ul>
        <p className="mt-2">
          You can rename the path but not the extension. This prevents
          accidental file type changes.
        </p>
      </HelpSubsection>

      <HelpSubsection title="Extension Lock Explained">
        <p>
          If you upload <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">photo.png</code>{" "}
          and rename it to <code className="text-[12px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded">photo.txt</code>,
          the app would refuse. This is intentional — changing the extension
          changes how the file is interpreted.
        </p>

        <HelpCallout type="info" title="Need a different extension?">
          Upload the file with the right extension. If you truly need to
          change it, delete the file after upload and re-upload with a
          different name.
        </HelpCallout>
      </HelpSubsection>

      <HelpSubsection title="File Size Limits">
        <p>
          GitHub's API limits individual file uploads. Practical limits:
        </p>
        <ul className="flex flex-col gap-2 pl-1 mt-2">
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Small files (&lt; 25 MB)</strong> —
              Work reliably via API
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#007AFF] font-bold shrink-0">•</span>
            <span>
              <strong className="text-black font-semibold">Large files (&gt; 25 MB)</strong> —
              May fail. Use Git LFS via command line
            </span>
          </li>
        </ul>
      </HelpSubsection>

      <HelpSubsection title="Multiple Files">
        <p>
          You can add as many files as you want in one session. When you tap{" "}
          <strong>Add Files to Queue</strong>, all files are queued at once.
        </p>
        <p>
          Review the queue before committing — remove any file you don't want to
          upload.
        </p>
      </HelpSubsection>

      <HelpCallout type="tip">
        Files are queued, not uploaded. Nothing is pushed to GitHub until you
        tap <strong>Commit</strong> in the Edit modal.
      </HelpCallout>
    </>
  );
}