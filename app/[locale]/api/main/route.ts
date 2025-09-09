import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const response = await fetch(data.url, {
    headers: data.headers,
    method: data.method,
  });
  const json = await response.json();
  return NextResponse.json({
    body: json,
    headers: Object.fromEntries(response.headers.entries()),
  });
}
