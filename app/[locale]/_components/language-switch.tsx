"use client";

import { useLocale, useTranslations } from "next-intl";

import { LANGUAGES } from "@/shared/globals";
import { usePathname, useRouter } from "@/shared/lib/i18n/navigation";
import { Dropdown } from "@/shared/ui/dropdown";

export function LanguageSwitch() {
  const t = useTranslations("dropdown");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const languageOptions = LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }));

  const handleLanguageChange = (languageCode: string) => {
    router.push(pathname, { locale: languageCode });
  };

  return (
    <div className="z-100">
      <Dropdown
        ariaLabel={t("language")}
        buttonClassName="text-text-primary hover:bg-border-default bg-bg-primary rounded-lg px-3 py-2 font-medium"
        dropdownClassName="bg-bg-secondary"
        onSelect={handleLanguageChange}
        options={languageOptions}
        selectedValue={currentLocale}
      />
    </div>
  );
}
