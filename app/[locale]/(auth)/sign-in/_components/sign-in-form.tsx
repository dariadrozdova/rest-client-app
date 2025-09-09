"use client";

import { FormEvent, useState } from "react";

import { logEvent } from "firebase/analytics";

import { getFreshIdToken, serverLogin, signInEmail } from "@shared/auth/auth";
import { toErrorMessage } from "@shared/lib/errors/errors";
import { useAuthRedirect } from "@shared/redirect/useAuthRedirect";

import { analytics } from "@/shared/lib/firebase/firebase";

export default function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const { done, locale } = useAuthRedirect();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const cred = await signInEmail(email, password);
      const idToken = await getFreshIdToken(cred);
      await serverLogin(locale, idToken);

      if (analytics) {
        logEvent(analytics, "login", { method: "password" });
      }
      done();
    } catch (error_: unknown) {
      const message = toErrorMessage(error_);
      if (analytics) {
        logEvent(analytics, "login_error", { message, method: "password" });
      }
      setError(message || "Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <input
        autoComplete="email"
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        type="email"
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
      <button
        className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Logging in…" : "Log in"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
