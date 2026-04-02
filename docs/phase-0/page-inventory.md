# Phase 0 Page Inventory

## Public Pages
- `/`
- `/pricing`
- `/login`
- `/forgot-password`
- `/accept-invite`

## Onboarding
- `/onboarding`
- `/onboarding/workspace`
- `/onboarding/branch`
- `/onboarding/profile`

## Authenticated App
- `/app/dashboard`
- `/app/members`
- `/app/members/[id]`
- `/app/plans`
- `/app/passes`
- `/app/checkins`
- `/app/payments`
- `/app/reports`
- `/app/settings`
- `/app/staff`
- `/app/branches`

## Supporting Views / UI States
- not-authorized
- not-found
- empty states for all list pages
- loading skeletons for dashboard, lists, and detail pages
- validation and mutation error states
- success confirmations for creates, updates, invites, payments, and check-ins

## Priority Order For Build
1. Login and onboarding
2. App shell with dashboard
3. Members list and member detail
4. Plans and passes
5. Check-in
6. Payments
7. Reports
8. Settings, staff, and branches

## Notes
- Member-facing pages are out of MVP scope for now
- A registration page is optional if onboarding is invite-led or owner-led only
