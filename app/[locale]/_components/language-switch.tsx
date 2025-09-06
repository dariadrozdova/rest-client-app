"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

import { LANGUAGES } from "@/shared/globals";
import { usePathname, useRouter } from "@/shared/lib/i18n/navigation";
import { classNames } from "@/shared/styles";
import type { Language } from "@/shared/types";

export function LanguageSwitch() {
  const [isListOpen, setIsListOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  const handleLanguageChange = (language: Language) => {
    setIsListOpen(false);
    router.push(pathname, { locale: language.code });
  };

  return (
    <div className="relative">
      <button
        aria-label="Select language"
        className={classNames(
          "text-text-primary hover:bg-border-default bg-bg-primary",
          "items-center rounded-lg px-3 py-2 font-medium transition-colors duration-300",
        )}
        onClick={() => setIsListOpen(!isListOpen)}
      >
        <span className="sm:inline">{currentLanguage.name}</span>
        <svg
          className={classNames(
            "inline-block h-4 w-6",
            "origin-center [transform-box:fill-box]",
            "transition-transform duration-300",
            isListOpen && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M19 9l-7 4-7-4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>
      {isListOpen && (
        <div className="bg-bg-secondary absolute z-10 mt-1 w-40 shadow-lg">
          {LANGUAGES.map((language) => (
            <button
              className={classNames(
                "w-full cursor-pointer px-4 py-2 text-left",
                "transition-colors duration-200",
                currentLocale === language.code
                  ? "bg-accent-blue font-semibold text-white"
                  : "text-text-secondary hover:bg-border-default",
              )}
              key={language.code}
              onClick={() => handleLanguageChange(language)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
