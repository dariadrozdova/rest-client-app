"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

export function useAuthRedirect() {
  const router = useRouter();
  const search = useSearchParams();
  const locale = useLocale();
  const next = search.get("next") || `/${locale}`;

  function done(to?: string) {
    router.replace(to ?? next);
    router.refresh();
  }
  return { done, locale, next };
}
