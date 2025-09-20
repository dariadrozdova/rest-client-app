"use client";

import { useSelector } from "react-redux";

import { BodyEditor } from "@app/[locale]/(protected)/_components/body-editor";
import { CodegenPanel } from "@app/[locale]/(protected)/_components/codegen/codegen-panel";
import { HeadersEditor } from "@app/[locale]/(protected)/_components/headers-editor";
import { VariablesEditor } from "@app/[locale]/(protected)/_components/variables-editor";

import { RootState } from "@/store/store";

export function LeftPaneClient() {
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

  return (
    <>
      {activeTab === "headers" && <HeadersEditor />}
      {activeTab === "body" && <BodyEditor />}
      {activeTab === "codegen" && <CodegenPanel />}
      {activeTab === "variables" && <VariablesEditor />}
    </>
  );
}
