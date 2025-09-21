"use client";

import { useReturnableModal } from "@utils/hooks/use-returnable-modal";

import SignUpModal from "@/app/[locale]/(auth)/sign-up/_components/sign-up-modal";

export default function SignUpPage() {
  const { open, onClose } = useReturnableModal();
  return open ? <SignUpModal onClose={onClose} /> : null;
}
