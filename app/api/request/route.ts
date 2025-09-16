import { NextResponse } from "next/server";

export const runtime = "nodejs";

import { addHistory } from "@/utils/server/history-store";
import { uidFromRequest } from "@/utils/server/uid-from-request";

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const { method, url, headers, body } = await request.json();

    const controller = new AbortController();
    const signal = controller.signal;

    const response = await fetch(url, {
      method,
      headers,
      body: method !== "GET" && method !== "HEAD" ? body : undefined,
      signal,
    });

    const responseText = await response.text();
    const responseHeaders: Record<string, string> = {};
    for (const [key, value] of response.headers.entries()) {
      responseHeaders[key] = value;
    }

    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseText,
    };

    // Analytics (пока console.log, позже - в history/DB)
    console.warn("Executed request:", {
      method,
      url,
      status: result.status,
      timestamp: new Date().toISOString(),
    });

    try {
      const uid = await uidFromRequest(request);
      if (uid) {
        const requestSize = body ? Buffer.byteLength(body, "utf8") : 0;
        const responseSize = responseText
          ? Buffer.byteLength(responseText, "utf8")
          : 0;

        await addHistory(uid, {
          timestamp: Date.now(),
          url,
          method,
          status: result.status,
          statusText: result.statusText,
          duration: Date.now() - startedAt,
          requestSize,
          responseSize,
          headers: responseHeaders,
          body: body || {},
        });
      } else {
        console.warn("Failed to get uid from request");
      }
    } catch (error) {
      console.warn("Failed to append history:", error);
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
