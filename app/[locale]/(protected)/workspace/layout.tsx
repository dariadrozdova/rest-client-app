import { redirect } from "next/navigation";

import { StickyHeaderGrid } from "@app/[locale]/(protected)/_components";
import { PageGrid } from "@app/[locale]/(protected)/_components/page-grid";
import { getServerSession } from "@shared/lib/auth/get-session";
import { LayoutProps } from "@shared/types";

import {
  RestoreRequestFromUrl,
  TabStatePersistence,
  WorkspaceUrlSync,
} from "@/app/[locale]/(protected)/workspace/_logic";

export default async function WorkspaceLayout({
  children,
  params,
}: LayoutProps<{ locale: string }>) {
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
