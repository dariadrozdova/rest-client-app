"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(defaultValue);
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
      throw new Error(
        `Failed to read from localStorage for key: ${key}. Error: ${error}`,
      );
    }
  }, [key]);

  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(
        `Failed to write to localStorage for key: ${key}. Error: ${error}`,
      );
    }
  }, [key, value]);

  const reset = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      throw new Error(
        `Failed to remove from localStorage for key: ${key}. Error: ${error}`,
      );
    }
    setValue(defaultValue);
  };
  return [value, setValue, reset] as const;
}
