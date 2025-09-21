"use client";

import Modal from "@app/[locale]/(auth)/_components/modal";
import EmailSignInForm from "@app/[locale]/(auth)/sign-in/_components/sign-in-form";

interface SignInModalProps {
  onClose: () => void;
}

export default function SignInModal({ onClose }: SignInModalProps) {
  return (
    <Modal onClose={onClose}>
      <EmailSignInForm />
    </Modal>
  );
}
