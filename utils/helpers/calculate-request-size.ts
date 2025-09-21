import { ResolvedRequest } from "@/shared/types";

export function calculateRequestSize(resolved: ResolvedRequest): number {
  let size = 0;

  size += new Blob([resolved.url]).size;

  for (const header of resolved.headers) {
    size += new Blob([`${header.name}: ${header.value}`]).size;
  }

  if (resolved.body) {
    size += new Blob([resolved.body]).size;
  }

  return size;
}
