"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { classNames } from "@shared/styles";

const MIN_PASSWORD_LENGTH = 8;
const TOTAL_CHECKS = 4;
const MAX_PERCENT = 100;
const MEDIUM_MIN = 2;
const STRONG_MIN = 4;

interface Props {
  password: string;
}

export default function PasswordStrength({ password }: Props) {
  const t = useTranslations("password-strength");

  const checks = useMemo(() => {
    const lengthOk = password.length >= MIN_PASSWORD_LENGTH;
    const hasLetter = /\p{L}/u.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[\p{P}\p{S}]/u.test(password);
    return { lengthOk, hasLetter, hasDigit, hasSpecial };
  }, [password]);

  const score = Object.values(checks).filter(Boolean).length;
  const strength =
    score >= STRONG_MIN ? "strong" : score >= MEDIUM_MIN ? "medium" : "weak";

  const percent = Math.max(
    0,
    Math.min(MAX_PERCENT, Math.round((score / TOTAL_CHECKS) * MAX_PERCENT)),
  );

  const barColor =
    strength === "strong"
      ? "bg-green-500"
      : strength === "medium"
        ? "bg-yellow-400"
        : "bg-red-500";

  const textColor =
    strength === "strong"
      ? "text-green-600"
      : strength === "medium"
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="mt-2">
      <div className="relative mb-4">
        <div className="bg-border-default h-1 w-full rounded-full">
          <div
            className={classNames("h-1 rounded-full transition-all", barColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
        {password && (
          <span
            className={classNames(
              "absolute right-0 -bottom-6 text-sm",
              textColor,
            )}
          >
            {t(`status.${strength}`)}
          </span>
        )}
      </div>

      <ul className="space-y-1 text-sm">
        <li className={checks.lengthOk ? "text-green-600" : "text-gray-400"}>
          {t("requirements.minLength")}
        </li>
        <li className={checks.hasLetter ? "text-green-600" : "text-gray-400"}>
          {t("requirements.letter")}
        </li>
        <li className={checks.hasDigit ? "text-green-600" : "text-gray-400"}>
          {t("requirements.digit")}
        </li>
        <li className={checks.hasSpecial ? "text-green-600" : "text-gray-400"}>
          {t("requirements.special")}
        </li>
      </ul>
    </div>
  );
}
