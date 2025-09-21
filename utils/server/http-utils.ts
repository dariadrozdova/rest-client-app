import { jsonDetect } from "@utils/helpers";

export function byteLength(value: null | string | undefined): number {
  return value ? Buffer.byteLength(value, "utf8") : 0;
}

export function isBodyAllowed(method: string) {
  const m = method.toUpperCase();
  return m !== "GET" && m !== "HEAD";
}

export function parseMaybeJson(text: string, contentType?: string): unknown {
  if (!jsonDetect(contentType)) {
    return text;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function toHeadersObject(headers: Headers): Record<string, string> {
  const object: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    object[key] = value;
  }
  return object;
}
