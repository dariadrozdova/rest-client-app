"use client";

import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { LANG_GEN } from "@/shared/globals";
import { classNames } from "@/shared/styles";
import type { CodeLangGen } from "@/shared/types";
import { Dropdown } from "@/shared/ui/dropdown";
import { setSelectedCodeLang } from "@/store/slices/code-lang-slice";
import { RootState } from "@/store/store";

export function CodeLangSwitch() {
  const t = useTranslations("dropdown");
  const dispatch = useDispatch();
  const selected = useSelector(
    (state: RootState) => state.codeLang.selectedCodeLang,
  );

  const handleSelect = (codeLang: CodeLangGen) => {
    dispatch(setSelectedCodeLang(codeLang));
  };

  return (
    <Dropdown<CodeLangGen>
      activeOptionClassName={classNames(
        "bg-accent-blue font-semibold text-white",
      )}
      ariaLabel={t("method")}
      buttonClassName={classNames(
        "bg-bg-secondary text-text-secondary border-border-default h-full w-46 border",
        "flex items-center justify-between rounded-l-md px-2 py-1 font-medium",
        "transition-colors duration-300 cursor-pointer",
      )}
      dropdownClassName={classNames("bg-bg-secondary")}
      onSelect={handleSelect}
      optionClassName={classNames("px-4 py-2")}
      options={LANG_GEN.map((lang) => ({
        key: lang.key,
        value: lang,
        label: lang.label,
      }))}
      selectedValue={selected}
      width="w-44"
    />
  );
}
