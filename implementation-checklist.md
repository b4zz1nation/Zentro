# Gym SaaS Web Execution Checklist

Use this as the working plan for approval and delivery. Each phase should be reviewed and explicitly approved before implementation moves to the next one.

## Current Status

- Phase 0 initiated on 2026-04-02
- Phase 0 approved on 2026-04-02
- Phase 1 initiated on 2026-04-02
- Phase 2 initiated on 2026-04-02
- Phase 1 and Phase 2 deliverables drafted and ready for approval review
- Phase 2 implementation started with a `Vite + React + TypeScript` app in `web/`
- Phase 2 implementation now has a `Next.js + TypeScript + Tailwind` app in `web-next/`
- Phase 3 backend baseline started and initial Supabase schema has been pushed

## Overall Sequence

- [x] Phase 0: Foundation and product decisions
- [ ] Phase 1: UX and UI planning
- [ ] Phase 2: Engineering setup
- [ ] Phase 3: Database and backend foundation
- [ ] Phase 4: Authentication and onboarding
- [ ] Phase 5: Dashboard and app layout
- [ ] Phase 6: Member management
- [ ] Phase 7: Plans, passes, and membership engine
- [ ] Phase 8: Check-in system
- [ ] Phase 9: Payments and sales
- [ ] Phase 10: Reports and analytics
- [ ] Phase 11: Settings and administration
- [ ] Phase 12: QA, security, and hardening
- [ ] Phase 13: Pilot deployment
- [ ] Phase 14: Post-launch improvements

---

## Phase 0: Foundation and Product Decisions

### Goal
Lock down the business rules and technical constraints before building.

### Checklist
- [x] Finalize MVP scope for web only
- [x] Confirm user roles: Super Admin, Gym Owner, Staff, Member
- [x] Define workspace and branch rules
- [x] Define tenant isolation rules
- [x] Define member lifecycle states
- [x] Define membership and pass product rules
- [x] Define renewal, extension, freeze, suspension, and reactivation rules
- [x] Define check-in validation rules
- [x] Define payment recording rules
- [x] Define success metrics for MVP

### Deliverables
- [x] PRD
- [x] Workflow diagrams
- [x] Permissions matrix
- [x] Page inventory
- [x] ERD draft
- [x] Status engine rules document

### Approval Gate
- [x] Phase 0 approved

---

## Phase 1: UX and UI Planning

### Goal
Design the structure and screens before implementation.

### Checklist
- [x] Define information architecture
- [x] Define navigation structure
- [x] Define layout patterns for desktop and mobile web
- [x] Create low-fidelity wireframes
- [x] Create reusable UI patterns for forms, tables, filters, and detail views
- [x] Define empty, loading, success, and error states

### Priority Screens
- [x] Login
- [x] Onboarding
- [x] Dashboard
- [x] Members list
- [x] Member detail
- [x] Plans
- [x] Passes
- [x] Check-in
- [x] Payments
- [x] Reports
- [x] Settings

### Approval Gate
- [ ] Phase 1 approved

---

## Phase 2: Engineering Setup

### Goal
Create the base application and deployment setup.

### Checklist
- [x] Initialize Next.js app
- [x] Configure Tailwind
- [x] Configure Supabase project access
- [x] Configure environment variables
- [ ] Connect Vercel project
- [x] Add linting and formatting
- [x] Define folder structure
- [x] Add shared app shell
- [x] Add route protection baseline
- [x] Add error handling baseline
- [x] Confirm local development workflow
- [ ] Confirm preview deployment workflow

### Deliverables
- [x] Working dev environment
- [ ] Preview deployment
- [x] Base app shell
- [x] Env setup document

### Approval Gate
- [ ] Phase 2 approved

---

## Phase 3: Database and Backend Foundation

### Goal
Build the multi-tenant backend correctly before feature modules expand.

### Checklist
- [x] Finalize core schema
- [x] Create migrations
- [x] Add tenant and branch ownership to all major records
- [x] Set up Supabase Row Level Security
- [x] Implement workspace isolation policies
- [ ] Implement branch restriction rules
- [x] Decide whether membership status is live or cached
- [x] Decide whether plans and passes are separate or unified models
- [x] Implement membership status utility/service
- [ ] Implement audit logging strategy
- [ ] Add protected mutation checks

### Core Tables
- [x] tenants
- [x] branches
- [x] users
- [x] user_roles
- [x] members
- [x] membership_plans
- [x] member_memberships
- [x] passes
- [x] checkins
- [x] payments
- [x] invitations
- [x] notifications
- [x] audit_logs

### Deliverables
- [ ] Production-ready schema draft
- [x] RLS policies
- [x] Core service utilities
- [ ] Backend rules document

### Approval Gate
- [ ] Phase 3 approved

---

## Phase 4: Authentication and Onboarding

### Goal
Allow gym owners and staff to securely access and set up their workspace.

### Checklist
- [x] Login flow
- [x] Logout flow
- [x] Forgot password flow
- [x] Protected routes
- [x] Role-based access setup
- [x] Workspace creation flow
- [x] First branch creation flow
- [x] Owner role assignment
- [x] Staff invitation flow
- [x] Invitation acceptance flow
- [x] Gym profile and initial settings flow

### Deliverables
- [x] Auth screens
- [x] Onboarding wizard
- [x] Invitation system

### Approval Gate
- [ ] Phase 4 approved

---

## Phase 5: Dashboard and App Layout

### Goal
Create the main authenticated experience and role-aware navigation.

### Checklist
- [x] Build sidebar and topbar
- [x] Add responsive app layout
- [ ] Add role-aware navigation
- [ ] Add branch-aware filtering
- [x] Add dashboard summary cards
- [x] Add recent activity section

### Dashboard Widgets
- [x] Active members
- [ ] Expiring soon
- [x] Today's check-ins
- [x] Today's revenue
- [x] Recent payments

### Approval Gate
- [ ] Phase 5 approved

---

## Phase 6: Member Management

### Goal
Enable core member operations and history tracking.

### Checklist
- [x] Create member
- [x] Edit member
- [x] Archive member
- [x] Search members
- [ ] Filter members
- [x] Member profile view
- [x] Emergency contact and notes
- [x] Attendance history
- [x] Payment history
- [x] Membership history
- [ ] Member quick actions

### Deliverables
- [x] Members list page
- [x] Member detail page
- [ ] Member quick actions

### Approval Gate
- [ ] Phase 6 approved

---

## Phase 7: Plans, Passes, and Membership Engine

### Goal
Support product management and correct live status behavior.

### Checklist
- [x] Create membership plans
- [x] Edit membership plans
- [x] Create passes
- [x] Edit passes
- [x] Support price, validity, branch access, usage limits, renewal rules, and extension rules
- [x] Assign membership to member
- [x] Assign pass to member
- [x] Build renewal flow
- [ ] Build extension flow
- [x] Support suspension
- [x] Support freeze
- [x] Support reactivation
- [x] Compute live membership status correctly

### Statuses
- [x] Active
- [x] Expired
- [x] Inactive
- [x] Suspended
- [x] Frozen
- [x] Pending payment
- [x] Trial

### Deliverables
- [x] Plan management pages
- [x] Pass management pages
- [x] Status computation utilities
- [x] Renewal workflow

### Approval Gate
- [ ] Phase 7 approved

---

## Phase 8: Check-In System

### Goal
Allow staff to validate and record member access quickly.

### Checklist
- [ ] Build QR check-in flow
- [x] Build manual check-in flow
- [ ] Add browser camera support for QR scanning
- [x] Add manual member search by ID, name, phone, or email
- [x] Validate membership or pass on check-in
- [x] Validate branch access rules on check-in
- [x] Record successful check-in
- [x] Show failed validation result and reason
- [x] Show recent check-in history

### Deliverables
- [x] Check-in page
- [ ] Browser QR scanner
- [x] Validation result state
- [x] Recent check-in log

### Approval Gate
- [ ] Phase 8 approved

---

## Phase 9: Payments and Sales

### Goal
Support sales and payment recording tied to members and products.

### Checklist
- [x] Record membership sale
- [ ] Record pass sale
- [x] Record renewal payment
- [x] Save payment history
- [x] Save receipt reference number
- [x] Connect payments to members
- [x] Connect payments to plans or passes
- [x] Show revenue records
- [x] Add member payment history view

### Deliverables
- [x] Payment recording UI
- [x] Member payment history
- [ ] Sales flow

### Approval Gate
- [ ] Phase 9 approved

---

## Phase 10: Reports and Analytics

### Goal
Provide basic operational and revenue visibility.

### Checklist
- [x] Active members report
- [x] Expired members report
- [x] Daily check-ins report
- [x] Weekly check-ins report
- [x] Monthly check-ins report
- [x] Revenue by plan report
- [ ] Pass sales report
- [x] Branch performance report
- [x] Recent staff activity report
- [x] Date filters
- [x] Basic charts and tables

### Deliverables
- [x] Report pages
- [x] Date filtering
- [x] Basic analytics UI

### Approval Gate
- [ ] Phase 10 approved

---

## Phase 11: Settings and Administration

### Goal
Allow workspace-level configuration and staff management.

### Checklist
- [x] Workspace profile settings
- [ ] Gym branding settings
- [ ] Logo upload
- [x] Branch settings
- [x] Staff management
- [x] Staff role management
- [x] Permission management UI
- [ ] QR settings
- [ ] Audit log visibility

### Deliverables
- [x] Settings pages
- [x] Permission management UI

### Approval Gate
- [ ] Phase 11 approved

---

## Phase 12: QA, Security, and Hardening

### Goal
Validate the system before pilot rollout.

### Checklist
- [ ] Tenant isolation tests
- [ ] Role-based access tests
- [x] Membership status edge case tests
- [ ] Renewal edge case tests
- [ ] Check-in edge case tests
- [ ] Responsive testing
- [ ] RLS validation
- [ ] Backend permission checks
- [ ] Bug fixing pass
- [x] Release-readiness review

### Approval Gate
- [ ] Phase 12 approved

---

## Phase 13: Pilot Deployment

### Goal
Launch the MVP to a small set of real gyms.

### Checklist
- [ ] Prepare production Vercel deployment
- [ ] Prepare production Supabase setup
- [ ] Configure production environment variables
- [ ] Run pre-launch checks
- [ ] Onboard 1 to 3 pilot gyms
- [ ] Gather pilot feedback
- [ ] Review issues and improvements

### Deliverables
- [ ] Production deployment
- [ ] Production Supabase setup
- [x] Pilot onboarding checklist

### Approval Gate
- [ ] Phase 13 approved

---

## Phase 14: Post-Launch Improvements

### Goal
Improve the product after real usage.

### Checklist
- [ ] Faster front desk workflow improvements
- [ ] Better reporting
- [ ] Better search and filters
- [ ] Printable or exportable receipts
- [ ] Custom branding improvements
- [ ] Evaluate online payments
- [ ] Branch-level analytics improvements

### Approval Gate
- [ ] Phase 14 approved

---

## Suggested Working Order

Use this approval flow so we do not build on unstable assumptions:

1. [ ] Approve Phase 0
2. [ ] Approve Phase 1
3. [ ] Approve Phase 2
4. [ ] Approve Phase 3
5. [ ] Approve Phase 4
6. [ ] Approve Phase 5
7. [ ] Approve Phase 6
8. [ ] Approve Phase 7
9. [ ] Approve Phase 8
10. [ ] Approve Phase 9
11. [ ] Approve Phase 10
12. [ ] Approve Phase 11
13. [ ] Approve Phase 12
14. [ ] Approve Phase 13
15. [ ] Review Phase 14 after launch

## Recommended Immediate Next Step

- [x] Start with Phase 0 and lock the product rules before implementation
