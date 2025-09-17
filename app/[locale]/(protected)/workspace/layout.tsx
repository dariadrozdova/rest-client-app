import { redirect } from "next/navigation";

import { RestoreRequestFromUrl } from "@workspace-logic/restore-request-from-url";
import { TabStatePersistence } from "@workspace-logic/tab-state-persistence";
import { WorkspaceUrlSync } from "@workspace-logic/url-sync";

import { StickyHeaderGrid } from "@app/[locale]/(protected)/_components";
import { PageGrid } from "@app/[locale]/(protected)/_components/page-grid";
import { getServerSession } from "@shared/lib/auth/get-session";

export default async function WorkspaceLayout({
  children,
  params,
}: LayoutProps<"/[locale]/workspace">) {
  const session = await getServerSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/sign-in?next=/${locale}/workspace`);
  }

  return (
    <div>
      <StickyHeaderGrid />
      <PageGrid />
      <WorkspaceUrlSync />
      <RestoreRequestFromUrl />
      <TabStatePersistence />
      {children}
    </div>
  );
}
