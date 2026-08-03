import { NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { generateReferralCode } from "./password";
import { checkRateLimit, resetRateLimit, RATE_LIMITS } from "./rate-limit";

/**
 * A real bcrypt hash of an unguessable value, compared against when no
 * account matches so that the failure path costs the same as a wrong
 * password. Cost 12 to match {@link BCRYPT_COST}.
 */
const DUMMY_HASH =
  "$2b$12$.mRB2Rnc4T57peBQ68t8yOPJ9FqNUs/t5GXBPRjvZvq0mEBoMLIzO";

/**
 * NextAuth hands `authorize` a stripped request whose `headers` is a plain
 * object, not a `Headers`, so {@link getClientIp} does not apply directly.
 */
function clientIpFromAuthRequest(req: {
  headers?: Record<string, string> | undefined;
}): string {
  const headers = req?.headers ?? {};
  const vercel = headers["x-vercel-forwarded-for"];
  if (vercel) return vercel.split(",")[0].trim();

  const realIp = headers["x-real-ip"];
  if (realIp) return realIp.trim();

  const forwarded = headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

providers.push(
  CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase();
        const ip = clientIpFromAuthRequest(req);

        // Password login was previously unthrottled, which left credential
        // stuffing and straight brute force open. Count every attempt
        // against both the account and the source: the per-account bucket
        // stops one account being ground down from many IPs, the per-IP
        // bucket stops one host working through a list of accounts.
        const [byAccount, byIp] = await Promise.all([
          checkRateLimit(
            `loginPerAccount:email:${email}`,
            RATE_LIMITS.loginPerAccount
          ),
          checkRateLimit(`login:ip:${ip}`, RATE_LIMITS.login),
        ]);

        if (!byAccount.ok || !byIp.ok) {
          const retryAfter = Math.max(byAccount.retryAfter, byIp.retryAfter);
          throw new Error(
            `Too many login attempts. Please try again in ${Math.ceil(
              retryAfter / 60
            )} minute(s).`
          );
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          // Burn comparable time on a throwaway hash. Returning early here
          // makes "no such account" measurably faster than "wrong
          // password", which is enough to enumerate valid addresses.
          await bcrypt.compare(credentials.password, DUMMY_HASH);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Correct credentials — release the throttle so a user who
        // mistyped a few times isn't left locked out.
        await Promise.all([
          resetRateLimit("loginPerAccount", `email:${email}`),
          resetRateLimit("login", `ip:${ip}`),
        ]);

        if (user.role !== "ADMIN" && !user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    })
);

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
    // Without this NextAuth defaults to a 30-day session that also slides
    // forward on every request, so a stolen token stays usable more or less
    // indefinitely. Cap the absolute lifetime and refresh the rolling window
    // at most once a day.
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const email = user.email;
        if (!email) return false;

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email,
              name: user.name || "User",
              role: "CLIENT",
              emailVerified: true,
              referralCode: generateReferralCode(user.name || "USER"),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      if (account?.provider === "google" || account?.provider === "github") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
