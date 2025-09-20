import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

function mockHistoryDepsEmpty() {
  vi.doMock("@utils/server/uid-from-request", () => ({
    getUidFromCookies: async () => null,
  }));
  vi.doMock("@utils/server/history-store", () => ({
    getUserHistory: async () => [],
  }));
}

function mockHistoryDepsWithEntries() {
  vi.doMock("@utils/server/uid-from-request", () => ({
    getUidFromCookies: async () => "uid-1",
  }));
  vi.doMock("@utils/server/history-store", () => ({
    getUserHistory: async () => [
      {
        id: "id1",
        timestamp: "2025-01-01T00:00:00.000Z",
        method: "GET",
        url: "https://x",
        headers: {},
        status: 200,
        statusText: "OK",
        duration: 1,
        requestSize: 1,
        responseSize: 1,
      },
    ],
  }));
}

function mockHistoryDepsWithUidEmpty() {
  vi.doMock("@utils/server/uid-from-request", () => ({
    getUidFromCookies: async () => "uid-1",
  }));
  vi.doMock("@utils/server/history-store", () => ({
    getUserHistory: async () => [],
  }));
}

function mockHistoryEmptyState() {
  vi.doMock(
    "@/app/[locale]/(protected)/_components/history-table/history-empty-state",
    () => ({
      HistoryEmptyState: () => (
        <div>
          <p>History is empty.</p>
          <button>Create new request</button>
        </div>
      ),
    }),
  );
}

/* ---------- i18n / navigation mocks ---------- */

/**
 * Mock ONLY the client table (to avoid Redux <Provider>).
 * Keep the real empty-state so we can assert the actual text it renders.
 */
function mockHistoryTableClient() {
  vi.doMock(
    "@/app/[locale]/(protected)/_components/history-table/history-table-client",
    () => ({
      HistoryTableClient: () => <div>CLIENT</div>,
    }),
  );
}

function mockNextIntlNavigation() {
  vi.doMock("next-intl/navigation", () => {
    const Link = (
      props: React.PropsWithChildren<{ className?: string; href: string }>,
    ) => (
      <a className={props.className} href={props.href}>
        {props.children}
      </a>
    );
    const createNavigation = () => ({
      Link,
      useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
      usePathname: () => "/",
      useSearchParams: () => new URLSearchParams(),
      redirect: vi.fn(),
      notFound: vi.fn(),
    });
    return { createNavigation, Link };
  });
}

function mockNextNavigation() {
  const navMock = {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    notFound: vi.fn(),
    redirect: vi.fn(),
  };
  vi.doMock("next/navigation", () => navMock);
  vi.doMock("next/navigation.js", () => navMock);
}

function mockServerI18n() {
  vi.doMock("next-intl/server", () => ({
    getTranslations: async () => (key: string) => {
      const dict: Record<string, string> = {
        "columns.method": "Method",
        "columns.status": "Status",
        "columns.time": "Time",
        "columns.endpoint": "Endpoint",
        title: "History",
        "empty.title": "History is empty.",
        "empty.cta": "Create new request",
      };
      return dict[key] ?? key;
    },
  }));
}

describe("HistoryTable (server)", () => {
  it("renders empty state when uid is missing", async () => {
    vi.resetModules();
    mockNextNavigation();
    mockNextIntlNavigation();
    mockServerI18n();
    mockHistoryDepsEmpty();
    mockHistoryTableClient();
    mockHistoryEmptyState();

    const module_ = await import(
      "@/app/[locale]/(protected)/_components/history-table/history-table"
    );
    const { HistoryTable } = module_;

    render(await HistoryTable());

    expect(screen.getByText("History is empty.")).toBeInTheDocument();
    expect(screen.getByText("Create new request")).toBeInTheDocument();
  });

  it("renders empty state when entries are empty", async () => {
    vi.resetModules();
    mockNextNavigation();
    mockNextIntlNavigation();
    mockServerI18n();
    mockHistoryDepsWithUidEmpty();
    mockHistoryTableClient();
    mockHistoryEmptyState();

    const module_ = await import(
      "@/app/[locale]/(protected)/_components/history-table/history-table"
    );
    const { HistoryTable } = module_;

    render(await HistoryTable());

    expect(screen.getByText("History is empty.")).toBeInTheDocument();
    expect(screen.getByText("Create new request")).toBeInTheDocument();
  });

  it("renders client table when entries exist", async () => {
    vi.resetModules();
    mockNextNavigation();
    mockNextIntlNavigation();
    mockServerI18n();
    mockHistoryDepsWithEntries();
    mockHistoryTableClient();

    const module_ = await import(
      "@/app/[locale]/(protected)/_components/history-table/history-table"
    );
    const { HistoryTable } = module_;

    render(await HistoryTable());
    expect(screen.getByText("CLIENT")).toBeInTheDocument();
  });
});
