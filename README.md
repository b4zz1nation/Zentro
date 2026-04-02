# Zentro

Zentro is a multi-tenant gym SaaS web platform. The current implementation is focused on the web MVP using Next.js, Supabase, and Vercel.

## Current App

- Main app: `web-next/`
- Framework: `Next.js`
- UI: `React`, `Tailwind CSS`
- Backend/Auth/DB: `Supabase`
- Deployment target: `Vercel`

There is also an older `web/` Vite scaffold in the repo. It is not the active implementation target.

## Features Implemented

- Supabase-backed authentication
- Workspace onboarding for the first gym owner
- Workspace settings
- Staff invitations and invite acceptance
- Dashboard with live data cards
- Member creation, editing, archive, and history views
- Membership plan management
- Membership assignment from member flows

## Repo Structure

```text
Zentro/
  docs/                  Planning and progress documents
  supabase/              Supabase config and SQL migrations
  web/                   Older Vite scaffold, not the active app
  web-next/              Active Next.js app
  implementation-checklist.md
  plans.md
```

## Prerequisites

Install these first:

1. `Node.js 20+`
2. `npm`
3. `Supabase CLI`

Optional but recommended:

1. `Git`
2. A Supabase project
3. A Vercel account

## Step By Step Setup

### 1. Clone the repo

```powershell
git clone https://github.com/b4zz1nation/Zentro.git
cd Zentro
```

### 2. Install app dependencies

```powershell
cd web-next
npm install
cd ..
```

### 3. Create Supabase environment variables

Create this file:

- `web-next/.env.local`

Use this shape:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` is the Supabase API URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the publishable or anon key
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only

### 4. Initialize or link Supabase locally

From the repo root:

```powershell
npx supabase init
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 5. Apply database migrations

From the repo root:

```powershell
npx supabase db push
```

This applies the migrations in `supabase/migrations/`.

### 6. Start the development server

Run the app from the active app directory:

```powershell
cd web-next
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 7. Build for verification

```powershell
cd web-next
npm run lint
npm run build
```

## Auth Flow

Current auth-related routes:

- `/login`
- `/forgot-password`
- `/onboarding`
- `/accept-invite`
- `/app/dashboard`

Expected initial flow:

1. Sign in
2. If no workspace exists yet, continue to onboarding
3. Create the first workspace and branch
4. Enter the app dashboard

## Plans Module

Current plans module supports:

1. Create plan from fixed presets:
   - `Day Pass`
   - `Half Month`
   - `Monthly`
   - `6 Months`
   - `1 Year`
2. Set price
3. Set access scope:
   - `All branches`
   - `Selected branches`
4. Configure rules:
   - `Supports renewal`
   - `Supports extension`
   - `Supports freeze`
   - `Supports suspension`
5. Edit in modal
6. Change status:
   - `active`
   - `inactive`
   - `archived`
7. Delete plan if not already assigned

## Useful Commands

Run the app:

```powershell
cd web-next
npm run dev
```

Lint:

```powershell
cd web-next
npm run lint
```

Build:

```powershell
cd web-next
npm run build
```

Push Supabase migrations:

```powershell
cd ..
npx supabase db push
```

## Documents

Planning and progress docs are in:

- `docs/phase-0/`
- `docs/phase-1/`
- `docs/phase-2/`
- `docs/progress-summary.md`
- `implementation-checklist.md`

## Current Notes

- `web-next/` is the active app
- `web/` is kept only as an older scaffold
- `web-next/.env.local` should never be committed
- Supabase credentials that were shared during setup should be rotated if still active
