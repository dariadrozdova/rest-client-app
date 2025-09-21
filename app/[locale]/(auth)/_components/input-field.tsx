"use client";

import { Eye, EyeOff } from "lucide-react";

import { classNames } from "@shared/styles";

interface InputFieldProps {
  autoComplete?: string;
  error?: null | string;
  isVisible?: boolean;
  label: string;
  onChange: (value: string) => void;
  onToggleVisibility?: () => void;
  placeholder?: string;
  required?: boolean;
  showToggle?: boolean;
  type: string;
  value: string;
}

export function InputField({
  autoComplete,
  onChange,
  label,
  placeholder,
  type,
  value,
  required,
  error,
  showToggle,
  isVisible,
  onToggleVisibility,
}: InputFieldProps) {
  const inputType = showToggle && isVisible ? "text" : type;

  return (
    <div className="flex flex-col">
      <label className="text-text-primary mb-1 text-sm font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <input
          autoComplete={autoComplete}
          className={classNames(
            "w-full rounded-md border px-3 py-2 text-sm",
            "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none",
            "bg-bg-secondary",
            error ? "border-red-500" : "",
          )}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={inputType}
          value={value}
        />
        {showToggle && (
          <button
            aria-label="Toggle password visibility"
            className="text-text-secondary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            onClick={onToggleVisibility}
            type="button"
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error !== undefined && (
        <div className="h-5 text-sm font-normal text-red-600">
          {error || " "}
        </div>
      )}
    </div>
  );
}
