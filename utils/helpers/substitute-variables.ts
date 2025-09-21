import { VARIABLE_REGEX } from "@shared/globals";

export function substituteVariables(
  input: string,
  variablesMap: Record<string, string>,
): { out: string; used: string[] } {
  if (!input) {
    return { out: input, used: [] };
  }
  const usedSet = new Set<string>();
  const out = input.replace(VARIABLE_REGEX, (_, name: string) => {
    if (Object.prototype.hasOwnProperty.call(variablesMap, name)) {
      usedSet.add(name);
      return variablesMap[name];
    }
    return `{{${name}}}`;
  });
  return { out, used: [...usedSet] };
}
