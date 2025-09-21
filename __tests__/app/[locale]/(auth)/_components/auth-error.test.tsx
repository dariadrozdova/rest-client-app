import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthError } from "@/app/[locale]/(auth)/_components/auth-error";

describe("AuthError", () => {
  it("renders provided message", () => {
    const MESSAGE = "Invalid credentials";
    render(<AuthError message={MESSAGE} />);
    expect(screen.getByText(MESSAGE)).toBeInTheDocument();
  });
});
