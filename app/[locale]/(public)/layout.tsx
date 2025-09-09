import { Metadata } from "next";

import { StickyHeaderGrid } from "@app/[locale]/(protected)/_components";

export const metadata: Metadata = { title: "PingPong" };

export default function Layout() {
  return (
    <div style={{}}>
      <StickyHeaderGrid />
    </div>
  );
}
