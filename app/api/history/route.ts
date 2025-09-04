// An SSR page fetches the user's history and analytics
// History must be server-side generated and loaded from DB
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true });
}
