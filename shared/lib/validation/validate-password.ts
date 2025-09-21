import { PasswordChecks } from "@/shared/types";
import { getStrength } from "@/utils/helpers/get-password-strength";

const MIN_PASSWORD_LENGTH = 8;

export function assessPassword(password: string): PasswordChecks {
  const lengthOk = password.length >= MIN_PASSWORD_LENGTH;
  const hasLetter = /\p{L}/u.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[\p{P}\p{S}]/u.test(password);
  const score = [lengthOk, hasLetter, hasDigit, hasSpecial].filter(
    Boolean,
  ).length;
  const strength = getStrength(score, lengthOk);
  return { lengthOk, hasLetter, hasDigit, hasSpecial, score, strength };
}

export function isStrongPassword(password: string): boolean {
  const result = assessPassword(password);
  return (
    result.lengthOk && result.hasLetter && result.hasDigit && result.hasSpecial
  );
}
