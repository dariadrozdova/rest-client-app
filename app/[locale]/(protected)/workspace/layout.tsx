import { redirect } from "next/navigation";

import { StickyHeaderGrid } from "@app/[locale]/(protected)/_components";
import { PageGrid } from "@app/[locale]/(protected)/_components/page-grid";
import { getServerSession } from "@shared/lib/auth/get-session";

export default async function ProtectedLayout({
  children,
  params,
}: LayoutProps<"/[locale]/workspace">) {
  const session = await getServerSession();
  const { locale } = await params;
  if (!session) {
    redirect(`/${locale}/sign-in?next=/${locale}/workspace`);
  }
  return (
    <div style={{}}>
      <StickyHeaderGrid />
      <PageGrid />
      {children}
    </div>
  );
}
