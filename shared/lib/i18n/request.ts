import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { getMessages } from "@/shared/lib/i18n";
import { routing } from "@/shared/lib/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = await getMessages(locale);

  return { locale, messages };
});
