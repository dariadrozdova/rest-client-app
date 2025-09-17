import type { ComponentProps } from "react";
import React from "react";

import { render, screen } from "@testing-library/react";

vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img">) => React.createElement("img", props),
}));
vi.mock("@shared/styles", () => ({
  classNames: (...cn: string[]) => cn.filter(Boolean).join(" "),
}));

// SUT
import { ClientLogo } from "@app/[locale]/(public)/components/client-logo";

describe("ClientLogo", () => {
  test("renders wrapper with non-vertical size and passes img props", () => {
    render(<ClientLogo alt="Brand" className="extra" src="/logo.png" />);
    const img = screen.getByRole("img", { name: "Brand" });
    expect(img).toHaveAttribute("src", "/logo.png");
    expect(img).toHaveClass("object-contain");
    // wrapper has non-vertical height class
    expect(img.parentElement?.className).toMatch(/h-\[72px\]/);
    expect(img.parentElement?.className).toMatch(/extra/);
  });

  test("vertical mode applies tall wrapper classes", () => {
    render(<ClientLogo alt="Tall" src="/logo2.png" vertical />);
    const wrapper = screen.getByRole("img", { name: "Tall" }).parentElement!;
    expect(wrapper.className).toMatch(/h-\[184px\]/);
    expect(wrapper.className).toMatch(/w-\[120px\]/);
  });
});
