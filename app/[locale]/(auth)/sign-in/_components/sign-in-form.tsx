"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { logEvent } from "firebase/analytics";

import { Button } from "@app/[locale]/(auth)/_components/form-button";
import { InputField } from "@app/[locale]/(auth)/_components/input-field";
import { logoSmall } from "@app/[locale]/(public)/images";
import { getFreshIdToken, serverLogin, signInEmail } from "@shared/auth/auth";
import { toErrorMessage } from "@shared/lib/errors/errors";
import { Link } from "@shared/lib/i18n/navigation";
import { isValidEmail } from "@shared/lib/validation/validate-email";
import { useAuthRedirect } from "@utils/hooks";

import { analytics } from "@/shared/lib/firebase/firebase";

export default function EmailSignInForm() {
  const t = useTranslations("sign-in");
  const _error = useTranslations("errors.auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<null | string>(null);
  const [serverError, setServerError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { done, locale } = useAuthRedirect();

  function handleEmailChange(value: string) {
    setEmail(value);
    setEmailError(
      value && !isValidEmail(value) ? _error("invalidEmail") : null,
    );
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
  }

  const isFormValid = isValidEmail(email) && password.length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    if (!isFormValid) {
      return;
    }

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
      setServerError(_error("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg-primary mx-auto w-full max-w-sm p-6">
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
          error={emailError}
          label={t("emailLabel")}
          onChange={handleEmailChange}
          placeholder={t("emailPlaceholder")}
          required
          type="email"
          value={email}
        />

        <InputField
          autoComplete="current-password"
          isVisible={showPassword}
          label={t("passwordLabel")}
          onChange={handlePasswordChange}
          onToggleVisibility={() => setShowPassword((previous) => !previous)}
          placeholder={t("passwordPlaceholder")}
          required
          showToggle
          type="password"
          value={password}
        />

        <Button disabled={!isFormValid || loading}>
          {loading ? t("buttonLoading") : t("buttonSubmit")}
        </Button>

        <div className="h-5 text-sm font-normal text-red-600">
          {serverError || " "}
        </div>
      </form>

      <p className="text-text-secondary mt-4 text-center text-xs">
        {t("noAccountQuestion")}{" "}
        <Link className="text-text-secondary font-bold" href="/sign-up">
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
