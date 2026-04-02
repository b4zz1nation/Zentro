# Phase 2 Implementation Checklist

## Setup Tasks
- initialize Next.js app with App Router and TypeScript
- configure Tailwind CSS
- add ESLint and Prettier
- add base route groups for public, onboarding, and authenticated app
- add shared layout shell

## Supabase Tasks
- configure project connection
- add server and browser Supabase clients
- document environment variables
- verify auth session access in app routes

## Security Baseline Tasks
- add auth middleware or equivalent route protection baseline
- centralize workspace resolution
- add permission guard helpers
- add branch-scope helper interfaces

## Deployment Tasks
- connect Vercel project
- configure preview environment variables
- verify preview deployment

## Review Gate
Phase 2 should not be marked approved until:
- local app runs cleanly
- preview deployment works
- environment setup is documented
- app shell and route protection baseline are present
