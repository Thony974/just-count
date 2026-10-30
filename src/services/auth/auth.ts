import NextAuth, { type Session } from "next-auth";
import Google from "next-auth/providers/google";

import "dotenv/config";

const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

export function shouldAllowSignin(
  email: string | null | undefined,
  provider: string | undefined,
) {
  return provider === "google" && allowedEmails.includes(email ?? "");
}

export function shouldAllowRequest({
  auth,
  pathname,
}: {
  auth: Session | null;
  pathname: string;
}) {
  if (pathname.startsWith("/api/auth")) {
    return true;
  }

  if (!auth?.user?.email) {
    return false;
  }

  return allowedEmails.includes(auth.user.email);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account }) {
      return shouldAllowSignin(user.email, account?.provider);
    },
    authorized: async ({ auth, request }) =>
      shouldAllowRequest({
        auth,
        pathname: request.nextUrl.pathname,
      }),
  },
});
