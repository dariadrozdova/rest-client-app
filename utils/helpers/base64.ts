export function fromBase64Utf8(input: string): null | string {
  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) {
      const codePoint = binary.codePointAt(index);
      if (codePoint !== undefined) {
        bytes[index] = codePoint;
      }
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch {
    return null;
  }
}

export function toBase64Utf8(input: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }
  return btoa(binary);
}
