"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TabOpenState } from "@shared/types";
import { setActiveTab } from "@store/slices/tab-open-slice";
import { RootState } from "@store/store";

import { useLocalStorage } from "@/utils/hooks/use-storage";

export function TabStatePersistence() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const [storedTab, setStoredTab] = useLocalStorage<TabOpenState["activeTab"]>(
    "lastActiveTab",
    "headers",
  );

  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;

      if (storedTab && storedTab !== activeTab) {
        dispatch(setActiveTab(storedTab));
      }
    }
  }, [storedTab, activeTab, dispatch]);

  useEffect(() => {
    if (activeTab !== storedTab) {
      setStoredTab(activeTab);
    }
  }, [activeTab, storedTab, setStoredTab]);

  return null;
}
