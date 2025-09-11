"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { logEvent } from "firebase/analytics";

import { AuthError } from "@app/[locale]/(auth)/_components/auth-error";
import { Button } from "@app/[locale]/(auth)/_components/form-button";
import { InputField } from "@app/[locale]/(auth)/_components/input-field";
import { logoSmall } from "@app/[locale]/(public)/images";
import { getFreshIdToken, serverLogin, signUpEmail } from "@shared/auth/auth";
import { toErrorMessage } from "@shared/lib/errors/errors";
import { Link } from "@shared/lib/i18n/navigation";
import { isStrongPassword } from "@shared/lib/validation/validate-password";
import { useAuthRedirect } from "@shared/redirect/useAuthRedirect";

import { analytics } from "@/shared/lib/firebase/firebase";

export default function EmailSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const t = useTranslations("sign-up");
  const translateErrors = useTranslations("errors.auth");
  const { done, locale } = useAuthRedirect();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      return setError(translateErrors("passwordsMustMatch"));
    }
    if (!isStrongPassword(password)) {
      return setError(translateErrors("weakPassword"));
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
      const message =
        toErrorMessage(error_) || translateErrors("signUpUnknown");
      if (analytics) {
        logEvent(analytics, "sign_up_error", { message, method: "password" });
      }
      setError(message);
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

      <form className="mt-4 space-y-3" noValidate onSubmit={onSubmit}>
        <InputField
          autoComplete="email"
          onChange={setEmail}
          placeholder={t("emailPlaceholder")}
          type="email"
          value={email}
        />
        <InputField
          autoComplete="new-password"
          onChange={setPassword}
          placeholder={t("passwordPlaceholder")}
          type="password"
          value={password}
        />
        <InputField
          autoComplete="new-password"
          onChange={setConfirm}
          placeholder={t("confirmPlaceholder")}
          type="password"
          value={confirm}
        />
        <Button disabled={!(email && password && confirm) || loading}>
          {loading ? t("buttonLoading") : t("buttonSubmit")}
        </Button>
        <div className="h-6">{error && <AuthError message={error} />}</div>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        {t("haveAccountQuestion")}{" "}
        <Link className="font-bold text-gray-600" href="/sign-in">
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}
