# Phase 1 Priority Screen Plan

## Screen Order
1. Login
2. Onboarding
3. Dashboard
4. Members list
5. Member detail
6. Plans
7. Passes
8. Check-in
9. Payments
10. Reports
11. Settings

## Why This Order
- login and onboarding are required before any authenticated flows
- dashboard establishes the app shell and daily summary experience
- members and member detail unlock the central record model
- plans, passes, check-in, and payments support core operations
- reports and settings depend on the rest of the product structure

## Acceptance Notes Per Screen
- Login: auth path must be simple and resilient
- Onboarding: setup must complete in one linear flow
- Dashboard: key metrics must fit above the fold on common laptop sizes
- Members list: search and filters must be fast to scan
- Member detail: quick actions must be obvious
- Plans and Passes: creation and editing should reuse common form patterns
- Check-in: result state must dominate the screen
- Payments: payment-to-member linkage must be explicit
- Reports: date controls must not hide the main report content
- Settings: admin options should remain grouped and low-friction
