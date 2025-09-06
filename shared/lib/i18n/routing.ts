import { defineRouting } from "next-intl/routing";

import { LANGUAGES } from "@/shared/globals";

export const routing = defineRouting({
  defaultLocale: "en",
  localePrefix: "as-needed",
  locales: LANGUAGES.map((lang) => lang.code),
});
