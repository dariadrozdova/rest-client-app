import type { Request as HarRequest } from "har-format";

export function convertToHar(request: {
  body?: FormData | string | URLSearchParams;
  headers: Record<string, string>;
  method: string;
  url: string;
}): HarRequest {
  const hasBody =
    request.body !== null &&
    !(typeof request.body === "string" && request.body.length === 0);

  const headers = Object.entries(request.headers).map(([name, value]) => ({
    name,
    value,
  }));

  const postData = hasBody
    ? typeof request.body === "string"
      ? {
          mimeType: request.headers["content-type"] ?? "text/plain",
          text: request.body,
        }
      : request.body instanceof URLSearchParams
        ? {
            mimeType: "application/x-www-form-urlencoded",
            params: [...request.body].map(([name, value]) => ({ name, value })),
          }
        : request.body instanceof FormData
          ? {
              mimeType: "multipart/form-data",
              params: [...request.body.entries()].map(([name, value]) => ({
                name,
                value: typeof value === "string" ? value : undefined,
                fileName: typeof value === "string" ? undefined : value.name,
              })),
            }
          : undefined
    : undefined;

  return {
    method: request.method,
    url: request.url,
    httpVersion: "HTTP/1.1",
    headers,
    queryString: [],
    cookies: [],
    headersSize: -1,
    bodySize: -1,
    postData,
  };
}
