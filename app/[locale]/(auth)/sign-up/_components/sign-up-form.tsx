"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { isStrongPassword } from "@shared/lib/validation/validate-password";
import { logEvent } from "firebase/analytics";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useTranslations } from "use-intl";

import { analytics, auth } from "@/shared/lib/firebase/firebase";

export default function EmailSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const t = useTranslations("errors.auth");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      throw new Error(t("passwordsMustMatch"));
    }
    if (!isStrongPassword(password)) {
      throw new Error(t("weakPassword"));
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
      throw new Error(
        error instanceof Error
          ? t("signUp", { message: error.message })
          : t("signUpUnknown"),
      );
    }
  }

  return (
    <form className="space-y-2" noValidate onSubmit={onSubmit}>
      <input
        autoComplete="email"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
        type="email"
        value={email}
      />
      <input
        autoComplete="new-password"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
        type="password"
        value={password}
      />
      <input
        autoComplete="new-password"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setConfirm(event.target.value)}
        placeholder="Confirm password"
        required
        type="password"
        value={confirm}
      />
      <button className="w-full rounded bg-green-600 py-2 text-white">
        Sign up
      </button>
    </form>
  );
}
