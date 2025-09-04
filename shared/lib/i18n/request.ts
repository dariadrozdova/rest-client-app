import { promises as fs } from "fs";
import path from "path";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

async function loadMessages(locale: string) {
  const dir = path.join(process.cwd(), "shared/lib/i18n/messages", locale);
  const files = await fs.readdir(dir);
  const messages: Record<string, any> = {};

  for (const file of files) {
    if (file.endsWith(".json")) {
      const ns = file.replace(".json", "");
      const content = await fs.readFile(path.join(dir, file), "utf-8");
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
