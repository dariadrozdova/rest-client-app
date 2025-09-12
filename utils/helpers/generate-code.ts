import { HTTPSnippet } from "@readme/httpsnippet";

import type { CodeLangGen, ResolvedRequest } from "@/shared/types";
import { convertToHar } from "@/utils/helpers/convert-to-har";

function headerRecord(
  headers: ResolvedRequest["headers"],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const h of headers) {
    out[h.name] = h.value;
  }
  return out;
}

function logHar(request: ResolvedRequest) {
  const headers = headerRecord(request.headers);
  const hasBody = request.body !== null && request.body !== "";

  if (!hasBody) {
    delete headers["content-type"];
    delete headers["Content-Type"];
  }

  const harRequest = convertToHar({
    method: request.method,
    url: request.url,
    headers,
    body: hasBody ? request.body : undefined,
  });

  if (!hasBody && !harRequest.postData) {
    harRequest.postData = {
      mimeType:
        headers["content-type"] ?? headers["Content-Type"] ?? "text/plain",
      text: "",
    };
  }

  return {
    log: {
      version: "1.2",
      creator: { name: "RS REST Client", version: "0.1.0" },
      entries: [{ request: harRequest }],
    },
  };
}
// eslint-disable-next-line perfectionist/sort-modules
export function requestToGenerateCode(
  request: ResolvedRequest,
  selected: CodeLangGen,
): string {
  const harLog = logHar(request);
  const snippet = new HTTPSnippet(harLog);
  const out = selected.snippetClient
    ? snippet.convert(selected.snippetLang, selected.snippetClient)
    : snippet.convert(selected.snippetLang);
  return (out ?? "").toString();
}
