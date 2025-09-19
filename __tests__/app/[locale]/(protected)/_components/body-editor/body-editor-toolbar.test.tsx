import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BodyEditorToolbar } from "@/app/[locale]/(protected)/_components/body-editor/body-editor-toolbar";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      "body-editor.contentType": "Content Type",
      "body-editor.prettifyButton": "Prettify JSON",
      "body-editor.clearContent": "Clear content",
    };
    return map[`body-editor.${key}`] ?? key;
  },
}));

const N = { ONE: 1 };

describe("BodyEditorToolbar", () => {
  it("shows content type label and current value; changing it triggers callback", async () => {
    const onChange = vi.fn();
    const onPrettifyJson = vi.fn();
    const onClearBody = vi.fn();

    render(
      <BodyEditorToolbar
        contentType="application/json"
        onClearBody={onClearBody}
        onContentTypeChange={onChange}
        onPrettifyJson={onPrettifyJson}
        showJsonControls
      />,
    );

    expect(screen.getByText("Content Type")).toBeInTheDocument();

    const select = screen.getByDisplayValue("application/json");
    await userEvent.selectOptions(select, "text/plain");
    expect(onChange).toHaveBeenCalledTimes(N.ONE);
    expect(onChange).toHaveBeenCalledWith("text/plain");
  });

  it("passes actions to buttons (prettify & clear)", async () => {
    const onChange = vi.fn();
    const onPrettifyJson = vi.fn();
    const onClearBody = vi.fn();

    render(
      <BodyEditorToolbar
        contentType="application/json"
        onClearBody={onClearBody}
        onContentTypeChange={onChange}
        onPrettifyJson={onPrettifyJson}
        showJsonControls
      />,
    );

    await userEvent.click(screen.getByTitle("Prettify JSON"));
    await userEvent.click(screen.getByTitle("Clear content"));

    expect(onPrettifyJson).toHaveBeenCalledTimes(N.ONE);
    expect(onClearBody).toHaveBeenCalledTimes(N.ONE);
  });
});
