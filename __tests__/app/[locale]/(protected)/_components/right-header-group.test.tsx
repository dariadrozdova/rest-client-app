import React from "react";

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { RightHeaderGroup } from "@/app/[locale]/(protected)/_components/right-header-group";

interface RequestMeta {
  requestDurationMs?: number;
  responseSizeBytes?: number;
}

interface RequestSlice {
  error: null | string;
  isLoading: boolean;
  response: null | ResponseShape;
}

interface ResponseShape {
  meta?: RequestMeta;
  status: number;
  statusText: string;
}

interface RootState {
  request: RequestSlice;
}

let mockState: RootState = {
  request: { response: null, error: null, isLoading: false },
};

vi.mock("react-redux", async () => {
  const actual =
    await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useSelector: <TSelected,>(selector: (s: RootState) => TSelected) =>
      selector(mockState),
    useDispatch: () => vi.fn(),
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

const L10N_STRINGS: Record<string, string> = {
  status: "Status",
  loading: "Loading…",
  response: "Response",
};
const l10nSize = (bytes: unknown) => `Size: ${String(bytes)}`;
const l10nTime = (ms: unknown) => `Time: ${String(ms)}`;

vi.mock("next-intl", () => ({
  useTranslations: () => {
    return (key: string, params?: Record<string, unknown>) => {
      if (key === "size") {
        return l10nSize(params?.bytes);
      }
      if (key === "time") {
        return l10nTime(params?.ms);
      }
      if (Object.prototype.hasOwnProperty.call(L10N_STRINGS, key)) {
        return L10N_STRINGS[key];
      }
      return key;
    };
  },
}));

vi.mock("@/utils/helpers/get-status-color", () => ({
  getStatusColor: () => "text-green-500",
}));

const DASH_REGEX = /[-–—]/;

const EXAMPLE = {
  STATUS_CODE: 200,
  STATUS_TEXT: "OK",
  BYTES: 1234,
  DURATION_MS: 567,
};

function renderUI() {
  render(<RightHeaderGroup />);
}

function setState(next: Partial<RootState["request"]>) {
  mockState = {
    request: {
      response: null,
      error: null,
      isLoading: false,
      ...next,
    },
  };
}

describe("RightHeaderGroup", () => {
  test("shows loading label for status and em-dash-like placeholder for size/time when loading", () => {
    setState({ isLoading: true, response: null, error: null });
    renderUI();

    expect(screen.getByText(L10N_STRINGS.loading)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(`^Size:\\s*${DASH_REGEX.source}$`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`^Time:\\s*${DASH_REGEX.source}$`)),
    ).toBeInTheDocument();

    expect(screen.getByText(L10N_STRINGS.response)).toBeInTheDocument();
  });

  test("shows generic Status label and placeholders for size/time when there is an error (no response)", () => {
    setState({ isLoading: false, response: null, error: "Boom" });
    renderUI();

    expect(screen.getByText(L10N_STRINGS.status)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(`^Size:\\s*${DASH_REGEX.source}$`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`^Time:\\s*${DASH_REGEX.source}$`)),
    ).toBeInTheDocument();

    expect(screen.getByText(L10N_STRINGS.response)).toBeInTheDocument();
  });

  test("shows status code/text and actual size/time when a response exists", () => {
    setState({
      isLoading: false,
      error: null,
      response: {
        status: EXAMPLE.STATUS_CODE,
        statusText: EXAMPLE.STATUS_TEXT,
        meta: {
          responseSizeBytes: EXAMPLE.BYTES,
          requestDurationMs: EXAMPLE.DURATION_MS,
        },
      },
    });
    renderUI();

    expect(
      screen.getByText(`${EXAMPLE.STATUS_CODE} ${EXAMPLE.STATUS_TEXT}`),
    ).toBeInTheDocument();

    expect(screen.getByText(`Size: ${EXAMPLE.BYTES}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Time: ${EXAMPLE.DURATION_MS}`),
    ).toBeInTheDocument();

    expect(screen.getByText(L10N_STRINGS.response)).toBeInTheDocument();
  });

  test("falls back to placeholders when meta is missing in response", () => {
    setState({
      isLoading: false,
      error: null,
      response: {
        status: EXAMPLE.STATUS_CODE,
        statusText: EXAMPLE.STATUS_TEXT,
      },
    });
    renderUI();

    expect(
      screen.getByText(`${EXAMPLE.STATUS_CODE} ${EXAMPLE.STATUS_TEXT}`),
    ).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(`^Size:\\s*${DASH_REGEX.source}$`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`^Time:\\s*${DASH_REGEX.source}$`)),
    ).toBeInTheDocument();
  });
});
