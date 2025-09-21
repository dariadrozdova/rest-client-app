import React, { ComponentProps, createElement } from "react";

import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", () => {
  const motion = {
    div: (
      props: ComponentProps<"div"> & { animate?: unknown; initial?: unknown },
    ) => createElement("div", props),
  };
  const AnimatePresence = ({ children }: { children?: React.ReactNode }) =>
    createElement(React.Fragment, null, children);
  return { motion, AnimatePresence };
});

vi.mock("@app/[locale]/(public)/components/three-d-layer", () => ({
  default: ({ src, layerIndex }: { layerIndex: number; src: string }) =>
    createElement("div", {
      "data-testid": "layer",
      "data-src": src,
      "data-index": String(layerIndex),
    }),
}));

import { ThreeDScene } from "@app/[locale]/(public)/components/three-d-scene";

describe("ThreeDScene", () => {
  test("renders layers", () => {
    const layers = ["/a.png", "/b.png", "/c.png"];
    render(<ThreeDScene height={500} layers={layers} width="600px" />);
    const rendered = screen.getAllByTestId("layer");
    expect(rendered).toHaveLength(layers.length);
  });
});
