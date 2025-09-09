"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocale } from "next-intl";

import { HTTP_METHODS } from "@/shared/globals";
import type { HttpMethod } from "@/shared/types";

interface RequestState {
  body: string;
  error: null | string;
  isLoading: boolean;
  method: HttpMethod;
  responseText: string;
  sendRequest: () => Promise<void>;
  setBody: (b: string) => void;
  setMethod: (m: HttpMethod) => void;
  setUrl: (u: string) => void;
  url: string;
}

const RequestContext = createContext<null | RequestState>(null);

export function RequestProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [method, setMethod] = useState<HttpMethod>(HTTP_METHODS[0]);
  const [url, setUrl] = useState<string>(
    "https://rickandmortyapi.com/api/character",
  );
  const [body, setBody] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const sendRequest = useCallback(async () => {
    setError(null);
    setResponseText("");

    const data = {
      body,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      url,
    };

    try {
      setIsLoading(true);
      const response = await fetch(`/${locale}/api/main`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const text = JSON.stringify(await response.json(), null, 2);
      setResponseText(`${response.status} ${response.statusText}\n\n${text}`);
      if (!response.ok) {
        setError(`HTTP ${response.status}: ${response.statusText}`);
        return;
      }
    } catch (error_: unknown) {
      const message = error_ instanceof Error ? error_.message : String(error_);
      setError(message || "Request error");
    } finally {
      setIsLoading(false);
    }
  }, [body, locale, url]);

  const value = useMemo<RequestState>(
    () => ({
      method,
      url,
      body,
      responseText,
      isLoading,
      error,
      setMethod,
      setUrl,
      setBody,
      sendRequest,
    }),
    [method, url, body, responseText, isLoading, error, sendRequest],
  );

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
}

export function useRequest() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
}
