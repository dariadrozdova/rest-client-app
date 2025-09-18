import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const NAMESPACE = "variables-editor";

  const LABELS = {
    title: "Variables",
    placeholderName: "Variable name",
    placeholderValue: "Variable value",
  } as const;

  const TESTIDS = {
    editor: "key-value-editor",
  } as const;

  const ACTIONS = {
    ENSURE_TRAILING_EMPTY: "variables/ensureTrailingEmpty",
    REMOVE_ROW: "variables/removeRow",
    TOGGLE_ENABLED: "variables/toggleEnabled",
    UPDATE_KEY: "variables/updateKey",
    UPDATE_VALUE: "variables/updateValue",
    SET_VARIABLES: "variables/setVariables",
  } as const;

  const STORED_NON_EMPTY = [
    { id: "s1", enabled: true, key: "TOKEN", value: "abc" },
  ] as const;

  const VARS_FOR_PERSIST = [
    { id: "v1", enabled: true, key: "USER", value: "alice" }, // valid
    { id: "v2", enabled: false, key: "DISABLED", value: "x" }, // not valid
    { id: "v3", enabled: true, key: "  ", value: "trimmed-out" }, // not valid (blank key)
    { id: "v4", enabled: true, key: "CITY", value: "   " }, // not valid (blank value)
  ] as const;

  interface Variable {
    enabled: boolean;
    id: string;
    key: string;
    value: string;
  }
  interface RootLike {
    variables: readonly Variable[];
  }
  const STATE: { value: RootLike } = {
    value: { variables: [] },
  };

  const LAST_CALL_INDEX = -1;
  const FIRST_ARG_INDEX = 0;
  const FIRST_CALL_INDEX = 0;
  const SECOND_CALL_INDEX = 1;

  return {
    NAMESPACE,
    LABELS,
    TESTIDS,
    ACTIONS,
    STORED_NON_EMPTY,
    VARS_FOR_PERSIST,
    STATE,
    LAST_CALL_INDEX,
    FIRST_ARG_INDEX,
    FIRST_CALL_INDEX,
    SECOND_CALL_INDEX,
  };
});

const mockDispatch = vi.fn();
const setStoredSpy = vi.fn();
const captureEditorProps = vi.fn();

const UNSET = Symbol("unset");
let fixtureStored: unknown = UNSET;
function setStoredFixture(v: unknown): void {
  fixtureStored = v;
}

vi.mock("react-redux", () => {
  function useDispatch() {
    return mockDispatch;
  }
  function useSelector<T>(selector: (state: unknown) => T): T {
    return selector({ variables: H.STATE.value.variables });
  }
  return { useDispatch, useSelector };
});

vi.mock("next-intl", () => {
  function useTranslations(ns: string) {
    if (ns !== H.NAMESPACE) {
      throw new Error(`Unexpected ns: ${ns}`);
    }
    return (key: string) => {
      if (key === "title") {
        return H.LABELS.title;
      }
      if (key === "placeholderName") {
        return H.LABELS.placeholderName;
      }
      if (key === "placeholderValue") {
        return H.LABELS.placeholderValue;
      }
      return key;
    };
  }
  return { useTranslations };
});

vi.mock("@utils/hooks", () => {
  function isSameType<T>(_sample: T, _x: unknown): _x is T {
    return true;
  }

  function useLocalStorage<T>(
    _key: string,
    initial: T,
  ): [T, (next: T) => void] {
    let value: T = initial;
    if (fixtureStored !== UNSET && isSameType(initial, fixtureStored)) {
      value = fixtureStored;
    }
    return [value, (next: T) => setStoredSpy(next)];
  }

  return { useLocalStorage };
});

vi.mock("@shared/ui/key-value-editor", () => {
  interface VariableItem {
    enabled: boolean;
    id: string;
    key: string;
    value: string;
  }
  interface KeyValueEditorProps {
    items: readonly VariableItem[];
    keyPlaceholder: string;
    onEnsureTrailingEmpty: (payload?: unknown) => unknown;
    onRemoveRow: (payload?: unknown) => unknown;
    onToggleEnabled: (payload?: unknown) => unknown;
    onUpdateKey: (payload?: unknown) => unknown;
    onUpdateValue: (payload?: unknown) => unknown;
    title: string;
    valuePlaceholder: string;
  }
  function KeyValueEditor(props: KeyValueEditorProps) {
    captureEditorProps(props);
    return <div data-testid={H.TESTIDS.editor} />;
  }
  return { KeyValueEditor };
});

vi.mock("@/store/slices/variables-slice", () => {
  const { ACTIONS } = H;
  function ensureTrailingEmpty(payload?: unknown) {
    return { type: ACTIONS.ENSURE_TRAILING_EMPTY, payload };
  }
  function removeRow(payload?: unknown) {
    return { type: ACTIONS.REMOVE_ROW, payload };
  }
  function toggleEnabled(payload?: unknown) {
    return { type: ACTIONS.TOGGLE_ENABLED, payload };
  }
  function updateKey(payload?: unknown) {
    return { type: ACTIONS.UPDATE_KEY, payload };
  }
  function updateValue(payload?: unknown) {
    return { type: ACTIONS.UPDATE_VALUE, payload };
  }
  function setVariables(payload?: unknown) {
    return { type: ACTIONS.SET_VARIABLES, payload };
  }
  function selectVariables(state: { variables: unknown }) {
    return state.variables;
  }
  return {
    ensureTrailingEmpty,
    removeRow,
    toggleEnabled,
    updateKey,
    updateValue,
    setVariables,
    selectVariables,
  };
});

import { VariablesEditor } from "@/app/[locale]/(protected)/_components/variables-editor";
import {
  ensureTrailingEmpty as ensureTrailingEmptyReference,
  removeRow as removeRowReference,
  toggleEnabled as toggleEnabledReference,
  updateKey as updateKeyReference,
  updateValue as updateValueReference,
} from "@/store/slices/variables-slice";

function getLastCall<T extends unknown[]>(calls: T[]): T {
  const call = calls.at(H.LAST_CALL_INDEX);
  if (!call) {
    throw new Error("Expected at least one call");
  }
  return call;
}

describe("VariablesEditor", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    setStoredSpy.mockClear();
    captureEditorProps.mockClear();

    setStoredFixture([]);
    H.STATE.value = { variables: [] };
  });

  it("renders KeyValueEditor with items and i18n labels; passes action callbacks by reference", () => {
    H.STATE.value = {
      variables: [
        { id: "1", enabled: true, key: "A", value: "1" },
        { id: "2", enabled: false, key: "", value: "" },
      ],
    };

    render(<VariablesEditor />);

    const last = getLastCall(captureEditorProps.mock.calls);
    const props = last[H.FIRST_ARG_INDEX];

    expect(Array.isArray(props.items)).toBe(true);
    expect(props.items).toEqual(H.STATE.value.variables);

    expect(props.title).toBe(H.LABELS.title);
    expect(props.keyPlaceholder).toBe(H.LABELS.placeholderName);
    expect(props.valuePlaceholder).toBe(H.LABELS.placeholderValue);

    expect(props.onEnsureTrailingEmpty).toBe(ensureTrailingEmptyReference);
    expect(props.onRemoveRow).toBe(removeRowReference);
    expect(props.onToggleEnabled).toBe(toggleEnabledReference);
    expect(props.onUpdateKey).toBe(updateKeyReference);
    expect(props.onUpdateValue).toBe(updateValueReference);
  });

  it("on mount with empty local storage: dispatches ensureTrailingEmpty (but not setVariables)", () => {
    render(<VariablesEditor />);

    const calls = mockDispatch.mock.calls;

    const first = calls[H.FIRST_CALL_INDEX];
    const firstAction = first?.[H.FIRST_ARG_INDEX];
    expect(firstAction?.type).toBe(H.ACTIONS.ENSURE_TRAILING_EMPTY);

    const hasSetVariables = calls.some(
      (c) => c[H.FIRST_ARG_INDEX]?.type === H.ACTIONS.SET_VARIABLES,
    );
    expect(hasSetVariables).toBe(false);
  });

  it("on mount with non-empty local storage: dispatches setVariables(stored) then ensureTrailingEmpty", () => {
    setStoredFixture(H.STORED_NON_EMPTY.map((v) => ({ ...v })));
    render(<VariablesEditor />);

    const calls = mockDispatch.mock.calls;
    const first = calls[H.FIRST_CALL_INDEX]?.[H.FIRST_ARG_INDEX];
    const second = calls[H.SECOND_CALL_INDEX]?.[H.FIRST_ARG_INDEX];

    expect(first?.type).toBe(H.ACTIONS.SET_VARIABLES);
    expect(first?.payload).toEqual(H.STORED_NON_EMPTY);

    expect(second?.type).toBe(H.ACTIONS.ENSURE_TRAILING_EMPTY);
  });

  it("persists only valid enabled variables (trimmed key/value) to local storage", () => {
    H.STATE.value = { variables: H.VARS_FOR_PERSIST.map((v) => ({ ...v })) };

    render(<VariablesEditor />);

    const expected = H.VARS_FOR_PERSIST.filter(
      (v) => v.enabled && v.key.trim() && v.value.trim(),
    );

    const last = getLastCall(setStoredSpy.mock.calls);
    const persisted = last[H.FIRST_ARG_INDEX];

    expect(persisted).toEqual(expected);
  });

  it("passes ensureTrailingEmpty action reference down to KeyValueEditor (not a wrapper)", () => {
    render(<VariablesEditor />);

    const last = getLastCall(captureEditorProps.mock.calls);
    const props = last[H.FIRST_ARG_INDEX];

    expect(props.onEnsureTrailingEmpty).toBe(ensureTrailingEmptyReference);

    expect(typeof ensureTrailingEmptyReference).toBe("function");
  });
});
