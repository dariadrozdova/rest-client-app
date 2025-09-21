"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

import { auth } from "@/shared/lib/firebase/firebase";

export async function getFreshIdToken(cred: UserCredential) {
  return cred.user.getIdToken(true);
}

export async function serverLogin(locale: string, idToken: string) {
  const resp = await fetch(`/${locale}/api/auth/login`, {
    body: JSON.stringify({ idToken }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!resp.ok) {
    throw new Error("Login failed");
  }
}

export async function signInEmail(
  email: string,
  password: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpEmail(
  email: string,
  password: string,
): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}
