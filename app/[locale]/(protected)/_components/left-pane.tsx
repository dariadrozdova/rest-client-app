"use client";

import { BodyEditor } from "@app/[locale]/(protected)/_components/body-editor";
import { CodegenerPanel } from "@app/[locale]/(protected)/_components/codegener-panel";
import { HeadersEditor } from "@app/[locale]/(protected)/_components/headers-editor";
import { HistoryTable } from "@app/[locale]/(protected)/_components/history-table";
import { VariablesEditor } from "@app/[locale]/(protected)/_components/variables-editor";

export function LeftPane() {
  return (
    <div className="col-start-1">
      <HeadersEditor />
      <BodyEditor />
      <CodegenerPanel />
      <VariablesEditor />
      <HistoryTable />
    </div>
  );
}
