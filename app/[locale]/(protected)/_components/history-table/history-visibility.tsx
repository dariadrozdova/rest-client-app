"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

export function HistoryVisibility({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const visible = activeTab === "requestHistory";

  const className = mounted ? (visible ? "" : "hidden") : "hidden";
  return <div className={className}>{children}</div>;
}
