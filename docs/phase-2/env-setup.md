# Phase 2 Environment Setup Document

## Files
- `.env.example`
- `.env.local`
- Vercel preview environment variables
- Vercel production environment variables

## Required Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Ownership Rules
- local secrets stay in `.env.local`
- shared documentation goes in `.env.example`
- preview and production values are managed in Vercel

## Validation Rules
- startup should fail fast for missing required server variables where practical
- client code must only read `NEXT_PUBLIC_*` variables
- server-only values must never cross into client bundles

## Rotation Notes
- rotate compromised keys immediately
- keep preview and production credentials separate
- update Supabase and Vercel together when rotating keys
