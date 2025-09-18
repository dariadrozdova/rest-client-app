import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  LABEL_METHOD,
  ATTR_CURRENT_METHOD,
  METHODS,
  INITIAL_SELECTED,
  VALID_NEW_METHOD,
  INVALID_METHOD,
  ACTION_TYPE_SET,
} = vi.hoisted(() => ({
  LABEL_METHOD: "Method",
  ATTR_CURRENT_METHOD: "data-current-method",
  METHODS: ["GET", "POST", "PUT"] as const,
  INITIAL_SELECTED: "POST",
  VALID_NEW_METHOD: "GET",
  INVALID_METHOD: "DELETE",
  ACTION_TYPE_SET: "method/setSelectedMethod",
}));

function getSelectByLabel(label: string): HTMLSelectElement {
  const element = screen.getByLabelText(label);
  if (!(element instanceof HTMLSelectElement)) {
    throw new TypeError(`Element for label "${label}" is not a select`);
  }
  return element;
}

const mockDispatch = vi.fn();

vi.mock("react-redux", () => {
  function useSelector<T>(selector: (state: unknown) => T): T {
    return selector({ method: { selectedMethod: INITIAL_SELECTED } });
  }
  function useDispatch() {
    return mockDispatch;
  }
  return { useDispatch, useSelector };
});

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    key === "method" ? LABEL_METHOD : key,
}));

vi.mock("@/shared/globals", () => ({
  HTTP_METHODS: METHODS,
}));

vi.mock("@store/slices/method-slice", () => ({
  setSelectedMethod: (payload: string) => ({
    type: ACTION_TYPE_SET,
    payload,
  }),
}));

vi.mock("@/shared/ui/dropdown", () => {
  interface Option {
    label: string;
    value: string;
  }
  interface DropdownProps {
    ariaLabel: string;
    buttonClassName?: string;
    dropdownClassName?: string;
    onSelect: (value: string) => void;
    options: Option[];
    selectedValue: string;
    width?: string;
  }

  function Dropdown({
    ariaLabel,
    options,
    selectedValue,
    onSelect,
  }: DropdownProps) {
    return (
      <label>
        <span className="sr-only">{ariaLabel}</span>
        <select
          aria-label={ariaLabel}
          onChange={(event) => onSelect(event.currentTarget.value)}
          value={selectedValue}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return { Dropdown };
});

import { MethodSwitch } from "@/app/[locale]/(protected)/_components/method-switch";

describe("MethodSwitch", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders select with the i18n label and initial selected method", () => {
    render(<MethodSwitch />);

    const select = getSelectByLabel(LABEL_METHOD);
    expect(select).toBeInTheDocument();
    expect(select.value).toBe(INITIAL_SELECTED);

    const wrapper = select.closest("div");
    expect(wrapper?.getAttribute(ATTR_CURRENT_METHOD)).toBe(INITIAL_SELECTED);
  });

  it("renders one option per HTTP method from globals with matching labels", () => {
    render(<MethodSwitch />);

    const select = getSelectByLabel(LABEL_METHOD);
    const options = [...select.querySelectorAll("option")];

    expect(options).toHaveLength(METHODS.length);
    expect(options.map((o) => o.value)).toEqual(METHODS);
    expect(options.map((o) => o.textContent)).toEqual(METHODS);
  });

  it("dispatches setSelectedMethod when a valid method is selected", async () => {
    const user = userEvent.setup();
    render(<MethodSwitch />);

    await user.selectOptions(getSelectByLabel(LABEL_METHOD), [
      VALID_NEW_METHOD,
    ]);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: ACTION_TYPE_SET,
      payload: VALID_NEW_METHOD,
    });
  });

  it("does not dispatch when an invalid method is selected", async () => {
    const user = userEvent.setup();
    render(<MethodSwitch />);

    const select = getSelectByLabel(LABEL_METHOD);

    const phantom = document.createElement("option");
    phantom.value = INVALID_METHOD;
    select.append(phantom);

    await user.selectOptions(select, [INVALID_METHOD]);

    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  it("keeps the wrapper's data-current-method attribute present after change", async () => {
    const user = userEvent.setup();
    render(<MethodSwitch />);

    const select = getSelectByLabel(LABEL_METHOD);
    const wrapper = select.closest("div");

    expect(wrapper?.getAttribute(ATTR_CURRENT_METHOD)).toBe(INITIAL_SELECTED);

    await user.selectOptions(select, [VALID_NEW_METHOD]);

    expect(wrapper?.hasAttribute(ATTR_CURRENT_METHOD)).toBe(true);
  });
});
