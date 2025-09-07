import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/shared/lib/auth/get-session";

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession();
  const resolvedParams = await params;
  if (session) {
    redirect(`/${resolvedParams.locale}`);
  }
  return <>{children}</>;
}
