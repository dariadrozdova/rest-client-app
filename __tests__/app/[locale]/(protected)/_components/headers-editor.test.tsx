import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const NAMESPACE = "header-tab";

  const LABELS = {
    title: "Headers",
    placeholderHeader: "Header name",
    placeholderValue: "Header value",
  } as const;

  const HEADERS = [
    { id: "1", enabled: true, key: "Accept", value: "application/json" },
    { id: "2", enabled: false, key: "", value: "" },
  ] as const;

  const TESTIDS = {
    editor: "key-value-editor",
  } as const;

  return { NAMESPACE, LABELS, HEADERS, TESTIDS };
});

vi.mock("react-redux", () => {
  function useSelector<T>(selector: (state: unknown) => T): T {
    const state = { headers: H.HEADERS };
    return selector(state);
  }
  return { useSelector };
});

vi.mock("next-intl", () => {
  function useTranslations(ns: string) {
    if (ns !== H.NAMESPACE) {
      throw new Error(`Unexpected namespace: ${ns}`);
    }
    return (key: string) => {
      if (key === "title") {
        return H.LABELS.title;
      }
      if (key === "placeholderHeader") {
        return H.LABELS.placeholderHeader;
      }
      if (key === "placeholderValue") {
        return H.LABELS.placeholderValue;
      }
      return key;
    };
  }
  return { useTranslations };
});

vi.mock("@shared/ui/key-value-editor", () => {
  interface HeaderItem {
    enabled: boolean;
    id: string;
    key: string;
    value: string;
  }
  interface KeyValueEditorProps {
    items: readonly HeaderItem[];
    keyPlaceholder: string;
    onEnsureTrailingEmpty: (payload: unknown) => unknown;
    onRemoveRow: (payload: unknown) => unknown;
    onToggleEnabled: (payload: unknown) => unknown;
    onUpdateKey: (payload: unknown) => unknown;
    onUpdateValue: (payload: unknown) => unknown;
    title: string;
    valuePlaceholder: string;
  }

  const lastPropsBox: { current: KeyValueEditorProps | null } = {
    current: null,
  };

  function KeyValueEditor(props: KeyValueEditorProps) {
    lastPropsBox.current = props;
    return <div data-testid={H.TESTIDS.editor} />;
  }

  function __getLastProps() {
    return lastPropsBox.current;
  }

  return { KeyValueEditor, __getLastProps };
});

vi.mock("@/store/slices/header-slice", () => {
  function ensureTrailingEmpty(payload: unknown) {
    return { type: "headers/ensureTrailingEmpty", payload };
  }
  function removeRow(payload: unknown) {
    return { type: "headers/removeRow", payload };
  }
  function toggleEnabled(payload: unknown) {
    return { type: "headers/toggleEnabled", payload };
  }
  function updateKey(payload: unknown) {
    return { type: "headers/updateKey", payload };
  }
  function updateValue(payload: unknown) {
    return { type: "headers/updateValue", payload };
  }

  function selectHeaders(state: { headers: unknown }) {
    return state.headers;
  }

  return {
    ensureTrailingEmpty,
    removeRow,
    toggleEnabled,
    updateKey,
    updateValue,
    selectHeaders,
  };
});

const captureProps = vi.fn();

vi.mock("@shared/ui/key-value-editor", () => {
  function KeyValueEditor(props: KeyValueEditorProps) {
    captureProps(props);
    return <div data-testid={H.TESTIDS.editor} />;
  }
  return { KeyValueEditor };
});
import { KeyValueEditorProps } from "@shared/types";

import { HeadersEditor } from "@/app/[locale]/(protected)/_components/headers-editor";
import {
  ensureTrailingEmpty as ensureTrailingEmptyReference,
  removeRow as removeRowReference,
  toggleEnabled as toggleEnabledReference,
  updateKey as updateKeyReference,
  updateValue as updateValueReference,
} from "@/store/slices/header-slice";

function getEditorProps() {
  const LAST_CALL_INDEX = -1;
  const FIRST_ARG_INDEX = 0;
  const lastCall = captureProps.mock.calls.at(LAST_CALL_INDEX);
  if (!lastCall) {
    throw new Error("Expected at least one call to captureProps");
  }

  const props = lastCall[FIRST_ARG_INDEX];
  if (props === null) {
    throw new Error("KeyValueEditor props were not captured.");
  }
  return props;
}

describe("HeadersEditor", () => {
  beforeEach(() => {
    //I'm not empty
  });

  it("renders KeyValueEditor and wires items from selectHeaders plus translated title/placeholders", () => {
    const { container } = render(<HeadersEditor />);

    const first = container.firstElementChild;
    if (!(first instanceof HTMLElement)) {
      throw new TypeError("Expected a DOM element as root.");
    }

    const props = getEditorProps();

    expect(Array.isArray(props.items)).toBe(true);
    expect(props.items).toEqual(H.HEADERS);

    expect(props.title).toBe(H.LABELS.title);
    expect(props.keyPlaceholder).toBe(H.LABELS.placeholderHeader);
    expect(props.valuePlaceholder).toBe(H.LABELS.placeholderValue);
  });

  it("passes header-slice action creators as callbacks by reference (identity check)", () => {
    render(<HeadersEditor />);
    const props = getEditorProps();

    expect(props.onEnsureTrailingEmpty).toBe(ensureTrailingEmptyReference);
    expect(props.onRemoveRow).toBe(removeRowReference);
    expect(props.onToggleEnabled).toBe(toggleEnabledReference);
    expect(props.onUpdateKey).toBe(updateKeyReference);
    expect(props.onUpdateValue).toBe(updateValueReference);
  });
});
