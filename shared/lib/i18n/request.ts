import { promises as fs } from "node:fs";
import path from "node:path";

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "@/shared/lib/i18n/routing";

async function loadMessages(locale: string) {
  const directory = path.join(
    process.cwd(),
    "shared/lib/i18n/messages",
    locale,
  );
  const files = await fs.readdir(directory);
  const messages: Record<string, string> = {};

  for (const file of files) {
    if (file.endsWith(".json")) {
      const ns = file.replace(".json", "");
      const content = await fs.readFile(path.join(directory, file), "utf8");
      messages[ns] = JSON.parse(content);
    }
  }
  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = await loadMessages(locale);

  return { locale, messages };
});
