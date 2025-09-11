"use client";

import { X } from "lucide-react";

import EmailSignInForm from "@app/[locale]/(auth)/sign-in/_components/sign-in-form";

interface SignInModalProps {
  onClose: () => void;
}

export default function SignInModal({ onClose }: SignInModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative min-h-[420px] w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          aria-label="Close"
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <EmailSignInForm />
      </div>
    </div>
  );
}
