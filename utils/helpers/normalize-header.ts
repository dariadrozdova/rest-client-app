import { HeaderItem } from "@shared/types";

export function normalizeHeader(row: HeaderItem): HeaderItem {
  const key = row.key?.trim?.() ?? "";
  const value = row.value?.trim?.() ?? "";
  return { ...row, key, value };
}
