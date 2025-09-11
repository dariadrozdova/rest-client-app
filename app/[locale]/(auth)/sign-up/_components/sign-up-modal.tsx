"use client";

import Modal from "@app/[locale]/(auth)/_components/modal";
import EmailSignUpForm from "@app/[locale]/(auth)/sign-up/_components/sign-up-form";

interface SignInModalProps {
  onClose: () => void;
}

export default function SignUpModal({ onClose }: SignInModalProps) {
  return (
    <Modal onClose={onClose}>
      <EmailSignUpForm />
    </Modal>
  );
}
