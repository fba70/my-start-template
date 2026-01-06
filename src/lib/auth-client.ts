import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { polarClient } from "@polar-sh/better-auth"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const authClient = createAuthClient({
  baseURL: baseUrl,
  plugins: [polarClient(), organizationClient()],
})
