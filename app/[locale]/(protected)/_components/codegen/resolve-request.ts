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

const rawRequestState = (state: RootState) => ({
  method: state.method.selectedMethod,
  urlRaw: state.httpUrl.httpUrl,
  headers: state.headers.items,
  body: {
    bodyRaw: state.bodyEditor.body,
    contentTypeHint: state.bodyEditor.contentType,
  },
  variables: state.variables.items,
});

export const selectResolvedRequest = createSelector(
  [rawRequestState],
  (state): ResolvedSelectorOutput => {
    const issues: Issue[] = [];

    const method = state.method;
    if (!method) {
      issues.push({ type: "MISSING_METHOD" });
    }

    const headersNorm: ResolvedHeader[] = state.headers
      .map((header) => normalizeHeader(header))
      .filter((header) => header.enabled && !!header.key)
      .map((header) => ({ name: header.key, value: header.value }));

    const variablesMap = collectEnabledVariables(state.variables);

    const { out: urlSub } = substituteVariables(
      state.urlRaw || "",
      variablesMap,
    );
    if (!urlSub.trim()) {
      issues.push({ type: "EMPTY_URL" });
    }

    const headersSub = headersNorm.map((h) => {
      const { out } = substituteVariables(h.value, variablesMap);
      return { name: h.name, value: out };
    });

    const { out: bodySub } = substituteVariables(
      state.body?.bodyRaw || "",
      variablesMap,
    );

    const unresolved: { names: string[]; scope: "body" | "headers" | "url" }[] =
      [];
    if (unresolved.length) {
      issues.push({ type: "UNRESOLVED_VARIABLES", fields: unresolved });
    }

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
      !issues.some((index) => index.type === "EMPTY_URL") &&
      !urlLeft.length &&
      !validateUrlString(urlSub)
    ) {
      issues.push({ type: "INVALID_URL", detail: urlSub });
    }

    const contentType = deriveContentType(
      headersSub,
      state.body?.contentTypeHint,
    );
    const jsonMode = jsonDetect(contentType);

    let finalBody: string | undefined = undefined;
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
