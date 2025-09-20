import React from "react";

import { cleanup, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.useFakeTimers();

type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

const hoisted = vi.hoisted(() => {
  return {
    replaceSpy: vi.fn<(url: string) => void>(),
    pathname: "/en/workspace/GET",
    params: { locale: "en" },

    reduxState: {
      method: { selectedMethod: "GET" },
      httpUrl: { httpUrl: "" },
      bodyEditor: { body: "" },
    },

    toBase64Utf8: vi.fn<(v: string) => string>(),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: hoisted.replaceSpy }),
  usePathname: () => hoisted.pathname,
  useParams: () => hoisted.params,
}));

vi.mock("react-redux", () => ({
  useSelector: <T,>(selector: (s: unknown) => T): T =>
    selector(hoisted.reduxState),
}));

vi.mock("@/utils/helpers/base64", () => ({
  toBase64Utf8: (s: string) => hoisted.toBase64Utf8(s),
}));

import { WorkspaceUrlSync } from "@/app/[locale]/(protected)/workspace/_logic/url-sync";

const H = Object.freeze({
  LOCALE: "en",
  base: (m: HttpMethod) => `/${H.LOCALE}/workspace/${m}`,
  URL: "https://example.com/users?q=ok",
  BODY: '{"a":1}',
});

describe("WorkspaceUrlSync", () => {
  beforeEach(() => {
    cleanup();
    hoisted.replaceSpy.mockClear();
    hoisted.toBase64Utf8.mockReset();
    hoisted.pathname = H.base("GET");
    hoisted.params.locale = H.LOCALE;

    hoisted.reduxState.method.selectedMethod = "GET";
    hoisted.reduxState.httpUrl.httpUrl = "";
    hoisted.reduxState.bodyEditor.body = "";

    hoisted.toBase64Utf8.mockImplementation((s) => `b64(${s})`);
  });

  it("does nothing until locale and method exist", () => {
    hoisted.params.locale = "";

    render(<WorkspaceUrlSync />);
    vi.runOnlyPendingTimers();

    expect(hoisted.replaceSpy).not.toHaveBeenCalled();
  });

  it("builds encoded path with url and body after debounce", () => {
    const { rerender } = render(<WorkspaceUrlSync />);

    hoisted.reduxState.method.selectedMethod = "POST";
    hoisted.reduxState.httpUrl.httpUrl = H.URL;
    hoisted.reduxState.bodyEditor.body = H.BODY;

    rerender(<WorkspaceUrlSync />);
    vi.runOnlyPendingTimers();

    const expected =
      `${H.base("POST")}/${encodeURIComponent(`b64(${H.URL})`)}` +
      `/${encodeURIComponent(`b64(${H.BODY})`)}`;

    expect(hoisted.replaceSpy).toHaveBeenCalledTimes(1);
    expect(hoisted.replaceSpy).toHaveBeenCalledWith(expected);
  });

  it("does not call replace when computed path equals current pathname", () => {
    hoisted.pathname = H.base("GET");

    render(<WorkspaceUrlSync />);
    vi.runOnlyPendingTimers();

    expect(hoisted.replaceSpy).not.toHaveBeenCalled();
  });

  it("clears previous debounce on rapid successive changes", () => {
    const { rerender } = render(<WorkspaceUrlSync />);

    hoisted.reduxState.httpUrl.httpUrl = "one";
    rerender(<WorkspaceUrlSync />);

    hoisted.reduxState.httpUrl.httpUrl = "two";
    rerender(<WorkspaceUrlSync />);

    vi.runOnlyPendingTimers();

    const expected = `${H.base("GET")}/${encodeURIComponent("b64(two)")}`;
    expect(hoisted.replaceSpy).toHaveBeenCalledTimes(1);
    expect(hoisted.replaceSpy).toHaveBeenLastCalledWith(expected);
  });
});
