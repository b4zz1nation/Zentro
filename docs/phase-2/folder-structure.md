# Phase 2 Folder Structure

## Proposed Structure
```text
app/
  (public)/
    page.tsx
    pricing/page.tsx
    login/page.tsx
    forgot-password/page.tsx
    accept-invite/page.tsx
  onboarding/
    page.tsx
  app/
    dashboard/page.tsx
    members/page.tsx
    members/[id]/page.tsx
    plans/page.tsx
    passes/page.tsx
    checkins/page.tsx
    payments/page.tsx
    reports/page.tsx
    settings/page.tsx
    staff/page.tsx
    branches/page.tsx
  api/
components/
  app-shell/
  forms/
  data-display/
  feedback/
  members/
  payments/
  checkins/
lib/
  auth/
  permissions/
  workspace/
  branches/
  status-engine/
  supabase/
  validations/
  utils/
services/
  members/
  plans/
  passes/
  checkins/
  payments/
types/
styles/
```

## Structure Rules
- colocate route-specific UI in route folders when only used once
- move reusable UI into `components/`
- keep permission and auth code out of page components
- place domain business logic in `services/` or `lib/`
- use `types/` for shared domain types only
