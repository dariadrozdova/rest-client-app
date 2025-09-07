"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  label?: string;
}

export default function SignOutButton({ className, label = "Log out" }: Props) {
  const router = useRouter();
  const locale = useLocale();

  async function handleClick() {
    await fetch(`/${locale}/api/auth/logout`, { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <button
      className={twMerge(
        "bg-bg-secondary hover:bg-border-default rounded-lg px-3 py-2 font-medium transition-colors duration-300",
        className,
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
