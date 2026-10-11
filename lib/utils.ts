export function formatSize(kb: number) {
  if (!kb || kb === 0) return '0 KB';
  if (kb < 1024) return `${Number(kb.toFixed(2))} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export function getByteSize(text: string) {
  return new TextEncoder().encode(text).length;
}

export function decodeBase64(base64: string) {
  try {
    const cleanBase64 = base64.replace(/\s/g, ''); 
    const binString = atob(cleanBase64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  } catch (error) {
    console.error("Decode Error:", error);
    return "Error decoding content.";
  }
}

export function encodeBase64(text: string) {
  try {
    const bytes = new TextEncoder().encode(text);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binString);
  } catch (error) {
    console.error("Encode Error:", error);
    throw new Error("Base64 encode failed.");
  }
}

// Sort tree keys: folders first, then files, alphabetical within each group.
// Used by both the visual tree (EditModal) and text tree (generateTreeText).
export function sortTreeKeys(node: any): string[] {
  return Object.keys(node)
    .filter((k) => k !== "_info")
    .sort((a, b) => {
      const isDirA = node[a]?._info?.type === "tree";
      const isDirB = node[b]?._info?.type === "tree";
      if (isDirA && !isDirB) return -1;
      if (!isDirA && isDirB) return 1;
      return a.localeCompare(b);
    });
}

// Generate ASCII Tree Structure String
export function generateTreeText(node: any, prefix = ""): string {
  let text = "";
  const keys = sortTreeKeys(node);
  keys.forEach((key, index) => {
    const child = node[key];
    const isLast = index === keys.length - 1;
    const isFolder = child._info?.type === "tree";
    const connector = isLast ? "└── " : "├── ";
    const info = child._info;
    const isFile = info?.type !== "tree";
    let label = key;

    if (isFile) {
      const sizeKB = (info?.size || 0) / 1024;
      const formattedSize = formatSize(sizeKB);
      label += ` (${formattedSize})`;
    }

    text += prefix + connector + label + "\n";
    if (isFolder) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      text += generateTreeText(child, newPrefix);
    }
  });
  return text;
}

// Helper to convert File to Raw Base64 String
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to process file"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

// ============================================
// EXPORT HTML HELPERS
// ============================================

// Binary file extensions — these are skipped during HTML export
const BINARY_EXTENSIONS = new Set([
  // Images
  "png", "jpg", "jpeg", "gif", "ico", "webp", "bmp", "tiff", "tif", "avif", "heic",
  // Fonts
  "woff", "woff2", "ttf", "otf", "eot",
  // Audio / Video
  "mp3", "wav", "ogg", "m4a", "flac", "mp4", "mov", "avi", "mkv", "webm", "flv", "wmv",
  // Archives
  "zip", "tar", "gz", "rar", "7z", "jar", "apk", "dmg", "iso", "bz2", "xz",
  // Documents
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp",
  // Binaries / Executables
  "exe", "dll", "so", "dylib", "bin", "wasm", "class", "pyc", "o", "a",
  // Databases
  "db", "sqlite", "sqlite3", "mdb",
]);

// Binary filenames (lock files that contain binary-ish content)
const BINARY_FILENAMES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "cargo.lock",
  "composer.lock",
  "gemfile.lock",
  "poetry.lock",
  "pipfile.lock",
]);

// Returns true if the path looks like a binary file
export function isBinaryPath(path: string): boolean {
  const lower = path.toLowerCase();
  const filename = lower.split("/").pop() || "";

  if (BINARY_FILENAMES.has(filename)) return true;

  if (!lower.includes(".")) return false;
  const ext = lower.split(".").pop() || "";
  return BINARY_EXTENSIONS.has(ext);
}

// Escape HTML special characters — order matters (& must be first)
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Build the final HTML document string from decoded file contents.
// Uses <pre class="code"> for semantic code blocks.
export function buildExportHtml(
  files: Array<{ path: string; content: string }>
): string {
  const templateHead = `<link href="https://fonts.googleapis.com/css2?family=Vesper+Libre:wght@400;700&display=swap" rel="stylesheet"><style>@font-face{font-family:'SF Pro Text Ultralight';src:url('https://pdftoimgjss.vercel.app/fonts/sf-pro-text_ultralight.woff') format('woff');font-weight:200;font-style:normal;font-display:swap;}@font-face{font-family:'SF Pro Text';src:url('https://pdftoimgjss.vercel.app/fonts/sf-pro-text_regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap;}.pdf-doc{font-family:'SF Pro Text Ultralight',sans-serif;font-size:12px;line-height:1.05;color:#1e1e1e;padding:0;margin:0}.pdf-doc .filename{font-family:'SF Pro Text',sans-serif;font-weight:700;font-size:12px;line-height:1.05;display:block;margin:8px 0 2px 0;color:#000}.pdf-doc .filename:first-child{margin-top:0}.pdf-doc pre.code{font-family:'SF Pro Text Ultralight',monospace;font-size:11px;line-height:1.2;display:block;margin:0 0 6px 0;padding:0;white-space:pre-wrap;word-break:break-word;color:#1e1e1e;background:transparent;border:none;tab-size:2}</style><div class="pdf-doc">`;

  const templateTail = `</div>`;

  const body = files
    .map((file) => {
      const safePath = escapeHtml(file.path);
      const safeContent = escapeHtml(file.content);
      return `<span class="filename">${safePath}</span><pre class="code">${safeContent}</pre>`;
    })
    .join("");

  return templateHead + body + templateTail;
}