# Progress Summary

## As Of 2026-04-03

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
- edit membership plans in a modal
- delete membership plans with assignment protection
- assign a membership plan to a member
- membership lifecycle actions on member detail:
  - renew
  - freeze
  - suspend
  - reactivate
- membership lifecycle service backed by `member_memberships` and `membership_events`
- basic membership status utility for member history display and check-in validation

Not completed yet:
- passes CRUD
- pass assignment
- extension flow
- full live membership status engine

## Phase 8 Status
Phase 8 has started with the manual front-desk path.

Completed implementation:
- branch-aware manual member search on `/app/checkins`
- manual check-in action with backend validation
- validation against active memberships and active passes
- branch access validation for scoped plans and passes
- success and failure check-ins are both recorded
- recent check-in log on the check-in page

Not completed yet:
- QR check-in flow
- browser camera support
- richer validation result presentation
- dedicated front-desk optimized QR/manual combined workflow

## Phase 9 Status
Phase 9 has started with a manual payment recording baseline.

Completed implementation:
- searchable member payment entry on `/app/payments`
- manual payment recording tied to members
- optional linkage to the member's latest membership
- automatic membership payment status update to `paid` when linked
- recent payment ledger on the payments page
- existing member detail payment history now surfaces real payment records

Not completed yet:
- pass sale linkage
- dedicated renewal checkout flow
- receipt generation or printable output
- richer revenue summaries and filters

## Phase 12 Status
Phase 12 has started with a first hardening baseline.

Completed implementation:
- added unit test baseline with Vitest
- added coverage for membership status rules
- added coverage for phone formatting helpers
- added coverage for fixed plan presets
- added basic security headers in Next.js config
- added a QA and hardening runbook

Not completed yet:
- tenant isolation integration tests
- role-based access integration tests
- check-in edge-case integration tests
- responsive test sweep
- audit log verification

## Phase 13 Status
Phase 13 has started in documentation and readiness form only.

Completed implementation:
- added pilot deployment runbook
- added pilot onboarding checklist
- documented Vercel and Supabase launch steps in the repo

Not completed yet:
- real Vercel project connection
- production environment configuration in Vercel
- actual pilot rollout to gyms

## Phase 14 Status
Phase 14 is documented as a post-launch backlog, not implemented.

Completed implementation:
- added post-launch improvement backlog document

Not completed yet:
- all product follow-up work remains pending real pilot feedback

## Phase 10 Status
Phase 10 has started with a live reporting baseline.

Completed implementation:
- date-range filtering on `/app/reports`
- branch filter constrained by workspace role access
- active members report
- expired members report
- daily, weekly, and monthly check-in summaries
- revenue by plan report
- branch performance report
- recent staff activity report
- basic visual bars and table-style report sections

Not completed yet:
- pass sales report
- richer charting
- export workflows

## Passes Status
The passes module is now implemented as a first real product slice.

Completed implementation:
- create passes
- edit passes in a modal
- delete passes with assignment protection
- archive and status changes
- branch-aware access scope
- optional usage limits
- assign passes to members
- member pass history on member detail

Not completed yet:
- dedicated pass sales workflow
- pass-focused analytics in reports

## Phase 11 Status
Phase 11 now has a practical admin baseline.

Completed implementation:
- workspace profile settings
- branch creation and editing
- branch status management
- staff invitation flow
- accepted-staff access management
- branch-scope permission controls for staff roles

Not completed yet:
- logo upload
- QR settings
- audit log visibility
- richer permission matrix beyond role status and branch scope
