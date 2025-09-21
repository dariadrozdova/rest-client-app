import React, { ComponentProps } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

const pushMock = vi.fn();
vi.mock("@/shared/lib/i18n/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/current",
}));

vi.mock("@/shared/globals", () => ({
  LANGUAGES: [
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
    { code: "be", name: "Беларуская" },
  ],
}));

function mockUseLocale() {
  return "ru";
}

function mockUseTranslations() {
  return (key: string) => (key === "language" ? "Language" : key);
}

vi.mock("next-intl", () => ({
  useLocale: mockUseLocale,
  useTranslations: mockUseTranslations,
}));

function MockDropdown(
  props: ComponentProps<"select"> & {
    ariaLabel: string;
    onSelect: (value: string) => void;
    options: { label: string; value: string }[];
    selectedValue: string;
  },
) {
  return (
    <label aria-label={props.ariaLabel}>
      <select
        data-testid="dropdown"
        onChange={(event) => props.onSelect(event.target.value)}
        value={props.selectedValue}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

vi.mock("@/shared/ui/dropdown", () => ({
  Dropdown: MockDropdown,
}));

import { LanguageSwitch } from "@app/[locale]/_components/language-switch";

describe("LanguageSwitch", () => {
  test("renders current language and all options", () => {
    render(<LanguageSwitch />);

    const select = screen.getByRole<HTMLSelectElement>("combobox");
    expect(screen.getByLabelText("Language")).toBeInTheDocument();
    expect(select.value).toBe("ru");
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  test("changes language using router.push", () => {
    render(<LanguageSwitch />);

    const select = screen.getByRole<HTMLSelectElement>("combobox");
    fireEvent.change(select, { target: { value: "en" } });

    expect(pushMock).toHaveBeenCalledWith("/current", { locale: "en" });
  });
});
