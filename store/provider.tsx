"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";

import { AuthProvider } from "@/providers/auth-provider";
import { store } from "@/store/store";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider />
      {children}
    </Provider>
  );
}
