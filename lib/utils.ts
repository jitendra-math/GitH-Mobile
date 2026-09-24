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