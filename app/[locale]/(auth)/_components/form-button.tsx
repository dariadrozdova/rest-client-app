import { classNames } from "@shared/styles";
import { ButtonProps } from "@shared/types/types";

export function Button({ children, disabled }: ButtonProps) {
  return (
    <button
      className={classNames(
        "w-full rounded-md py-2 text-sm font-medium text-white shadow-sm transition-colors",
        disabled
          ? "cursor-not-allowed bg-gray-400 opacity-60"
          : "cursor-pointer bg-blue-600 hover:bg-blue-700",
      )}
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}
