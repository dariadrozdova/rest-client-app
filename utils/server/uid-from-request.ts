import { getSessionCookieName } from "@/shared/lib/auth/cookies";
import { adminAuth } from "@/shared/lib/firebase/admin";

export async function getUidFromRequest(
  request: Request,
): Promise<null | string> {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    if (cookieHeader) {
      const sessionCookieName = getSessionCookieName();
      const sessionCookie = cookieHeader
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith(`${sessionCookieName}=`))
        ?.split("=")[1];

      if (sessionCookie) {
        const decoded = await adminAuth.verifySessionCookie(
          sessionCookie,
          true,
        );
        return decoded.uid ?? null;
      }
    }

    const authHeader = request.headers.get("authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      const bearer = authHeader.slice("Bearer ".length).trim();
      if (bearer) {
        const decoded = await adminAuth.verifyIdToken(bearer, true);
        return decoded.uid ?? null;
      }
    }

    return null;
  } catch {
    return null;
  }
}
