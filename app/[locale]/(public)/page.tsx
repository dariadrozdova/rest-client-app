import { getTranslations } from "next-intl/server";

import { LogosShowcase } from "@app/[locale]/(public)/components";
import { ThreeDScene } from "@app/[locale]/(public)/components";
import { classNames } from "@shared/styles";

import { LAYERS } from "@/shared/globals";

export default async function PublicLayout() {
  const t = await getTranslations("main-page");
  return (
    <>
      <section
        className="relative min-h-[900px] overflow-hidden"
        id="how-it-works"
      >
        <div className="relative z-10 mx-auto px-8 pt-20">
          <h1 className="w-4/5 text-7xl font-bold">{t("slogan")}</h1>
          <h3 className="text-text-secondary mt-4 w-1/2 text-2xl font-medium">
            {t("headline")}
          </h3>
        </div>
        <div
          className={classNames(
            "pointer-events-none absolute inset-0 z-0 mt-28 [height:100%]",
            "[mask-image:linear-gradient(0deg,transparent_0%,transparent_20%,white_40%,white_70%,transparent_100%)]",
            "[--h:900] [--k:calc(min(100vw/(var(--w)*1px),100dvh/(var(--h)*1px)))] [--w:1440]",
            "[perspective-origin:50%_40%] [perspective:calc(var(--k)*1000px)]",
          )}
        >
          <div
            className={classNames(
              "absolute top-1/2 left-1/2 [height:calc(var(--h)*1px)] transform-gpu",
              "[width:calc(var(--w)*1px)] -translate-x-1/2 -translate-y-1/2 scale-[var(--k)]",
            )}
          >
            <ThreeDScene height={700} layers={LAYERS} />
          </div>
        </div>
      </section>
      <LogosShowcase />
    </>
  );
}
