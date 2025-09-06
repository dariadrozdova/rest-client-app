"use client";

import EmailSignUpForm from "@app/[locale]/(auth)/sign-up/_components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-sm space-y-3">
      <h1 className="text-lg font-semibold">Sign up</h1>
      <EmailSignUpForm />
    </div>
  );
}
