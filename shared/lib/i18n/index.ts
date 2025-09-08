export type Locale = "be" | "en" | "ru";

const loaders = {
  be: () => import("./messages/be.index").then((m) => m.default),
  en: () => import("./messages/en.index").then((m) => m.default),
  ru: () => import("./messages/ru.index").then((m) => m.default),
} as const;

export async function getMessages(locale: Locale) {
  return loaders[locale]();
}
