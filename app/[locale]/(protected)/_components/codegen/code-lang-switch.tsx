"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedCodeLang } from "@store/slices/code-lang-slice";
import { RootState } from "@store/store";

import { LANG_GEN } from "@/shared/globals";
import { classNames } from "@/shared/styles";
import type { CodeLangGen } from "@/shared/types";

export function CodeLangSwitch() {
  const dispatch = useDispatch();
  const selected = useSelector(
    (state: RootState) => state.codeLang.selectedCodeLang,
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (codeLang: CodeLangGen) => {
    dispatch(setSelectedCodeLang(codeLang));
    setIsOpen(false);
  };

  return (
    <div className="relative h-full text-base" data-code-lang={selected.key}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select code language"
        className={classNames(
          "bg-bg-secondary text-text-secondary border-border-default h-full w-46 border",
          "flex items-center justify-between rounded-l-md px-2 py-1 font-medium transition-colors duration-300",
          "cursor-pointer",
        )}
        onClick={() => setIsOpen((s) => !s)}
        type="button"
      >
        <span className="sm:inline">{selected.label}</span>
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
          className="bg-bg-secondary absolute z-10 mt-1 w-44 shadow-lg"
          role="listbox"
        >
          {LANG_GEN.map((codeLangOption) => {
            const isActive = selected.key === codeLangOption.key;
            return (
              <button
                aria-selected={isActive}
                className={classNames(
                  "w-full cursor-pointer px-4 py-2 text-left transition-colors duration-200",
                  isActive
                    ? "bg-accent-blue font-semibold text-white"
                    : "text-text-secondary hover:bg-border-default",
                )}
                key={codeLangOption.key}
                onClick={() => handleSelect(codeLangOption)}
                role="option"
              >
                {codeLangOption.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
