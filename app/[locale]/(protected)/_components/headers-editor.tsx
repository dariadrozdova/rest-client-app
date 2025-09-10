"use client";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { KeyValueEditor } from "@shared/ui/key-value-editor";

import {
  ensureTrailingEmpty,
  removeRow,
  selectHeaders,
  toggleEnabled,
  updateKey,
  updateValue,
} from "@/store/slices/header-slice";

export function HeadersEditor() {
  const headers = useSelector(selectHeaders);
  const t = useTranslations("header-tab");

  return (
    <KeyValueEditor
      items={headers}
      keyPlaceholder={t("placeholderHeader")}
      onEnsureTrailingEmpty={ensureTrailingEmpty}
      onRemoveRow={removeRow}
      onToggleEnabled={toggleEnabled}
      onUpdateKey={updateKey}
      onUpdateValue={updateValue}
      title={t("title")}
      valuePlaceholder={t("placeholderValue")}
    />
  );
}
