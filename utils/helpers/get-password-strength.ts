import { PasswordStrengthLevel } from "@/shared/types";

const STRONG_THRESHOLD = 4;

export function getStrength(
  score: number,
  lengthOk: boolean,
): PasswordStrengthLevel {
  if (!lengthOk || score <= 1) {
    return "weak";
  }
  if (score < STRONG_THRESHOLD) {
    return "medium";
  }
  return "strong";
}
