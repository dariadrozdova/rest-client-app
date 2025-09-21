import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { logoSmall } from "@app/[locale]/(public)/images";

import { FOOTER_SECTIONS } from "@/shared/globals";
import { classNames } from "@/shared/styles";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer
      className="border-border-default bg-bg-primary text-text-secondary border-t"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-2">
        <div className="flex flex-wrap items-start gap-x-24 gap-y-8">
          <div className="shrink-0 basis-full sm:basis-auto">
            <Image alt="logo small" height={40} src={logoSmall} width={40} />
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <nav
              aria-labelledby={`footer-${section.id}`}
              className="shrink-0"
              key={section.id}
            >
              <h2
                className="text-xs font-semibold tracking-wide uppercase"
                id={`footer-${section.id}`}
              >
                {t(section.titleKey)}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    {link.external ? (
                      <a
                        className="underline-offset-2 hover:underline"
                        href={link.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t(link.labelKey)}
                      </a>
                    ) : (
                      <Link
                        className="underline-offset-2 hover:underline"
                        href={link.href}
                      >
                        {t(link.labelKey)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div
        className={classNames(
          "border-border-default mx-auto max-w-7xl border-t px-4 pt-6",
          "pb-10 text-xs sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8",
        )}
      >
        <p>
          {t("legal.copyright", {
            company: "LoneStarDev",
            year: new Date().getFullYear(),
          })}
        </p>
        <p className="mt-3 sm:mt-0">
          {t("legal.build", {
            version: process.env.NEXT_PUBLIC_BUILD ?? "1.0.0",
          })}
        </p>
      </div>
    </footer>
  );
}
