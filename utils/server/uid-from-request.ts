import { adminAuth } from "@shared/lib/firebase/admin";

const ID_TOKEN_COOKIE = "session" as const;

export async function uidFromRequest(
  request: Request,
): Promise<string | undefined> {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const sessionCookie = cookieHeader
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(`${ID_TOKEN_COOKIE}=`))
      ?.split("=")[1];

    const authHeader = request.headers.get("authorization") ?? "";
    const bearer = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    if (sessionCookie) {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decoded.uid;
    }

    if (bearer) {
      const decoded = await adminAuth.verifyIdToken(bearer, true);
      return decoded.uid;
    }

    return undefined;
  } catch {
    return undefined;
  }
}
