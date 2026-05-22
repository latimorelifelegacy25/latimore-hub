# Latimore Life & Legacy LLC — Codex Agent Config
# Repo: latimorelifelegacy25 | Supabase: medxfhhxvmczmpurkmrp

## Stack
Next.js App Router | Prisma + Supabase | Vercel | Resend | Twilio | GA4
Build: npm run validate before every push
Migrations: npm run db:deploy (never db:push in prod)
Temp dir (Termux): /sdcard/Download/ — never /tmp

## File organization (every commit)
Run: node /sdcard/Download/organize.js
Scans: outputs/ marketing/ proposals/ clients/
Renames: YYYY-MM-DD_[type]_[audience]_[channel].[ext]
Never touch or delete anything in legal/

## Brand drift check (every PR to main)
Send new .md and .html files to Claude API claude-sonnet-4-20250514
Post drift scorecard as PR comment
Flag Major Drift — never auto-block merge

## Proposal PDF export
Watch proposals/pending/ for new JSON files
Render with Puppeteer: #2C3E50 / #C49A6C / #FFFFFF
Save to proposals/districts/[name]-[date].pdf
Email to jackson1989@latimorelegacy.com via Resend

## Weekly KPI cron (Vercel — Monday 7am ET)
Route: /api/cron/weekly-kpi | Auth: x-cron-secret
Query Supabase: new leads, policies, referral sources past 7 days
Email to leads@latimorelegacy.com + jackson1989@latimorelegacy.com

## GA4 lead events
Main: G-S0Q3E4DEBJ | Card: G-91DT7W1KRP
Event: generate_lead | Params: source, county, icp_type, carrier
Write to Supabase via POST /api/lead

## Contacts
jackson1989@latimorelegacy.com | (717) 615-2613
leads@latimorelegacy.com
www.latimorelifelegacy.com
1544 Route 61 Hwy S Suite 6104, Pottsville PA 17901
