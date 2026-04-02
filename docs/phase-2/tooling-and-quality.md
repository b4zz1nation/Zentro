# Phase 2 Tooling And Quality Baseline

## Required Tooling
- TypeScript
- ESLint
- Prettier
- Tailwind configuration
- path aliases if they remain simple and predictable

## Recommended Scripts
- `dev`
- `build`
- `start`
- `lint`
- `typecheck`
- `format`

## Code Quality Rules
- no direct protected data fetching in client components when server-side checks are required
- all protected mutations pass through shared authorization checks
- add schema validation for form and mutation payloads
- prefer small composable components over oversized page files

## Testing Baseline
Phase 2 should prepare for:
- unit tests for utilities and status logic later
- integration tests for protected flows later
- smoke testing on preview deployments now

## Error Handling Baseline
- app-level not-found page
- app-level error boundary
- friendly form submission errors
- structured server-side error logging
