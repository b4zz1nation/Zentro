# Phase 1 State Definitions

## Empty States
- no members found
- no plans created
- no passes created
- no payments recorded
- no recent check-ins
- no reports for the selected date range

## Loading States
- page skeleton for dashboard
- table skeleton for list pages
- detail summary skeleton
- submit button pending state
- check-in validation loading state

## Success States
- workspace created
- branch created
- member created or updated
- plan or pass saved
- payment recorded
- invitation sent
- successful check-in

## Error States
- authentication failure
- validation failure
- permission denied
- record not found
- failed check-in with reason
- network or server error

## Destructive Confirmation States
- archive member
- revoke invitation later if implemented
- suspend membership
- freeze membership

## Offline / Partial Failure Notes
- MVP assumes online use
- temporary request failures should show retry guidance
- optimistic UI is not required for MVP operational flows
