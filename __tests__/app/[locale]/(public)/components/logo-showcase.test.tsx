import React, { ComponentProps, createElement } from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";

import { ADVANCE_MS } from "@/shared/globals";

const { GROUPS, SHOWCASE_DEFAULTS } = vi.hoisted(() => ({
  GROUPS: [
    {
      key: "g1",
      layout: "2x3",
      items: [
        { src: "/a.png", alt: "A" },
        { src: "/b.png", alt: "B" },
      ],
    },
    { key: "g2", layout: "vertical", items: [{ src: "/c.png", alt: "C" }] },
  ],
  SHOWCASE_DEFAULTS: { intervalMs: 50, transitionMs: 0 },
}));

vi.mock("@shared/styles", () => ({
  classNames: (...cn: string[]) => cn.filter(Boolean).join(" "),
}));

function mockUseTranslations() {
  return (key: string) =>
    key === "main-page.teamsTitle"
      ? "Teams title"
      : key === "main-page.teamsSubtitle"
        ? "Teams subtitle"
        : key;
}
vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => (k: string) =>
    mockUseTranslations()(`${ns ? `${ns}.` : ""}${k}`),
}));

vi.mock("@/shared/globals/globals-animation", () => ({
  GROUPS,
  SHOWCASE_DEFAULTS,
}));

function MockClientLogo(props: ComponentProps<"img"> & { alt: string }) {
  const { alt, ...rest } = props;
  return createElement("img", { alt, ...rest });
}
vi.mock("@app/[locale]/(public)/components/client-logo", () => ({
  ClientLogo: MockClientLogo,
}));

import { LogosShowcase } from "@app/[locale]/(public)/components/logo-showcase";
describe("LogosShowcase", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test("renders title/subtitle from translations and initial active group", () => {
    render(<LogosShowcase />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Teams title/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Teams subtitle")).toBeInTheDocument();

    const containers = document.querySelectorAll<HTMLElement>("[aria-hidden]");

    expect(containers).toHaveLength(GROUPS.length);
    expect(containers[0]).toHaveAttribute("aria-hidden", "false");
    expect(containers[1]).toHaveAttribute("aria-hidden", "true");
  });

  test("auto-rotates by interval and allows manual selection by bullet", () => {
    render(<LogosShowcase />);

    act(() => {
      vi.advanceTimersByTime(ADVANCE_MS);
    });
    let containers = document.querySelectorAll("[aria-hidden]");
    expect(containers[0].getAttribute("aria-hidden")).toBe("true");
    expect(containers[1].getAttribute("aria-hidden")).toBe("false");

    const bullets = screen.getAllByRole("button");
    fireEvent.click(bullets[0]);
    containers = document.querySelectorAll("[aria-hidden]");
    expect(containers[0].getAttribute("aria-hidden")).toBe("false");
  });
});
