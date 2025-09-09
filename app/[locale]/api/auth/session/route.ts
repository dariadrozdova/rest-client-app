import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminAuth } from "@/shared/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET() {
  const name = process.env.SESSION_NAME ?? "session";
  const cookiesStore = await cookies();
  const token = cookiesStore.get(name)?.value;

  if (!token) {
    return NextResponse.json({ session: null });
  }

  try {
    const claims = await adminAuth.verifySessionCookie(token, true);
    return NextResponse.json({
      session: {
        email: claims.email ?? null,
        name: claims.name ?? null,
        uid: claims.uid,
      },
    });
  } catch {
    return NextResponse.json({ session: null });
  }
}
