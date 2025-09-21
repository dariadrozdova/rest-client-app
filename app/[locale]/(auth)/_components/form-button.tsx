import { classNames } from "@shared/styles";
import { ButtonProps } from "@shared/types/types";

export function Button({ children, disabled }: ButtonProps) {
  return (
    <button
      className={classNames(
        "text-bg-primary bg-accent-blue w-full rounded-md py-2 text-sm font-medium shadow-sm transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:brightness-110",
      )}
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}
