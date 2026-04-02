# Phase 0 ERD Draft

## Core Entities

### tenants
- `id`
- `name`
- `slug`
- `status`
- `created_at`
- `updated_at`

### branches
- `id`
- `tenant_id`
- `name`
- `code`
- `address`
- `status`
- `created_at`
- `updated_at`

### users
- `id`
- `auth_user_id`
- `full_name`
- `email`
- `phone`
- `status`
- `created_at`
- `updated_at`

### user_roles
- `id`
- `tenant_id`
- `user_id`
- `role`
- `branch_scope_type`
- `created_at`
- `updated_at`

### user_role_branches
- `id`
- `user_role_id`
- `branch_id`

### members
- `id`
- `tenant_id`
- `home_branch_id`
- `external_member_code`
- `first_name`
- `last_name`
- `email`
- `phone`
- `date_of_birth`
- `gender`
- `joined_at`
- `archived_at`
- `notes`
- `emergency_contact_name`
- `emergency_contact_phone`
- `created_at`
- `updated_at`

### membership_plans
- `id`
- `tenant_id`
- `name`
- `description`
- `price`
- `duration_unit`
- `duration_value`
- `supports_renewal`
- `supports_extension`
- `supports_freeze`
- `supports_suspension`
- `branch_access_type`
- `created_at`
- `updated_at`

### plan_branch_access
- `id`
- `membership_plan_id`
- `branch_id`

### member_memberships
- `id`
- `tenant_id`
- `member_id`
- `membership_plan_id`
- `start_at`
- `end_at`
- `status_override`
- `status_reason`
- `payment_status`
- `remaining_freeze_days`
- `created_by`
- `created_at`
- `updated_at`

### membership_events
- `id`
- `tenant_id`
- `member_membership_id`
- `event_type`
- `effective_at`
- `meta`
- `created_by`
- `created_at`

### passes
- `id`
- `tenant_id`
- `name`
- `description`
- `price`
- `validity_unit`
- `validity_value`
- `usage_limit`
- `branch_access_type`
- `created_at`
- `updated_at`

### pass_branch_access
- `id`
- `pass_id`
- `branch_id`

### member_passes
- `id`
- `tenant_id`
- `member_id`
- `pass_id`
- `start_at`
- `end_at`
- `remaining_uses`
- `status_override`
- `status_reason`
- `payment_status`
- `created_by`
- `created_at`
- `updated_at`

### checkins
- `id`
- `tenant_id`
- `branch_id`
- `member_id`
- `checkin_method`
- `result`
- `result_reason`
- `source_membership_id`
- `source_member_pass_id`
- `created_by`
- `created_at`

### payments
- `id`
- `tenant_id`
- `branch_id`
- `member_id`
- `payment_type`
- `related_membership_id`
- `related_member_pass_id`
- `amount`
- `currency`
- `payment_method`
- `receipt_reference`
- `paid_at`
- `created_by`
- `created_at`

### invitations
- `id`
- `tenant_id`
- `email`
- `role`
- `branch_scope_type`
- `expires_at`
- `accepted_at`
- `created_by`
- `created_at`

### notifications
- `id`
- `tenant_id`
- `member_id`
- `type`
- `status`
- `payload`
- `created_at`

### audit_logs
- `id`
- `tenant_id`
- `branch_id`
- `actor_user_id`
- `entity_type`
- `entity_id`
- `action`
- `meta`
- `created_at`

## Relationship Summary
- one `tenant` has many `branches`
- one `tenant` has many `users` through `user_roles`
- one `tenant` has many `members`
- one `member` has many `member_memberships`, `member_passes`, `checkins`, and `payments`
- one `membership_plan` has many `member_memberships`
- one `pass` has many `member_passes`
- branch access for staff and products is modeled through join tables

## Design Notes
- `member_memberships` and `member_passes` are separate to keep membership and pass rules clear in MVP
- `membership_events` captures renew, extend, freeze, suspend, and reactivate history
- `audit_logs` is required for sensitive mutations
- all major records carry `tenant_id` for RLS and backend validation
