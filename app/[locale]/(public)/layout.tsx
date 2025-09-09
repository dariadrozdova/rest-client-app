import { StickyHeaderGrid } from "@app/[locale]/(protected)/_components";
import { PageGrid } from "@app/[locale]/(protected)/_components/page-grid";

export default function PublicLayout() {
  return (
    <div style={{}}>
      <StickyHeaderGrid />
      <PageGrid />
    </div>
  );
}
