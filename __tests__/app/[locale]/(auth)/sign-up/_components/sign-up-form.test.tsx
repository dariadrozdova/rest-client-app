import type React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const DICT_SIGN_UP: Record<string, string> = {
  logoAlt: "App logo",
  title: "Create your account",
  emailPlaceholder: "Email",
  passwordPlaceholder: "Password",
  confirmPlaceholder: "Confirm password",
  buttonLoading: "Creating account…",
  buttonSubmit: "Sign up",
  haveAccountQuestion: "Already have an account?",
  signInLink: "Sign in",
};

const DICT_ERRORS: Record<string, string> = {
  passwordsMustMatch: "Passwords must match",
  weakPassword: "Password is too weak",
  signUpUnknown: "Something went wrong during sign up",
};

vi.mock("next-intl", () => ({
  useTranslations:
    (ns?: string) =>
    (key: string): string => {
      if (ns === "sign-up") {
        return DICT_SIGN_UP[key];
      }
      if (ns === "errors.auth") {
        return DICT_ERRORS[key];
      }
      return key;
    },
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

const signUpEmailMock = vi.fn();
const getFreshIdTokenMock = vi.fn();
const serverLoginMock = vi.fn();
vi.mock("@shared/auth/auth", () => ({
  signUpEmail: (...arguments_: unknown[]) => signUpEmailMock(...arguments_),
  getFreshIdToken: (...arguments_: unknown[]) =>
    getFreshIdTokenMock(...arguments_),
  serverLogin: (...arguments_: unknown[]) => serverLoginMock(...arguments_),
}));

const toErrorMessageMock = vi.fn();
vi.mock("@shared/lib/errors/errors", () => ({
  toErrorMessage: (...arguments_: unknown[]) =>
    toErrorMessageMock(...arguments_),
}));

const isStrongPasswordMock = vi.fn();
vi.mock("@shared/lib/validation/validate-password", () => ({
  isStrongPassword: (...arguments_: unknown[]) =>
    isStrongPasswordMock(...arguments_),
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
vi.mock("@shared/redirect/useAuthRedirect", () => ({
  useAuthRedirect: () => ({ locale: "en", done: doneMock }),
}));

vi.mock("@app/[locale]/(public)/images", () => ({
  logoSmall: "/logo-small.png",
}));

import EmailSignUpForm from "@/app/[locale]/(auth)/sign-up/_components/sign-up-form";

const TEXT = {
  title: DICT_SIGN_UP.title,
  email: DICT_SIGN_UP.emailPlaceholder,
  password: DICT_SIGN_UP.passwordPlaceholder,
  confirm: DICT_SIGN_UP.confirmPlaceholder,
  submit: DICT_SIGN_UP.buttonSubmit,
  loading: DICT_SIGN_UP.buttonLoading,
  haveAccount: DICT_SIGN_UP.haveAccountQuestion,
  signInLink: DICT_SIGN_UP.signInLink,
};

const ERRORS = {
  mismatch: DICT_ERRORS.passwordsMustMatch,
  weak: DICT_ERRORS.weakPassword,
  unknown: DICT_ERRORS.signUpUnknown,
};

const COUNTS = {
  once: 1,
};

const INPUT = {
  email: "user@example.com",
  password: "StrongPassword1!",
  confirmWrong: "StrongPassword2!",
};

beforeEach(() => {
  vi.clearAllMocks();
  isStrongPasswordMock.mockReturnValue(true);
});

describe("EmailSignUpForm", () => {
  it("renders title, inputs and disabled submit initially", () => {
    render(<EmailSignUpForm />);

    expect(
      screen.getByRole("heading", { name: TEXT.title }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TEXT.email)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TEXT.password)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TEXT.confirm)).toBeInTheDocument();

    const submit = screen.getByRole("button", { name: TEXT.submit });
    expect(submit).toBeDisabled();
  });

  it("enables submit when email, password, and confirm are filled", async () => {
    const user = userEvent.setup();
    render(<EmailSignUpForm />);

    await user.type(screen.getByPlaceholderText(TEXT.email), INPUT.email);
    await user.type(screen.getByPlaceholderText(TEXT.password), INPUT.password);
    await user.type(screen.getByPlaceholderText(TEXT.confirm), INPUT.password);

    expect(screen.getByRole("button", { name: TEXT.submit })).toBeEnabled();
  });

  it("shows mismatch error when passwords do not match and does not call signUp", async () => {
    const user = userEvent.setup();
    render(<EmailSignUpForm />);

    await user.type(screen.getByPlaceholderText(TEXT.email), INPUT.email);
    await user.type(screen.getByPlaceholderText(TEXT.password), INPUT.password);
    await user.type(
      screen.getByPlaceholderText(TEXT.confirm),
      INPUT.confirmWrong,
    );

    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    expect(await screen.findByText(ERRORS.mismatch)).toBeInTheDocument();
    expect(signUpEmailMock).not.toHaveBeenCalled();
  });

  it("shows weak-password error and does not call signUp when password is weak", async () => {
    const user = userEvent.setup();
    isStrongPasswordMock.mockReturnValueOnce(false);

    render(<EmailSignUpForm />);

    await user.type(screen.getByPlaceholderText(TEXT.email), INPUT.email);
    await user.type(screen.getByPlaceholderText(TEXT.password), "weak");
    await user.type(screen.getByPlaceholderText(TEXT.confirm), "weak");

    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    expect(await screen.findByText(ERRORS.weak)).toBeInTheDocument();
    expect(signUpEmailMock).not.toHaveBeenCalled();
  });

  it("submits successfully: calls sign-up flow, logs analytics and redirects to /en", async () => {
    const user = userEvent.setup();

    const MOCK_CRED = { user: { uid: "u1" } };
    const TOKEN = "id-token";
    signUpEmailMock.mockResolvedValueOnce(MOCK_CRED);
    getFreshIdTokenMock.mockResolvedValueOnce(TOKEN);

    render(<EmailSignUpForm />);

    await user.type(screen.getByPlaceholderText(TEXT.email), INPUT.email);
    await user.type(screen.getByPlaceholderText(TEXT.password), INPUT.password);
    await user.type(screen.getByPlaceholderText(TEXT.confirm), INPUT.password);

    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    expect(signUpEmailMock).toHaveBeenCalledTimes(COUNTS.once);
    expect(signUpEmailMock).toHaveBeenLastCalledWith(
      INPUT.email,
      INPUT.password,
    );

    expect(getFreshIdTokenMock).toHaveBeenCalledTimes(COUNTS.once);
    expect(getFreshIdTokenMock).toHaveBeenLastCalledWith(MOCK_CRED);

    expect(serverLoginMock).toHaveBeenCalledTimes(COUNTS.once);
    expect(serverLoginMock).toHaveBeenLastCalledWith("en", TOKEN);

    expect(logEventMock).toHaveBeenCalledWith(expect.any(Object), "sign_up", {
      method: "password",
    });

    expect(doneMock).toHaveBeenCalledWith("/en");
    expect(doneMock).toHaveBeenCalledTimes(COUNTS.once);
  });

  it("shows mapped error on failure, logs analytics error, and does not redirect", async () => {
    const user = userEvent.setup();

    const MAPPED = "Email already in use";
    signUpEmailMock.mockRejectedValueOnce(new Error("Auth failed"));
    toErrorMessageMock.mockReturnValueOnce(MAPPED);

    render(<EmailSignUpForm />);

    await user.type(screen.getByPlaceholderText(TEXT.email), INPUT.email);
    await user.type(screen.getByPlaceholderText(TEXT.password), INPUT.password);
    await user.type(screen.getByPlaceholderText(TEXT.confirm), INPUT.password);

    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    expect(await screen.findByText(MAPPED)).toBeInTheDocument();

    expect(logEventMock).toHaveBeenCalledWith(
      expect.any(Object),
      "sign_up_error",
      { message: MAPPED, method: "password" },
    );

    expect(doneMock).not.toHaveBeenCalled();
  });

  it("shows loading label while submitting", async () => {
    const user = userEvent.setup();

    let resolveAuth: (() => void) | undefined;
    const authPromise = new Promise<void>((resolve) => {
      resolveAuth = resolve;
    });
    signUpEmailMock.mockReturnValueOnce(authPromise);

    render(<EmailSignUpForm />);

    await user.type(screen.getByPlaceholderText(TEXT.email), INPUT.email);
    await user.type(screen.getByPlaceholderText(TEXT.password), INPUT.password);
    await user.type(screen.getByPlaceholderText(TEXT.confirm), INPUT.password);

    await user.click(screen.getByRole("button", { name: TEXT.submit }));

    expect(screen.getByRole("button", { name: TEXT.loading })).toBeDisabled();

    resolveAuth?.();
  });
});
