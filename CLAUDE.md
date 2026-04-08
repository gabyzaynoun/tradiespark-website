# TradieSpark — Project Context

## What is TradieSpark?
Web design business (tradiespark.com.au) that builds professional WordPress websites for Australian tradies. Owner: Gaby, based in Sydney. ABN: 72 847 046 578.

## Current Status (as of 8 April 2026)

### DONE
- **Landing page** live at tradiespark.com.au (static HTML: index.html, style.css, script.js)
- **Stripe payment links** set up — all deposit + final links in EMAIL-TEMPLATES.txt
- **Formspree intake form** working on the landing page
- **Email templates** finalized in EMAIL-TEMPLATES.txt (deposit, build started, preview, revisions, final payment, handover, add-ons, care plan, dev brief)
- **Demo plumber site** built on WordPress Playground proving quality (Mitchell Plumbing Co, Core package)
- **Reusable WordPress template** saved in templates/homepage-core.html with placeholder variables
- **Template guide** in templates/README-TEMPLATES.txt (placeholders, example data, colour palettes per trade)
- **Grok Instagram prompt** saved in templates/grok-instagram-prompt.txt for daily social content
- **Blog posts**: 3 SEO blog pages (local SEO, plumbing jobs Sydney, why tradies need websites)
- **Demo pages**: 3 static demo sites (plumber, electrician, landscaper)
- **Legal pages**: privacy.html, terms.html

### NOT DONE — BUY BEFORE FIRST CLIENT
- **VentraIP Reseller Hosting** (~A$30/month) — unlimited client sites, WHM/cPanel
- Sign up at: https://ventraip.com.au (Reseller Hosting plan)
- **Stripe subscription links** for Care Plans ($20/$29/$59 per month)
- **Founding client Stripe link** ($700 flat, $350 deposit / $350 final)

## Packages & Pricing

| Package | Price | Pages | Deposit (50%) | Final (50%) |
|---------|-------|-------|---------------|-------------|
| Starter | $990 | 5 pages (mobile-first, SEO, contact form, Google Maps, click-to-call) | $495 | $495 |
| Core | $1,590 | 8 pages (+ photo gallery, Google Reviews, Google Business Profile) | $795 | $795 |
| Pro | $2,290 | 12 pages (+ booking system, blog, advanced local SEO, priority support) | $1,145 | $1,145 |
| Makeover | $1,490 | Full redesign with Core-level features | $745 | $745 |

Founding client rate (first 3 only): $700 flat — in exchange for testimonial + portfolio permission

Add-ons:
- AI Chat Widget: $590 + ~$29/mo to provider
- Rush Delivery (2 days): +$250

## Monthly Care Plans (recurring revenue)

| Plan | Price | Includes |
|------|-------|----------|
| Hosting Only | $20/mo | WordPress hosting, daily backups, security monitoring, SSL (mandatory for all clients) |
| Basic Care | $29/mo | Everything in Hosting + WordPress & plugin updates, email support (48hr) |
| Active Care | $59/mo | Everything in Basic + 2 content updates/month, monthly analytics report, same-day support |

## When a New Client Comes In — Workflow

1. Client submits intake form on tradiespark.com.au → arrives in Formspree/email
2. Call them within 2 hours. 10-minute conversation. Confirm package + timeline
3. Send EMAIL 1 (Deposit Invoice) with Stripe link for 50% deposit
4. Client pays deposit via Stripe link
5. Send EMAIL 2 (Build Started)
6. **SET UP VENTRAIP** if not already done (one-time reseller account setup)
7. Create hosting account in WHM for client, register domain in client's name + email
8. Install WordPress via cPanel one-click installer
9. Claude Code generates custom WordPress theme → upload via cPanel
10. Install plugins: Yoast SEO, WPForms, Smash Balloon, Duplicator, UpdraftPlus
11. Configure: contact form, Google Maps, click-to-call, SEO, daily backups
12. Send EMAIL 3 (Preview Ready) with preview URL
13. Client sends feedback → apply revisions → Send EMAIL 4 (Revisions Done)
14. Client approves → Send EMAIL 5 (Final Payment)
15. Client pays → point domain live → Send EMAIL 6 (Handover with wp-admin credentials)
16. Send EMAIL 8 (Care Plan Setup) → set up Stripe subscription

## Exit Policy
If a client wants to leave:
1. Export full site using Duplicator plugin → send zip file
2. Transfer domain from reseller account to their own registrar (5 minutes, free)
3. Cancel Stripe subscription same day
4. Done — clean, professional, no drama. Tell every client this upfront.

## Key Files

| File | Purpose |
|------|---------|
| index.html | Main landing page (live at tradiespark.com.au) |
| EMAIL-TEMPLATES.txt | All client email templates + Stripe links + dev brief |
| templates/homepage-core.html | Reusable WordPress block markup with {PLACEHOLDERS} |
| templates/README-TEMPLATES.txt | Template usage guide + example data + colour palettes |
| templates/grok-instagram-prompt.txt | Grok prompt for generating daily Instagram posts |

## Trade → Colour Palette

| Trade | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| Plumber | #2563EB | #1E40AF | #60A5FA |
| Electrician | #F59E0B | #D97706 | #FCD34D |
| Carpenter | #92400E | #78350F | #D97706 |
| Landscaper | #16A34A | #15803D | #4ADE80 |
| Builder | #DC2626 | #B91C1C | #F87171 |
| Painter | #7C3AED | #6D28D9 | #A78BFA |
| Roofer | #475569 | #334155 | #94A3B8 |
| Other | #FF6B35 | #E85A2A | #FF9F43 |

## Hosting Model
- Client sites hosted on VentraIP Reseller account (Gaby's WHM panel)
- ~A$30/month for unlimited client sites
- Each client gets isolated hosting environment within reseller account
- Domain registered in client's full legal name and their email — they own it
- Clients pay $20/month minimum (Hosting Only Care Plan)
- Clients get wp-admin access to edit their own content
- If client leaves: export site via Duplicator + transfer domain same day

## WordPress Stack (for every client site)
- Theme: **Custom** (generated by Claude Code, uploaded via cPanel)
- Page builder: **Block Editor (Gutenberg)** — no Elementor needed
- Contact form: **WPForms Lite**
- SEO: **Yoast SEO**
- Social proof: **Smash Balloon** (Google Reviews embed)
- Backup/migration: **Duplicator**
- Backups: **UpdraftPlus** (daily automated backups)
- Hosting: **VentraIP Reseller** (WHM/cPanel)
