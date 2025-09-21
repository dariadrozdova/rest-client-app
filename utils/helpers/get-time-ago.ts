import { MS_IN_DAY, MS_IN_HOUR, MS_IN_MINUTE } from "@/shared/globals";
import { formatBe } from "@/utils/helpers/format-be";

export function getTimeAgo(dateString: string, locale: string): string {
  const now = Date.now();
  const created = new Date(dateString).getTime();
  const diffMs = now - created;

  const days = Math.floor(diffMs / MS_IN_DAY);
  const hours = Math.floor(diffMs / MS_IN_HOUR);
  const minutes = Math.floor(diffMs / MS_IN_MINUTE);

  if (locale.startsWith("be")) {
    if (days > 0) {
      return formatBe(-days, "day");
    }
    if (hours > 0) {
      return formatBe(-hours, "hour");
    }
    if (minutes > 0) {
      return formatBe(-minutes, "minute");
    }
    return "толькі што";
  }

  const supported = Intl.RelativeTimeFormat.supportedLocalesOf([locale]);
  const effectiveLocale = supported.length > 0 ? supported[0] : "en";
  const rtf = new Intl.RelativeTimeFormat(effectiveLocale, { numeric: "auto" });

  if (days > 0) {
    return rtf.format(-days, "day");
  }
  if (hours > 0) {
    return rtf.format(-hours, "hour");
  }
  if (minutes > 0) {
    return rtf.format(-minutes, "minute");
  }
  return rtf.format(0, "minute");
}
