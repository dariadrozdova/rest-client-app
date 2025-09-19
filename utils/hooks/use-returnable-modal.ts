"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useReturnableModal() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const onClose = () => {
    setOpen(false);
    router.back();
  };

  return { open, onClose };
}
