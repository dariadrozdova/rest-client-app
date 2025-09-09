import { LeftPane } from "@app/[locale]/(protected)/_components/left-pane";
import { ResponsePane } from "@app/[locale]/(protected)/_components/response-panel";
import { MOCK_RESPONSE } from "@shared/globals";

export function PageGrid() {
  return (
    <div className="grid grid-cols-[1fr_1px_1fr] gap-x-6">
      <div
        aria-hidden
        className="bg-border-default w col-start-2 row-span-2 h-full w-px"
      />
      <LeftPane />
      <ResponsePane response={MOCK_RESPONSE} />
    </div>
  );
}
