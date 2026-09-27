# VaultSync — Deployment Guide

## Prerequisites

- **Node.js 18+** and **npm** installed
- **Supabase** project with schema applied
- **Clerk** application configured

## Step-by-Step Deployment

### 1. Apply the Database Schema

In the Supabase SQL Editor, run `supabase/schema.sql`. This creates:
- `vault_items` table with RLS enabled
- Required indexes and realtime publication

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

| Variable | Where to Get It | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production domain (e.g. `https://vaultsync.app`) | Recommended |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | For Cloud Sync |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | For Cloud Sync |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` (secret) | For Cloud Sync |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | ✅ Required |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | ✅ Required |

> 💡 **Dual-Engine Resilience**: VaultSync seamlessly works with Supabase for cross-device cloud sync, and automatically falls back to secure zero-knowledge local storage if Supabase is offline or not yet connected. Users will never face a 503 outage.

### 3. Configure Clerk

1. Add your production domain in Clerk Dashboard
2. Set Sign-In redirect URL to `/dashboard`
3. Set Sign-Up redirect URL to `/dashboard`
4. Enable the authentication methods you want (email, Google, GitHub, etc.)

### 5. Build & Deploy

```bash
npm run build    # Creates optimized production build
npm run start    # Starts production server
```

For Vercel deployment:
```bash
npx vercel --prod
```

### 6. Verify Deployment

Test these routes after deployment:
- `/` — Landing page loads with all sections
- `/robots.txt` — Correct sitemap URL
- `/sitemap.xml` — All public pages listed
- `/sign-in` — Clerk sign-in renders
- `/sign-up` — Clerk sign-up renders
- `/dashboard` — Redirects to sign-in when logged out
- `/security`, `/privacy`, `/terms` — Legal pages render
- Full vault CRUD flow: create → edit → delete an item while signed in

---

## Architecture Notes

- **Zero-Knowledge Encryption**: Passwords are encrypted in the browser with AES-256-GCM (PBKDF2 key derivation, 100K iterations) before being sent to the API. The server never sees plaintext passwords.
- **Service Role Security**: The vault API uses the Supabase service role key (server-only) after verifying the Clerk session. The anon key is only used for non-sensitive browser operations.
- **Master Password**: Never stored in browser storage. A page refresh requires re-entering the master password, preventing session hijacking on shared devices.

## Release Notes

- The vault API intentionally returns a configuration error until `SUPABASE_SERVICE_ROLE_KEY` is supplied.
- Existing password and note encryption remains readable. New and updated notes use the dedicated `notes_iv` column; legacy rows continue using their existing IV.
- Review `privacy` and `terms` pages with qualified counsel and add a real support contact before public launch.
