import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const EMAIL = "user@example.com";
const PASSWORD = "hunter2";
const LOCALE = "en";
const ID_TOKEN = "id-token-123";
const LOGIN_PATH_PREFIX = "/";
const LOGIN_API_PATH = "api/auth/login";
const FORCE_REFRESH_TRUE = true;

interface HoistedState {
  fetchCalls: { init?: RequestInit; input: string }[];
  lastSignIn?: SignArguments;
  lastSignUp?: SignArguments;
  nextFetchStatus: number;
  userCredential: {
    operationType: null | string;
    providerId: null | string;
    user: {
      getIdToken: (forceRefresh: boolean) => Promise<string>;
    };
  };
}
interface SignArguments {
  email: string;
  password: string;
}

const ST: HoistedState = vi.hoisted(() => {
  return {
    lastSignIn: undefined,
    lastSignUp: undefined,
    userCredential: {
      user: {
        getIdToken: (forceRefresh: boolean) =>
          Promise.resolve(forceRefresh ? ID_TOKEN : ID_TOKEN),
      },
      providerId: null,
      operationType: null,
    },
    fetchCalls: [],
    nextFetchStatus: 200,
  };
});

vi.mock("@/shared/lib/firebase/firebase", () => {
  return { auth: { __mock: true } };
});

vi.mock("firebase/auth", () => {
  return {
    signInWithEmailAndPassword: (
      _auth: unknown,
      email: string,
      password: string,
    ) => {
      ST.lastSignIn = { email, password };
      return Promise.resolve(ST.userCredential);
    },
    createUserWithEmailAndPassword: (
      _auth: unknown,
      email: string,
      password: string,
    ) => {
      ST.lastSignUp = { email, password };
      return Promise.resolve(ST.userCredential);
    },
  };
});

const originalFetch = globalThis.fetch;

beforeEach(() => {
  ST.lastSignIn = undefined;
  ST.lastSignUp = undefined;
  ST.fetchCalls.length = 0;
  ST.nextFetchStatus = 200;

  const mockFetch: typeof fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = typeof input === "string" ? input : String(input);
    ST.fetchCalls.push({ input: url, init });
    return new Response("", { status: ST.nextFetchStatus });
  };

  globalThis.fetch = mockFetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

import {
  getFreshIdToken,
  serverLogin,
  signInEmail,
  signUpEmail,
} from "@/shared/auth/auth";

describe("auth client helpers", () => {
  it("serverLogin makes a POST to /{locale}/api/auth/login with JSON body and headers; resolves when ok", async () => {
    ST.nextFetchStatus = 200;

    await serverLogin(LOCALE, ID_TOKEN);

    const expectedUrl = `${LOGIN_PATH_PREFIX}${LOCALE}/${LOGIN_API_PATH}`;
    expect(ST.fetchCalls).toHaveLength(1);
    const call = ST.fetchCalls[0];

    expect(call.input).toBe(expectedUrl);
    expect(call.init?.method).toBe("POST");
    expect(call.init?.headers).toEqual({ "Content-Type": "application/json" });
    expect(call.init?.body).toBe(JSON.stringify({ idToken: ID_TOKEN }));
  });

  it("serverLogin rejects with 'Login failed' when response is not ok", async () => {
    ST.nextFetchStatus = 500;

    await expect(serverLogin(LOCALE, ID_TOKEN)).rejects.toThrowError(
      "Login failed",
    );

    expect(ST.fetchCalls).toHaveLength(1);
  });

  it("signInEmail delegates to Firebase and returns a credential", async () => {
    const cred = await signInEmail(EMAIL, PASSWORD);

    expect(ST.lastSignIn).toEqual({ email: EMAIL, password: PASSWORD });

    const token = await cred.user.getIdToken(FORCE_REFRESH_TRUE);
    expect(token).toBe(ID_TOKEN);
  });

  it("signUpEmail delegates to Firebase and returns a credential", async () => {
    const cred = await signUpEmail(EMAIL, PASSWORD);

    expect(ST.lastSignUp).toEqual({ email: EMAIL, password: PASSWORD });

    const token = await getFreshIdToken(cred);
    expect(token).toBe(ID_TOKEN);
  });

  it("getFreshIdToken calls user.getIdToken(true) and returns the token", async () => {
    const cred = await signUpEmail(EMAIL, PASSWORD);

    let capturedForceRefresh: boolean | null = null;
    const originalGetter = cred.user.getIdToken.bind(cred.user);

    cred.user.getIdToken = (forceRefresh: boolean) => {
      capturedForceRefresh = forceRefresh;
      return originalGetter(forceRefresh);
    };

    const token = await getFreshIdToken(cred);

    expect(capturedForceRefresh).toBe(FORCE_REFRESH_TRUE);
    expect(token).toBe(ID_TOKEN);
  });
});
