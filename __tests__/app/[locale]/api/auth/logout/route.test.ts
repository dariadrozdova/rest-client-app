const STATUS_LOGOUT = Object.freeze({
  OK: 200,
});

const COOKIE_LOGOUT = Object.freeze({
  NAME: "session",
  ZERO_SECONDS: 0,
  PATH: "/",
  SAME_SITE_LAX: "Lax",
});

const HOISTED_LOGOUT = vi.hoisted(() => ({
  getSessionCookieName: vi.fn(() => COOKIE_LOGOUT.NAME),
}));

vi.mock("@/shared/lib/auth/cookies", () => ({
  getSessionCookieName: HOISTED_LOGOUT.getSessionCookieName,
}));

import { POST as logoutPOST } from "@/app/[locale]/api/auth/logout/route";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("NODE_ENV", "test");
  HOISTED_LOGOUT.getSessionCookieName
    .mockReset()
    .mockReturnValue(COOKIE_LOGOUT.NAME);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/auth/logout", () => {
  it("clears the session cookie and returns ok (non-production)", async () => {
    const response = await logoutPOST();

    expect(response.status).toBe(STATUS_LOGOUT.OK);

    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(setCookie).toContain(`${COOKIE_LOGOUT.NAME}=;`);

    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain(`Max-Age=${COOKIE_LOGOUT.ZERO_SECONDS}`);
    expect(setCookie).toContain(`Path=${COOKIE_LOGOUT.PATH}`);
    expect(setCookie).toMatch(
      new RegExp(`(?:^|;\\s*)SameSite=${COOKIE_LOGOUT.SAME_SITE_LAX}`, "i"),
    );
    expect(setCookie.includes("Secure")).toBe(false);

    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("marks cookie Secure in production", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "production");

    const response = await logoutPOST();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(setCookie).toContain(`${COOKIE_LOGOUT.NAME}=;`);
    expect(setCookie).toContain(`Max-Age=${COOKIE_LOGOUT.ZERO_SECONDS}`);
    expect(setCookie).toContain("Secure");
  });
});
