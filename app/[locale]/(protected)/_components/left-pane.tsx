import { Suspense } from "react";

import { HistoryTable } from "@/app/[locale]/(protected)/_components/history-table/history-table";
import { HistoryVisibility } from "@/app/[locale]/(protected)/_components/history-table/history-visibility";
import { LeftPaneClient } from "@/app/[locale]/(protected)/_components/left-pane.client";

export async function LeftPane() {
  return (
    <div className="col-start-1 min-w-0">
      <LeftPaneClient />
      <Suspense fallback={null}>
        <HistoryVisibility>
          <HistoryTable />
        </HistoryVisibility>
      </Suspense>
    </div>
  );
}
