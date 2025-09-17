import React, { ComponentProps, createElement } from "react";

import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", () => {
  return {
    motion: {
      img: (
        props: ComponentProps<"img"> & {
          animate?: unknown;
          exit?: unknown;
          initial?: unknown;
          transition?: unknown;
        },
      ) => createElement("img", props),
      div: (
        props: ComponentProps<"div"> & {
          animate?: unknown;
          initial?: unknown;
        },
      ) => createElement("div", props),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      createElement(React.Fragment, null, children),
  };
});

import ThreeDLayer from "@app/[locale]/(public)/components/three-d-layer";

describe("ThreeDLayer", () => {
  const TOTAL_LAYERS = 3;
  const LAYER_INDEX = 2;
  const SRC = "/layer.png";
  const Z = 100.4;

  test("renders img with correct alt/src, draggable=false and rounded zIndex", () => {
    render(
      <ThreeDLayer
        layerIndex={LAYER_INDEX}
        scaleTarget={1}
        src={SRC}
        totalLayers={TOTAL_LAYERS}
        x={0}
        y={0}
        z={Z}
      />,
    );

    const img = screen.getByRole("img", { name: `layer-${LAYER_INDEX}` });
    expect(img).toHaveAttribute("src", SRC);
    expect(img).toHaveAttribute("draggable", "false");
    expect(img.style.zIndex).toBe(String(Math.round(Z)));
  });
});
