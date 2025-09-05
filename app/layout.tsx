import { ReactNode } from "react";

import { Header } from "@app/_components";

import "@/shared/styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-base">
        <Header />
        {children}
      </body>
    </html>
  );
}
