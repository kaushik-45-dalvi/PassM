# VaultSync — Deployment Guide

## Prerequisites

- **Node.js 18+** and **npm** installed
- **Clerk** application configured (API keys from Clerk dashboard)

## Step-by-Step Deployment

### 1. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

| Variable | Where to Get It | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production domain (e.g. `https://vaultsync.app`) | Recommended |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | ✅ Required |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | ✅ Required |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | ✅ Default |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | ✅ Default |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/dashboard` | ✅ Default |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/dashboard` | ✅ Default |

### 2. Configure Clerk Dashboard

1. Add your production domain under **Domains** in Clerk Dashboard.
2. In Clerk Dashboard → Paths:
   - Sign-In Path: `/sign-in`
   - Sign-Up Path: `/sign-up`
   - After Sign-In Redirect: `/dashboard`
   - After Sign-Up Redirect: `/dashboard`
3. Enable your desired authentication methods (Email verification, Google OAuth, GitHub OAuth, Passkeys, etc.).

### 3. Build & Deploy

```bash
npm run build    # Creates optimized production build
npm run start    # Starts production server
```

For Vercel deployment:
```bash
npx vercel --prod
```

### 4. Verify Deployment

Test these routes after deployment:
- `/` — Landing page loads with all sections and interactive navbar
- `/robots.txt` — Correct sitemap URL
- `/sitemap.xml` — All public pages listed
- `/sign-in` — Clerk branded sign-in component renders
- `/sign-up` — Clerk branded registration component renders
- `/dashboard` — Protected route: redirects to `/sign-in` when logged out; loads vault when signed in
- `/security`, `/privacy`, `/terms` — Legal and architecture pages render
- Full vault CRUD flow: Master password setup → create item → edit item → delete item

---

## Architecture Notes

- **Zero-Knowledge Encryption**: Passwords, TOTP keys, and secure notes are encrypted in the browser with AES-256-GCM (PBKDF2 key derivation, 100K iterations) before reaching `/api/vault`. The server never sees plaintext credentials.
- **Clerk Identity Authority**: Every vault request validates the authenticated Clerk session via `await auth()`.
- **Master Password**: Never stored in browser storage or disk. A page refresh or idle timeout locks the vault, requiring re-entry to derive the volatile in-memory CryptoKey.
