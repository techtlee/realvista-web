# Makléři — storefront

The public landing page and site configurator. A realtor picks a template,
colourway, modules, home section order, brand and tone; sees it live; and
submits. The submission is the selection JSON from `@makleri/selection`,
which the CMS stores on a lead.

## Running it

```bash
pnpm install
cp .env.example .env.local   # CMS_URL, NEXT_PUBLIC_PREVIEW_URL
pnpm dev                     # http://localhost:3004
```

Port 3004 because 3000 is the CMS, 3001 the demo site, 3002 the CRM dashboard.

Needs the CMS running for `GET /api/themes` and `POST /api/intake`. Without it
the page renders and the configurator shows an "unavailable" state.

## How it fits together

```
browser ──▶ storefront /api/poptavka-webu ──▶ CMS POST /api/intake
                 (proxy: CMS origin stays private, no CORS, one place to rate-limit)

storefront page ──(server, ISR 300 s)──▶ CMS GET /api/themes   catalog from theme manifests

configurator ──iframe──▶ REALVISTA site /nahled   live preview (see contract below)
```

- **Nothing here names a theme or a colourway.** Templates, swatches and the
  default section order all come from the catalog.
- **The draft is shaped like the selection JSON from the start** (`lib/draft.ts`),
  so submitting is assembly, not translation. It is saved in the URL (`?k=`, a
  shareable link) and in localStorage. A shared link wins over a saved draft.
- **The same zod schema validates in the browser and in the CMS**, so issues
  from either side carry the same paths. `lib/issues.ts` turns them into Czech
  messages and the step to jump to.
- **The blog module and the blog section are one decision.** Turning the
  module off removes the section; turning it on brings it back.

## Depends on work outside this repo

The configurator works today. These two make it complete; both belong in
`platform/`.

### 1. The preview route — `platform/apps/site/app/nahled`

Until it exists, the preview panel falls back to a schematic wireframe in the
chosen colour and section order, with a note saying so.

The contract (also in `lib/preview.ts`):

| | |
|---|---|
| URL | `/nahled?varianta=<value>&sekce=<id,id,…>&blog=0\|1&mapa=0\|1&hypoteka=0\|1` |
| Renders | `theme.pages.Home` from `@makleri/theme-kit/fixtures` (`full`), not CMS data. Unknown section ids dropped |
| parent → iframe | `{ type: 'makleri:variant', value }` → set `data-variant` on `<html>`, no reload |
| iframe → parent | `{ type: 'makleri:ready' }` once hydrated. Without it the storefront keeps showing the wireframe |
| Origins | both sides check `event.origin` |
| Gate | 404 unless `NEXT_PUBLIC_VARIANT_PREVIEW` is set — a client site must never serve it |
| Headers | `noindex`, and **`X-Frame-Options` must be removed for this route** and replaced by `Content-Security-Policy: frame-ancestors <storefront origin>` |

The headers row matters: `createNextConfig` in `@makleri/config` sends
`X-Frame-Options: SAMEORIGIN` on every route of every site, so today the
browser refuses to put the demo site in a frame at all.

### 2. `domain` and `plan` optional in `@makleri/selection`

The v1 configurator does not ask for them (they are settled in the
qualification call), but `schema.ts` requires both, so **the CMS currently
rejects every submission from this page** with a 400. Make both `.optional()`.
Until then the browser deliberately ignores those two issues (`lib/issues.ts`)
and the realtor sees a generic "could not send" error.

Verified against a stand-in that runs the real catalog and the real intake
schema: with this change simulated, a full submission is accepted, carrying
crimson, a reordered and trimmed section list, the tone, the UTM parameters and
every colourway previewed.

## Before it goes public

- **Rate limiting** on `/api/poptavka-webu` (Vercel firewall or Turnstile). The
  honeypot and the strict schema stop casual spam, not a determined bot.
- **Consent wording** in `lib/consent.ts` is a placeholder. It needs legal
  review, the controller's name and IČO, and a link to a privacy policy page —
  which does not exist yet (the footer says so).
- **Product name and domain.** "Makléři" in the header is a stand-in.
- **`link:` dependencies do not build on Vercel.** `@makleri/selection` and
  `@makleri/config` point at `../platform`. Same blocker as the CMS; solved for
  both by publishing the packages, which needs the git remotes first.
- **Visual design.** The styling is a placeholder; every value the Figma design
  will change is a token in `app/globals.css`. The Figma file is not yet
  readable by the MCP (the connected account has View seats only).
- **Copy.** Czech, written to be accurate rather than final. Claims made: Czech
  admin, photos resized and stripped of location, PENB enforced, own domain with
  a temporary one first, enquiries per listing, automatic template updates — all
  true of the platform today. No delivery time is promised anywhere.

## Follow-ups

- Section labels live in `lib/sections.ts`. They belong in the theme manifest
  next to the ids, once a second theme brings sections this list does not know.
