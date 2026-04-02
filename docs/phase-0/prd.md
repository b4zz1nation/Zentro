# Phase 0 PRD

## Product
Zentro is a multi-tenant gym management SaaS built for the web first. The MVP is designed for gym owners and front desk staff to manage members, products, check-ins, payments, and reporting across one or more branches inside a single gym workspace.

## Product Goal
Ship a web MVP that lets a gym owner or staff member operate daily gym workflows without spreadsheets, paper logs, or fragmented tools.

## Target Users
- Super Admin: platform operator managing the SaaS
- Gym Owner: workspace owner responsible for setup, staff, branches, pricing, and oversight
- Staff: front desk or operations user handling members, check-ins, and payments within assigned permissions
- Member: end customer with a member profile and membership or pass records

## MVP Scope
The web MVP includes:
- authentication and protected app access
- workspace onboarding and first branch setup
- branch management
- member management
- membership plans and passes
- membership assignment and live status evaluation
- QR and manual check-in
- payment recording
- dashboard and operational reports
- settings for workspace, staff, branches, and branding

The MVP excludes:
- native mobile apps
- online payment gateway integration
- advanced marketing automation
- payroll, scheduling, or class booking
- public ecommerce checkout
- deep accounting integrations

## Core Product Principles
- Every major record belongs to one tenant workspace
- Branch access rules must be enforced in backend logic, not only UI
- Status decisions must be predictable and auditable
- Front desk workflows should minimize clicks and search friction
- Owners need visibility across branches; staff access is restricted by role and branch

## Approved-Target Phase 0 Decisions
These are the default product decisions for Phase 0 review.

### 1. Membership status strategy
Compute membership status live from source-of-truth records. Store optional snapshots only for reporting optimization later.

Reason:
- avoids stale status bugs in MVP
- keeps business logic centralized
- reduces cache invalidation complexity early

### 2. Plans and passes data model
Keep plans and passes as separate product models in MVP.

Reason:
- plans are duration-based recurring membership products
- passes are usage- or time-bounded access products
- rules diverge enough that forcing one model early adds ambiguity

### 3. Renewal behavior
Use controlled renewal rules per product:
- if renewed before expiry and the product allows stacking, extend from current expiry
- if renewed after expiry, renew from payment effective date
- if the product disallows stacking, create a new active term based on the effective date and close prior term

### 4. Branch access enforcement
Every protected read or mutation must verify:
- workspace ownership
- user role
- assigned branch scope when applicable
- product branch eligibility for check-in or usage

### 5. Staff access default
Staff is branch-restricted by default. Owners may grant wider access later through role configuration.

Reason:
- safer branch isolation in MVP
- clearer operational boundaries
- fewer accidental cross-branch actions

### 6. Member access
Members do not receive direct portal access in the web MVP.

Reason:
- keeps the first release focused on owner and staff workflows
- avoids adding a second user experience before core operations are stable

### 7. Payment recording model
Payments are recorded manually in MVP with amount, method, timestamp, receipt reference, and linked sale context.

Reason:
- faster implementation
- simpler pilot rollout
- avoids payment gateway and compliance complexity in the first release

## Success Metrics For MVP
- a new gym can create a workspace and first branch without admin intervention
- staff can add a member and sell a membership in under 5 minutes
- check-in validation completes in under 3 seconds for normal usage
- owners can see active members, expiring members, check-ins, and revenue from the dashboard
- no cross-tenant data visibility incidents

## Non-Functional Requirements
- responsive web experience for desktop and mobile web
- strong tenant isolation with Supabase Row Level Security
- audit logging for sensitive mutations
- role-based access enforcement in both UI and backend
- recoverable error states for forms and network failures

## MVP Risks To Control
- unclear membership edge cases causing status bugs
- weak branch scoping causing unauthorized access
- over-scoping reporting before operational flows are stable
- mixing membership and pass logic too early

## Phase 0 Review Checklist
Phase 0 review should confirm:
- the four roles are final for MVP
- plans and passes stay separate in the data model
- live status computation is accepted for MVP
- renewal and extension rules are accepted as written
- staff is branch-restricted by default
- payment recording remains manual in MVP
