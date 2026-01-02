import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/drizzle"
import { schema } from "@/db/schema"
import { sendEmails } from "@/lib/email"
import { lastLoginMethod } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
import { polar, checkout, portal, usage } from "@polar-sh/better-auth" // webhooks
import { Polar } from "@polar-sh/sdk"

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
})

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    freshAge: 0, // 5 minutes, 0 to disable freshness checks
  },
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
  plugins: [
    lastLoginMethod(),
    nextCookies(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "4411934b-5c8e-482d-b9fc-dd88c5ab625f",
              slug: "Test-credit",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        // webhooks({
        // secret: process.env.POLAR_WEBHOOK_SECRET,
        // onCustomerStateChanged: (payload) => // Triggered when anything regarding a customer changes
        // onOrderPaid: (payload) => // Triggered when an order was paid (purchase, subscription renewal, etc.)
        // onPayload: (payload) => // Catch-all for all events
        // })
      ],
    }),
  ],
})
