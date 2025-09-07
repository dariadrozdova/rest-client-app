import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@shared/lib/auth/get-session";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession();
  const resolvedParams = await params;
  if (!session) {
    redirect(
      `/${resolvedParams.locale}/sign-in?next=/${resolvedParams.locale}${decodeURIComponent("")}`,
    );
  }
  return <>{children}</>;
}
