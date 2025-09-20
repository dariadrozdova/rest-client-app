"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { VariableItem } from "@shared/types";
import { KeyValueEditor } from "@shared/ui/key-value-editor";
import { useLocalStorage } from "@utils/hooks";

import {
  ensureTrailingEmpty,
  removeRow,
  selectVariables,
  setVariables,
  toggleEnabled,
  updateKey,
  updateValue,
} from "@/store/slices/variables-slice";

export function VariablesEditor() {
  const dispatch = useDispatch();
  const variables = useSelector(selectVariables);
  const t = useTranslations("variables-editor");
  const hasLoadedFromStorage = useRef(false);

  const [storedVariables, setStoredVariables] = useLocalStorage<VariableItem[]>(
    "variables",
    [],
  );

  useEffect(() => {
    if (!hasLoadedFromStorage.current && storedVariables.length > 0) {
      dispatch(setVariables(storedVariables));
      hasLoadedFromStorage.current = true;
    }
    dispatch(ensureTrailingEmpty());
  }, [storedVariables, dispatch]);

  useEffect(() => {
    if (hasLoadedFromStorage.current || variables.length > 1) {
      const validVariables = variables.filter(
        (variable) =>
          variable.enabled && variable.key.trim() && variable.value.trim(),
      );
      setStoredVariables(validVariables);

      if (!hasLoadedFromStorage.current) {
        hasLoadedFromStorage.current = true;
      }
    }
  }, [variables, setStoredVariables]);

  return (
    <KeyValueEditor
      items={variables}
      keyPlaceholder={t("placeholderName")}
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
