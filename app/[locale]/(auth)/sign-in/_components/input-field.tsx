import classNames from "classnames";

import { InputFieldProps } from "@shared/types/types";
export function InputField({
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: InputFieldProps) {
  return (
    <input
      autoComplete={autoComplete}
      className={classNames(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
        "focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none",
      )}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}
