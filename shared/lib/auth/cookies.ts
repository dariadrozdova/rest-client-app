export const DEFAULT_SESSION_COOKIE_NAME = "session" as const;

export function getSessionCookieName(): string {
  return process.env.SESSION_NAME ?? DEFAULT_SESSION_COOKIE_NAME;
}
