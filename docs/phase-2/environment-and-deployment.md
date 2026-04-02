# Phase 2 Environment And Deployment

## Environment Variables
Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Optional later variables:
- storage bucket names
- feature flags
- analytics keys

## Environment Rules
- never expose service role keys to the client
- keep local, preview, and production environments separate
- document each variable in `.env.example`
- validate required variables on startup where practical

## Local Development Workflow
1. Install dependencies
2. Copy `.env.example` to `.env.local`
3. Start Next.js dev server
4. Connect to Supabase project
5. Run lint checks before commit

## Preview Deployment Workflow
1. Push branch to remote
2. Vercel builds preview deployment
3. Preview uses preview environment variables
4. Smoke test auth, navigation, and protected routes

## Deployment Notes
- use Vercel for branch previews and production
- keep Supabase project configuration synchronized with environment stage
- avoid mixing production keys into preview builds
