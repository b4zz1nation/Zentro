# Progress Summary

## As Of 2026-04-02

## Phase 1 Status
Phase 1 planning is complete and ready for approval.

Completed planning artifacts:
- information architecture
- navigation structure
- layout patterns
- low-fidelity wireframes
- reusable UI patterns
- state definitions
- priority screen plan

Implementation status:
- low-fidelity route scaffolding now exists in `web-next/` for login, onboarding, dashboard, members, member detail, plans, passes, check-in, payments, reports, branches, staff, and settings

## Phase 2 Status
Phase 2 planning is complete and implementation has started.

Completed planning artifacts:
- engineering setup
- folder structure
- environment and deployment notes
- tooling and quality baseline
- app shell spec
- route protection spec
- environment setup doc

Completed implementation:
- created `web-next/` app with `Next.js + TypeScript + Tailwind`
- installed dependencies
- verified production build with `npm run build`
- configured local Next.js workspace root to avoid cross-workspace Turbopack warnings
- replaced the default starter with the Phase 1 public landing page
- added shared `/app` shell layout with sidebar and topbar
- added placeholder routes for core MVP modules
- added route-level `loading`, `error`, and `not-found` states
- added a temporary auth/workspace guard baseline in `src/lib/auth/guards.ts`
- initialized local Supabase CLI config in `supabase/`
- added app-side Supabase env and client setup in `web-next/src/lib/supabase/`
- verified lint with `npm run lint`

Not completed yet:
- remote Supabase project linking through CLI
- Vercel connection
- real auth and role enforcement
- branch-aware authorization enforcement
- production app shell polish tied to real data
- route-specific error handling tied to backend workflows

## Stack Note
The approved product plan names `Next.js` as the primary app framework.

The current implementation root that matches the plan is:
- `web-next/`
- `Next.js`
- `React`
- `TypeScript`
- `Tailwind`

There is also an older temporary scaffold in `web/` created earlier with Vite. It is no longer the intended app root.

## Phase 3 Status
Phase 3 planning has started and the first backend baseline is now applied.

Completed implementation:
- created versioned Supabase migrations in `supabase/migrations/`
- linked the local repo to Supabase project `fqidxjnhbrapljtnorzs`
- applied the initial schema to the remote database with `supabase db push`
- created core tables for tenants, branches, users, roles, members, plans, passes, assignments, check-ins, payments, invitations, notifications, and audit logs
- enabled row level security across tenant-owned tables
- added helper functions for tenant and role-aware access checks
- replaced the hardcoded auth guard with Supabase-backed session, profile, and role resolution
- added user profile bootstrap against `public.users` when an authenticated Supabase user exists
- added auth debug and bootstrap inspection routes in `web-next/`
- added owner onboarding flow to create the first tenant, branch, and `gym_owner` role
- applied an RLS policy fix so authenticated users can read and update their own profile before they have a workspace role
- implemented Supabase email/password sign-in through the `/login` route
- implemented sign-out from the authenticated app shell
- implemented forgot-password email request flow through `/forgot-password`
- implemented owner-side staff invitation creation with branch scope selection
- implemented public `/accept-invite` flow that assigns `user_roles` and branch access after sign-in
- added persisted tenant profile fields for contact email, contact phone, and brand color
- extended onboarding to capture initial workspace profile details
- implemented real workspace settings read/update flow on `/app/settings`
- implemented real member creation flow on `/app/members`
- implemented member list and search backed by Supabase
- implemented member detail route backed by Supabase

Not completed yet:
- seed data
- status engine SQL or backend services
- protected mutation procedures
- branch-restricted policies beyond the current baseline

## Phase 6 Status
Phase 6 has started with the core member record flow.

Completed implementation:
- create member
- members list page
- basic member search
- member detail page
- emergency contact and notes capture
- edit member
- archive member
- basic attendance, payment, and membership history panels on member detail

Not completed yet:
- filters beyond basic search
- member quick actions

## Phase 7 Status
Phase 7 has started with the membership-plan vertical slice.

Completed implementation:
- create membership plans
- list membership plans
- assign a membership plan to a member
- basic membership status utility for member history display

Not completed yet:
- edit membership plans
- passes CRUD
- pass assignment
- renewal, extension, suspension, freeze, and reactivation flows
- full live membership status engine
