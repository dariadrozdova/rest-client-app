export const runtime = "nodejs";

import { NextResponse } from "next/server";

import {
  buildResponseDTO,
  executeHttp,
  persistHistoryErrorSafe,
  persistHistorySafe,
  type RequestPayload,
} from "@/utils/server/http-client";

export async function POST(request: Request) {
  const startedAt = Date.now();
  let payload: RequestPayload = {
    method: "",
    url: "",
    headers: {},
    body: null,
  };

  try {
    const raw = await request.json();
    payload = {
      method:
        typeof raw?.method === "string" ? raw.method.toUpperCase() : "GET",
      url: String(raw?.url ?? ""),
      headers: raw?.headers ?? {},
      body: typeof raw?.body === "string" ? raw.body : null,
    };

    const executed = await executeHttp(payload);

    const dto = buildResponseDTO(payload, executed, startedAt);

    await persistHistorySafe(startedAt, payload, executed);

    return NextResponse.json(dto, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await persistHistoryErrorSafe(startedAt, payload, message);
    return NextResponse.json({ error: message }, { status: 200 });
  }
}
