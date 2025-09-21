export function isCompatibleType<T>(
  parsed: unknown,
  defaultValue: T,
): parsed is T {
  if (parsed === null || parsed === undefined) {
    return false;
  }

  const parsedType = typeof parsed;
  const defaultType = typeof defaultValue;

  if (parsedType !== defaultType) {
    return false;
  }

  if (Array.isArray(defaultValue) && Array.isArray(parsed)) {
    return true;
  }

  if (parsedType === "object" && defaultType === "object") {
    if (Array.isArray(defaultValue) !== Array.isArray(parsed)) {
      return false;
    }
    return true;
  }

  return true;
}
