import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { FOOTER_SECTIONS } from "@/shared/globals";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer
      className="border-border-default bg-bg-primary text-text-secondary border-t"
      role="contentinfo"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {FOOTER_SECTIONS.map((section) => (
          <nav aria-labelledby={`footer-${section.id}`} key={section.id}>
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

      <div className="border-border-default mx-auto flex max-w-7xl flex-col gap-3 border-t px-4 pt-6 pb-10 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="bg-accent-blue inline-block h-3.5 w-3.5 rounded-full"
          />
          <span className="font-medium">PingPong</span>
        </div>
        <p>
          {t("legal.copyright", {
            company: "LoneStarDev",
            year: new Date().getFullYear(),
          })}
        </p>
        <p>
          {t("legal.build", {
            version: process.env.NEXT_PUBLIC_BUILD ?? "1.0.0",
          })}
        </p>
      </div>
    </footer>
  );
}
