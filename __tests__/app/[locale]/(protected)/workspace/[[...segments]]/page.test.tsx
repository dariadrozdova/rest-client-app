import React from "react";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface RouteParams {
  segments?: string[];
}

function createRouteParams(): RouteParams {
  return {};
}

const hoisted = vi.hoisted(() => {
  return {
    dispatchSpy: vi.fn<(action: { payload?: unknown; type: string }) => void>(),
    params: createRouteParams(),
    isValidHttpMethod: vi.fn<(m: string) => boolean>(),
    validateUrlString: vi.fn<(u: string) => boolean>(),
    safeDecodeBase64Uri: vi.fn<(s: string) => null | string>(),
  };
});

const H = Object.freeze({
  GET: "GET",
  POST: "POST",
  RAW_URL: "https://api.example.com/users?id=7",
  RAW_BODY: '{"ok":true}',
  SEG_URL: "b64url",
  SEG_BODY: "b64body",
});

vi.mock("react-redux", () => ({
  useDispatch: () => hoisted.dispatchSpy,
}));

vi.mock("next/navigation", () => ({
  useParams: () => hoisted.params,
}));

vi.mock("@store/slices/method-slice", () => ({
  setSelectedMethod: (payload: string) => ({
    type: "method/setSelectedMethod",
    payload,
  }),
}));
vi.mock("@store/slices/url-slice", () => ({
  setUrl: (payload: string) => ({ type: "url/setUrl", payload }),
}));
vi.mock("@store/slices/body-editor-slice", () => ({
  setBody: (payload: string) => ({ type: "body/setBody", payload }),
}));

vi.mock("@/utils/helpers", () => ({
  isValidHttpMethod: hoisted.isValidHttpMethod,
  validateUrlString: hoisted.validateUrlString,
}));

vi.mock("@/utils/helpers/safe-decode-base64-uri", () => ({
  safeDecodeBase64Uri: hoisted.safeDecodeBase64Uri,
}));

import WorkspaceCatchAllPage from "@/app/[locale]/(protected)/workspace/[[...segments]]/page";

describe("WorkspaceCatchAllPage (catch-all URL restore)", () => {
  beforeEach(() => {
    hoisted.dispatchSpy.mockClear();
    hoisted.isValidHttpMethod.mockReset();
    hoisted.validateUrlString.mockReset();
    hoisted.safeDecodeBase64Uri.mockReset();
    hoisted.params.segments = undefined;
  });

  it("dispatches method/url/body when segments are valid", () => {
    hoisted.params.segments = [H.POST, H.SEG_URL, H.SEG_BODY];
    hoisted.isValidHttpMethod.mockReturnValue(true);
    hoisted.validateUrlString.mockReturnValue(true);
    hoisted.safeDecodeBase64Uri.mockImplementation((s) =>
      s === H.SEG_URL ? H.RAW_URL : s === H.SEG_BODY ? H.RAW_BODY : null,
    );

    render(<WorkspaceCatchAllPage />);

    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "method/setSelectedMethod",
      payload: H.POST,
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "url/setUrl",
      payload: H.RAW_URL,
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "body/setBody",
      payload: H.RAW_BODY,
    });
  });

  it("falls back to GET and does not change url/body when segments exist but are invalid", () => {
    hoisted.params.segments = ["WHATEVER", H.SEG_URL, H.SEG_BODY];
    hoisted.isValidHttpMethod.mockReturnValue(false);
    hoisted.validateUrlString.mockReturnValue(false);
    hoisted.safeDecodeBase64Uri.mockReturnValue(null);

    render(<WorkspaceCatchAllPage />);

    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "method/setSelectedMethod",
      payload: H.GET,
    });

    const calls = hoisted.dispatchSpy.mock.calls.map(([a]) => a);

    expect(calls.some((a) => a.type === "url/setUrl")).toBe(false);

    expect(calls.some((a) => a.type === "body/setBody")).toBe(false);
  });

  it("clears url/body when segments are missing", () => {
    hoisted.params.segments = [H.GET];
    hoisted.isValidHttpMethod.mockReturnValue(true);

    render(<WorkspaceCatchAllPage />);

    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "method/setSelectedMethod",
      payload: H.GET,
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "url/setUrl",
      payload: "",
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "body/setBody",
      payload: "",
    });
  });
});
