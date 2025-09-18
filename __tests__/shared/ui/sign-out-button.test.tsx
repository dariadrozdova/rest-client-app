// __tests__/shared/ui/sign-out-button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ✔ your barrel has no default export — use a named one
import { SignOutButton } from "@/shared/ui";

// Keep this mock simple and hoist-safe
vi.mock("@/shared/styles", () => ({
  classNames: (...xs: unknown[]) => xs.filter(Boolean).join(" "),
}));

// Use unique names to avoid collisions with other files
const routerPush = vi.fn();
const routerRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  // Return stable fns from the module scope (not redeclared)
  useRouter: () => ({ push: routerPush, refresh: routerRefresh }),
}));

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

describe("SignOutButton", () => {
  beforeEach(() => {
    routerPush.mockClear();
    routerRefresh.mockClear();
    // Stub global fetch without type assertions
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  it("logs out and navigates to locale root", async () => {
    const user = userEvent.setup();

    const LABEL = "Log out";
    const LOCALE = "en";
    const LOGOUT_PATH = `/${LOCALE}/api/auth/logout`;
    const HOME_PATH = `/${LOCALE}`;

    render(<SignOutButton label={LABEL} />);

    await user.click(screen.getByRole("button", { name: LABEL }));

    expect(fetch).toHaveBeenCalledWith(LOGOUT_PATH, { method: "POST" });
    expect(routerPush).toHaveBeenCalledWith(HOME_PATH);
    expect(routerRefresh).toHaveBeenCalled();
  });
});
