import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const LABELS = { method: "Language" } as const;

  const LANG_GEN = [
    { key: "curl", label: "cURL" },
    { key: "python", label: "Python" },
    { key: "js", label: "JavaScript" },
  ] as const;

  const SELECTED_INDEX = 1;

  const DISPATCH_CALL_INDEX = 0;
  const FIRST_ARG_INDEX = 0;

  const ACTIONS = {
    SET_SELECTED_CODE_LANG: "code-lang/setSelectedCodeLang",
  } as const;

  return {
    LABELS,
    LANG_GEN,
    SELECTED_INDEX,
    DISPATCH_CALL_INDEX,
    FIRST_ARG_INDEX,
    ACTIONS,
  };
});

const mockDispatch = vi.fn();

vi.mock("react-redux", () => {
  function useDispatch() {
    return mockDispatch;
  }
  function useSelector<T>(selector: (s: unknown) => T): T {
    const state = {
      codeLang: { selectedCodeLang: H.LANG_GEN[H.SELECTED_INDEX] },
    };
    return selector(state);
  }
  return { useDispatch, useSelector };
});

vi.mock("next-intl", () => {
  function useTranslations(ns: string) {
    if (ns !== "dropdown") {
      throw new Error(`Unexpected ns: ${ns}`);
    }
    return (key: string) => (key === "method" ? H.LABELS.method : key);
  }
  return { useTranslations };
});

vi.mock("@/shared/globals", () => ({ LANG_GEN: H.LANG_GEN }));

vi.mock("@/shared/styles", () => ({
  classNames: (...p: string[]) => p.filter(Boolean).join(" "),
}));

vi.mock("@store/slices/code-lang-slice", () => {
  const { ACTIONS } = H;
  return {
    setSelectedCodeLang: (payload: unknown) => ({
      type: ACTIONS.SET_SELECTED_CODE_LANG,
      payload,
    }),
  };
});

vi.mock("@/shared/ui/dropdown", () => {
  interface Option<T> {
    key: string;
    label: string;
    value: T;
  }
  interface Props<T> {
    activeOptionClassName?: string;
    ariaLabel: string;
    buttonClassName?: string;
    dropdownClassName?: string;
    onSelect: (v: T) => void;
    optionClassName?: string;
    options: readonly Option<T>[];
    selectedValue: T;
    width?: string;
  }

  function Dropdown<T>(props: Props<T>) {
    const selected = props.options.find((o) => o.value === props.selectedValue);
    const selectedLabel = selected ? selected.label : "";

    return (
      <div aria-label={props.ariaLabel}>
        {props.options.map((o) => (
          <button
            data-testid={`opt-${o.key}`}
            key={o.key}
            onClick={() => props.onSelect(o.value)}
            type="button"
          >
            {o.label}
          </button>
        ))}
        <div data-testid="selected">{selectedLabel}</div>
      </div>
    );
  }

  return { Dropdown };
});

import { CodeLangSwitch } from "@/app/[locale]/(protected)/_components/codegen/code-lang-switch";

describe("CodeLangSwitch", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders all language options with i18n label and shows current selection", () => {
    render(<CodeLangSwitch />);

    const group = screen.getByLabelText(H.LABELS.method);
    expect(group).toBeInTheDocument();

    for (const lg of H.LANG_GEN) {
      expect(screen.getByTestId(`opt-${lg.key}`)).toBeInTheDocument();
    }

    expect(screen.getByTestId("selected").textContent).toBe(
      H.LANG_GEN[H.SELECTED_INDEX].label,
    );
  });

  it("dispatches setSelectedCodeLang when a different language is picked", async () => {
    const user = userEvent.setup();
    render(<CodeLangSwitch />);

    const target = H.LANG_GEN[0];
    await user.click(screen.getByTestId(`opt-${target.key}`));

    const call = mockDispatch.mock.calls[H.DISPATCH_CALL_INDEX];
    const action = call?.[H.FIRST_ARG_INDEX];

    expect(action).toEqual({
      type: H.ACTIONS.SET_SELECTED_CODE_LANG,
      payload: target,
    });
  });
});
