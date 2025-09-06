import { defineRouting } from "next-intl/routing";

import { LANGUAGES } from "@/shared/globals";

export const routing = defineRouting({
  defaultLocale: "en",
  localePrefix: "always",
  locales: LANGUAGES.map((lang) => lang.code),
});
