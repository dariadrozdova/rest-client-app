import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
