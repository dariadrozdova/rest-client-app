import { ResolvedRequest } from "@/shared/types";

export function buildProxyUrl(resolved: ResolvedRequest): string {
  const encodedUrl = btoa(resolved.url);

  let proxyUrl = `http://localhost:3000/${resolved.method}/${encodedUrl}`;

  if (resolved.body) {
    const encodedBody = btoa(resolved.body);
    proxyUrl += `/${encodedBody}`;
  }

  if (resolved.headers.length > 0) {
    const searchParams = new URLSearchParams();
    for (const header of resolved.headers) {
      searchParams.set(header.name, header.value);
    }
    proxyUrl += `?${searchParams.toString()}`;
  }

  return proxyUrl;
}
