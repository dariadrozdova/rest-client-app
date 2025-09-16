import "server-only";

import { cookies } from "next/headers";

import { getSessionCookieName } from "@/shared/lib/auth/cookies";
import { adminAuth } from "@/shared/lib/firebase/admin";

export async function getServerSession() {
  const name = getSessionCookieName();
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
