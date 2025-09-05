"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "use-intl";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(defaultValue);
  const t = useTranslations("errors.localStorage");
  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw));
      }
    } catch (error) {
      throw new Error(t("read", { error: String(error), key }));
    }
  }, [key, t]);

  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(t("write", { error: String(error), key }));
    }
  }, [key, value, t]);

  const reset = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      throw new Error(t("remove", { error: String(error), key }));
    }
    setValue(defaultValue);
  };
  return [value, setValue, reset] as const;
}
