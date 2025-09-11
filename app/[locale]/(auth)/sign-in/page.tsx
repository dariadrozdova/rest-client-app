"use client";

import { useState } from "react";

import SignInModal from "@app/[locale]/(auth)/sign-in/_components/sign-in-modal";

export default function SignInPage() {
  const [open, setOpen] = useState(true);
  return <>{open && <SignInModal onClose={() => setOpen(false)} />}</>;
}
