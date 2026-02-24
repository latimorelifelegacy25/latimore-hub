# LatimoreHub — Setup Guide

## What This Is
Full-stack Next.js 14 app: cinematic public website + built-in CRM with lead intake, email notifications, Kanban pipeline, tasks, and reporting.

---

## Step 1 — Clone / Push to GitHub
Push this folder to a new GitHub repo (e.g. `latimore-hub`).

---

## Step 2 — Supabase Database
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy the **Connection String (URI)** from Settings → Database
3. Run migrations:
   ```bash
   npm install
   npx prisma migrate deploy
   ```
4. In Supabase SQL Editor, paste and run `supabase-rls.sql`

---

## Step 3 — Resend (Email)
1. Go to [resend.com](https://resend.com) → Add Domain → `latimorelegacy.com`
2. Add the DNS records (SPF, DKIM, DMARC) they provide
3. Copy your API key

---

## Step 4 — Google OAuth (Admin Login)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect: `https://latimorehub.vercel.app/api/auth/callback/google`

---

## Step 5 — Vercel Deploy
1. Import GitHub repo in [vercel.com](https://vercel.com)
2. Framework: **Next.js** (auto-detected)
3. Add environment variables (copy from `.env.local.example`):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Supabase Postgres URI |
| `FILLOUT_SECRET` | From Fillout webhook settings |
| `BOOKING_WEBHOOK_SECRET` | Protects `/api/booking/notify` (set a long random secret) |
| `ADMIN_EMAILS` | Optional: comma-separated allowlist for admin logins |
| `ALLOW_GMAIL_DEV` | Optional: allow Gmail sign-in for local dev (`true`/`false`) |
| `NEXT_PUBLIC_BASE_URL` | Public base URL for absolute links in emails |
| `GA4_ID` | Your GA4 measurement ID |
| `GOOGLE_CLIENT_ID` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `NEXTAUTH_URL` | `https://latimorehub.vercel.app` |
| `NEXTAUTH_SECRET` | Random string (run: `openssl rand -base64 32`) |
| `RESEND_API_KEY` | From Resend dashboard |
| `NOTIFY_TO` | `leads@latimorelegacy.com` |
| `THANKYOU_FROM` | `Latimore Life & Legacy <hello@latimorelegacy.com>` |

---

## Step 6 — Fillout Webhook
1. In Fillout, go to form `tMz7ZcqpaZus` → Settings → Webhooks
2. Add webhook URL: `https://latimorehub.vercel.app/api/fillout`
3. Copy the signing secret → set as `FILLOUT_SECRET`
4. Make sure hidden fields exist: `lead_session_id`, `utm_source`, `utm_medium`, `utm_campaign`, `interest_type`, `county`

---

## Step 7 — Smoke Test
- [ ] Visit site → cinematic scroll works 
- [ ] Submit Fillout form → check `/admin` for new inquiry
- [ ] Check your email inbox for notification
- [ ] Check lead's email for thank-you
- [ ] Go to `/admin/pipeline` → drag card to "Qualified"
- [ ] Visit `/admin/tasks` → see follow-up task

---

## Routes
| URL | Purpose |
|---|---|
| `/` | Public cinematic home |
| `/consult` | Fillout lead form |
| `/book` | Google Calendar booking |
| `/thank-you` | Post-form confirmation |
| `/velocity` `/depth` `/group` | Service pages |
| `/retirement` | Retirement planning page |
| `/admin` | Inbox (protected) |
| `/admin/pipeline` | Kanban CRM |
| `/admin/tasks` | Follow-up tasks |
| `/admin/reports` | Pipeline KPIs |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms |
| `/legal/disclosures` | Insurance disclosures |

---

## Local Development
```bash
cp .env.local.example .env.local
# Fill in your values
npm install
npx prisma generate
npm run dev
```

Visit http://localhost:3000

---

*#TheBeatGoesOn — Latimore Life & Legacy LLC*


---

## Optional — Asset Integration Pack

This repo includes an asset importer at `./latimore_asset_integration/scripts/copy-assets.mjs`.

If you have one or more ZIPs/folders of site assets, extract them into a folder (example: `./_assets_src`) and run:

```bash
node latimore_asset_integration/scripts/copy-assets.mjs ./_assets_src
```

It will copy images/fonts into:
- `public/latimore/brand`
- `public/latimore/images`
- `public/fonts`

…and write an import map to `latimore_asset_integration/import-map.json`.
If CSS files are found, they’re appended to `app/globals.css.append.txt` for manual review/merge.

---

## Optional — AI Social Content Workflow

A workflow export is included at `./workflows/latimore_ai_social_workflow.json`.
If you use a GPT-chain / workflow runner that supports this format, import it and edit the `state.keys` values to match your brand + week.

(Original file upload reference: fileciteturn0file0)
