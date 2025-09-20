import React from "react";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface RouteParams {
  segments?: string[];
}

// 2) Small factory that returns a correctly typed empty object
function createRouteParams(): RouteParams {
  return {};
}

// 3) Hoisted fakes (no assertions anywhere)
const hoisted = vi.hoisted(() => {
  return {
    dispatchSpy: vi.fn<(action: { payload?: unknown; type: string }) => void>(),
    params: createRouteParams(), // ✅ typed via factory, no `as`
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

// Mocks
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

// SUT import AFTER mocks
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

    // method falls back to GET
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "method/setSelectedMethod",
      payload: H.GET,
    });

    // Collect dispatched action types to assert "no-op" for url/body
    const calls = hoisted.dispatchSpy.mock.calls.map(([a]) => a);

    // endpoint segment exists but invalid -> NO url/setUrl dispatch
    expect(calls.some((a) => a.type === "url/setUrl")).toBe(false);

    // body segment exists but decode returned null -> NO body/setBody dispatch
    expect(calls.some((a) => a.type === "body/setBody")).toBe(false);
  });

  it("clears url/body when segments are missing", () => {
    hoisted.params.segments = [H.GET]; // no endpoint/body
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
