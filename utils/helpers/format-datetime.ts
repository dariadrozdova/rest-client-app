export function formatDateTime(
  input: Date | null | number | string | undefined,
  locale?: string,
): string {
  if (!input) {
    return "-";
  }
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const dtf = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = dtf.formatToParts(date);
  const byType = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const day = byType.day ?? "";
  const mon = byType.month ?? "";
  const year = byType.year ?? "";
  const hh = (byType.hour ?? "").padStart(2, "0");
  const mm = (byType.minute ?? "").padStart(2, "0");
  const ss = (byType.second ?? "").padStart(2, "0");

  return `${day} ${mon} ${year}, ${hh}.${mm}.${ss}`.trim();
}
