# Phase 0 Decision Summary

## Final Defaults For Review
- Web MVP only
- Roles: `Super Admin`, `Gym Owner`, `Staff`, `Member`
- Staff is branch-restricted by default
- Members do not get direct portal access in MVP
- Membership status is computed live
- Plans and passes are separate models
- Payments are manually recorded in MVP
- Check-in validation is branch-aware and backend-enforced
- Sensitive mutations create audit logs

## Business Rules Snapshot
- Owners have workspace-wide administration inside their tenant
- Staff operates only within assigned branch scope unless elevated later
- Archived members remain in history but are excluded from normal operations
- A member can check in only if a valid membership or pass exists for the current branch
- `suspended`, `frozen`, and `pending_payment` block check-in in MVP

## Safe Assumptions For Phase 1
- UI planning should focus on owner and staff workflows only
- Member detail should expose membership, pass, payment, and attendance history
- Dashboard widgets should be branch-aware for staff and workspace-wide for owners
- Plans and passes should have separate management screens
- Check-in must support both QR and manual lookup
