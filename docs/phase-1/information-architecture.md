# Phase 1 Information Architecture

## IA Goal
Define a structure that supports fast front desk actions, clear owner oversight, and low navigation complexity on desktop and mobile web.

## Primary User Journeys
- Owner onboarding and setup
- Staff daily dashboard review
- Member search and profile access
- Membership or pass sale
- Check-in validation
- Payment recording
- Report review
- Settings and staff administration

## Top-Level IA

### Public
- Home
- Pricing
- Login
- Forgot Password
- Accept Invite

### Onboarding
- Workspace setup
- First branch setup
- Gym profile setup

### Authenticated App
- Dashboard
- Members
- Plans
- Passes
- Check-in
- Payments
- Reports
- Branches
- Staff
- Settings

## Object Model In The UI

### Workspace Context
- active workspace
- active branch filter
- active user role

### Core Objects
- member
- membership plan
- pass
- assigned membership
- assigned pass
- payment
- check-in
- branch
- staff user

## Navigation Priorities
The IA should optimize for:
- finding a member quickly
- checking in a member with minimal friction
- recording a payment without leaving member context
- switching branch context safely
- exposing owner-level admin areas without cluttering staff views

## Role-Aware Visibility

### Owner
- sees all app modules
- sees workspace-wide metrics by default
- can switch branch filter without access restrictions

### Staff
- sees operational modules first
- dashboard is scoped to assigned branches
- settings and staff management are hidden unless explicitly granted

## Recommended Screen Grouping

### Operations
- Dashboard
- Members
- Check-in
- Payments

### Product Management
- Plans
- Passes

### Organization
- Branches
- Staff
- Settings

### Insights
- Reports

## Mobile Web IA Notes
- use the same route structure as desktop
- collapse sidebar navigation into a sheet or drawer
- keep member search and check-in actions available in the primary navigation
- avoid deep drill-down paths that require repeated backtracking
