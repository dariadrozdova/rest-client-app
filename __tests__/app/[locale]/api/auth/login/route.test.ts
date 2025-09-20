import { NextRequest } from "next/server";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STATUS = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
});

const TIME = Object.freeze({
  SEC_PER_MIN: 60,
  MIN_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  MS_PER_SEC: 1000,
  DEFAULT_SESSION_DAYS: 7,
});

const H = Object.freeze({
  URL: "http://localhost/api/auth/login",
  ID_TOKEN: "token-123",
  COOKIE_NAME: "session",
});

const SECONDS_IN_DAY =
  TIME.SEC_PER_MIN * TIME.MIN_PER_HOUR * TIME.HOURS_PER_DAY;

const hoisted = vi.hoisted(() => ({
  createSessionCookie: vi.fn(async () => "cookie-abc"),
  getSessionCookieName: vi.fn(() => H.COOKIE_NAME),
}));

vi.mock("@/shared/lib/firebase/admin", () => ({
  adminAuth: { createSessionCookie: hoisted.createSessionCookie },
}));
vi.mock("@/shared/lib/auth/cookies", () => ({
  getSessionCookieName: hoisted.getSessionCookieName,
}));

import { POST } from "@/app/[locale]/api/auth/login/route";

function makeNextJsonRequest<T extends Record<string, unknown>>(
  body: T,
): NextRequest {
  return new NextRequest(H.URL, {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("NODE_ENV", "test");
  hoisted.createSessionCookie.mockReset().mockResolvedValue("cookie-abc");
  hoisted.getSessionCookieName.mockReset().mockReturnValue(H.COOKIE_NAME);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/auth/login", () => {
  it("returns BAD_REQUEST when idToken is missing", async () => {
    const result = await POST(makeNextJsonRequest({}));

    expect(result.status).toBe(STATUS.BAD_REQUEST);
    await expect(result.json()).resolves.toEqual({ error: "Missing idToken" });
  });

  it("uses default 7 days when SESSION_MAX_AGE is unset and sets Secure in production", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "production");

    const defaultSeconds = TIME.DEFAULT_SESSION_DAYS * SECONDS_IN_DAY;

    const result = await POST(makeNextJsonRequest({ idToken: H.ID_TOKEN }));

    expect(hoisted.createSessionCookie).toHaveBeenCalledWith(H.ID_TOKEN, {
      expiresIn: defaultSeconds * TIME.MS_PER_SEC,
    });

    const setCookie = result.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${H.COOKIE_NAME}=cookie-abc`);
    expect(setCookie).toContain(`Max-Age=${defaultSeconds}`);
    expect(setCookie).toContain("Secure");
  });

  it("returns UNAUTHORIZED when Firebase rejects the token", async () => {
    hoisted.createSessionCookie.mockRejectedValueOnce(new Error("bad token"));

    const result = await POST(makeNextJsonRequest({ idToken: H.ID_TOKEN }));

    expect(result.status).toBe(STATUS.UNAUTHORIZED);
    await expect(result.json()).resolves.toEqual({
      error: "Invalid Firebase token",
    });
  });
});
