"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { logEvent } from "firebase/analytics";

import { getFreshIdToken, serverLogin, signUpEmail } from "@shared/auth/auth";
import { toErrorMessage } from "@shared/lib/errors/errors";
import { isStrongPassword } from "@shared/lib/validation/validate-password";
import { useAuthRedirect } from "@shared/redirect/useAuthRedirect";

import { analytics } from "@/shared/lib/firebase/firebase";

export default function EmailSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const t = useTranslations("errors.auth");
  const { done, locale } = useAuthRedirect();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      return setError(t("passwordsMustMatch"));
    }
    if (!isStrongPassword(password)) {
      return setError(t("weakPassword"));
    }

    try {
      setLoading(true);
      const cred = await signUpEmail(email, password);
      const idToken = await getFreshIdToken(cred);
      await serverLogin(locale, idToken);

      if (analytics) {
        logEvent(analytics, "sign_up", { method: "password" });
      }
      done(`/${locale}`);
    } catch (error_: unknown) {
      const message = toErrorMessage(error_) || t("signUpUnknown");
      if (analytics) {
        logEvent(analytics, "sign_up_error", { message, method: "password" });
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !loading && email && password && confirm;

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
      <button
        className="w-full rounded bg-green-600 py-2 text-white disabled:opacity-60"
        disabled={!canSubmit}
      >
        {loading ? "Creating…" : "Sign up"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
