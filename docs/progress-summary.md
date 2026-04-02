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
- verified lint with `npm run lint`

Not completed yet:
- Supabase integration
- environment variable wiring
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
