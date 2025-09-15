"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "use-intl";

import { isCompatibleType } from "@/utils/helpers/is-compatible-type";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const t = useTranslations("errors.localStorage");

  const getInitialValue = (): T => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          const parsed = JSON.parse(raw);

          if (isCompatibleType(parsed, defaultValue)) {
            return parsed;
          }

          return defaultValue;
        }
      } catch (error) {
        throw new Error(t("read", { error: String(error), key }));
      }
    }
    return defaultValue;
  };

  const [value, setValue] = useState<T>(getInitialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      throw new Error(t("write", { error: String(error), key }));
    }
  }, [key, value, isInitialized, t]);

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
