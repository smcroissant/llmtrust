import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "./db/schema";
import {
  sendWelcomeEmail,
  sendPasswordReset,
  sendEmailVerification,
} from "@/lib/email";

let _auth: any = null;

/**
 * Lazy auth initialization — only creates the Better Auth instance
 * when first accessed. Prevents DATABASE_URL crashes during CI builds.
 */
export function getAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: drizzleAdapter(getDb(), {
        provider: "pg",
        schema: {
          user: schema.user,
          session: schema.session,
          account: schema.account,
          verification: schema.verification,
        },
      }),
      emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
          await sendPasswordReset({
            email: user.email,
            name: user.name ?? "",
            resetUrl: url,
          });
        },
      },
      emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
          await sendEmailVerification({
            email: user.email,
            name: user.name ?? "",
            verificationUrl: url,
          });
        },
      },
      // Welcome email on user creation
      databaseHooks: {
        user: {
          create: {
            after: async (user) => {
              // Fire-and-forget welcome email
              sendWelcomeEmail({
                email: user.email,
                name: user.name ?? "",
              }).catch((err: unknown) => {
                console.error("[auth] Failed to send welcome email:", err);
              });
            },
          },
        },
      },
      // Session configuration
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Refresh every 24h
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5, // Cache cookie validation for 5 min
        },
      },
      // CSRF protection (enabled by default in Better Auth)
      // Cookie security
      advanced: {
        cookiePrefix: "llmtrust",
        crossSubDomainCookies: {
          enabled: false,
        },
        defaultCookieAttributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        },
        // Use secure headers
        useSecureCookies: process.env.NODE_ENV === "production",
      },
      secret: process.env.BETTER_AUTH_SECRET!,
      baseURL: process.env.BETTER_AUTH_URL!,
    });
  }
  return _auth;
}

/** @deprecated Use getAuth() instead — kept for backward compatibility */
export const auth = new Proxy({} as any, {
  get(_target, prop, receiver) {
    const actual = getAuth();
    return Reflect.get(actual, prop, receiver);
  },
});

/**
 * Password strength validation for client-side feedback.
 * Better Auth enforces minLength server-side; this adds complexity rules
 * for the registration form.
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return { valid: errors.length === 0, errors };
}
