"use client";

import { Copy } from "lucide-react";

import { classNames } from "@shared/styles";
import { CopyButtonProps } from "@shared/types";

export function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.warn("Copy failed");
    }
  };

  return (
    <button
      className={classNames(
        "text-text-primary ml-auto flex cursor-pointer items-center",
        "disabled:text-text-secondary gap-1 rounded px-3 py-1",
      )}
      disabled={!text}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      <Copy size={16} />
    </button>
  );
}
