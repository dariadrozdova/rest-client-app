import type { ReactNode } from "react";

import "@/shared/styles/globals.css";

export const metadata = { title: "PingPong" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-bg-primary text-base">{children}</body>
    </html>
  );
}
