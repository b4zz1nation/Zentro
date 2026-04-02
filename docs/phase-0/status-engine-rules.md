# Phase 0 Status Engine Rules

## Objective
Compute whether a member can currently access the gym and explain why.

## Status Model
The system exposes these statuses in MVP:
- `active`
- `expired`
- `inactive`
- `suspended`
- `frozen`
- `pending_payment`
- `trial`

## Source Of Truth
Status is computed live from:
- membership assignment dates
- pass assignment dates
- payment state
- status overrides and event records
- usage limits
- branch access rules

## Evaluation Order
Apply status evaluation in this order so results remain deterministic.

1. Confirm the member belongs to the active tenant.
2. Find usable memberships and passes for the requested branch and date.
3. Exclude archived members.
4. Apply hard overrides:
   - suspended
   - frozen
5. Apply payment rules:
   - pending payment blocks normal active access unless the product explicitly allows grace access
6. Apply date validity:
   - before start date is inactive
   - after end date is expired
7. Apply usage rules for passes:
   - zero remaining uses is expired
8. If the product is a trial and still valid, return trial
9. If one valid usable product remains, return active
10. If no valid product remains, return inactive or expired based on the nearest failed condition

## Member Lifecycle States
Recommended member lifecycle states for MVP:
- lead: optional later phase, not required for MVP
- active_member: has at least one currently usable product
- inactive_member: exists but has no currently usable product
- archived_member: hidden from day-to-day operations

## Product Rule Definitions

### Membership
- duration-based product with start and end dates
- may allow renewal, extension, freeze, or suspension depending on plan configuration
- may be restricted to all branches or selected branches

### Pass
- usage-based or short-duration product
- may expire by date, uses, or both
- may be restricted to all branches or selected branches

## Renewal Rules
- renewal is allowed only if the product supports it
- if renewed before expiry and stacking is allowed, extend from current `end_at`
- if renewed after expiry, start from renewal effective date
- if stacking is not allowed, close the prior record and create a new term

## Extension Rules
- extension adds time without creating a new product sale record
- extension requires a reason and actor audit entry
- extension cannot bypass suspension

## Freeze Rules
- only allowed for products that support freezing
- freeze requires start date, end date, and reason
- frozen time should not count against active duration if the plan allows freeze-day carryover
- while frozen, member cannot check in

## Suspension Rules
- suspension overrides all normal access
- suspension requires reason and actor audit entry
- suspended members cannot check in even if paid and in date

## Reactivation Rules
- reactivation clears an active freeze or suspension when permitted
- reactivation recalculates status from the remaining underlying product state

## Check-In Validation Rules
For a successful check-in all of the following must be true:
- member belongs to the current tenant
- acting staff user is allowed to operate in the current branch
- member is not archived
- member has at least one valid membership or pass for that branch
- product is not suspended or frozen
- payment rule does not block access
- pass still has remaining uses if applicable

If validation fails, the system must return a machine-readable reason and a human-readable message.

## Failure Reasons
Recommended MVP reason codes:
- `member_not_found`
- `member_archived`
- `branch_not_allowed`
- `no_valid_product`
- `membership_expired`
- `pass_exhausted`
- `pending_payment`
- `frozen`
- `suspended`
- `outside_validity_window`

## Audit Requirements
Create audit records for:
- membership assignment
- pass assignment
- renewal
- extension
- freeze
- suspension
- reactivation
- payment creation
- member archive and restore

## Recommendation
Implement the status engine as a shared backend service used by:
- member detail pages
- dashboard counts
- reports
- check-in validation
- renewal and payment flows
