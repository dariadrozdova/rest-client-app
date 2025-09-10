"use client";

import { ResponsePaneProps } from "@shared/types";

import { useRequest } from "@/app/[locale]/(protected)/main/_modules/request-context";
import { JsonViewer } from "@/shared/ui/json-viewer";

export function ResponsePane({ response }: ResponsePaneProps) {
  const context = useRequest();
  const fallbackContent = response ?? "";
  const content = context.responseText ?? fallbackContent;

  return (
    <div className="col-start-3 max-h-[calc(100vh-12rem)] overflow-auto">
      <JsonViewer
        className="h-full"
        content={content}
        readOnly
        showLineNumbers
      />
    </div>
  );
}
