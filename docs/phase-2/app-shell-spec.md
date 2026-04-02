# Phase 2 App Shell Spec

## Shell Responsibilities
- provide authenticated frame for all protected pages
- display role-aware navigation
- expose branch context and user menu
- support desktop and mobile navigation patterns
- provide a consistent place for global feedback and loading states

## Shell Regions

### Sidebar
- primary navigation
- role-aware item visibility
- current workspace branding

### Topbar
- page title
- branch switcher or branch indicator
- global member search entry point later
- user menu

### Main Content
- route content area
- page-level actions
- route-level loading and error UI

## Mobile Behavior
- sidebar becomes drawer
- topbar remains sticky
- branch context remains visible
- no hover-only actions

## Baseline Components
- `AppShell`
- `SidebarNav`
- `Topbar`
- `BranchSwitcher`
- `UserMenu`
- `PageContainer`
