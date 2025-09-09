import { useSelector } from "react-redux";

import { RootState } from "@store/store";

export function BodyEditor() {
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const isHeadersOpen = activeTab === "body";
  return isHeadersOpen && <div className="text-5xl">BODY</div>;
}
