export function safeDecodeBase64Uri(value: string): null | string {
  try {
    const decoded = atob(value);
    return decodeURIComponent(decoded);
  } catch {
    return null;
  }
}
