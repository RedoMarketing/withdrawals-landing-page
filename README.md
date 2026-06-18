# Redo Withdrawals Landing Page

Single-page landing for ads driving traffic to Redo's EU Right of Withdrawal compliance flow. Lives at **`redo.com/withdrawals`** in production.

## What this page does

It's an educational, conversion-focused landing page that takes scare-ad traffic ("you could be fined 4% of turnover!") and converts it into self-onboarding signups. Every CTA points to the self-onboarding URL. **There is no form on this page** — clicks go straight through.

| File | Purpose |
| --- | --- |
| `index.html` | The entire landing page (single page, all sections inlined) |
| `styles.css` | Shared design tokens copied from the main Redo style system |
| `logos/` | Redo logo + compliance badges (SOC 2, GDPR) |
| `server.js` | Tiny Express server that serves the page under `/withdrawals/*` for the Cloudflare proxy |
| `package.json` | Express dependency + `npm start` script |

## Self-onboarding URL

Every CTA currently points to `https://app.redo.com/signup` as a placeholder. To swap in the real onboarding URL, search-and-replace it across `index.html`:

```bash
sed -i '' 's|https://app.redo.com/signup|<YOUR_REAL_URL>|g' index.html
```

There are three CTA links to update:
- The nav "Get compliant" pill
- The hero "Get compliant now →" button
- The final CTA section "Get compliant now →" button

## Local dev

```bash
npm install
npm start          # serves on http://localhost:3000
```

Then open `http://localhost:3000/` — the bare root redirects to `http://localhost:3000/withdrawals/`.

## Railway deployment

1. Connect this GitHub repo to a new Railway project (Deploy from GitHub repo)
2. Railway auto-detects Node, runs `npm install`, then `npm start` (`node server.js`)
3. The server binds `0.0.0.0:$PORT` — Railway sets `$PORT` automatically
4. Generate a public domain in Railway (Settings → Networking → Generate Domain), e.g. `withdrawals-landing.up.railway.app`
5. Verify the page loads at `https://<that-domain>/withdrawals/`
6. Health check path: `/healthz`

### Cloudflare reverse-proxy rule

On the `redo.com` zone, set up a path-preserving Origin Rule:

- **Match**: `Hostname equals redo.com AND URI Path starts with /withdrawals`
- **Action**: override the origin host to the Railway domain, **do not** rewrite/strip the path

The path stays `/withdrawals/*` all the way to Railway, where `server.js` serves it.

## Content notes

- **Compliance claims** (June 19, 2026 deadline; 4% penalty; 14-day window; 10-min setup) are sourced from Redo's blog post at `redo.com/blogs/eu-right-of-withdrawal`. Verify these stay accurate as the directive evolves.
- **Legal disclaimer** at the bottom of the page is intentional and important — Redo provides tooling, not legal advice.
- **The "Free with Redo Returns" claim** is per the blog post (withdrawal flow bundled with Checkout+ at no extra cost). Confirm this stays accurate before launch.
- **No customer logos, no testimonials, no stats from the shipping page** — this page focuses on education and the compliance deadline, not social proof. Add proof points later if the page underperforms.

## Asset notes

- `logos/soc2-badge.png` and `logos/gdpr-badge.svg` are copies of the same compliance badges from the shipping landing page. Same caveat applies: verify Redo holds these certifications before launching publicly.
- All other assets are inline SVG or pure CSS (no other image dependencies).
