"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedMethod } from "@store/slices/method-slice";
import { RootState } from "@store/store";

import { HTTP_METHODS } from "@/shared/globals";
import { classNames } from "@/shared/styles";
import type { Selected } from "@/shared/types";

export function MethodSwitch() {
  const dispatch = useDispatch();
  const selected = useSelector(
    (state: RootState) => state.method.selectedMethod,
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (m: Selected) => {
    dispatch(setSelectedMethod(m));
    setIsOpen(false);
  };

  return (
    <div className="relative h-full text-base" data-current-method={selected}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select HTTP method"
        className={classNames(
          "bg-bg-secondary text-text-secondary border-border-default h-full w-28 border",
          "flex items-center justify-between rounded-l-md px-2 py-1 font-medium transition-colors duration-300",
          "cursor-pointer",
        )}
        onClick={() => setIsOpen((s) => !s)}
        type="button"
      >
        <span className="sm:inline">{selected}</span>
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
          className="bg-bg-secondary absolute z-10 mt-1 w-40 shadow-lg"
          role="listbox"
        >
          {HTTP_METHODS.map((methodOption) => {
            const isActive = selected === methodOption;
            return (
              <button
                aria-selected={isActive}
                className={classNames(
                  "w-full cursor-pointer px-4 py-2 text-left transition-colors duration-200",
                  isActive
                    ? "bg-accent-blue font-semibold text-white"
                    : "text-text-secondary hover:bg-border-default",
                )}
                key={methodOption}
                onClick={() => handleSelect(methodOption)}
                role="option"
              >
                {methodOption}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
