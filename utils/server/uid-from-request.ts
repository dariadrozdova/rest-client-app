import { cookies } from "next/headers";

import { getSessionCookieName } from "@/shared/lib/auth/cookies";
import { adminAuth } from "@/shared/lib/firebase/admin";

export async function getUidFromCookies(): Promise<null | string> {
  try {
    const store = await cookies();
    const sessionCookieName = getSessionCookieName();
    const sessionCookie = store.get(sessionCookieName)?.value;

    if (sessionCookie) {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decoded.uid ?? null;
    }

    return null;
  } catch {
    return null;
  }
}
