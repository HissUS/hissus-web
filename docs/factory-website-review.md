# Factory website delivery — 2026-10-11

Implemented in the existing React/TypeScript/Vite application on the local branch `origin/factory-website`, based on `origin/vibe` at `2633f535ad944ea149b252006c7dbbd6183c540c`. The local branch name follows the user’s request; its GitHub review branch is `factory-website`. Working tree was clean before editing. Nothing was deployed to production.

## Architecture and design

Keep Tailwind v4, shared layouts, TanStack Router/Query, Zustand UI state, existing react-i18next JSON dictionaries, and Netlify quote function/Resend. Public marketing needs no database. A frontend pnpm configuration retains a 24-hour release-age policy, permits only esbuild’s install step, and uses an ignored writable local store. New pages live beside existing pages; shared company sections live in the existing homepage feature. No new feature tree or application was introduced. The only new shared server helper is `frontend/netlify/inquiry.ts`, beside the existing function directory, so it is not accidentally deployed as another endpoint. Shared form state and submission logic live in the existing inquiry feature’s `useInquiry` hook; errors are stored as translation keys so language changes also translate retained feedback. Shared form state and submission logic live in the existing inquiry feature’s `useInquiry` hook; feedback is stored as translation keys. Regression scripts use the existing scripts directory; Playwright is a dev-only test dependency.

Homepage now leads with factory/facility setup and team hospital/cleanroom construction experience. Services explains the proposed Guaranteed Maximum Price cooperation model with defined scope, approved-change caveats, open-book costs, and contractual shared savings. Experience is a section, not an invented project portfolio. New About and Contact pages use supplied business positioning and existing company contact details. No unverified added services, clients, years, metrics, savings percentages, certifications, or testimonials were invented. Additional proposed services: none.

Retain HISSUS logo and blue identity, with restrained editorial typography, whitespace, an accessible mobile disclosure menu, and parallel layouts for both languages. Existing product descriptions, images, category interactions, lightbox, demonstrations, specs, and screen-quote workflow remain intact. Videos now load only after a click, with autoplay disabled. The screen homepage reuses the original HeroSection, CatalogExplorer, and TrustSection rather than replacing them with a summary. Existing screen marketing claims were preserved; their pre-existing references to awards/years/product specs have not been independently substantiated by this task.

## Route mapping

For every route below, Traditional Chinese uses the existing `/tw` prefix. English remains unprefixed and is the default; there was no localStorage language persistence to replace. URL language survives refresh. Switching preserves the equivalent page, query selection, and section hash. Document lang, page title, description, and hreflang now follow language/page. Metadata is client-updated in this SPA; social crawlers that do not execute JavaScript still see the shared HTML shell. No SSR/SEO-rendering migration was introduced.

| Existing URL | Result | Preservation/redirect |
| --- | --- | --- |
| `/` | `/home` | Existing client-side TanStack redirect retained; not an HTTP 301 |
| `/home`, `/tw/home` | New company homepage | URLs retained; former screen homepage fully available at `/window-screen-solutions`, `/tw/window-screen-solutions` |
| `/products`, `/tw/products` and `?tab=...` | Existing full screen catalog | URLs and product IDs retained |
| `/get-a-quote`, `/tw/get-a-quote` | Existing screen inquiry form | URLs, Texas city selection and product options retained |
| `/login`, `/tw/login` | Existing login UI skeleton | URLs retained; functional auth remains unimplemented/unverified |
| `/console`, `/tw/console` | Existing placeholder | URLs retained; placeholder now translated |
| New `/services`, `/tw/services` | Facility services and GMP | New route; experience at `#experience`, GMP at `#gmp` |
| New `/about`, `/tw/about` | Company introduction | New route |
| New `/contact`, `/tw/contact` | Facility inquiry and verified contact channels | New route using the existing mail integration |
| New `/window-screen-solutions`, `/tw/window-screen-solutions` | Complete former screen homepage | Permanent top-level navigation entry |

No existing URL was deleted, so no relocation HTTP redirect is necessary. Netlify's existing `/* -> /index.html` **200 rewrite**, not a redirect, remains the server fallback for direct navigation/refresh. `/api/*` function rewrite and direct `/.netlify/functions/quote` calls are retained. Unknown paths render a localized not-found view; Netlify SPA rewriting can still return HTTP 200 for these paths.

## Source access and photography

Read repository guide, READMEs, package manifests/lockfiles, configuration, deployment files, page/router/layout source, translations, state/API helpers, forms, catalog/gallery and infrastructure source. The supplied live HISSUS page, DSBA Global, CMT Worldwide, Gensler, and Google Photos album all returned **proxy tunnel 403**. Their design/content was not inspected; the design follows the user's written directions and repository. `design.rtf` was not attached: the two provided attachments are identical request text files.

No factory/hospital/cleanroom image exists in the selected branch's repository inventory. Do not repurpose a residential photo or the existing Gemini-named branding asset as factory work. Hero and project-photo areas are explicitly labeled development placeholders, translated in both languages. Photography is an outstanding content requirement before a polished public release.

Selected repository assets:

| Asset | Placement | Reason/context |
| --- | --- | --- |
| `src/assets/images/multi_handle/ML_screendoor_hori.jpg` | Company-home screen-business introduction | Wide, readable view of a residential screen installation already used in the product catalog. Caption states only the visible context. Generated local 800/1600px WebP sizes (69/199 KB) retain the original and reserve dimensions. |
| `src/assets/images/logo.png` | Shared header/footer | Existing recognizable HISSUS identity; kept original branding |
| `src/assets/images/belc.jpg` | Preserved screen homepage hero | Existing screen-business hero, retained only there; not represented as a factory project |
| Existing 11 catalog photos | Original catalog and screen homepage | All originals retained. Includes 5 multi-handle, 4 single-handle, 1 double-handle, 1 window-screen image. Galleries lazy-load, reserve dimensions, and retain full-size lightbox. |
| Existing 9 YouTube links | Original category demonstrations | All IDs retained; now click-to-load privacy-enhanced embeds without autoplay |

Uploads needed: (1) one approved high-resolution wide facility/construction photo for hero, ideally >=1920px wide with a useful mobile crop; (2) two or more approved hospital/cleanroom/facility construction or workmanship photos for the selected-photo section; (3) factual context and publication permission for each photo, including confirmation of any visible identifying/sensitive details. No ownership/client/location/certification will be inferred. `design.rtf` may also be supplied for any additional requirements; implementation uses the actual repository.

## Validation

Baseline: frozen frontend install and production/TypeScript build passed; locale parity passed. Lint had three pre-existing Fast Refresh rule failures in shadcn variant files and code-based router. Scoped lint exceptions now match those deliberate export boundaries; no broad lint rule removal. Baseline bilingual screen/product/quote/login views inspected locally at 1440px and 390px; an initial stale server after branch/dependency switching was restarted before continuing review.

Final checks:

- `pnpm build`: passed, includes TypeScript and production bundle; lazy-loaded secondary pages keep the main bundle below the Vite warning threshold.
- `pnpm lint`: passed. `pnpm check-locales`: passed. New strings, metadata, form feedback and gallery labels exist in both dictionaries.
- `pnpm test:inquiry`: **7 tests passed**, zero skipped. Exercises actual bundled server schema/handler, HTML escaping, input/type/size/origin/method validation, provider-returned and thrown failures, receipt versus optional confirmation, and declared edge limits. Mail provider is mocked; no actual delivery occurred.
- `pnpm test:browser`: **110 checks passed**, at 1440px, 390px, 320px, in both languages. Direct routes and refreshes, exact localized metadata/lang, all four product categories and counts of original media, query-preserving language switch and refresh, mobile menu navigation, lightbox Escape behavior, click-to-load video target, truthful failure/partial-success form states, skip link, reduced motion, missing local images, console/page errors and horizontal overflow checked. External players and email responses are stubbed.
- `pnpm test:csp`: six bilingual production pages, local images, and configured embed target exercised with the prepared Netlify CSP injected into HTTP responses; **zero CSP violations**. Real YouTube content is stubbed. Does not establish deployed headers.
- Screenshots captured for home/services/contact/screen homepage in both languages at desktop/mobile widths, reviewed visually. Runtime artifacts are in `/tmp/hissus-redesign`; scripts can regenerate them.
- Full dependency advisories and remaining risk: [security-review.md](security-review.md). Final frontend audit has one remaining tooling finding; root audit has none. No vulnerability-free claim.

Repeat locally from `frontend` (Node >=22, pnpm 11 recommended):

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm check-locales
pnpm test:inquiry
pnpm exec vite preview --host 0.0.0.0 --port 4173 --strictPort
# In another terminal:
CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser
CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp
```

If system Chromium is unavailable, `pnpm exec playwright install chromium` and omit CHROMIUM_PATH. Optional `SCREENSHOT_DIR=/tmp/hissus-redesign` saves full-page visual artifacts. `TEST_BASE_URL` overrides the local production server address.

Not tested: real Resend sending, real YouTube playback/network, deployed Netlify routing/security headers/rate enforcement, live CDN/DNS/origin restrictions, screen readers, automated contrast audit, backend/database/auth, Java/container dependency scans. Keyboard focus and responsive visual legibility were checked; this is not an accessibility certification. Native browser constraints plus server schema are in place; per-field messages remain browser-localized for native required/email checks and use existing application-language form validation for custom checks.

## External hosting and DDoS actions

Prepared in repository: Netlify CSP/security headers, static asset cache policy, and per-function edge rate-limit declaration. Verified in code: bounded input, explicit provider error handling, no-store function response, HTML escaping, honeypot and disabled duplicate submit. These are not a substitute for managed edge protection.

After user-authorized staging deployment, in the existing Netlify site:

1. Verify base directory `frontend`, build `pnpm build`, publish `dist`, functions `netlify/functions`, Node >=22, pnpm 10, and that `frontend/netlify.toml` is the active config. Keep Vite/preview servers out of production. Test every EN/TW direct URL and refresh; confirm API rewrites precede SPA fallback.
2. Set existing server-only `RESEND_API_KEY` and optionally `QUOTE_RECIPIENT_EMAIL` in Netlify Functions environment settings. Confirm `quotes@hissus.com` domain authentication in Resend. Do not place credentials in any `VITE_*` variable. Send one controlled test per inquiry type/language with authorized recipients; verify actual team receipt and optional customer confirmation. Keys are absent locally, so delivery is pending.
3. Confirm Netlify's current plan supports function rate-limit metadata; verify 5/60s IP+domain enforcement on staging under controlled tests, not the live site. Confirm 429 responses and UI feedback. If unsupported, configure an equivalent supported edge/gateway rule before enabling public mail; do not substitute a per-process in-memory counter.
4. Enable/check provider-managed DDoS and firewall protections appropriate to the account. Restrict abuse rules to the quote endpoint, cap request size where the provider allows it, enforce platform execution timeouts, and monitor rejected/5xx traffic. Challenge controls, if desired, require a server-verified token and user-selected provider credentials; none was silently added.
5. Set traffic/function/error alerts and usage/cost thresholds in Netlify and Resend; ensure email quotas/abuse monitoring and sender reputation protections. Pricing/available dashboard features depend on the actual plan, which was not accessible. Establish a contact inbox fallback when quotas are reached.
6. Verify actual response headers and immutable assets; test CSP with genuine YouTube playback and any deployed asset/API origins. Confirm TLS. Check that preview/staging deployment URLs do not expose secrets or sensitive files and that public publish contents are only `dist`.
7. Determine live DNS/CDN ownership before any Cloudflare-specific action. The compose Cloudflare Tunnel scaffold is not proof the website uses Cloudflare. If the separate Oracle backend is deployed later, switch to prod, keep tunnel credentials as mounted secrets, remove host-published API/database ports, close direct origin ingress, and enforce authenticated endpoint/CSRF/actuator policy in a separate backend deployment review. Do not expose an origin around the CDN or mistake the localhost Nginx development proxy for production protection.

No live DNS, dashboards, paid service purchases, deployments, intrusive scans, or load tests were performed.
