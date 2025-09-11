"use client";

import { useState } from "react";

import SignUpModal from "@app/[locale]/(auth)/sign-up/_components/sign-up-modal";

export default function SignUpPage() {
  const [open, setOpen] = useState(true);
  return <>{open && <SignUpModal onClose={() => setOpen(false)} />}</>;
}
