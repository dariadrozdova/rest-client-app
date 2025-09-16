export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { getHistory } from "@/utils/server/history-store";
import { uidFromRequest } from "@/utils/server/uid-from-request";

export async function GET(request: Request) {
  const uid = await uidFromRequest(request);
  if (!uid) {
    return Response.json({ items: [] }, { status: 200 });
  }
  const raw = await getHistory(uid);
  const items = raw.map((it) => ({
    id: it.id,
    createdAt: new Date(it.timestamp).toISOString(),
    request: {
      method: it.method,
      url: it.url,
      body: typeof it.body === "string" ? it.body : undefined,
      headers: [],
      meta: { contentType: null, jsonMode: false },
    },
    response: {
      status: it.status,
      statusText: it.statusText,
      headers: it.headers ?? {},
      body: null,
      meta: {
        requestDurationMs: it.duration,
        requestSizeBytes: it.requestSize,
        responseSizeBytes: it.responseSize,
        requestTimestamp: new Date(it.timestamp).toISOString(),
      },
    },
  }));
  return NextResponse.json({ items });
}
