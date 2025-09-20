import React from "react";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = Object.freeze({
  LOCALE: "en",
  redirectTo: (loc: string) => `/${loc}/sign-in?next=/${loc}/workspace`,
});

const hoisted = vi.hoisted(() => {
  return {
    redirectSpy: vi.fn<(url: string) => never>(),
    getServerSession: vi.fn<() => Promise<unknown>>(),

    StickyHeaderGrid: vi.fn(() =>
      React.createElement("div", { "data-testid": "sticky" }),
    ),
    PageGrid: vi.fn(() =>
      React.createElement("div", { "data-testid": "pagegrid" }),
    ),
    WorkspaceUrlSync: vi.fn(() =>
      React.createElement("div", { "data-testid": "ws-sync" }),
    ),
    RestoreRequestFromUrl: vi.fn(() =>
      React.createElement("div", { "data-testid": "restore" }),
    ),
    TabStatePersistence: vi.fn(() =>
      React.createElement("div", { "data-testid": "tabs" }),
    ),
  };
});

vi.mock("next/navigation", () => ({
  redirect: (url: string) => hoisted.redirectSpy(url),
}));

vi.mock("@shared/lib/auth/get-session", () => ({
  getServerSession: () => hoisted.getServerSession(),
}));

vi.mock("@app/[locale]/(protected)/_components", () => ({
  StickyHeaderGrid: () => hoisted.StickyHeaderGrid(),
}));

vi.mock("@app/[locale]/(protected)/_components/page-grid", () => ({
  PageGrid: () => hoisted.PageGrid(),
}));

vi.mock("@/app/[locale]/(protected)/workspace/_logic", () => ({
  WorkspaceUrlSync: () => hoisted.WorkspaceUrlSync(),
  RestoreRequestFromUrl: () => hoisted.RestoreRequestFromUrl(),
  TabStatePersistence: () => hoisted.TabStatePersistence(),
}));

import WorkspaceLayout from "@/app/[locale]/(protected)/workspace/layout";

describe("WorkspaceLayout (auth & composition)", () => {
  beforeEach(() => {
    hoisted.redirectSpy.mockReset();
    hoisted.getServerSession.mockReset();

    hoisted.StickyHeaderGrid.mockClear();
    hoisted.PageGrid.mockClear();
    hoisted.WorkspaceUrlSync.mockClear();
    hoisted.RestoreRequestFromUrl.mockClear();
    hoisted.TabStatePersistence.mockClear();
  });

  it("redirects unauthenticated users to sign-in with next param", async () => {
    hoisted.getServerSession.mockResolvedValueOnce(null);

    await WorkspaceLayout({
      children: React.createElement("div", { "data-testid": "c" }),
      params: { locale: H.LOCALE },
    });

    expect(hoisted.redirectSpy).toHaveBeenCalledWith(H.redirectTo(H.LOCALE));
  });

  it("renders sticky grid, page grid and workspace logic components for authenticated users", async () => {
    hoisted.getServerSession.mockResolvedValueOnce({ id: "u1" });

    const vnode = await WorkspaceLayout({
      children: React.createElement("div", { "data-testid": "c" }),
      params: { locale: H.LOCALE },
    });

    const Wrapper = () => <>{vnode}</>;
    render(<Wrapper />);

    expect(hoisted.redirectSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId("sticky")).toBeInTheDocument();
    expect(screen.getByTestId("pagegrid")).toBeInTheDocument();
    expect(screen.getByTestId("ws-sync")).toBeInTheDocument();
    expect(screen.getByTestId("restore")).toBeInTheDocument();
    expect(screen.getByTestId("tabs")).toBeInTheDocument();

    expect(hoisted.StickyHeaderGrid).toHaveBeenCalledTimes(1);
    expect(hoisted.PageGrid).toHaveBeenCalledTimes(1);
    expect(hoisted.WorkspaceUrlSync).toHaveBeenCalledTimes(1);
    expect(hoisted.RestoreRequestFromUrl).toHaveBeenCalledTimes(1);
    expect(hoisted.TabStatePersistence).toHaveBeenCalledTimes(1);
  });
});
