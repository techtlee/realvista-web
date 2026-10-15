# Makléři — storefront

The public landing page and site configurator. A realtor picks a template and
colourway, switches modules on and off, orders the homepage sections, names
their office and picks a tone — and clicks through a mock of the site they
are getting while they do it. The output is one JSON object: the
configuration, sent to our backend as a lead.

Standalone: no CMS, no other repo, nothing to run alongside it.

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:3004
```

Port 3004 because 3000 is the CMS, 3001 the demo site, 3002 the CRM dashboard.

Add `?debug` to the URL to see the exact JSON a submit would send, with copy
and download buttons. Realtors never see it.

## The output

```jsonc
{
  "contact":  { "name": "…", "email": "…", "phone": "…" },
  "company":  { "ico": "12345678", "name": "…" },      // optional
  "portfolioSize": "6-20",                               // optional
  "consent":  { "given": true, "text": "<the wording exactly as shown>" },
  "selection": {
    "schemaVersion": 1,
    "capturedAt": "2026-10-15T09:55:59.537Z",
    "theme":    { "name": "realvista", "variant": "crimson" },
    "modules":  { "blog": true, "listingMap": true, "mortgageCalculator": false,
                  "services": true, "references": false },
    "sections": { "home": ["hero", "featured", "stats", "agent", "contact", "blog"] },
    "brand":    { "name": "Novák Reality", "tagline": "…" },
    "content":  { "tone": "friendly", "locale": "cs-CZ" },
    "source":   { "page": "/", "previewedVariants": ["indigo", "crimson"],
                  "utm": { "source": "seznam" } }
  }
}
```

`selection` is the selection JSON v1 (`lib/selection.ts`), the same shape the
CRM stores and later turns into the client site's `site.config.ts`. `domain`
and `plan` are left out: they are settled in the qualification call.

## Submitting

The browser posts to `/api/poptavka-webu`, which forwards to `LEAD_ENDPOINT`
(the CRM's `POST /api/intake`). Server-side, so the backend URL stays private
and no CORS is needed.

| `LEAD_ENDPOINT` | development | production |
|---|---|---|
| unset | JSON logged to the terminal, form reports success | 503 — never pretend a lead arrived |
| set | forwarded, backend's answer returned | same |

Backend validation errors come back as zod issues; `lib/issues.ts` maps each to
a Czech message and the step that fixes it.

**Backend change still needed:** the CRM's intake schema
(`platform/packages/selection/src/schema.ts`) still *requires* `domain` and
`plan`, so it will reject these leads until both are made optional. Tested
against a stand-in running that real schema with the two fields relaxed: leads
are accepted, and a filled honeypot is rejected.

## How it is built

- `lib/catalog.ts` — what is on sale: REALVISTA, four colourways, seven home
  sections. **Copied from the theme manifest** so this repo stands alone; when
  a theme gains a colourway or section, update it here too.
- `lib/draft.ts` — the configuration state, shaped like the selection JSON from
  the first click, so submitting is assembly rather than translation. Kept in
  the URL (`?k=`, a shareable link) and localStorage.
- `components/mock/` — the clickable mock site: home in the chosen section
  order, listings (+ map), property detail (+ PENB badge, mortgage calculator),
  blog. Colour from CSS variables, copy from the chosen tone
  (`lib/tone-copy.ts`), photos generated as SVG (`Photo.tsx`) — nothing loads
  from outside. Laid out with container queries, so the "Mobil" frame shows the
  real phone layout with a hamburger menu.
- `components/configurator/` — the four steps, the preview frame, the summary,
  the debug panel. Each action tells the preview where to look: reorder a
  section and it scrolls there and highlights it; switch on the calculator and
  it opens a property detail.

## Before it goes public

- **Visual design** — placeholder; every value the Figma design will change is
  a token in `app/globals.css`.
- **Rate limiting** on `/api/poptavka-webu` (Vercel firewall or Turnstile).
- **Consent wording** in `lib/consent.ts` is a placeholder: needs legal review,
  the controller's name and IČO, and a privacy policy page to link to.
- **Product name and domain** — "Makléři" in the header is a stand-in.
