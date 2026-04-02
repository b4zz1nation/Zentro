# Phase 2 Engineering Setup

## Goal
Define the technical baseline required before feature modules are implemented.

## Approved Stack
- Next.js for web app and server logic
- React for UI
- Tailwind CSS for styling
- Supabase for auth, database, storage, and RLS
- Vercel for deployment

## App Strategy
- one Next.js application for public pages, onboarding, and authenticated app
- server actions and route handlers for protected mutations
- shared backend services for permission checks, branch checks, and status logic

## Core Technical Decisions
- use the App Router
- use TypeScript
- keep plans and passes as separate domains in code
- centralize auth and workspace resolution
- centralize permission and branch-scope enforcement

## Required Outputs Before Feature Work
- working local app
- connected Supabase project
- connected Vercel preview deployment
- shared app shell
- route protection baseline
- error boundary and not-found baseline
- environment variable documentation
