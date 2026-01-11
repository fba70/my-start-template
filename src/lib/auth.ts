import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/drizzle"
import { schema } from "@/db/schema"
import { sendEmails } from "@/lib/email"
import { lastLoginMethod, organization, apiKey } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
import { polar, checkout, portal, usage } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { getActiveOrganization } from "@/server/organizations"
import {
  uniqueUsernameGenerator,
  Config,
  adjectives,
  nouns,
} from "unique-username-generator"

const config: Config = {
  dictionaries: [adjectives, nouns],
  separator: "-",
  length: 2,
  style: "lowerCase",
}

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
    schema: schema,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    freshAge: 0, // 5 minutes, 0 to disable freshness checks
    additionalFields: {
      activeOrganizationId: {
        type: "string",
        returned: true,
      },
      activeOrganizationName: {
        type: "string",
        returned: true,
      },
      activeOrganizationLogo: {
        type: "string",
        returned: true,
      },
      activeOrganizationSlug: {
        type: "string",
        returned: true,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // redirectURI: "https://xxx/api/auth/callback/github",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // redirectURI: "https://xxx/api/auth/callback/google",
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const slug = uniqueUsernameGenerator(config)
          await auth.api.createOrganization({
            body: {
              name: "My Organization",
              slug: slug,
              logo: "",
              metadata: {},
              userId: user.id,
            },
          })
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId)
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
              activeOrganizationName: organization?.name,
              activeOrganizationLogo: organization?.logo,
              activeOrganizationSlug: organization?.slug,
            },
          }
        },
      },
    },
  },
  plugins: [
    lastLoginMethod(),
    nextCookies(),
    organization(),
    apiKey(),
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
