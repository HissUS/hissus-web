# Factory website delivery - 2026-10-12

Implemented in the existing React/TypeScript/Vite application on the local branch `origin/factory-website`, based on `origin/vibe` at `2633f535ad944ea149b252006c7dbbd6183c540c`. The local branch name follows the user’s request; its GitHub review branch is `factory-website`. Working tree was clean before editing. Nothing was deployed to production.

## Architecture and design

Keep Tailwind v4, shared layouts, TanStack Router/Query, Zustand UI state, existing react-i18next JSON dictionaries, and Netlify quote function/Resend. Public marketing needs no database. A frontend pnpm configuration retains a 24-hour release-age policy, permits only esbuild’s install step, and uses an ignored writable local store. New pages live beside existing pages; shared company sections live in the existing homepage feature. No new feature tree or application was introduced. The only new shared server helper is `frontend/netlify/inquiry.ts`, beside the existing function directory, so it is not accidentally deployed as another endpoint. Shared form state and submission logic live in the existing inquiry feature’s `useInquiry` hook; errors are stored as translation keys so language changes also translate retained feedback. Shared form state and submission logic live in the existing inquiry feature’s `useInquiry` hook; feedback is stored as translation keys. Regression scripts use the existing scripts directory; Playwright is a dev-only test dependency.

Homepage now leads with factory/facility setup and team hospital/cleanroom construction experience. Services explains the proposed Guaranteed Maximum Price cooperation model with defined scope, approved-change caveats, open-book costs, and contractual shared savings. Experience is a section, not an invented project portfolio. New About and Contact pages use supplied business positioning and existing company contact details. Contact now follows the screen-quote layout and asks only for name/company name, phone, email, inquiry subject, and an optional message. Each business section has its own header navigation on the same hostname. Factory pages show Home, Services, and Contact; screen pages show Home, Products, and Quote. The button before the language controls switches to the other business. The contact page has no window-quote link, and the company homepage no longer has the screen-business promotional section. The footer restores the original contact icons and layout, with two business links; the back-to-top control restores the original circular arrow appearance. No unverified added services, clients, years, metrics, savings percentages, certifications, or testimonials were invented. Additional proposed services: none.

Retain HISSUS logo and blue identity, with restrained editorial typography, whitespace, an accessible mobile disclosure menu, and parallel layouts for both languages. Existing product descriptions, images, category interactions, lightbox, demonstrations, specs, and screen-quote workflow remain intact. Videos show YouTube thumbnails with a local product-photo fallback. Players load after a click and request immediate playback, with the poster retained until the iframe loads. The screen homepage reuses the original HeroSection, CatalogExplorer, and TrustSection rather than replacing them with a summary. Existing screen marketing claims were preserved; their pre-existing references to awards/years/product specs have not been independently substantiated by this task.

## Route mapping

For every route below, Traditional Chinese uses the existing `/tw` prefix. English remains unprefixed and is the default; there was no localStorage language persistence to replace. URL language survives refresh. Switching preserves the equivalent page, query selection, section hash, and current scroll position without navigating to that hash again. Document lang, page title, description, and hreflang now follow language/page. Metadata is client-updated in this SPA; social crawlers that do not execute JavaScript still see the shared HTML shell. No SSR/SEO-rendering migration was introduced.

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
| New `/window-screen-solutions`, `/tw/window-screen-solutions` | Complete former screen homepage | Permanent header button immediately before the language controls |

No existing URL was deleted, so no relocation HTTP redirect is necessary. Netlify's existing `/* -> /index.html` **200 rewrite**, not a redirect, remains the server fallback for direct navigation/refresh. `/api/*` function rewrite and direct `/.netlify/functions/quote` calls are retained. Unknown paths render a localized not-found view; Netlify SPA rewriting can still return HTTP 200 for these paths.

## Source access and photography

The original `HISS US-1-001.zip` exceeded the tool's 32 MiB transfer limit. The later `HISSUS-website-selected-images.zip` downloaded successfully: all 12 JPEGs were reviewed and six selected. Its `PHOTO-GUIDE.md` was read as photo-selection context, not as instructions governing the task. The original ZIP and byte-unchanged extracted JPEGs are preserved outside the checkout. Only optimized derivatives are committed.

Google Photos and the external reference sites returned proxy 403 responses; their content was not inspected. The smaller user upload provides the actual factory/facility photography used here. Captions describe visible spaces without assigning clients, location, certifications, or project ownership. Industrial images are not labeled as hospital or cleanroom work.

| Uploaded source | Placement | Selection reason |
| --- | --- | --- |
| `IMG_1555.JPG` | Home hero and gallery | Clear open factory floor, steel columns and skylights |
| `IMG_1771.JPG` | Gallery | Equipment aisle adds manufacturing context |
| `IMG_1801.JPG` | Services hero and gallery | Clear entrance, glass frontage, simple composition |
| `IMG_1811.JPG` | About and gallery | Loading bays illustrate building access |
| `IMG_1821.JPG` | Gallery | Bright supporting room broadens the selection |
| `IMG_1366.JPG` | Gallery, uncropped portrait in viewer | Stairwell shows circulation and interior detail |

Skipped IMG_1559/1782/1804 as similar compositions, IMG_1809 as a less focused exterior, IMG_1355 for distracting equipment detail and labels, and IMG_1817 for people and branded dining-area context. Each selected photo has 640/1200/1800px-wide WebP derivatives at quality 82, generated with EXIF orientation applied and metadata omitted. All 18 files total 1,571,818 bytes. They live in `frontend/src/assets/images/factory/`; below-fold photos load lazily, while hero images have high fetch priority. Viewer navigation supports buttons, arrow keys, Escape, native focus trapping, and focus return without scrolling. Motion uses opacity/transform only and respects reduced motion.

Selected repository assets:

| Asset | Placement | Reason/context |
| --- | --- | --- |
| `src/assets/images/logo.png` | Shared header/footer | Existing recognizable HISSUS identity; kept original branding |
| `src/assets/images/belc.jpg` | Preserved screen homepage hero | Existing screen-business hero, retained only there; not represented as a factory project |
| Existing 11 catalog photos | Original catalog and screen homepage | All originals retained. Includes 5 multi-handle, 4 single-handle, 1 double-handle, 1 window-screen image. Galleries lazy-load, reserve dimensions, and retain full-size lightbox. |
| Existing 9 YouTube links | Original category demonstrations | All IDs retained; thumbnails and click-initiated privacy-enhanced playback |

## Validation

Baseline: frozen frontend install and production/TypeScript build passed; locale parity passed. Lint had three pre-existing Fast Refresh rule failures in shadcn variant files and code-based router. Scoped lint exceptions now match those deliberate export boundaries; no broad lint rule removal. Baseline bilingual screen/product/quote/login views inspected locally at 1440px and 390px; an initial stale server after branch/dependency switching was restarted before continuing review.

Final checks:

- `pnpm build`: passed, includes TypeScript and production bundle; lazy-loaded secondary pages keep the main bundle below the Vite warning threshold.
- `pnpm lint`: passed. `pnpm check-locales`: passed. New strings, metadata, form feedback and gallery labels exist in both dictionaries.
- `pnpm test:inquiry`: **8 tests passed**, zero skipped. Exercises actual bundled server schema/handler, HTML escaping, input/type/size/origin/method validation, provider-returned and thrown failures, receipt versus optional confirmation, and declared edge limits. Mail provider is mocked; no actual delivery occurred.
- `pnpm test:browser`: **209 checks passed**, at 1440px, 390px, 320px, in both languages. Direct routes and refreshes, exact localized metadata/lang, all four product categories and counts of original media, scroll/query/hash-preserving language switching and refresh, six-photo gallery keyboard navigation/focus return, thumbnail failure fallback, mobile menu navigation, lightbox Escape behavior, click-to-load video target, truthful failure/partial-success form states, skip link, reduced motion, missing local images, console/page errors and horizontal overflow checked. External players, thumbnail responses, and email responses are stubbed; local images remain real.
- `pnpm test:csp`: six bilingual production pages, local images, and configured embed target exercised with the prepared Netlify CSP injected into HTTP responses; **zero CSP violations**. Real YouTube content is stubbed. Does not establish deployed headers.
- Screenshots captured for home/services/contact/screen homepage in both languages at desktop/mobile widths, reviewed visually. Current photo/portrait-viewer artifacts are in `/tmp/hissus-photos-review`; scripts can regenerate them.
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

1. Verify base directory `frontend`, build `pnpm build`, publish `dist`, functions `netlify/functions`, Node >=22, pnpm 11, and that `frontend/netlify.toml` is the active config. Keep Vite/preview servers out of production. Test every EN/TW direct URL and refresh; confirm API rewrites precede SPA fallback.
2. Set existing server-only `RESEND_API_KEY` and optionally `QUOTE_RECIPIENT_EMAIL` in Netlify Functions environment settings. Confirm `quotes@hissus.com` domain authentication in Resend. Do not place credentials in any `VITE_*` variable. Send one controlled test per inquiry type/language with authorized recipients; verify actual team receipt and optional customer confirmation. Keys are absent locally, so delivery is pending.
3. Confirm Netlify's current plan supports function rate-limit metadata; verify 5/60s IP+domain enforcement on staging under controlled tests, not the live site. Confirm 429 responses and UI feedback. If unsupported, configure an equivalent supported edge/gateway rule before enabling public mail; do not substitute a per-process in-memory counter.
4. Enable/check provider-managed DDoS and firewall protections appropriate to the account. Restrict abuse rules to the quote endpoint, cap request size where the provider allows it, enforce platform execution timeouts, and monitor rejected/5xx traffic. Challenge controls, if desired, require a server-verified token and user-selected provider credentials; none was silently added.
5. Set traffic/function/error alerts and usage/cost thresholds in Netlify and Resend; ensure email quotas/abuse monitoring and sender reputation protections. Pricing/available dashboard features depend on the actual plan, which was not accessible. Establish a contact inbox fallback when quotas are reached.
6. Verify actual response headers and immutable assets; test CSP with genuine YouTube playback and any deployed asset/API origins. Confirm TLS. Check that preview/staging deployment URLs do not expose secrets or sensitive files and that public publish contents are only `dist`.
7. Determine live DNS/CDN ownership before any Cloudflare-specific action. The compose Cloudflare Tunnel scaffold is not proof the website uses Cloudflare. If the separate Oracle backend is deployed later, switch to prod, keep tunnel credentials as mounted secrets, remove host-published API/database ports, close direct origin ingress, and enforce authenticated endpoint/CSRF/actuator policy in a separate backend deployment review. Do not expose an origin around the CDN or mistake the localhost Nginx development proxy for production protection.

No live DNS, dashboards, paid service purchases, deployments, intrusive scans, or load tests were performed.
