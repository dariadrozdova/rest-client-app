export function jsonDetect(contentType?: null | string): boolean {
  if (!contentType) {
    return false;
  }
  const ct = contentType.toLowerCase();
  return ct.includes("application/json") || ct.includes("+json");
}
