# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start Next.js dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `npx drizzle-kit push` — push schema changes to database
- `npx drizzle-kit generate` — generate migration files
- `npx drizzle-kit migrate` — run migrations

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **better-auth** for authentication (email/password, GitHub OAuth, Google OAuth) with admin and organization plugins
- **Drizzle ORM** with **Neon Postgres** (serverless)
- **Tailwind CSS v4** with shadcn/ui (New York style)
- **Polar** for payments integration
- **Resend** for transactional email
- **React Hook Form + Zod** for form validation

## Architecture

### Route Groups

- `src/app/(auth)/` — public auth pages (sign-in, sign-up, forgot-password, accept-invitation)
- `src/app/(protected)/` — auth-gated pages with sidebar layout; session checked server-side in layout.tsx, redirects to `/sign-in` if unauthenticated
- `src/app/(protected)/settings/` — platform admin settings (users & orgs management), visible only to admin role users
- `src/app/api/auth/[...all]/route.ts` — better-auth catch-all handler
- `src/app/api/admin/` — admin-only API routes (user-organizations, organizations CRUD)

### Auth Flow

- Server sessions: `src/lib/get-session.ts` uses `cache()` to deduplicate session calls per request
- Client auth: `src/lib/auth-client.ts` exports `authClient` with organization, admin, apiKey, and Polar plugins
- Auth config: `src/lib/auth.ts` — session lasts 7 days, auto-creates organization on user signup, sends invitation emails via Resend

### Role Model (Two-Tier)

- **Platform roles** (`user.role` column, managed by admin plugin): `user` | `admin`. Controls access to platform-wide admin functions (Settings page, user/org management across the platform).
- **Organization roles** (`member.role` column, managed by organization plugin): `owner` | `admin` | `member`. Controls permissions within a specific organization (member management, org editing, invitations).
- These are independent — a user can be platform `user` but org `owner`.

### Admin Plugin

- Configured in `src/lib/auth.ts` with `adminUserIds` for static admin designation
- Admin user schema fields on `user` table: `role`, `banned`, `banReason`, `banExpires`
- Admin session field on `session` table: `impersonatedBy`
- Client operations: `authClient.admin.listUsers()`, `.updateUser()`, `.setUserPassword()`, `.setRole()`, `.banUser()`, `.unbanUser()`
- Settings page (`/settings`) restricted to admin role — shows user management table and organization management table
- Admin-specific forms in `src/components/forms/form-admin-*.tsx`

### Organization Member Management

- Org owners can: list members, update member roles, remove members, invite new members
- Org owners CANNOT: edit user data (name/email) or set passwords (admin plugin operations only)
- Invitation flow: owner sends invite → email via Resend with link → `/accept-invitation/[id]` page → user accepts
- Member management UI on Account page (`/account`), visible only to org owners
- Org-specific forms in `src/components/forms/form-set-org-role.tsx`, `form-remove-member.tsx`, `form-invite-member.tsx`

### Data Layer

- Schema: `src/db/schema.ts` — 8 tables (user, session, account, verification, organization, member, invitation, apikey). User table includes admin plugin fields (role, banned, banReason, banExpires). Session table includes impersonatedBy.
- DB client: `src/db/drizzle.ts` — Neon serverless connection
- Server queries: `src/server/` — server-only modules for permissions, organizations, members, users, api-keys

### Multi-Tenancy

Session stores active organization (id, name, logo, slug). Members table links users to orgs with roles (member/admin/owner). Permissions checked via `src/server/permissions.ts`.

### Component Organization

- `src/components/ui/` — shadcn/ui primitives
- `src/components/blocks/` — composed UI blocks (sidebar, theme toggle, loading button)
- `src/components/forms/` — React Hook Form components with Zod validation
- `src/components/tables/` — data table components

### Path Alias

`@/*` maps to `./src/*`

## Environment Variables

Required in `.env`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `POLAR_ACCESS_TOKEN`, `POLAR_SUCCESS_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` (base URL for invitation email links)
