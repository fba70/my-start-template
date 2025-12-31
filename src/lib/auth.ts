import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/drizzle"
import { schema } from "@/db/schema"
import { sendEmails } from "./email"
import { lastLoginMethod } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // redirectURI: "https://crm-mvp-2025.vercel.app/api/auth/callback/github",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // redirectURI: "https://crm-mvp-2025.vercel.app/api/auth/callback/google",
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmails({
        to: user.email,
        subject: "Reset your password",
        body: `Click this link to reset your password: ${url}`,
      })
    },
    // requireEmailVerification: true, // if user can access the app without email verified
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmails({
        to: user.email,
        subject: "Verify your email address",
        body: `Click this link to verify your email: ${url}`,
      })
    },
  },
  plugins: [lastLoginMethod(), nextCookies()],
})
