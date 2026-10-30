import { describe, expect, it, jest } from "@jest/globals";

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: {},
    signIn: jest.fn(),
    signOut: jest.fn(),
    auth: {},
  })),
}));

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: "google-provider",
}));

// Load the auth module after mocking to ensure the mock of env variables is applied correctly
const loadAuthModule = () => {
  jest.resetModules();
  return require("@/services/auth/auth");
};

describe("shouldAllowSignin", () => {
  it("allows only Google sign-ins for the configured email", () => {
    process.env.ALLOWED_EMAILS = "alice@example.com,bob@example.com";

    const { shouldAllowSignin } = loadAuthModule();

    expect(shouldAllowSignin("alice@example.com", "google")).toBe(true);
    expect(shouldAllowSignin("bob@example.com", "google")).toBe(true);
    expect(shouldAllowSignin("charlie@example.com", "google")).toBe(false);
    expect(shouldAllowSignin("alice@example.com", "github")).toBe(false);
    expect(shouldAllowSignin(undefined, "google")).toBe(false);
  });
});

describe("shouldAllowRequest", () => {
  it("allows the auth routes without a session", () => {
    process.env.ALLOWED_EMAILS = "test@example.com";

    const { shouldAllowRequest } = loadAuthModule();

    expect(
      shouldAllowRequest({ auth: null, pathname: "/api/auth/signin" }),
    ).toBe(true);
    expect(
      shouldAllowRequest({ auth: null, pathname: "/api/auth/callback/google" }),
    ).toBe(true);
  });

  it("requires an authenticated session for protected pages", () => {
    process.env.ALLOWED_EMAILS = "test@example.com";

    const { shouldAllowRequest } = loadAuthModule();

    expect(
      shouldAllowRequest({
        auth: {
          user: { email: "test@example.com" },
          expires: new Date(Date.now() + 60_000).toISOString(),
        },
        pathname: "/",
      }),
    ).toBe(true);

    expect(shouldAllowRequest({ auth: null, pathname: "/monthlyFees" })).toBe(
      false,
    );
  });
});
