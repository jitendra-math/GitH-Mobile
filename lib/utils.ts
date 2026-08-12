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
