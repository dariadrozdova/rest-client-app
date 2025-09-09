import { redirect } from "next/navigation";

import { getServerSession } from "@/shared/lib/auth/get-session";

export default async function AuthLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const session = await getServerSession();
  const { locale } = await params;
  if (session) {
    redirect(`/${locale}`);
  }
  return <>{children}</>;
}
