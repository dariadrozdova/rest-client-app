"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { classNames } from "@shared/styles";

import { ClientLogo } from "@/app/[locale]/(public)/components/client-logo";
import { GROUPS, SHOWCASE_DEFAULTS } from "@/shared/globals/globals-animation";

export function LogosShowcase() {
  const { intervalMs, transitionMs } = SHOWCASE_DEFAULTS;
  const [active, setActive] = useState(0);
  const t = useTranslations("main-page");

  useEffect(() => {
    const id = setInterval(
      () => setActive((index) => (index + 1) % GROUPS.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <section className="relative isolate w-full overflow-hidden p-6 md:p-8">
      <header className="text-center text-2xl md:mb-8">
        <h2 className="text-text-primary font-medium">{t("teamsTitle")} </h2>
        <p className="text-text-secondary">{t("teamsSubtitle")}</p>
      </header>

      <div className="relative h-[220px] md:h-[260px]">
        {GROUPS.map((group, index) => {
          const isActive = index === active;
          return (
            <div
              aria-hidden={!isActive}
              className={classNames(
                "absolute inset-0 grid place-content-center transition-all",
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-[10px] opacity-0",
              )}
              key={group.key}
              style={{ transitionDuration: `${transitionMs}ms` }}
            >
              {group.layout === "2x3" ? (
                <div className="grid grid-cols-3 gap-x-32 gap-y-16">
                  {group.items.map((img, index_) => (
                    <ClientLogo
                      alt={img.alt}
                      className="w-[160px] md:w-[180px]"
                      key={index_}
                      src={img.src}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-32">
                  {group.items.map((img, index_) => (
                    <ClientLogo
                      alt={img.alt}
                      key={index_}
                      src={img.src}
                      vertical
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {GROUPS.map((_, index) => (
          <button
            aria-label={`Показать группу ${index + 1}`}
            className={`h-2 w-8 rounded-full transition-colors ${
              index === active
                ? "bg-[var(--color-border-hover)]"
                : "bg-[var(--color-border-default)]"
            } `}
            key={index}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}
