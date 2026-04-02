# Phase 0 Workflow Diagrams

## 1. Workspace Onboarding
1. User signs up or is provisioned.
2. User authenticates.
3. User creates workspace.
4. User creates first branch.
5. System assigns Gym Owner role in that workspace.
6. User enters gym profile and baseline settings.
7. User lands on dashboard.

## 2. Staff Invitation
1. Owner opens staff management.
2. Owner enters staff details and role.
3. Owner optionally restricts branch access.
4. System creates invitation record.
5. Staff receives invite link.
6. Staff accepts invite and sets password.
7. System links user to workspace and role.

## 3. Member Enrollment
1. Staff searches for existing member to avoid duplicates.
2. Staff creates member profile if no match exists.
3. Staff selects a plan or pass.
4. Staff records payment or marks pending payment based on allowed workflow.
5. System creates membership or pass assignment.
6. Status engine evaluates resulting member status.
7. Member becomes eligible or ineligible for check-in based on rules.

## 4. Renewal
1. Staff opens member profile.
2. Staff selects active or expired membership.
3. Staff chooses renewal action.
4. System applies product renewal rule.
5. Staff records payment.
6. System recalculates end date and live status.
7. Audit log stores the mutation.

## 5. Freeze / Suspension / Reactivation
1. Staff or owner opens member membership record.
2. User selects freeze, suspend, or reactivate.
3. System validates permission and product state.
4. System stores status modifier with effective dates and reason.
5. Live status service recalculates member eligibility.
6. Audit log stores who changed the status and why.

## 6. Check-In
1. Staff scans QR or searches member manually.
2. System resolves member and active branch.
3. System validates workspace, branch access, and usable membership or pass.
4. System rejects invalid access with reason or records a successful check-in.
5. Check-in result is shown immediately with recent history.

## 7. Payment Recording
1. Staff selects member and related product or renewal.
2. Staff enters amount, method, date, and receipt reference.
3. System stores payment against workspace, branch, member, and related sale context.
4. Audit log records the mutation.

## Notes
- All mutation workflows above require backend authorization checks.
- All branch-sensitive flows must use the acting user’s branch scope.
- All sensitive actions should create audit log entries in MVP.
