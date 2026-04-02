# Phase 1 Layout Patterns

## Goal
Establish predictable layouts for desktop and mobile web without designing each screen from scratch.

## App Shell Pattern
- desktop: persistent left sidebar, top utility bar, main content area
- tablet: collapsible sidebar, top utility bar
- mobile: drawer navigation, sticky top bar, full-width content

## List Page Pattern
Use for:
- members
- plans
- passes
- payments
- branches
- staff

Structure:
- page title and primary action
- filter/search bar
- summary chips or quick metrics when useful
- data table on desktop
- stacked cards on mobile
- pagination or incremental load

## Detail Page Pattern
Use for:
- member detail
- branch detail if added later

Structure:
- header with title, status, quick actions
- summary panel
- tabbed or sectioned history areas
- side panel on desktop for metadata and recent actions
- stacked sections on mobile

## Form Pattern
Use for:
- onboarding
- create member
- create plan
- create pass
- record payment

Structure:
- single-column form on mobile
- two-column grouped sections on desktop for longer forms
- sticky footer or inline action area for save/cancel
- explicit validation and helper text

## Dashboard Pattern
- top row KPI cards
- branch-aware filters
- recent activity feed
- expiring soon list
- revenue and check-in summaries

## Check-In Pattern
- primary scan/search input area above the fold
- immediate validation result card
- large success or failure state
- recent check-ins below
- mobile-safe spacing for camera and input interactions

## Reports Pattern
- page title and date controls
- report selector or tabs
- chart area
- summary table
- export actions deferred until later phase

## Responsive Rules
- no horizontal scrolling for primary actions on mobile
- tables must degrade into cards or stacked rows
- primary actions remain reachable without needing hover
- key operational workflows fit within one viewport on common laptop sizes
