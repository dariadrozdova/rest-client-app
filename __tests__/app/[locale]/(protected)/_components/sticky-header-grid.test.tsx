import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const TESTIDS = {
    left: "left-header-group",
    right: "right-header-group",
  } as const;

  const CLASS_EXPECTED = {
    bg: "bg-bg-primary",
    borderColor: "border-border-default",
    sticky: "sticky",
    top: "top-0",
    zIndex: "z-30",
    grid: "grid",
    height: "h-28",
    cols: "grid-cols-[1fr_1px_1fr]",
    rows: "grid-rows-[5rem_2rem]",
    items: "items-start",
    gap: "gap-x-6",
    bottomBorder: "border-b",
  } as const;

  const DIVIDER_CLASS = {
    bg: "bg-border-default",
    colStart: "col-start-2",
    rowSpan: "row-span-2",
    h: "h-full",
    w: "w-px",
  } as const;

  const SELECTOR = {
    divider: '[aria-hidden="true"]',
  } as const;

  return { TESTIDS, CLASS_EXPECTED, DIVIDER_CLASS, SELECTOR };
});

vi.mock("@/app/[locale]/(protected)/_components/left-header-group", () => ({
  LeftHeaderGroup: () => <div data-testid={H.TESTIDS.left} />,
}));

vi.mock("@/app/[locale]/(protected)/_components/right-header-group", () => ({
  RightHeaderGroup: () => <div data-testid={H.TESTIDS.right} />,
}));

vi.mock("@/shared/styles", () => {
  function classNames(...parts: string[]) {
    return parts.filter(Boolean).join(" ");
  }
  return { classNames };
});

import StickyHeaderGrid from "@/app/[locale]/(protected)/_components/sticky-header-grid";

function getContainerDiv(container: HTMLElement): HTMLDivElement {
  const element = container.firstElementChild;
  if (!(element instanceof HTMLDivElement)) {
    throw new TypeError("Top-level element should be a <div>.");
  }
  return element;
}

function getDivider(container: HTMLElement): HTMLDivElement {
  const element = container.querySelector(H.SELECTOR.divider);
  if (!(element instanceof HTMLDivElement)) {
    throw new TypeError("Divider is not a <div> or not found.");
  }
  return element;
}

describe("StickyHeaderGrid", () => {
  beforeEach(() => {
    // I'm not empty
  });

  it("renders a sticky, two-row grid with expected container classes", () => {
    const { container } = render(<StickyHeaderGrid />);
    const root = getContainerDiv(container);

    const classes = root.className;

    expect(classes.includes(H.CLASS_EXPECTED.bg)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.borderColor)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.sticky)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.top)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.zIndex)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.grid)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.height)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.cols)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.rows)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.items)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.gap)).toBe(true);
    expect(classes.includes(H.CLASS_EXPECTED.bottomBorder)).toBe(true);
  });

  it("renders a vertical divider in the middle column spanning two rows", () => {
    const { container } = render(<StickyHeaderGrid />);
    const divider = getDivider(container);

    const classes = divider.className;

    expect(classes.includes(H.DIVIDER_CLASS.bg)).toBe(true);
    expect(classes.includes(H.DIVIDER_CLASS.colStart)).toBe(true);
    expect(classes.includes(H.DIVIDER_CLASS.rowSpan)).toBe(true);
    expect(classes.includes(H.DIVIDER_CLASS.h)).toBe(true);
    expect(classes.includes(H.DIVIDER_CLASS.w)).toBe(true);
  });

  it("renders LeftHeaderGroup and RightHeaderGroup", () => {
    const { getByTestId } = render(<StickyHeaderGrid />);
    expect(getByTestId(H.TESTIDS.left)).toBeInTheDocument();
    expect(getByTestId(H.TESTIDS.right)).toBeInTheDocument();
  });
});
