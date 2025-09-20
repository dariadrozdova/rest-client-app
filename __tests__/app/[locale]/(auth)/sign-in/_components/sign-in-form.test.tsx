import type React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const DICT = {
  logoAlt: "App logo",
  title: "Sign in to your account",
  emailPlaceholder: "Email",
  passwordPlaceholder: "Password",
  buttonLoading: "Signing in…",
  buttonSubmit: "Sign in",
  genericError: "Something went wrong",
  noAccountQuestion: "Don’t have an account?",
  signUpLink: "Sign up",
} as const;

vi.mock("next-intl", () => ({
  useTranslations: () => (key: keyof typeof DICT) => DICT[key],
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return (
      <img alt={alt ?? ""} src={typeof src === "string" ? src : ""} {...rest} />
    );
  },
}));

const logEventMock = vi.fn();
vi.mock("firebase/analytics", () => ({
  logEvent: (...arguments_: unknown[]) => logEventMock(...arguments_),
}));

vi.mock("@/shared/lib/firebase/firebase", () => ({
  analytics: {},
}));

const signInEmailMock = vi.fn();
const getFreshIdTokenMock = vi.fn();
const serverLoginMock = vi.fn();
vi.mock("@shared/auth/auth", () => ({
  signInEmail: (...arguments_: unknown[]) => signInEmailMock(...arguments_),
  getFreshIdToken: (...arguments_: unknown[]) =>
    getFreshIdTokenMock(...arguments_),
  serverLogin: (...arguments_: unknown[]) => serverLoginMock(...arguments_),
}));

const toErrorMessageMock = vi.fn();
vi.mock("@shared/lib/errors/errors", () => ({
  toErrorMessage: (...arguments_: unknown[]) =>
    toErrorMessageMock(...arguments_),
}));

vi.mock("@shared/lib/i18n/navigation", () => ({
  Link: (
    props: React.PropsWithChildren<{ className?: string; href: string }>,
  ) => (
    <a className={props.className} href={props.href}>
      {props.children}
    </a>
  ),
}));

const doneMock = vi.fn();
vi.mock("@utils/hooks", () => ({
  useAuthRedirect: () => ({ locale: "en", done: doneMock }),
}));

vi.mock("@app/[locale]/(public)/images", () => ({
  logoSmall: "/logo-small.png",
}));

import EmailSignInForm from "@/app/[locale]/(auth)/sign-in/_components/sign-in-form";

const TEXT = {
  title: DICT.title,
  email: DICT.emailPlaceholder,
  password: DICT.passwordPlaceholder,
  submit: DICT.buttonSubmit,
  loading: DICT.buttonLoading,
  genericError: DICT.genericError,
  noAccount: DICT.noAccountQuestion,
  signUp: DICT.signUpLink,
};

const COUNTS = {
  once: 1,
};

const CREDENTIALS = {
  email: "user@example.com",
  password: "secret",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("EmailSignInForm", () => {
  it("renders title, inputs and disabled submit initially", () => {
    render(<EmailSignInForm />);
    expect(
      screen.getByRole("heading", { name: TEXT.title }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TEXT.email)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TEXT.password)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: TEXT.submit })).toBeDisabled();
  });

  it("enables submit when both email and password are filled", async () => {
    const user = userEvent.setup();
    render(<EmailSignInForm />);
    await user.type(screen.getByPlaceholderText(TEXT.email), CREDENTIALS.email);
    expect(screen.getByRole("button", { name: TEXT.submit })).toBeDisabled();
    await user.type(
      screen.getByPlaceholderText(TEXT.password),
      CREDENTIALS.password,
    );
    expect(screen.getByRole("button", { name: TEXT.submit })).toBeEnabled();
  });

  it("submits successfully: calls auth flow, logs analytics and redirects", async () => {
    const user = userEvent.setup();
    const MOCK_CRED = { user: { uid: "u1" } };
    const TOKEN = "id-token";
    signInEmailMock.mockResolvedValueOnce(MOCK_CRED);
    getFreshIdTokenMock.mockResolvedValueOnce(TOKEN);

    render(<EmailSignInForm />);
    await user.type(screen.getByPlaceholderText(TEXT.email), CREDENTIALS.email);
    await user.type(
      screen.getByPlaceholderText(TEXT.password),
      CREDENTIALS.password,
    );
    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    expect(signInEmailMock).toHaveBeenCalledTimes(COUNTS.once);
    expect(signInEmailMock).toHaveBeenLastCalledWith(
      CREDENTIALS.email,
      CREDENTIALS.password,
    );
    expect(getFreshIdTokenMock).toHaveBeenCalledTimes(COUNTS.once);
    expect(serverLoginMock).toHaveBeenCalledTimes(COUNTS.once);
    expect(logEventMock).toHaveBeenCalledWith(expect.any(Object), "login", {
      method: "password",
    });
    expect(doneMock).toHaveBeenCalledTimes(COUNTS.once);
  });

  it("shows error on failure, logs analytics error, and does not redirect", async () => {
    const user = userEvent.setup();
    const ERROR_MESSAGE = "Invalid credentials";
    signInEmailMock.mockRejectedValueOnce(new Error("Auth failed"));
    toErrorMessageMock.mockReturnValueOnce(ERROR_MESSAGE);

    render(<EmailSignInForm />);
    await user.type(screen.getByPlaceholderText(TEXT.email), CREDENTIALS.email);
    await user.type(screen.getByPlaceholderText(TEXT.password), "wrong");
    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    const errorNode = await screen.findByText((content) =>
      content.includes(ERROR_MESSAGE),
    );
    expect(errorNode).toBeInTheDocument();

    expect(logEventMock).toHaveBeenCalledWith(
      expect.any(Object),
      "login_error",
      {
        message: ERROR_MESSAGE,
        method: "password",
      },
    );
    expect(doneMock).not.toHaveBeenCalled();
  });

  it("shows loading label while submitting", async () => {
    const user = userEvent.setup();
    let resolveAuth: (() => void) | undefined;
    const authPromise = new Promise<void>((resolve) => {
      resolveAuth = resolve;
    });
    signInEmailMock.mockReturnValueOnce(authPromise);

    render(<EmailSignInForm />);
    await user.type(screen.getByPlaceholderText(TEXT.email), CREDENTIALS.email);
    await user.type(
      screen.getByPlaceholderText(TEXT.password),
      CREDENTIALS.password,
    );
    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    expect(screen.getByRole("button", { name: TEXT.loading })).toBeDisabled();
    resolveAuth?.();
  });
});
