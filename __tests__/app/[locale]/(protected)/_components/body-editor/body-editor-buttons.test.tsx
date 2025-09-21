import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BodyEditorButtons } from "@/app/[locale]/(protected)/_components/body-editor/body-editor-buttons";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      "body-editor.prettifyButton": "Prettify JSON",
      "body-editor.clearContent": "Clear content",
    };
    return map[`body-editor.${key}`] ?? key;
  },
}));

const N = { ZERO: 0, ONE: 1 };

describe("BodyEditorButtons", () => {
  it("disables prettify when JSON controls are hidden and does not call handler", async () => {
    const onPrettifyJson = vi.fn();
    const onClearBody = vi.fn();

    render(
      <BodyEditorButtons
        onClearBody={onClearBody}
        onPrettifyJson={onPrettifyJson}
        showJsonControls={false}
      />,
    );

    const prettify = screen.getByTitle("Prettify JSON");
    expect(prettify).toBeDisabled();

    await userEvent.click(prettify);
    expect(onPrettifyJson).toHaveBeenCalledTimes(N.ZERO);
  });

  it("enables prettify when JSON controls are shown and calls handler once", async () => {
    const onPrettifyJson = vi.fn();
    const onClearBody = vi.fn();

    render(
      <BodyEditorButtons
        onClearBody={onClearBody}
        onPrettifyJson={onPrettifyJson}
        showJsonControls
      />,
    );

    const prettify = screen.getByTitle("Prettify JSON");
    expect(prettify).toBeEnabled();

    await userEvent.click(prettify);
    expect(onPrettifyJson).toHaveBeenCalledTimes(N.ONE);
  });

  it("always allows clearing and calls clear handler once", async () => {
    const onPrettifyJson = vi.fn();
    const onClearBody = vi.fn();

    render(
      <BodyEditorButtons
        onClearBody={onClearBody}
        onPrettifyJson={onPrettifyJson}
        showJsonControls={false}
      />,
    );

    const clearButton = screen.getByTitle("Clear content");
    expect(clearButton).toBeEnabled();

    await userEvent.click(clearButton);
    expect(onClearBody).toHaveBeenCalledTimes(N.ONE);
  });
});
