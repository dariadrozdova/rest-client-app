"use client";

import type { HTMLAttributes } from "react";
import Image from "next/image";

import type { ClientLogoProps } from "@/shared/types/animation-types";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function ClientLogo({
  src,
  alt,
  vertical = false,
  className,
}: ClientLogoProps & DivProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${vertical ? "h-[184px] w-[120px]" : "h-[72px]"} ${className ?? ""} `}
    >
      <Image
        alt={alt}
        className="object-contain"
        fill
        sizes="(max-width: 768px) 180px, 180px"
        src={src}
      />
    </div>
  );
}
