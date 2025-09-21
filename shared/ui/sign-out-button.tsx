"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { signOut } from "@firebase/auth";

import { auth } from "@shared/lib/firebase/firebase";

import { classNames } from "@/shared/styles";

interface Props {
  className?: string;
  label?: string;
}

export function SignOutButton({ className, label = "Log out" }: Props) {
  const router = useRouter();
  const locale = useLocale();

  async function handleClick() {
    await signOut(auth);
    await fetch(`/${locale}/api/auth/logout`, { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <button
      className={classNames(
        "bg-bg-secondary hover:bg-border-default cursor-pointer rounded-lg px-3 py-2 font-medium transition-colors duration-300",
        className,
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
