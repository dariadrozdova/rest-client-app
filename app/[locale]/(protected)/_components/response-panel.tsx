"use client";

import { ResponsePaneProps } from "@shared/types";

import { useRequest } from "@/app/[locale]/(protected)/main/_modules/request-context";

export function ResponsePane({ response }: ResponsePaneProps) {
  const context = useRequest();
  const fallbackContent = response ?? "";
  const content = context.responseText ?? fallbackContent;
  const lines = content.split("\n");

  return (
    <div className="col-start-3 max-h-[calc(100vh-12rem)] overflow-auto font-mono text-sm">
      <pre className="m-0 p-4">
        {lines.map((line, index) => (
          <div className="flex" key={index}>
            <span className="text-text-tertiary w-10 pr-4 text-right select-none">
              {index + 1}
            </span>
            <span className="break-words whitespace-pre-wrap">{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
