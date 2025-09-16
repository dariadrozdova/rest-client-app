import { redirect } from "next/navigation";

import { LayoutProps } from "@shared/types/types";

import { getServerSession } from "@/shared/lib/auth/get-session";

export default async function AuthLayout({ children, params }: LayoutProps) {
  const session = await getServerSession();
  const { locale } = params;
  if (session) {
    redirect(`/${locale}/workspace`);
  }
  return <>{children}</>;
}
