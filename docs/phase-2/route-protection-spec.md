# Phase 2 Route Protection Spec

## Goal
Protect authenticated routes and establish a baseline for role-aware access.

## Protection Levels

### Public
- home
- pricing
- login
- forgot-password
- accept-invite

### Authenticated
- onboarding
- all `/app/*` routes

### Role-Constrained
- branches
- staff
- settings
- some report views if later restricted

## Required Checks
- authenticated session exists
- user is linked to a workspace where required
- user has a role for the active workspace
- user has branch scope for branch-sensitive actions

## Failure Behavior
- unauthenticated users redirect to login
- authenticated but uninitialized users redirect to onboarding
- authenticated but unauthorized users see not-authorized state
- missing records resolve to not-found state

## Shared Helpers
- `requireAuth()`
- `requireWorkspace()`
- `requireRole()`
- `requireBranchScope()`
