import { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, ...rest }: ComponentProps<"a">) => (
    <a {...rest}>{children}</a>
  ),
}));

vi.mock("@/shared/styles", () => ({
  classNames: (...cn: string[]) => cn.filter(Boolean).join(" "),
}));

vi.mock("@/shared/globals", () => ({
  FOOTER_SECTIONS: [
    {
      id: "product",
      titleKey: "sections.product.title",
      links: [
        {
          labelKey: "sections.product.links.howItWorks",
          href: "/how-it-works",
          external: false,
        },
        {
          labelKey: "sections.product.links.pricing",
          href: "https://example.com/pricing",
          external: true,
        },
      ],
    },
  ],
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async () => {
    return (key: string, variables?: Record<string, number | string>) => {
      const dict: Record<string, string> = {
        "sections.product.title": "Продукт",
        "sections.product.links.howItWorks": "Как это работает",
        "sections.product.links.pricing": "Цены",
        "legal.copyright": `© ${variables?.year} ${variables?.company}. Все права защищены.`,
        "legal.build": `Сборка v${variables?.version}`,
      };
      return dict[key] ?? key;
    };
  },
}));

import Footer from "@app/[locale]/_components/footer";

describe("Footer", () => {
  test("render section and links (external/internal)", async () => {
    const ui = await Footer();
    render(ui);

    expect(screen.getByText("Продукт")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Как это работает" }),
    ).toHaveAttribute("href", "/how-it-works");
    expect(screen.getByRole("link", { name: "Цены" })).toHaveAttribute(
      "href",
      "https://example.com/pricing",
    );
  });

  test("render legal with year and version", async () => {
    process.env.NEXT_PUBLIC_BUILD = "2.3.4";
    const ui = await Footer();
    render(ui);

    expect(
      screen.getByText(/© \d{4} LoneStarDev\. Все права защищены\./),
    ).toBeInTheDocument();
    expect(screen.getByText("Сборка v2.3.4")).toBeInTheDocument();
  });
});
