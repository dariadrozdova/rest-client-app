export function safePrettyJson(
  raw: string,
): { error: string; ok: false } | { ok: true; text: string } {
  try {
    const object = JSON.parse(raw);
    return { ok: true, text: JSON.stringify(object, null, 2) };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Invalid JSON" };
  }
}
