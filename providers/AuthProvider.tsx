"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getIdToken, onAuthStateChanged } from "firebase/auth";

import { auth } from "@/shared/lib/firebase/client";
import { setHistory } from "@/store/slices/history-slice";

export function AuthProvider() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        const token = user ? await getIdToken(user, false) : null;
        const resp = await fetch("/api/history", {
          credentials: "include",
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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
  }, [dispatch]);

  return null;
}
