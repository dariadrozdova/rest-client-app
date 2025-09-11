"use client";

import { useReturnableModal } from "@app/[locale]/(auth)/hooks/useReturnableModal";

import SignInModal from "@/app/[locale]/(auth)/sign-in/_components/sign-in-modal";

export default function SignInPage() {
  const { open, onClose } = useReturnableModal();
  return open ? <SignInModal onClose={onClose} /> : null;
}
