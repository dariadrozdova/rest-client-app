import { redirect } from "next/navigation";

import { LayoutProps } from "@shared/types";

import { getServerSession } from "@/shared/lib/auth/get-session";

export default async function PublicLayout({
  children,
  params,
}: LayoutProps<{ locale: string }>) {
  const { locale } = await params;
  const session = await getServerSession();

  if (session) {
    redirect(`/${locale}/workspace`);
  }

  return <>{children}</>;
}
