import classNames from "classnames";

import { ButtonProps } from "@shared/types/types";

export function Button({ children, disabled }: ButtonProps) {
  return (
    <button
      className={classNames(
        "w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white",
        "shadow-sm transition-colors hover:bg-blue-700",
        disabled && "cursor-not-allowed opacity-60",
      )}
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}
