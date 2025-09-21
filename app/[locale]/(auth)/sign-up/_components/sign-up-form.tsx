"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { logEvent } from "firebase/analytics";

import { Button } from "@app/[locale]/(auth)/_components/form-button";
import { InputField } from "@app/[locale]/(auth)/_components/input-field";
import PasswordStrength from "@app/[locale]/(auth)/_components/password-strength";
import { logoSmall } from "@app/[locale]/(public)/images";
import { getFreshIdToken, serverLogin, signUpEmail } from "@shared/auth/auth";
import { toErrorMessage } from "@shared/lib/errors/errors";
import { Link } from "@shared/lib/i18n/navigation";
import { isValidEmail } from "@shared/lib/validation/validate-email";
import { isStrongPassword } from "@shared/lib/validation/validate-password";
import { useAuthRedirect } from "@utils/hooks/use-auth-redirect";

import { analytics } from "@/shared/lib/firebase/firebase";

export default function EmailSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailError, setEmailError] = useState<null | string>(null);
  const [confirmError, setConfirmError] = useState<null | string>(null);
  const [serverError, setServerError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const t = useTranslations("sign-up");
  const _error = useTranslations("errors.auth");
  const { done, locale } = useAuthRedirect();

  const isFormValid =
    isValidEmail(email) && isStrongPassword(password) && password === confirm;

  function handleEmailChange(value: string) {
    setEmail(value);
    setEmailError(
      value && !isValidEmail(value) ? _error("invalidEmail") : null,
    );
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setConfirmError(
      value && confirm && value !== confirm
        ? _error("passwordsMustMatch")
        : null,
    );
  }

  function handleConfirmChange(value: string) {
    setConfirm(value);
    setConfirmError(
      value && password && value !== password
        ? _error("passwordsMustMatch")
        : null,
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    if (!isFormValid) {
      return;
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
      const message = toErrorMessage(error_) || _error("signUpUnknown");
      if (analytics) {
        logEvent(analytics, "sign_up_error", { message, method: "password" });
      }
      setServerError(message);
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
          autoComplete="new-password"
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
        <PasswordStrength password={password} />

        <InputField
          autoComplete="new-password"
          error={confirmError}
          isVisible={showPassword}
          label={t("confirmLabel")}
          onChange={handleConfirmChange}
          onToggleVisibility={() => setShowPassword((previous) => !previous)}
          placeholder={t("confirmPlaceholder")}
          required
          showToggle
          type="password"
          value={confirm}
        />

        <Button disabled={!isFormValid || loading}>
          {loading ? t("buttonLoading") : t("buttonSubmit")}
        </Button>

        <div className="h-5 text-sm font-normal text-red-600">
          {serverError || " "}
        </div>
      </form>

      <p className="text-text-secondary mt-4 text-center text-xs">
        {t("haveAccountQuestion")}{" "}
        <Link className="text-text-secondary font-bold" href="/sign-in">
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}
