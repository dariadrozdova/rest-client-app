"use client";

import { ReactNode } from "react";

import { X } from "lucide-react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
      onMouseDown={onClose}
    >
      <div
        className="bg-bg-primary relative min-h-[420px] w-full max-w-md rounded-lg p-6 shadow-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="text-text-secondary hover:text-text-primary absolute top-5 right-5 cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
