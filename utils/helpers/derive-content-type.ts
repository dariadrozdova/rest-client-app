import { ResolvedHeader } from "@shared/types";

export function deriveContentType(
  headers: ResolvedHeader[],
  hint?: null | string,
): string | undefined {
  const fromHeader = headers
    .find((h) => h.name.toLowerCase() === "content-type")
    ?.value?.trim();
  return fromHeader || hint || undefined;
}
