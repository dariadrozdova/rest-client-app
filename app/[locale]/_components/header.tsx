import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { logoFull } from "@app/[locale]/(public)/images";

import { LanguageSwitch } from "@/app/[locale]/_components/language-switch";
import { classNames } from "@/shared/styles";

export default async function Header() {
  const t = await getTranslations("header");
  return (
    <section className="">
      <div className="bg-bg-primary flex flex-row items-center justify-between px-6 py-2">
        <Image alt="logo" height={60} priority src={logoFull} width={150} />
        <div className="justify-space-between flex flex-row">
          <LanguageSwitch />
          <button
            className={classNames(
              "bg-bg-secondary hover:bg-border-default rounded-lg px-3 py-2",
              "font-medium transition-colors duration-300",
            )}
          >
            {t("logoff")}
          </button>
        </div>
      </div>
      <hr className="border-border-default border-t" />
    </section>
  );
}
