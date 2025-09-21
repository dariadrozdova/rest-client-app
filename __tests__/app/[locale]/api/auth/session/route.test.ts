const STATUS = Object.freeze({
  OK: 200,
});

const FLAGS = Object.freeze({
  CHECK_REVOKED: true as const,
});

const COOKIE = Object.freeze({
  NAME: "session",
});

interface CookieShape {
  name: string;
  value: string;
}
interface CookieStore {
  get: (name: string) => CookieShape | undefined;
}

interface VerifyClaims {
  email?: string;
  name?: string;
  uid: string;
}

function createHoisted() {
  const state: { tokenValue: string | undefined } = { tokenValue: undefined };

  return {
    cookieName: "session",
    ...state,
    getSessionCookieName: vi.fn<() => string>(() => "session"),
    verifySessionCookie:
      vi.fn<(token: string, checkRevoked: boolean) => Promise<VerifyClaims>>(),
  };
}

const HOISTED = vi.hoisted(createHoisted);

vi.mock("@/shared/lib/auth/cookies", () => ({
  getSessionCookieName: HOISTED.getSessionCookieName,
}));

vi.mock("@/shared/lib/firebase/admin", () => ({
  adminAuth: { verifySessionCookie: HOISTED.verifySessionCookie },
}));

vi.mock("next/headers", () => ({
  cookies: async (): Promise<CookieStore> => {
    return {
      get: (name: string) =>
        HOISTED.tokenValue ? { name, value: HOISTED.tokenValue } : undefined,
    };
  },
}));

import { GET } from "@/app/[locale]/api/auth/session/route";

beforeEach(() => {
  HOISTED.tokenValue = undefined;
  HOISTED.getSessionCookieName.mockReset().mockReturnValue(COOKIE.NAME);
  HOISTED.verifySessionCookie.mockReset();
});

describe("GET /api/auth/session", () => {
  it("returns session: null when the cookie is missing", async () => {
    const response = await GET();

    expect(response.status).toBe(STATUS.OK);
    await expect(response.json()).resolves.toEqual({ session: null });
    expect(HOISTED.verifySessionCookie).not.toHaveBeenCalled();
  });

  it("returns session with email/name/uid when verification succeeds", async () => {
    HOISTED.tokenValue = "token-abc";
    HOISTED.verifySessionCookie.mockResolvedValueOnce({
      email: "a@b.com",
      name: "Alice",
      uid: "u1",
    });

    const response = await GET();

    expect(HOISTED.getSessionCookieName).toHaveBeenCalledTimes(1);
    expect(HOISTED.verifySessionCookie).toHaveBeenCalledWith(
      "token-abc",
      FLAGS.CHECK_REVOKED,
    );

    expect(response.status).toBe(STATUS.OK);
    await expect(response.json()).resolves.toEqual({
      session: { email: "a@b.com", name: "Alice", uid: "u1" },
    });
  });

  it("maps missing email/name to null in the response", async () => {
    HOISTED.tokenValue = "token-def";
    HOISTED.verifySessionCookie.mockResolvedValueOnce({ uid: "u2" });

    const response = await GET();

    expect(HOISTED.verifySessionCookie).toHaveBeenCalledWith(
      "token-def",
      FLAGS.CHECK_REVOKED,
    );

    expect(response.status).toBe(STATUS.OK);
    await expect(response.json()).resolves.toEqual({
      session: { email: null, name: null, uid: "u2" },
    });
  });

  it("returns session: null when verification throws", async () => {
    HOISTED.tokenValue = "token-err";
    HOISTED.verifySessionCookie.mockRejectedValueOnce(new Error("boom"));

    const response = await GET();

    expect(HOISTED.verifySessionCookie).toHaveBeenCalledWith(
      "token-err",
      FLAGS.CHECK_REVOKED,
    );
    expect(response.status).toBe(STATUS.OK);
    await expect(response.json()).resolves.toEqual({ session: null });
  });
});
