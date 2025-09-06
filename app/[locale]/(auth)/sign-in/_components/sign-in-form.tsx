"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { logEvent } from "firebase/analytics";
import { signInWithEmailAndPassword } from "firebase/auth";

import { analytics, auth } from "@/shared/lib/firebase/firebase";

export default function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (analytics) {
        logEvent(analytics, "login", { method: "password" });
      }
      router.replace("/");
    } catch (error: unknown) {
      if (analytics) {
        logEvent(analytics, "login_error", {
          message: error instanceof Error ? error.message : "Unknown error",
          method: "password",
        });
      }
      console.warn(error);
    }
  }

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <input
        autoComplete="email"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        value={email}
      />
      <input
        autoComplete="current-password"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        type="password"
        value={password}
      />
      <button className="w-full rounded bg-blue-600 py-2 text-white">
        Log in
      </button>
    </form>
  );
}
