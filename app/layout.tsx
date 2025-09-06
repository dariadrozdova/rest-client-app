import type { ReactNode } from "react";

import "@/shared/styles/globals.css";

export const metadata = { title: "My App" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="bg-bg-primary text-base">{children}</body>
    </html>
  );
}
