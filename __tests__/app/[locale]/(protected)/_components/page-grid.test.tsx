import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const TESTIDS = {
    leftPane: "left-pane",
    response: "response-panel",
  } as const;

  const CONTAINER_CLASSES = {
    grid: "grid",
    cols: "grid-cols-[1fr_1px_1fr]",
    gap: "gap-x-6",
  } as const;

  const DIVIDER_CLASSES = {
    bg: "bg-border-default",
    colStart: "col-start-2",
    rowSpan: "row-span-2",
    h: "h-full",
    wpx: "w-px",
  } as const;

  const DIVIDER_SELECTOR = '[aria-hidden="true"]' as const;

  return { TESTIDS, CONTAINER_CLASSES, DIVIDER_CLASSES, DIVIDER_SELECTOR };
});

vi.mock("@app/[locale]/(protected)/_components/left-pane", () => ({
  LeftPane: () => <div data-testid={H.TESTIDS.leftPane} />,
}));

vi.mock("@app/[locale]/(protected)/_components/response-panel", () => ({
  ResponsePanel: () => <div data-testid={H.TESTIDS.response} />,
}));

import { PageGrid } from "@/app/[locale]/(protected)/_components/page-grid";

function getDivider(container: HTMLElement): HTMLDivElement {
  const element = container.querySelector(H.DIVIDER_SELECTOR);
  if (!(element instanceof HTMLDivElement)) {
    throw new TypeError("Divider is not a div or not found.");
  }
  return element;
}
function getRoot(container: HTMLElement): HTMLDivElement {
  const element = container.firstElementChild;
  if (!(element instanceof HTMLDivElement)) {
    throw new TypeError("Root element is not a div.");
  }
  return element;
}

describe("PageGrid", () => {
  beforeEach(() => {
    //for function not to be empty
  });

  it("renders a grid container with expected classes", () => {
    const { container } = render(<PageGrid />);
    const root = getRoot(container);
    const classes = root.className.split(" ");

    expect(classes).toContain(H.CONTAINER_CLASSES.grid);
    expect(classes).toContain(H.CONTAINER_CLASSES.cols);
    expect(classes).toContain(H.CONTAINER_CLASSES.gap);
  });

  it("renders the vertical divider in the middle column spanning two rows", () => {
    const { container } = render(<PageGrid />);
    const divider = getDivider(container);
    const classes = divider.className.split(" ");

    expect(classes).toContain(H.DIVIDER_CLASSES.bg);
    expect(classes).toContain(H.DIVIDER_CLASSES.colStart);
    expect(classes).toContain(H.DIVIDER_CLASSES.rowSpan);
    expect(classes).toContain(H.DIVIDER_CLASSES.h);
    expect(classes).toContain(H.DIVIDER_CLASSES.wpx);
  });

  it("renders LeftPane and ResponsePanel", () => {
    render(<PageGrid />);
    expect(screen.getByTestId(H.TESTIDS.leftPane)).toBeInTheDocument();
    expect(screen.getByTestId(H.TESTIDS.response)).toBeInTheDocument();
  });
});
