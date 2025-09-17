import { NextResponse } from "next/server";

import { getUserHistory } from "@/utils/server/history-store";
import { getUidFromRequest } from "@/utils/server/uid-from-request";

export async function GET(request: Request) {
  try {
    const uid = await getUidFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await getUserHistory(uid);

    const data = entries.map((entry) => ({
      id: entry.id,
      createdAt: entry.timestamp,
      request: {
        method: entry.method,
        url: entry.url,
        headers: entry.headers ?? {},
        body: entry.body ?? null,
      },
      response: {
        status: entry.status,
        statusText: entry.statusText ?? "",
        error: entry.error ?? null,
        meta: {
          requestDurationMs: entry.duration,
          requestSizeBytes: entry.requestSize,
          responseSizeBytes: entry.responseSize,
          requestTimestamp: entry.timestamp,
        },
      },
    }));

    return NextResponse.json({ items: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
