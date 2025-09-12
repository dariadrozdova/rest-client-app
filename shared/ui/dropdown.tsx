"use client";

import { useRef, useState } from "react";

import { DropdownProps } from "@shared/types";

import { classNames } from "@/shared/styles";
import { useOutsideClick } from "@/utils/hooks/use-outside-click";

export function Dropdown<T>({
  options,
  selectedValue,
  onSelect,
  buttonClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  activeOptionClassName = "",
  width = "w-40",
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownReference = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownReference, () => setIsOpen(false), isOpen);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const displayLabel = selectedOption?.label ?? "";

  return (
    <div className="relative" ref={dropdownReference}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={classNames(
          "flex cursor-pointer items-center justify-between transition-colors duration-300",
          buttonClassName,
        )}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{displayLabel}</span>
        <svg
          aria-hidden="true"
          className={classNames(
            "inline-block h-4 w-6",
            "origin-center [transform-box:fill-box]",
            "transition-transform duration-300",
            isOpen && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M19 9l-7 4-7-4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={classNames(
            "absolute z-10 mt-1 shadow-lg",
            width,
            dropdownClassName,
          )}
          role="listbox"
        >
          {options.map((option) => {
            const isActive = option.isActive ?? selectedValue === option.value;
            return (
              <button
                aria-selected={isActive}
                className={classNames(
                  "w-full cursor-pointer px-4 py-2 text-left transition-colors duration-200",
                  isActive
                    ? classNames(
                        "bg-accent-blue font-semibold text-white",
                        activeOptionClassName,
                      )
                    : classNames(
                        "text-text-secondary hover:bg-border-default",
                        optionClassName,
                      ),
                )}
                key={String(option.value)}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                role="option"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
