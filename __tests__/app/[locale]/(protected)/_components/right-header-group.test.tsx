import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const NAMESPACE = "protected-header" as const;

  const LABELS = {
    loading: "Loading…",
    status: "Status",
    size: (bytes: number | string) => `Size: ${bytes}`,
    time: (ms: number | string) => `Time: ${ms}`,
    response: "Response",
  } as const;

  const STATUS_CLASS_OK = "text-green-600";

  const HTTP_OK = 200;
  const HTTP_OK_TEXT = "OK";
  const BYTES_ANSWER = 2048;
  const TIME_MS = 123;

  interface RequestMeta {
    requestDurationMs: number;
    responseSizeBytes: number;
  }
  interface RequestState {
    error: null | string;
    isLoading: boolean;
    response: null | {
      meta: RequestMeta;
      status: number;
      statusText: string;
    };
  }
  interface RootLike {
    request: RequestState;
  }

  const INITIAL_STATE: RootLike = {
    request: {
      response: null,
      error: null,
      isLoading: false,
    },
  };

  const STATE: { value: RootLike } = { value: INITIAL_STATE };

  return {
    NAMESPACE,
    LABELS,
    STATUS_CLASS_OK,
    HTTP_OK,
    HTTP_OK_TEXT,
    BYTES_ANSWER,
    TIME_MS,
    STATE,
  };
});

vi.mock("react-redux", () => {
  function useSelector<T>(selector: (state: unknown) => T): T {
    return selector(H.STATE.value);
  }
  return { useSelector };
});

vi.mock("next-intl", () => {
  const { NAMESPACE, LABELS } = H;
  function useTranslations(ns: string) {
    if (ns !== NAMESPACE) {
      throw new Error(`Unexpected namespace: ${ns}`);
    }
    return (
      key: string,
      params?: { bytes?: number | string; ms?: number | string },
    ) => {
      if (key === "loading") {
        return LABELS.loading;
      }
      if (key === "status") {
        return LABELS.status;
      }
      if (key === "response") {
        return LABELS.response;
      }
      if (key === "size") {
        return LABELS.size(params?.bytes ?? "");
      }
      if (key === "time") {
        return LABELS.time(params?.ms ?? "");
      }
      return key;
    };
  }
  return { useTranslations };
});

vi.mock("@/utils/helpers/get-status-color", () => {
  const { STATUS_CLASS_OK } = H;
  return {
    getStatusColor: (_status: number) => STATUS_CLASS_OK,
  };
});

import { RightHeaderGroup } from "@/app/[locale]/(protected)/_components/right-header-group";

function getText(text: string): HTMLElement {
  const element = screen.getByText(text);
  if (!(element instanceof HTMLElement)) {
    throw new TypeError("Found node is not an HTMLElement");
  }
  return element;
}

describe("RightHeaderGroup", () => {
  beforeEach(() => {
    H.STATE.value = {
      request: {
        response: null,
        error: null,
        isLoading: false,
      },
    };
  });

  it("renders status summary, size, time, and response header when response is present", () => {
    const {
      HTTP_OK,
      HTTP_OK_TEXT,
      BYTES_ANSWER,
      TIME_MS,
      STATUS_CLASS_OK,
      LABELS,
    } = H;

    H.STATE.value = {
      request: {
        response: {
          status: HTTP_OK,
          statusText: HTTP_OK_TEXT,
          meta: {
            responseSizeBytes: BYTES_ANSWER,
            requestDurationMs: TIME_MS,
          },
        },
        error: null,
        isLoading: false,
      },
    };

    render(<RightHeaderGroup />);

    const statusElement = getText(`${HTTP_OK} ${HTTP_OK_TEXT}`);
    expect(statusElement.className.split(" ")).toContain(STATUS_CLASS_OK);

    expect(getText(LABELS.size(BYTES_ANSWER))).toBeInTheDocument();
    expect(getText(LABELS.time(TIME_MS))).toBeInTheDocument();

    expect(getText(LABELS.response)).toBeInTheDocument();
  });

  it("shows generic status label and em-dash for size/time when there is an error", () => {
    const { LABELS } = H;

    H.STATE.value = {
      request: {
        response: null,
        error: "something-went-wrong",
        isLoading: false,
      },
    };

    render(<RightHeaderGroup />);

    expect(getText(LABELS.status)).toBeInTheDocument();

    const DASH = "—";
    expect(getText(LABELS.size(DASH))).toBeInTheDocument();
    expect(getText(LABELS.time(DASH))).toBeInTheDocument();
  });

  it("shows loading label for status and em-dash for size/time when loading", () => {
    const { LABELS } = H;

    H.STATE.value = {
      request: {
        response: null,
        error: null,
        isLoading: true,
      },
    };

    render(<RightHeaderGroup />);

    expect(getText(LABELS.loading)).toBeInTheDocument();

    const DASH = "—";
    expect(getText(LABELS.size(DASH))).toBeInTheDocument();
    expect(getText(LABELS.time(DASH))).toBeInTheDocument();
  });

  it("shows generic status label and em-dash for size/time when idle", () => {
    const { LABELS } = H;

    render(<RightHeaderGroup />);

    expect(getText(LABELS.status)).toBeInTheDocument();

    const DASH = "—";
    expect(getText(LABELS.size(DASH))).toBeInTheDocument();
    expect(getText(LABELS.time(DASH))).toBeInTheDocument();

    expect(getText(LABELS.response)).toBeInTheDocument();
  });
});
