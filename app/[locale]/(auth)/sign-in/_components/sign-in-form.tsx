"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { logEvent } from "firebase/analytics";

import { AuthError } from "@app/[locale]/(auth)/sign-in/_components/auth-error";
import { Button } from "@app/[locale]/(auth)/sign-in/_components/form-button";
import { InputField } from "@app/[locale]/(auth)/sign-in/_components/input-field";
import { logoSmall } from "@app/[locale]/(public)/images";
import { getFreshIdToken, serverLogin, signInEmail } from "@shared/auth/auth";
import { toErrorMessage } from "@shared/lib/errors/errors";
import { Link } from "@shared/lib/i18n/navigation";
import { useAuthRedirect } from "@shared/redirect/useAuthRedirect";

import { analytics } from "@/shared/lib/firebase/firebase";

export default function EmailSignInForm() {
  const t = useTranslations("sign-in");

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
    } catch (error: unknown) {
      const message = toErrorMessage(error);
      if (analytics) {
        logEvent(analytics, "login_error", { message, method: "password" });
      }
      setError(message || t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm bg-white p-6">
      <div className="mb-3">
        <Image
          alt={t("logoAlt")}
          className="mx-auto h-10 w-auto"
          src={logoSmall}
        />
      </div>

      <h2 className="text-center text-lg font-semibold">{t("title")}</h2>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <InputField
          autoComplete="email"
          onChange={setEmail}
          placeholder={t("emailPlaceholder")}
          type="email"
          value={email}
        />
        <InputField
          autoComplete="current-password"
          onChange={setPassword}
          placeholder={t("passwordPlaceholder")}
          type="password"
          value={password}
        />
        <Button disabled={loading}>
          {loading ? t("buttonLoading") : t("buttonSubmit")}
        </Button>
        <div className="h-6">{error && <AuthError message={error} />}</div>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        {t("noAccountQuestion")}{" "}
        <Link className="font-bold text-gray-600" href="/sign-up">
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
