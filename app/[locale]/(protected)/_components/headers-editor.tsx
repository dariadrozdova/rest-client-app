import { useSelector } from "react-redux";

import { RootState } from "@store/store";

export function HeadersEditor() {
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const isHeadersOpen = activeTab === "headers";
  return isHeadersOpen && <div className="text-5xl">HEADERS</div>;
}
