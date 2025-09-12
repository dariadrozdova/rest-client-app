import { createSelector } from "@reduxjs/toolkit";

import type {
  Issue,
  ResolvedHeader,
  ResolvedRequest,
  ResolvedSelectorOutput,
} from "@/shared/types";
import type { RootState } from "@/store/store";
import {
  collectEnabledVariables,
  deriveContentType,
  extractUnresolvedVariables,
  jsonDetect,
  normalizeHeader,
  safePrettyJson,
  substituteVariables,
  validateUrlString,
} from "@/utils/helpers";

/** ----- PURE INPUT SELECTORS (no new objects/arrays created here) ----- */
const selectMethod = (state: RootState) => state.method.selectedMethod;
const selectUrlRaw = (state: RootState) => state.httpUrl.httpUrl ?? "";
const selectHeaderItems = (state: RootState) => state.headers.items;
const selectBodyRaw = (state: RootState) => state.bodyEditor.body ?? "";
const selectContentTypeHint = (state: RootState) =>
  state.bodyEditor.contentType ?? "";
const selectVariablesItems = (state: RootState) => state.variables.items;

/** ----- RESULT SELECTOR (all computation happens here) ----- */
export const selectResolvedRequest = createSelector(
  [
    selectMethod,
    selectUrlRaw,
    selectHeaderItems,
    selectBodyRaw,
    selectContentTypeHint,
    selectVariablesItems,
  ],
  (
    method,
    urlRaw,
    headerItems,
    bodyRaw,
    contentTypeHint,
    variablesItems,
  ): ResolvedSelectorOutput => {
    const issues: Issue[] = [];

    if (!method) {
      issues.push({ type: "MISSING_METHOD" });
    }

    const headersNorm = headerItems
      .map((h) => normalizeHeader(h))
      .filter((h) => h.enabled && !!h.key);

    const headersSub: ResolvedHeader[] = [];

    const variablesMap = collectEnabledVariables(variablesItems);

    const { out: urlSub } = substituteVariables(urlRaw || "", variablesMap);
    if (!urlSub.trim()) {
      issues.push({ type: "EMPTY_URL" });
    }

    for (const h of headersNorm) {
      const { out } = substituteVariables(h.value, variablesMap);
      headersSub.push({ name: h.key, value: out });
    }

    const { out: bodySub } = substituteVariables(bodyRaw || "", variablesMap);
    const unresolved: { names: string[]; scope: "body" | "headers" | "url" }[] =
      [];
    const headerLeftNames = new Set<string>();
    for (const h of headersSub) {
      for (const n of extractUnresolvedVariables(h.value)) {
        headerLeftNames.add(n);
      }
    }
    if (headerLeftNames.size) {
      unresolved.push({ scope: "headers", names: [...headerLeftNames] });
    }

    const bodyLeft = extractUnresolvedVariables(bodySub);
    if (bodyLeft.length) {
      unresolved.push({ scope: "body", names: bodyLeft });
    }

    const urlLeft = extractUnresolvedVariables(urlSub);
    if (urlLeft.length) {
      unresolved.push({ scope: "url", names: urlLeft });
    }

    if (unresolved.length) {
      issues.push({ type: "UNRESOLVED_VARIABLES", fields: unresolved });
    }

    if (
      !issues.some((issue) => issue.type === "EMPTY_URL") &&
      urlLeft.length === 0 &&
      !validateUrlString(urlSub)
    ) {
      issues.push({ type: "INVALID_URL", detail: urlSub });
    }

    const contentType = deriveContentType(headersSub, contentTypeHint);
    const jsonMode = jsonDetect(contentType);

    let finalBody: string | undefined;
    if (bodySub && bodySub.length > 0) {
      if (jsonMode) {
        const pretty = safePrettyJson(bodySub);
        if (pretty.ok) {
          finalBody = pretty.text;
        } else {
          issues.push({ type: "INVALID_JSON_BODY", detail: pretty.error });
          finalBody = bodySub;
        }
      } else {
        finalBody = bodySub;
      }
    }

    const canGenerate = issues.length === 0;
    if (!canGenerate) {
      return { issues, canGenerate };
    }

    const resolved: ResolvedRequest = {
      method,
      url: urlSub,
      headers: headersSub,
      body: finalBody,
      meta: { contentType, jsonMode },
    };

    return { resolved, issues: [], canGenerate };
  },
);
