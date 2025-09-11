"use client";

import { X } from "lucide-react";

import EmailSignInForm from "@app/[locale]/(auth)/sign-in/_components/sign-in-form";

interface SignInModalProps {
  onClose: () => void;
}

export default function SignInModal({ onClose }: SignInModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <EmailSignInForm />
      </div>
    </div>
  );
}
