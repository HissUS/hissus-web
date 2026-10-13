# HISS US SEO review

Date: 2026-10-13. Production origin: https://hissus.com. The implementation preserves the factory/window routes, business navigation, design, galleries and inquiry Functions. Local build and browser evidence does not establish Google indexing or ranking improvements.

## Findings and implementation

| Finding | Change |
| --- | --- |
| Vite served an empty React root with one generic title. Public content and page metadata appeared only after JavaScript. | Build-time React rendering emits content, one H1, translated metadata and links in HTML. React hydrates the existing page and router; no production rendering server or new rendering dependency is required. |
| Canonicals and social metadata were missing. | A shared SEO helper produces unique English/Traditional Chinese titles/descriptions, clean production canonicals, reciprocal language alternates, Open Graph and Twitter cards. Client navigation updates the same metadata. |
| Factory and screen search intent shared generic metadata. | Separate page metadata describes verified factory coordination services and the actual pleated screen catalog. Existing product-tab URLs get category-specific titles, descriptions, social images and canonicals. |
| Default product tab, tracking parameters and legacy routes can duplicate content. | The default multi-handle tab consolidates to `/windows/products`; the three other tabs retain their existing query URLs. Tracking parameters/hash do not enter canonicals. Legacy paths retain their redirects. About aliases remain noindex, canonical to Home, and redirect in the client to preserve supplied bookmark fragments. |
| Every unknown path received the SPA shell with HTTP 200. Arbitrary locale prefixes could show English. | Exact public static rewrites replace the wildcard 200. Unknown routes and backing prerender files return 404; English and Traditional Chinese error pages retain the corresponding business Home link. Unsupported locale prefixes fail in the router too. |
| Sitemap, robots and schema were absent. | Each build emits a production-only sitemap and robots file. JSON-LD covers Organization/LocalBusiness using footer details, WebPage, BreadcrumbList, the six visible factory Services, and the selected screen category. |
| Netlify previews could be indexed as copies of production. | Non-production build contexts emit noindex HTML and omit sitemap entries. A small host-aware Netlify Edge Function adds `X-Robots-Tag: noindex, nofollow` on all non-production hosts, including immutable production deploy permalinks, and redirects www to the canonical host. It leaves API/Function requests unchanged. |
| Screen photos were large original JPEGs and repeated product names were their alt text. | Committed responsive WebP variants, accurate dimensions, localized descriptive alt text, lazy gallery/thumbnail loading and a prioritized responsive hero. The twelve largest photo variants total 4,050,936 bytes versus 8,912,558 bytes for originals, a 55% reduction. Smaller variants serve smaller displays. Original images stay intact. |
| Product H1 referenced a missing translation; gallery headings skipped semantic nesting. | Added the bilingual catalog heading, made selected-product titles H3, Photos/Videos H3, and retained the login heading appearance while making it H1. |

No new locations, reviews, certifications, prices, ratings, service areas or projects were added. Existing screen specifications remain existing business claims; their independent substantiation is still the owner's responsibility. Removed the unsupported award-winning claim from the hero introduction. Factory equipment-installation services were not inferred from equipment photographs. The selected real entrance photo is used for factory social sharing, rather than presenting the generated hero concept as completed work.

## Category coverage

Factory Home introduces facility planning and construction coordination; Services covers site selection, government permits/communication, architectural design, construction, factory operations/quality systems and human resources. Contact metadata describes an inquiry about those services. Home retains the concise company introduction and its existing Services/Contact links.

Windows Home describes retractable screen doors/window screens. Products describes the actual single-handle, double-handle, multi-handle and pleated-window-screen categories, with photographs and demonstrations; Quote describes requesting those products. The implementation does not advertise unrelated replacement glass windows.

Both business sets have English routes and `/tw` Traditional Chinese routes. Public sitemap canonicals total 18: six base public routes per language, plus three non-default product tabs per language. Login, Console, error pages, About aliases, tracking parameters, Functions and backing HTML are excluded. Login/Console remain accessible but noindex; no security or authentication claim is made for the console placeholder.

## Main files

- `frontend/src/lib/seo.ts`: centralized page/category metadata, canonicals, language alternates, social images, escaped JSON-LD/head markup.
- `frontend/src/hooks/usePageMetadata.ts`: keeps metadata accurate during client navigation, including noindex on non-production hosts.
- `frontend/src/Application.tsx`, `src/entry-server.tsx`, `src/main.tsx`, `src/router/index.tsx`: shared providers, deterministic build-time rendering, hydration and locale/not-found handling. The router's SSR boundary mode is retained on both sides; routes load before hydration. Metadata is applied once at the root.
- `frontend/scripts/prerender.mjs`: emits 30 route HTML files, sitemap, robots, private/preview indexing headers and a local validation manifest. Runs automatically after the existing TypeScript/Vite build.
- `netlify.toml`, `frontend/netlify/edge-functions/seo.ts`: exact route/query rewrites, redirects, 404 policy and preview-host noindex. Email Function paths, rate declaration, CSP and other headers remain intact.
- `frontend/src/locales/en.json`, `zh-TW.json`: separate business/page/category metadata, missing catalog H1 and truthful image descriptions. Existing styles/layouts are retained.
- `frontend/src/features/homepage/constants/{catalog,screenImages}.ts`, `components/{HeroSection,CatalogExplorer/GalleryCarousel}.tsx`, `CatalogExplorer/types.ts`, `src/pages/ProductsPage.tsx`, `src/config/site.ts`, `src/components/layout/Footer/index.tsx`: responsive existing screen photos, image dimensions/loading, verified postal details and heading semantics.
- `frontend/src/assets/images/*-*.webp`, existing product subdirectories and `screen-image-manifest.json`: generated same-photo variants. `scripts/optimize-screen-images.mjs` regenerates them locally with ImageMagick; ImageMagick is not a Netlify build dependency.
- `frontend/scripts/{seo-regression,serve-built-site,browser-regression}.mjs`, `package.json`, `eslint.config.js`: validation, local static-route preview, build scripts and the intentional server-entry lint exception.
- `src/components/layout/MainLayout.tsx`, `src/layouts/AuthLayout.tsx`, `src/pages/LoginPage.tsx`, `src/lib/index.ts`: root metadata reuse and heading/barrel maintenance.
- `frontend/src/features/inquiry/components/TurnstileVerification.tsx`: translated noscript notice; proof still required before emails.

## Validation and limits

Reproduce using Node 24 and the installed pnpm version:

```sh
cd frontend
pnpm lint
pnpm check-locales
pnpm test:inquiry
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

In a second terminal:

```sh
cd frontend
CHROMIUM_PATH=/usr/bin/chromium pnpm test:seo
CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser
CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp
```

Use Playwright's installed Chromium when available by omitting `CHROMIUM_PATH`. The sample public key is Cloudflare's testing key, only for local stubbed regression builds. Never use testing keys for live inquiry protection. Production must use the owner's widget site key and server secret; missing configuration blocks sending.

SEO tests inspect generated HTML without JavaScript, sitemap XML, canonicals, language alternates, social metadata, JSON-LD/content agreement, asset paths/internal anchors, route HTTP status, alias/query selection and edge-host policies. Browser regressions cover hydration, page reloads, language/product scroll, galleries, forms and 1440/390/320px layouts. Six CSP pages exercise stubbed video and verification. Inquiry tests exercise both forms, actual public adapters and real Siteverify client with provider fetch stubbed. No real emails or verification calls are sent.

The local preview approximates the static Netlify rules; it does not run Netlify Functions. Use Netlify Dev for local real-Function integration. Actual Netlify edge deployment, redirect/query behavior, Resend delivery, verification keys and rate-limit enforcement require deployment testing. Automated checks are not field Core Web Vitals measurements or Search Console evidence. The live production crawl was blocked by this environment's outbound proxy, so production status and Google coverage remain unverified.

To test preview output separately, run `CONTEXT=deploy-preview node scripts/prerender.mjs`, then the SEO test; it expects zero sitemap canonicals and noindex pages. Restore production output with `CONTEXT=production node scripts/prerender.mjs` before final local review. Netlify supplies its build context automatically. Build regeneration runs for future content changes; image variants need regeneration only when their source photos change.

## Owner deployment and Search Console steps

1. Deploy the branch containing these files. Check `https://hissus.com/factory/home`, `/tw/factory/home`, `/windows/products?tab=windows`, `/factory/contact` and `/windows/quote`. View page source with JavaScript disabled to confirm actual page text, metadata and JSON-LD. Confirm `/missing-page` returns 404, `/index.html` redirects, and old bookmarks still arrive correctly.
2. Check https://hissus.com/robots.txt and https://hissus.com/sitemap.xml. Confirm primary production responses have no `noindex` header. Check a deploy-preview and immutable deploy URL for `X-Robots-Tag: noindex, nofollow`, even when JavaScript is disabled. Confirm Netlify actually deployed the `seo` Edge Function and exact product-query rewrites. Investigate any edge-plan/deployment restriction before claiming preview protection is active.
3. In Google Search Console, add a **Domain property** for `hissus.com`. Copy the provided DNS TXT verification record into the domain's DNS provider and complete verification. Do not add a second conflicting SPF TXT record; Search Console's record is separate. A URL-prefix property for `https://hissus.com/` is an alternative if DNS access is unavailable.
4. Under **Sitemaps**, submit `https://hissus.com/sitemap.xml`. Check the processing result and discovered URLs. The sitemap is a discovery signal, not a promise of indexing.
5. Use **URL Inspection** on Factory Home, Services, Windows Home and each catalog category. Check the live test, fetched HTML, crawl allowance and declared canonical. Request indexing for the main changed pages after deployment. Check Google's selected canonical once indexing data is available.
6. Review **Page indexing**, **HTTPS**, **Core Web Vitals** and **Performance** reports. Expected exclusions include legacy aliases, default-tab duplicates, noindex private routes and 404s. Monitor clicks, impressions and queries separately for `/factory/`, `/windows/`, `/tw/factory/` and `/tw/windows/`; compare meaningful periods rather than promising immediate ranking gains.
7. Run Google's Rich Results Test or Schema Markup Validator against deployed URLs. Valid Organization/Service/navigation data does not guarantee a rich result. Confirm shared images load publicly.

## Next visibility improvements

Prioritize verified, useful material: permissioned project case studies with real scope and photographs, clearer documented factory service areas/processes, screen selection/measurement guidance, and answers to actual customer questions. Add credentials or reviews only after verification and authorization. Keep bilingual information consistent and link new material from the relevant business pages.

If HISS US is eligible for Google Business Profile, maintain an accurate owner-verified profile and consistent business contact details. Do not create profiles or invented offices for extra coverage. Earn relevant references from real partners and organizations. Use Search Console queries to choose future content and measure the result. Track field Core Web Vitals before expanding performance changes; these image improvements alone do not prove passing scores.

Inquiry abuse controls remain a separate concern: Turnstile, the emergency pause and declared per-IP/domain rate rule are present. A shared global sending budget and automatic alerts are not implemented. See [the rate-limit review](netlify-rate-limit-review.md) for setup and live verification.
