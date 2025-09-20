// __tests__/app/[locale]/(protected)/workspace/_logic/restore-request-from-url.test.tsx
import React from "react";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Hoisted mock fns (exist before vi.mock runs)
// Types for the route params your component reads
interface RouteParams {
  bodyBase64?: string;
  endpointBase64?: string;
  method?: string;
}

// Small factory so we can get a properly typed empty object without assertions
function createParams(): RouteParams {
  return {};
}

// Hoisted fakes (exist before vi.mock runs)
const hoisted = vi.hoisted(() => {
  return {
    isValidHttpMethod: vi.fn<(m: string) => boolean>(),
    validateUrlString: vi.fn<(u: string) => boolean>(),
    fromBase64Utf8: vi.fn<(v: string) => null | string>(),
    dispatchSpy: vi.fn(),
    params: createParams(), // ✅ typed, no assertions
  };
});

// Mocks
vi.mock("react-redux", () => ({
  useDispatch: () => hoisted.dispatchSpy,
}));

vi.mock("next/navigation", () => ({
  useParams: () => hoisted.params, // returns RouteParams
}));

vi.mock("@store/slices/method-slice", () => ({
  setSelectedMethod: (payload: string) => ({
    type: "setSelectedMethod",
    payload,
  }),
}));
vi.mock("@store/slices/url-slice", () => ({
  setUrl: (payload: string) => ({ type: "setUrl", payload }),
}));
vi.mock("@store/slices/body-editor-slice", () => ({
  setBody: (payload: string) => ({ type: "setBody", payload }),
}));

vi.mock("@/utils/helpers", () => ({
  isValidHttpMethod: hoisted.isValidHttpMethod,
  validateUrlString: hoisted.validateUrlString,
}));
vi.mock("@/utils/helpers/base64", () => ({
  fromBase64Utf8: hoisted.fromBase64Utf8,
}));

// SUT import AFTER mocks
import { RestoreRequestFromUrl } from "@/app/[locale]/(protected)/workspace/_logic/restore-request-from-url";

const H = Object.freeze({
  GET: "GET",
  POST: "POST",
  URL_RAW: "https://api.example.com/users?id=7",
  BODY_RAW: '{"ok":true}',
  URL_B64: "b64url",
  BODY_B64: "b64body",
});

describe("RestoreRequestFromUrl", () => {
  beforeEach(() => {
    hoisted.dispatchSpy.mockClear();
    hoisted.isValidHttpMethod.mockReset();
    hoisted.validateUrlString.mockReset();
    hoisted.fromBase64Utf8.mockReset();

    // clear params
    hoisted.params.method = undefined;
    hoisted.params.endpointBase64 = undefined;
    hoisted.params.bodyBase64 = undefined;
  });

  it("dispatches method, url and body when params are valid", () => {
    hoisted.params.method = H.POST;
    hoisted.params.endpointBase64 = H.URL_B64;
    hoisted.params.bodyBase64 = H.BODY_B64;

    hoisted.isValidHttpMethod.mockReturnValue(true);
    hoisted.fromBase64Utf8.mockImplementation((v) =>
      v === H.URL_B64 ? H.URL_RAW : v === H.BODY_B64 ? H.BODY_RAW : null,
    );
    hoisted.validateUrlString.mockReturnValue(true);

    render(<RestoreRequestFromUrl />);

    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setSelectedMethod",
      payload: H.POST,
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setUrl",
      payload: H.URL_RAW,
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setBody",
      payload: H.BODY_RAW,
    });
  });

  it("falls back to GET and clears invalid url/body", () => {
    hoisted.params.method = "INVALID";
    hoisted.params.endpointBase64 = H.URL_B64;
    hoisted.params.bodyBase64 = H.BODY_B64;

    hoisted.isValidHttpMethod.mockReturnValue(false);
    hoisted.fromBase64Utf8.mockReturnValue(null);
    hoisted.validateUrlString.mockReturnValue(false);

    render(<RestoreRequestFromUrl />);

    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setSelectedMethod",
      payload: H.GET,
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setUrl",
      payload: "",
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setBody",
      payload: "",
    });
  });

  it("handles missing optional params by clearing state", () => {
    hoisted.params.method = H.GET;

    hoisted.isValidHttpMethod.mockReturnValue(true);

    render(<RestoreRequestFromUrl />);

    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setSelectedMethod",
      payload: H.GET,
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setUrl",
      payload: "",
    });
    expect(hoisted.dispatchSpy).toHaveBeenCalledWith({
      type: "setBody",
      payload: "",
    });
  });
});
