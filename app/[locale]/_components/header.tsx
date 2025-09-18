import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { logoFull } from "@app/[locale]/(public)/images";
import { Link } from "@shared/lib/i18n/navigation";

import { LanguageSwitch } from "@/app/[locale]/_components/language-switch";
import { getServerSession } from "@/shared/lib/auth/get-session";
import { classNames } from "@/shared/styles";
import { SignOutButton } from "@/shared/ui";

export default async function Header() {
  const t = await getTranslations("header");
  const session = await getServerSession();

  return (
    <section className="">
      <div className="bg-bg-primary flex flex-row items-center justify-between px-6 py-2">
        <Image alt="logo" height={60} priority src={logoFull} />
        <div className="justify-space-between flex flex-row gap-2">
          <LanguageSwitch />

          {session ? (
            <SignOutButton label={t("logoff")} />
          ) : (
            <>
              <Link
                className={classNames(
                  "bg-bg-secondary rounded-lg px-3 py-2 hover:brightness-90",
                  "font-medium transition-colors duration-300",
                )}
                href="/sign-in"
                prefetch
              >
                {t("login")}
              </Link>
              <Link
                className={classNames(
                  "bg-bg-secondary rounded-lg px-3 py-2 hover:brightness-90",
                  "font-medium transition-colors duration-300",
                )}
                href="/sign-up"
                prefetch
              >
                {t("signup")}
              </Link>
            </>
          )}
        </div>
      </div>
      <hr className="border-border-default border-t" />
    </section>
  );
}
