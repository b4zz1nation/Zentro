# Gym SaaS Web Plan

## Stack
- **Frontend:** React + Tailwind
- **Backend:** Next.js
- **Database/Auth/Storage:** Supabase
- **Infrastructure:** Vercel

## Objective
Build the **web platform first** for a multi-tenant gym SaaS product.

The web app should allow gym owners and staff to:
- log in securely
- create and manage their gym workspace
- manage branches
- manage members
- create and assign plans and passes
- check in members using QR or manual input
- record payments
- view membership status and reports

---

## Product Scope

### Core concepts
- One platform supports **multiple gyms**
- Each gym has its own **workspace**
- Each workspace can have **multiple branches**
- Each workspace has its own:
  - staff
  - members
  - pricing/plans
  - passes
  - check-in records
  - reports

### User roles
- **Super Admin**
- **Gym Owner**
- **Staff / Front Desk**
- **Member**

---

## Web MVP Goals
The first web release should support:
- authentication and role-based access
- workspace onboarding
- branch setup
- member management
- membership plans and passes
- membership status engine
- QR/manual check-in
- payment recording
- dashboard and reports
- responsive mobile web for staff use

---

## Recommended Architecture

### App structure
Use **Next.js** as the main web platform.

- **UI:** React + Tailwind
- **Server logic:** Next.js route handlers / server actions
- **Auth:** Supabase Auth
- **Database:** Supabase Postgres
- **Storage:** Supabase Storage
- **Hosting:** Vercel

### Why this approach
- faster MVP delivery
- one main codebase for web
- easier deployment and preview environments
- built-in scaling path for later phases

---

## Functional Modules

### 1. Authentication
- login
- logout
- forgot password
- invite staff
- accept invitation
- protected routes
- role-based access

### 2. Workspace onboarding
- create gym workspace
- create first branch
- assign owner role
- save gym profile/settings

### 3. Branch management
- create branch
- edit branch
- activate/deactivate branch
- branch-based permissions and access rules

### 4. Member management
- create member
- edit member
- archive member
- search/filter members
- member profile
- emergency contact / notes
- attendance history
- payment history
- membership history

### 5. Plans and passes
Support products such as:
- monthly membership
- yearly membership
- weekly pass
- day pass
- trial pass
- custom duration pass

Each product should support:
- price
- validity
- branch access
- usage limits
- renewal rules
- extension rules

### 6. Membership status engine
Statuses:
- active
- expired
- inactive
- suspended
- frozen
- pending payment
- trial

Rules should consider:
- validity dates
- payment status
- freeze/suspension state
- branch access
- usage limits

### 7. Check-in system
Two methods:
- **QR check-in**
- **Manual check-in**

#### QR flow
- member presents QR
- staff scans through browser camera
- system validates membership/pass
- system records check-in

#### Manual flow
- staff searches by member ID, name, phone, or email
- system validates membership/pass
- system records check-in

### 8. Payments and sales
- record membership sale
- record pass sale
- record renewal payment
- payment history
- revenue records
- receipt reference number

### 9. Reporting
- active members
- expired members
- daily/weekly/monthly check-ins
- revenue by plan
- pass sales
- branch performance
- recent staff activity

### 10. Settings and administration
- workspace profile
- gym branding
- branch settings
- staff and permissions
- QR settings
- audit logs

---

## Multi-Tenant Design Rules
This project must be designed as a **multi-tenant SaaS system**.

### Rules
- every major record belongs to a workspace/tenant
- gyms cannot view each other’s data
- plans, branches, reports, and members are isolated per gym
- permissions must be workspace-aware
- branch restrictions should be enforced in the backend

### Implementation notes
- use Supabase **Row Level Security**
- attach tenant/workspace ID to core tables
- enforce backend checks in all protected mutations

---

## Database Plan

### Core tables
- `tenants`
- `branches`
- `users`
- `user_roles`
- `members`
- `membership_plans`
- `member_memberships`
- `passes`
- `checkins`
- `payments`
- `invitations`
- `notifications`
- `audit_logs`

### Important backend decisions
- whether membership status is computed live or cached
- whether passes and memberships share one product model or separate models
- how renewals affect expiry dates
- how branch-level permissions are enforced

---

## Web Route Plan
Suggested web route structure:

- `/`
- `/pricing`
- `/login`
- `/register`
- `/onboarding`
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

---

## Roadmap

## Phase 0 — Product and technical foundation
### Goals
- finalize MVP scope
- define roles and permissions
- define workspace/branch logic
- define membership and pass rules
- define check-in rules
- define success metrics

### Deliverables
- PRD
- workflow diagrams
- permissions matrix
- page inventory
- entity relationship draft

---

## Phase 1 — UX and UI planning
### Goals
- design information architecture
- create wireframes
- define reusable UI patterns
- make responsive layouts from day one

### Priority screens
- login
- onboarding
- dashboard
- members
- member details
- plans
- passes
- check-in
- payments
- reports
- settings

---

## Phase 2 — Engineering setup
### Goals
- initialize Next.js project
- configure Tailwind
- configure Supabase
- connect Vercel
- add linting and formatting
- define folder structure
- add route protection and error handling basics

### Deliverables
- working dev environment
- deployed preview environment
- base app shell
- environment variable setup

---

## Phase 3 — Database and backend foundation
### Goals
- build schema
- add migrations
- set up Row Level Security
- create tenant isolation rules
- implement membership status logic
- implement audit logging

### Deliverables
- production-ready schema draft
- RLS policies
- core service utilities

---

## Phase 4 — Authentication and onboarding
### Goals
- login and forgot password
- workspace creation
- first branch creation
- staff invitation flow
- protected app shell

### Deliverables
- auth screens
- onboarding wizard
- invitation system

---

## Phase 5 — Dashboard and app layout
### Goals
- build sidebar/topbar
- create role-aware navigation
- add summary dashboard widgets
- support branch-aware filtering

### Dashboard widgets
- active members
- expiring soon
- today’s check-ins
- today’s revenue
- recent payments

---

## Phase 6 — Member management
### Goals
- member CRUD
- search/filter members
- member detail view
- member activity history

### Deliverables
- members list page
- member detail page
- member quick actions

---

## Phase 7 — Plans, passes, and membership engine
### Goals
- create products
- assign memberships and passes
- build renewal flow
- build extension flow
- support suspension/freeze/reactivation
- compute live status correctly

### Deliverables
- plan management pages
- pass management pages
- status computation utilities
- renewal workflow

---

## Phase 8 — Check-in system
### Goals
- build QR scan flow
- build manual search flow
- validate status and access rules
- log check-ins

### Deliverables
- check-in page
- browser QR scanner
- validation result state
- recent check-in log

---

## Phase 9 — Payments and sales
### Goals
- record payments
- sell memberships and passes
- connect payment records to members
- provide basic revenue data

### Deliverables
- payment recording UI
- member payment history
- sales flow

---

## Phase 10 — Reports and analytics
### Goals
- summarize activity and revenue
- show branch performance
- track membership health

### Deliverables
- report pages
- date filters
- basic charts and tables

---

## Phase 11 — Settings and administration
### Goals
- workspace settings
- logo/branding upload
- staff role management
- branch settings
- QR configuration
- audit log visibility

### Deliverables
- settings pages
- permission management UI

---

## Phase 12 — QA, security, and hardening
### Focus areas
- tenant isolation tests
- role-based access tests
- status edge cases
- renewal edge cases
- check-in edge cases
- responsive testing
- RLS validation
- backend permission checks

---

## Phase 13 — Pilot deployment
### Goals
- deploy production MVP
- onboard 1–3 gyms
- gather real-world feedback
- improve core flows

### Deliverables
- production deployment on Vercel
- production Supabase setup
- pilot onboarding checklist

---

## Phase 14 — Post-launch improvements
### Priorities
- faster front desk experience
- improved reporting
- better search and filters
- printable/exportable receipts
- custom branding improvements
- online payments later
- branch-level analytics

---

## Sprint Breakdown

### Sprint 1
- project setup
- auth
- app shell
- base UI system

### Sprint 2
- onboarding
- workspace creation
- branch setup
- staff invitations

### Sprint 3
- members module
- member profiles
- search/filtering

### Sprint 4
- plans and passes
- assignment flows
- status engine

### Sprint 5
- check-in module
- QR/manual validation
- recent check-ins

### Sprint 6
- payments
- renewals
- revenue summaries

### Sprint 7
- reports
- settings
- staff/role management

### Sprint 8
- QA
- hardening
- bug fixes
- pilot deployment

---

## Timeline Estimate
A practical web MVP can be built in **8 to 12 weeks**, depending on team size and how strictly the MVP scope is controlled.

### Example small team
- 1 frontend/full-stack developer
- 1 backend/full-stack developer
- 1 designer part-time
- 1 QA / project lead shared role

---

## Definition of Web MVP Done
The web MVP is complete when a gym owner or staff member can:
- log in
- create/access a gym workspace
- manage branches
- add and manage members
- create plans and passes
- assign/sell memberships or passes
- view live membership status
- check in members using QR or manual search
- record payments
- view dashboard and basic reports

---

## Next Step
After the web MVP plan is approved, proceed with the **mobile app roadmap** using:
- React Native
- Tailwind
- Expo

The mobile phase should focus on the member experience first, then staff workflows if needed.

