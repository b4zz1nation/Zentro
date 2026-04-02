# Phase 0 Permissions Matrix

## Roles
- Super Admin
- Gym Owner
- Staff
- Member

## Workspace Rules
- Super Admin can operate across all workspaces
- Gym Owner is full admin inside one workspace
- Staff belongs to one workspace and is branch-restricted by default to one or more branches
- Members do not access the staff application in MVP and have no direct app access in this phase

## Permissions
| Capability | Super Admin | Gym Owner | Staff | Member |
|---|---|---|---|---|
| View platform-wide tenants | Yes | No | No | No |
| Create workspace | Yes | Yes, for own workspace during onboarding | No | No |
| Edit workspace profile | Yes | Yes | No | No |
| Manage branches | Yes | Yes | Limited, if granted | No |
| Manage staff users | Yes | Yes | No | No |
| Assign roles | Yes | Yes | No | No |
| Invite staff | Yes | Yes | No | No |
| View members in assigned scope | Yes | Yes | Yes | Own record only, later phase |
| Create and edit members | Yes | Yes | Yes | No |
| Archive members | Yes | Yes | No | No |
| Create and edit plans | Yes | Yes | Limited, if granted | No |
| Create and edit passes | Yes | Yes | Limited, if granted | No |
| Assign memberships and passes | Yes | Yes | Yes | No |
| Record payments | Yes | Yes | Yes | No |
| Perform check-ins | Yes | Yes | Yes | No |
| View reports | Yes | Yes | Limited, by branch scope | No |
| View audit logs | Yes | Yes | No | No |
| Configure permissions | Yes | Yes | No | No |

## Staff Permission Presets
Recommended presets for MVP:

### Front Desk Staff
- view members in assigned branches
- create and edit members
- assign memberships and passes
- record payments
- check in members
- view basic dashboard widgets for assigned branches

### Branch Manager
- all front desk permissions
- manage branch settings for assigned branches
- view branch reports
- no staff invitation permission in MVP

## Backend Enforcement Rules
- Every request must resolve the authenticated user, active workspace, and allowed branch scope
- UI visibility never replaces backend permission checks
- Staff may not access records outside assigned branches unless explicitly granted workspace-wide access
- Owners may access all records in their workspace across branches

## Phase 0 Defaults
- members have no direct portal access in MVP
- staff cannot archive members in MVP
- branch managers cannot invite staff in MVP
