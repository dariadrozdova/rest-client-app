import { useSelector } from "react-redux";

import { RootState } from "@store/store";

export function CodegenerPanel() {
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const isHeadersOpen = activeTab === "codegen";
  return isHeadersOpen && <div className="text-5xl">CODE GENERATOR</div>;
}
