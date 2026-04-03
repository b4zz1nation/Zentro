# Phase 12 QA And Hardening

## Objective
Create a repeatable release-readiness process before pilot rollout.

## Current Baseline
- `npm run lint`
- `npm run build`
- `npm run test`

## Test Coverage Added
- membership status utility coverage
- phone parsing and formatting coverage
- fixed plan preset coverage

## Manual QA Checklist

### Authentication
- sign in with a valid owner account
- confirm signed-out users are redirected to `/login`
- confirm users without a workspace are redirected to `/onboarding`
- confirm invited users can accept an invitation only with the matching email

### Workspace and Staff
- complete first-workspace onboarding
- update workspace settings and confirm persistence
- create a staff invitation
- accept invitation with a second account

### Members and Memberships
- create a member
- auto-generate member code
- assign a membership
- renew a membership
- freeze a membership
- suspend a membership
- reactivate a membership
- archive a member

### Check-Ins
- manual search by name, email, phone, and member code
- successful check-in with active access
- failed check-in with no valid access
- confirm failed reason is visible in recent log

### Payments
- record membership sale
- record renewal payment
- confirm receipt reference persists
- confirm member payment history updates
- confirm linked membership payment status changes to `paid`

## Security Hardening Baseline
- Next.js response headers:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(self), microphone=(), geolocation=()`
- Supabase RLS enabled on tenant-owned tables
- route protection enforced through server-side auth guards

## Remaining Hardening Gaps
- tenant isolation integration tests
- role access integration tests
- branch restriction integration tests
- audit log write coverage
- deployment smoke tests
- production monitoring and alerting

## Release Gate
Do not mark Phase 12 approved until:
- lint passes
- build passes
- unit tests pass
- manual QA checklist is completed against a staging or pilot environment
