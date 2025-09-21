import { VARIABLE_REGEX } from "@shared/globals";

export function extractUnresolvedVariables(input: string): string[] {
  if (!input) {
    return [];
  }
  const names = new Set<string>();
  let m: null | RegExpExecArray;
  const re = new RegExp(VARIABLE_REGEX);
  while ((m = re.exec(input))) {
    names.add(m[1]);
  }
  return [...names];
}
