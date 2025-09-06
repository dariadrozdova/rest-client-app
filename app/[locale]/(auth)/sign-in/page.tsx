"use client";

import EmailSignInForm from "@app/[locale]/(auth)/sign-in/_components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm space-y-3">
      <h1 className="text-lg font-semibold">Log in</h1>
      <EmailSignInForm />
    </div>
  );
}
