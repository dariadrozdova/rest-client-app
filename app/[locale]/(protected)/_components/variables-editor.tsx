import { useSelector } from "react-redux";

import { RootState } from "@store/store";

export function VariablesEditor() {
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const isHeadersOpen = activeTab === "variables";
  return isHeadersOpen && <div className="text-5xl">VARIABLES</div>;
}
