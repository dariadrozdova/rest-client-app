import Image from "next/image";

import { LanguageSwitch } from "@app/_components/language-switch";

import logoFull from "@/app/(public)/images/icons/Logo-paddle-text.svg";
import { classNames } from "@/shared/styles";
export function Header() {
  return (
    <section className="">
      <div className="bg-bg-primary flex flex-row items-center justify-between px-6 py-2">
        <Image alt="logo" height={60} src={logoFull} width={150} />
        <div className="justify-space-between flex flex-row">
          <LanguageSwitch />
          <button
            className={classNames(
              "bg-bg-secondary hover:bg-border-default rounded-lg px-3 py-2",
              "font-medium transition-colors duration-300",
            )}
          >
            Log off
          </button>
        </div>
      </div>
      <hr className="border-border-default border-t" />
    </section>
  );
}
