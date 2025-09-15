import { redirect } from "next/navigation";

import { getServerSession } from "@/shared/lib/auth/get-session";

export default async function PublicLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const session = await getServerSession();

  if (session) {
    redirect(`/${locale}/workspace`);
  }

  return <>{children}</>;
}
