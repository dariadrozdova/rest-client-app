"use client";

import { ReactNode } from "react";

import { RequestProvider } from "@/app/[locale]/(protected)/main/_modules/request-context";

export function RequestProviderWrapper({ children }: { children: ReactNode }) {
  return <RequestProvider>{children}</RequestProvider>;
}
