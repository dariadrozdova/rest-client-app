"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocale } from "next-intl";

import { getIdToken, onAuthStateChanged } from "firebase/auth";

import { serverLogin } from "@/shared/auth/auth";
import { auth } from "@/shared/lib/firebase/client";
import { setHistory } from "@/store/slices/history-slice";

export function AuthProvider() {
  const dispatch = useDispatch();
  const locale = useLocale();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          dispatch(setHistory([]));
          return;
        }
        const token = user ? await getIdToken(user, false) : null;
        if (!token) {
          dispatch(setHistory([]));
          return;
        }

        await serverLogin(locale, token);

        const controller = new AbortController();

        const resp = await fetch("/api/history", {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!resp.ok) {
          dispatch(setHistory([]));
          return;
        }
        const { items } = await resp.json();
        dispatch(setHistory(items));
      } catch {
        dispatch(setHistory([]));
      }
    });

    return () => unsub();
  }, [dispatch, locale]);

  return null;
}
