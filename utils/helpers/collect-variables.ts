import { VariableItem } from "@shared/types";

export function collectEnabledVariables(
  variables: VariableItem[],
): Record<string, string> {
  const variableList: Record<string, string> = {};
  for (const v of variables) {
    if (!v.enabled) {
      continue;
    }
    const name = (v.key ?? "").trim();
    if (!name) {
      continue;
    }
    variableList[name] = (v.value ?? "").toString();
  }
  return variableList;
}
