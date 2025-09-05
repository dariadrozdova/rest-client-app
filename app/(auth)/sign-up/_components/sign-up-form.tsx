"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { logEvent } from "firebase/analytics";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { analytics, auth } from "@/shared/lib/firebase/firebase";

export default function EmailSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      return alert("Passwords must match");
    }
    if (
      !/^(?=.*[A-Za-z\u00C0-\u024F\u0400-\u04FF])(?=.*\d)(?=.*[^\w\s]).{8,}$/u.test(
        password,
      )
    ) {
      return alert("Min 8, one letter, one digit, one special char");
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (analytics) {
        logEvent(analytics, "sign_up", { method: "password" });
      }
      router.replace("/");
    } catch (error: unknown) {
      if (analytics) {
        logEvent(analytics, "sign_up_error", {
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
        autoComplete="new-password"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        type="password"
        value={password}
      />
      <input
        autoComplete="new-password"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setConfirm(event.target.value)}
        placeholder="Confirm password"
        type="password"
        value={confirm}
      />
      <button className="w-full rounded bg-green-600 py-2 text-white">
        Sign up
      </button>
    </form>
  );
}
