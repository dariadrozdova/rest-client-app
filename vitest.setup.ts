import "@testing-library/jest-dom/vitest";

import { ComponentProps, createElement } from "react";

import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img">) => {
    const { alt = "", ...rest } = props;
    return createElement("img", { alt, ...rest });
  },
}));

vi.mock("@/shared/lib/firebase/firebase", () => ({
  auth: {},
  googleProvider: {},
  database: {},
  analytics: null,
  app: {},
}));

vi.mock("@firebase/auth", async () => {
  return {
    signOut: vi.fn().mockImplementation(() => Promise.resolve()),
  };
});
