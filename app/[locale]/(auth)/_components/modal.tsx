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
        className="relative min-h-[420px] w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-gray-700"
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
