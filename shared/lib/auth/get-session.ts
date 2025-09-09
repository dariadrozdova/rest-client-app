import "server-only";

import { cookies } from "next/headers";

import { adminAuth } from "@/shared/lib/firebase/admin";

export async function getServerSession() {
  const name = process.env.SESSION_NAME ?? "session";
  const cookiesStore = await cookies();
  const token = cookiesStore.get(name)?.value;
  if (!token) {
    return null;
  }

  try {
    const claims = await adminAuth.verifySessionCookie(token, true);
    return {
      email: claims.email ?? null,
      name: claims.name ?? null,
      uid: claims.uid,
    };
  } catch {
    return null;
  }
}
