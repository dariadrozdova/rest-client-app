"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { errorImage } from "@app/[locale]/(public)/images";
import { ErrorTemplateProps } from "@shared/types";

export function ErrorTemplate({
  code,
  title,
  description,
  extra,
}: ErrorTemplateProps) {
  const locale = useLocale();
  const t = useTranslations("error-page");

  return (
    <div className="bg-bg-primary flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <div className="text-text-primary text-6xl leading-none font-bold sm:text-7xl">
            {code}
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-text-secondary mt-4 max-w-md text-base leading-relaxed">
              {description}
            </p>
          ) : null}
          <div className="mt-8 flex items-center gap-4">
            <Link
              className="bg-accent-blue text-bg-primary focus:ring-accent-blue rounded-md px-5 py-2.5 text-sm font-medium transition hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              href={`/${locale}`}
            >
              {t("go-to-homepage")}
            </Link>
            {extra}
          </div>
        </div>

        <div className="relative mx-auto h-48 w-48 md:h-64 md:w-64">
          <Image
            alt="Error illustration"
            className="object-contain"
            fill
            priority
            sizes="(max-width: 768px) 192px, 256px"
            src={errorImage}
          />
          <div className="absolute bottom-0 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-gray-200/70 blur-md md:h-5 md:w-40" />
        </div>
      </div>
    </div>
  );
}
