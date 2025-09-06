import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "en",
  localePrefix: {
    mode: "as-needed",
  },
  locales: ["en", "ru", "be"],
});
