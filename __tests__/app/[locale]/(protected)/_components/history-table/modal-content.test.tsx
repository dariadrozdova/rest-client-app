import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  makeEntry,
  NOW_ISO,
} from "@/__tests__/app/[locale]/(protected)/_components/history-table/fixtures/history";
import { ModalContent } from "@/app/[locale]/(protected)/_components/history-table/modal-content";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const DICT: Record<string, string> = {
      "modal.title": "Details",
      "modal.labels.datetime": "Date/Time",
      "modal.labels.endpoint": "Endpoint",
      "modal.labels.method": "Method",
      "modal.labels.status": "Status",
      "modal.labels.requestSize": "Request size",
      "modal.labels.responseSize": "Response size",
      "modal.labels.duration": "Duration",
      "modal.labels.error": "Error",
      "modal.notAvailable": "N/A",
      "modal.units.ms": "ms",
    };
    return DICT[key] ?? key;
  },
  useLocale: () => "en",
}));

vi.mock("@utils/helpers/format-datetime", () => ({
  formatDateTime: () => "Jan 1, 2025, 12:00 PM",
}));
vi.mock("@utils/helpers/format-bytes", () => ({
  formatBytes: (n: number) => `${n} B`,
}));
vi.mock("@utils/helpers/get-method-color", () => ({
  getMethodColor: () => "text-green-700",
}));
vi.mock("@utils/helpers/get-status-color", () => ({
  getStatusColor: () => "text-blue-700",
}));

describe("ModalContent", () => {
  it("renders summary fields and formatted values", () => {
    const entry = makeEntry({
      request: { method: "PUT", url: "https://x/y", headers: {}, body: null },
      response: {
        status: 404,
        statusText: "Not Found",
        error: "Oops",
        meta: {
          requestDurationMs: 250,
          requestSizeBytes: 512,
          responseSizeBytes: 1024,
          requestTimestamp: NOW_ISO,
        },
      },
    });

    render(<ModalContent entry={entry} />);

    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2025, 12:00 PM")).toBeInTheDocument();
    expect(screen.getByText("https://x/y")).toBeInTheDocument();
    expect(screen.getByText("PUT")).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("512 B")).toBeInTheDocument();
    expect(screen.getByText("1024 B")).toBeInTheDocument();
    expect(screen.getByText("250 ms")).toBeInTheDocument();
    expect(screen.getByText("Oops")).toBeInTheDocument();
  });

  it("shows N/A for null duration", () => {
    const base = makeEntry();

    const entry = makeEntry({
      response: {
        ...base.response,
        meta: {
          ...base.response.meta,
          requestDurationMs: undefined,
        },
      },
    });

    render(<ModalContent entry={entry} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
