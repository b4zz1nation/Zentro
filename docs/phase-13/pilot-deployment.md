# Phase 13 Pilot Deployment

## Objective
Prepare the app for a limited real-world rollout on Vercel and Supabase.

## Deployment Target
- frontend and server routes: Vercel
- database, auth, and storage: Supabase

## Vercel Setup
1. Create a new Vercel project from the GitHub repo.
2. Set the root directory to `web-next`.
3. Use the default Next.js framework detection.
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. Set `NEXT_PUBLIC_APP_URL` to the deployed app URL.

## Supabase Production Checklist
1. Confirm the correct project is linked.
2. Push all migrations:
   - `npx supabase db push`
3. Confirm auth settings:
   - site URL points to the deployed app
   - redirect URL includes:
     - `/login`
     - `/accept-invite`
4. Rotate any credentials that were shared insecurely during development.

## Pre-Launch Commands
From `web-next/`:

```powershell
npm install
npm run lint
npm run test
npm run build
```

From repo root:

```powershell
npx supabase db push
```

## Pilot Scope
- onboard 1 to 3 gyms only
- use owners and staff already prepared to give detailed workflow feedback
- prioritize front desk workflow, member management, and payment logging

## Pilot Exit Criteria
- no tenant isolation issues
- no auth-blocking issues
- no front-desk-blocking check-in issues
- no payment-recording data loss
