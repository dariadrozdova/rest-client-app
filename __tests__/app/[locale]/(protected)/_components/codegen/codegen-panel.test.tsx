import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const LABELS = {
    copy: "Copy",
    hints: "Paste here to see generated code…",
    unable: "Unable to generate:",
    missingUrl: "Missing URL",
  } as const;

  const TABS = { codegen: "codegen", headers: "headers" } as const;

  interface Lang {
    key: string;
    label: string;
  }
  const SELECTED_LANG: Lang = { key: "python", label: "Python" };

  type IssueType = "missingUrl" | "other";
  interface ResolvedOut {
    canGenerate: boolean;
    issues: { type: IssueType }[];
    resolved: null | unknown;
  }

  const RESOLVED_OK: ResolvedOut = {
    canGenerate: true,
    issues: [],
    resolved: { some: "request" },
  };

  const RESOLVED_CANNOT: ResolvedOut = {
    canGenerate: false,
    issues: [{ type: "missingUrl" }],
    resolved: null,
  };

  interface StoreShape {
    codeLang: { selectedCodeLang: Lang };
    tabs: { activeTab: string };
  }
  const STORE: StoreShape = {
    tabs: { activeTab: TABS.headers },
    codeLang: { selectedCodeLang: SELECTED_LANG },
  };

  const RESOLVED_BOX: { current: ResolvedOut } = { current: RESOLVED_OK };

  const FIRST = 0;
  const SECOND = 1;
  const ONE = 1;
  const LAST = -1;

  function setTab(k: string) {
    STORE.tabs.activeTab = k;
  }
  function setLang(lang: Lang) {
    STORE.codeLang.selectedCodeLang = lang;
  }
  function setResolved(o: ResolvedOut) {
    RESOLVED_BOX.current = o;
  }

  return {
    LABELS,
    TABS,
    SELECTED_LANG,
    RESOLVED_OK,
    RESOLVED_CANNOT,
    STORE,
    RESOLVED_BOX,
    FIRST,
    SECOND,
    ONE,
    LAST,
    setTab,
    setLang,
    setResolved,
  };
});

interface CopyProps {
  text: string;
}
interface JsonViewerProps {
  className?: string;
  content: string;
  mode?: "json" | "text";
  readOnly?: boolean;
  showLineNumbers?: boolean;
}

const capturedCopyProps: CopyProps[] = [];
const capturedJsonViewerProps: JsonViewerProps[] = [];

const captureSwitch = vi.fn(() => {
  //I'm not empty
});
const requestToGenerateCodeSpy = vi.fn((..._arguments: unknown[]) => {
  //I'm not empty
});

vi.mock("react-redux", () => {
  function useSelector<T>(selector: (s: unknown) => T): T {
    return selector(H.STORE);
  }
  return { useSelector };
});

vi.mock("next-intl", () => {
  const { LABELS } = H;
  function useTranslations(ns: string) {
    if (ns !== "code-gen") {
      throw new Error(`Unexpected ns: ${ns}`);
    }
    return (key: string) => {
      if (key === "copy") {
        return LABELS.copy;
      }
      if (key === "hints") {
        return LABELS.hints;
      }
      if (key === "codeGenErrors.unable") {
        return LABELS.unable;
      }
      if (key === "codeGenErrors.missingUrl") {
        return LABELS.missingUrl;
      }
      return key;
    };
  }
  return { useTranslations };
});

vi.mock("@/shared/globals", () => ({
  ISSUE_I18N_KEY: { missingUrl: "missingUrl", other: "other" },
}));

vi.mock("@/utils/helpers", () => ({
  requestToGenerateCode: (...arguments_: unknown[]) =>
    requestToGenerateCodeSpy(...arguments_),
}));

vi.mock("@/utils/helpers/resolve-request", () => {
  function selectResolvedRequest() {
    return H.RESOLVED_BOX.current;
  }
  return { selectResolvedRequest };
});

vi.mock("@/shared/ui/json-viewer", () => {
  function JsonViewer(props: JsonViewerProps) {
    capturedJsonViewerProps.push(props);
    return <div data-testid="json-viewer" />;
  }
  return { JsonViewer };
});

vi.mock(
  "@/app/[locale]/(protected)/_components/codegen/code-lang-switch",
  () => ({
    CodeLangSwitch: () => {
      captureSwitch();
      return <div data-testid="code-lang-switch" />;
    },
  }),
);

vi.mock("@/app/[locale]/(protected)/_components/codegen/copy-button", () => ({
  CopyButton: (props: CopyProps) => {
    capturedCopyProps.push(props);
    return <div data-testid="copy-button" />;
  },
}));

import { CodegenPanel } from "@/app/[locale]/(protected)/_components/codegen/codegen-panel";

function last<T>(array: readonly T[]): T {
  const item = array.at(H.LAST);
  if (item === undefined) {
    throw new Error("Expected at least one item");
  }
  return item;
}

describe("CodegenPanel", () => {
  beforeEach(() => {
    captureSwitch.mockClear();
    requestToGenerateCodeSpy.mockReset();
    capturedCopyProps.length = 0;
    capturedJsonViewerProps.length = 0;

    H.setTab(H.TABS.headers);
    H.setResolved(H.RESOLVED_OK);
    H.setLang(H.SELECTED_LANG);
  });

  it("returns null when codegen tab is not active", () => {
    const { container } = render(<CodegenPanel />);
    expect(container.firstChild).toBeNull();
  });

  it("when open & canGenerate=false: shows errors and CopyButton gets empty text; JsonViewer shows hints", () => {
    H.setTab(H.TABS.codegen);
    H.setResolved(H.RESOLVED_CANNOT);

    render(<CodegenPanel />);

    expect(
      screen.getByText(`${H.LABELS.unable} ${H.LABELS.missingUrl}`),
    ).toBeInTheDocument();

    const copyLatest = last(capturedCopyProps);
    expect(copyLatest.text).toBe("");

    const jsonLatest = last(capturedJsonViewerProps);
    expect(jsonLatest.content).toBe(H.LABELS.hints);
  });

  it("when open & canGenerate=true: generates code and passes it to CopyButton & JsonViewer", async () => {
    H.setTab(H.TABS.codegen);
    H.setResolved(H.RESOLVED_OK);

    requestToGenerateCodeSpy.mockImplementation(() => "print('ok')");

    render(<CodegenPanel />);

    expect(requestToGenerateCodeSpy).toHaveBeenCalledTimes(H.ONE);
    const firstCall = requestToGenerateCodeSpy.mock.calls[H.FIRST];
    const requestArgument = firstCall?.[H.FIRST];
    const langArgument = firstCall?.[H.SECOND];
    expect(langArgument).toEqual(H.SELECTED_LANG);
    expect(requestArgument).toEqual(H.RESOLVED_OK.resolved);

    await waitFor(() => {
      const copyLatest = last(capturedCopyProps);
      expect(copyLatest.text).toBe("print('ok')");
      const jsonLatest = last(capturedJsonViewerProps);
      expect(jsonLatest.content).toBe("print('ok')");
    });
  });

  it("handles generator errors by showing the error message as snippet", async () => {
    H.setTab(H.TABS.codegen);
    H.setResolved(H.RESOLVED_OK);

    requestToGenerateCodeSpy.mockImplementation(() => {
      throw new Error("boom");
    });

    render(<CodegenPanel />);

    await waitFor(() => {
      const copyLatest = last(capturedCopyProps);
      expect(copyLatest.text).toBe("boom");
      const jsonLatest = last(capturedJsonViewerProps);
      expect(jsonLatest.content).toBe("boom");
    });
  });
});
