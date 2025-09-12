"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@store/store";

import { CodeLangSwitch } from "@/app/[locale]/(protected)/_components//codegen/code-lang-switch";
import { selectResolvedRequest } from "@/app/[locale]/(protected)/_components/codegen/resolve-request"; // reselect selector
import { JsonViewer } from "@/shared/ui/json-viewer";
import { requestToGenerateCode } from "@/utils/helpers";

export function CodegenerPanel() {
  const activeTab = useSelector((s: RootState) => s.tabs.activeTab);
  const isOpen = activeTab === "codegen";

  const selected = useSelector((s: RootState) => s.codeLang.selectedCodeLang);
  const resolvedOutput = useSelector(selectResolvedRequest);

  const [snippet, setSnippet] = useState("");

  const canGenerate = resolvedOutput.canGenerate && !!resolvedOutput.resolved;
  const issues = resolvedOutput.issues;
  const request = resolvedOutput.resolved;

  useEffect(() => {
    if (!isOpen || !canGenerate || !request) {
      return;
    }
    try {
      setSnippet(requestToGenerateCode(request, selected));
    } catch (error) {
      setSnippet(error instanceof Error ? error.message : String(error));
    }
  }, [isOpen, canGenerate, request, selected]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="col-span-full row-start-3 flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <CodeLangSwitch />
        {!canGenerate && (
          <div className="text-text-secondary text-sm">
            Unable to generate code:{" "}
            {issues.map((index) => index.type).join(", ")}
          </div>
        )}
      </div>

      <JsonViewer
        className="h-[420px]"
        content={
          snippet || "// Prepare a request and pick a language to see code"
        }
        mode="json"
        readOnly
        showLineNumbers
      />
    </div>
  );
}
