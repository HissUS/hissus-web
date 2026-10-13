# Feature: Company Homepage & Preserved Screen Homepage

## 🎯 Business Intent

The company homepage gives a concise visual introduction to factory/facility setup and construction: a stronger hero with one project-discussion button, the six-photo looping gallery, three short starting steps, a combined About HISSUS section with a generated planning illustration and a compact contact invitation. Hospital/cleanroom experience and the team’s client-focused approach appear in the company story. The detailed Experience and Guaranteed Maximum Price sections belong to Services. HomePage uses `FactoryHero.tsx`, `CompanyAbout.tsx`, `FactoryGallery.tsx`, `FactorySteps.tsx` and the compact variant of `CompanyContact` from `CompanySections.tsx`, plus the dedicated business switch in the shared header. Services and Contact sit beside existing pages; About bookmarks lead to the homepage company section. See `docs/factory-website-review.md` for content, route, security, and verification details.

The original screen homepage is retained in `src/pages/WindowScreenPage.tsx` at `/windows/home` and `/tw/windows/home`, using the original HeroSection, CatalogExplorer, and TrustSection. The catalog and quote pages use `/windows/products` and `/windows/quote`; old URLs redirect to them. The section below documents those preserved components.

Showcase Hissus retractable screen products and drive quote conversions. The homepage is self-contained within the `homepage` feature — it does not import from `products` or `inquiry` features.

## 🧩 Modular Orchestration

```
src/pages/WindowScreenPage.tsx
  └── src/features/homepage/
        ├── components/HeroSection.tsx
        ├── components/CatalogExplorer/
        │     ├── CatalogExplorer.tsx   (tabs + layout orchestrator)
        │     ├── GalleryCarousel.tsx   (Embla carousel)
        │     ├── SpecSection.tsx       (spec grid + CTA)
        │     ├── useCatalogData.ts     (static data hook)
        │     └── types.ts
        └── components/TrustSection.tsx
```

### 1. Hero Section (Owner: `homepage`)

* **Visual**: Full-bleed `belc.jpg` background; gradient overlay `bg-linear-to-b from-transparent to-black/40`; image fades in with `animate-in fade-in duration-700`.
* **Typography**: `text-5xl font-bold tracking-tight text-white` headline; `text-xl text-white/90` subtitle.
* **Dual CTAs** (locale-prefix-aware via `useLocale()`):
  * "Get A Quote" → `${prefix}/windows/quote` (`variant="default" size="lg"`)
  * "Explore Products" → `${prefix}/windows/products` (`variant="outline" size="lg"`, `border-white bg-transparent text-white`)
* **i18n keys**: `homepage.hero.title`, `homepage.hero.subtitle`, `nav.getQuote`, `homepage.hero.explore`

### 2. Catalog Explorer (Owner: `homepage`)

Self-contained interactive product showcase. **No dependency on `products` feature.**

* **Data**: `useCatalogData()` hook returns 4 static `CatalogCategory` objects:
  * `single-handle` — 4 images (`SH_*`)
  * `multi-handle` — 5 images (`ML_*`)
  * `double-handle` — 1 image (`DH_screendoor.jpg`)
  * `windows` — 1 image (`windows.jpg`)
  * All share `COMMON_SPECS`: midgeProof (`Shield`), uvResistance (`Sun`), trackless (`ArrowLeftRight`)
* **Tab Navigation**: 4 tabs, active tab underlined with `border-b-2 border-[--primary]`.
* **Gallery Carousel** (`GalleryCarousel.tsx`):
  * Embla carousel with `loop: true`, `align: 'start'`, 3 visible slides.
  * `ensureLoopBuffer()`: duplicates slides until count ≥ 7 (required for smooth loop with small image sets).
  * Embla-canonical spacing: `-ml-4 flex` on container, `pl-4` on outer slide wrapper, `overflow-hidden rounded-2xl` on inner image container (these must be separate divs).
  * Glassmorphism arrows: `opacity-0 group-hover:opacity-100`, `bg-white/60 backdrop-blur-md border border-white/80`; only shown when original `images.length > 3`.
  * Bottom gradient on each image: `bg-linear-to-t from-black/20 to-transparent`.
* **Spec Section** (`SpecSection.tsx`):
  * Frameless 3-column spec grid (`grid grid-cols-3 gap-x-8 gap-y-3`), icon + label, no borders or backgrounds.
  * Specifications remain; the featured-products "Explore Details" link was removed at the user’s request.
* **i18n keys**: `products.singleHandle`, `products.multiHandle`, `products.doubleHandle`, `products.windows`, `products.spec.midgeProof`, `products.spec.uvResistance`, `products.spec.trackless`, `common.explore_details`

### 3. Trust & Brand Story (Owner: `homepage`)

* **Pillars** (Icon + Title + Description):
  * **Custom-Tailored**: `t('homepage.trust.customTailored.title')` / `.desc`
  * **Craftsmanship**: `t('homepage.trust.craftsmanship.title')` / `.desc`
  * **Eco-Conscious**: `t('homepage.trust.ecoConscious.title')` / `.desc`
* **Typography standard** (aligned with CatalogExplorer):
  * Section heading: `text-4xl font-bold text-gray-900`
  * Icon: `text-[--primary]`
  * Pillar title: `text-base font-semibold text-gray-900`
  * Pillar description: `text-sm text-gray-600 leading-relaxed`
  * Brand narrative: `text-sm text-gray-500 leading-relaxed`
* **i18n keys**: `homepage.trust.heading`, `homepage.trust.customTailored.*`, `homepage.trust.craftsmanship.*`, `homepage.trust.ecoConscious.*`, `homepage.brand.narrative`

## 🚀 Engineering Guardrails

* **Import Rule**: Only shared UI from `src/components/ui-wrapper`. No cross-feature imports on the homepage.
* **Self-Contained Data**: `useCatalogData()` returns static in-memory data — no API calls, no `products` feature dependency.
* **i18n Namespace**: `homepage.*` for layout text, `products.*` for product names/specs, `common.*` for generic labels.
* **Locale Links**: All navigation CTAs must be computed with `useLocale()` prefix pattern: `const prefix = country ? \`/\${country}\` : ''`.

## 🌐 Content Mapping (en.json)

| Key | Content |
| --- | --- |
| `homepage.hero.title` | "Modern Retractable Screens" |
| `homepage.hero.subtitle` | "Safe, stylish, and award-winning retractable screen technology since 2017." |
| `homepage.hero.explore` | "Explore Products" |
| `products.spec.midgeProof` | "20 × 20 Midge Proof Strands" |
| `products.spec.uvResistance` | "UPF 50+ UV Resistance" |
| `products.spec.trackless` | "Trackless Design" |
| `common.explore_details` | "Explore Details" |

## Factory photography and motion

`FactoryImage.tsx` renders same-origin responsive WebP assets with explicit dimensions, alt text, srcset, and lazy loading. The home hero uses a generated architectural concept through `FactoryHero.tsx`, with the visible illustration caption removed at the user’s request. Its generated-image provenance remains documented. Real IMG_1555 remains in the gallery. Services uses IMG_1801 with an edge gradient that blends into the page; IMG_1811 remains in the real-photo gallery; the homepage About section uses a separate generated planning illustration. `FactoryGallery.tsx` presents six curated photos in a horizontal Embla carousel with bilingual captions and a native modal viewer. One photo is visible on mobile, two on tablet and three on desktop. The carousel loops through all six originals in both directions, like the window gallery. Translucent circular arrows overlay the left/right sides of the photos, remain visible on mobile, and appear on desktop hover or keyboard focus; each retains a 44px touch target. Dragging and left/right keys also scroll horizontally; reduced motion makes button scrolling immediate. `hooks/useFactoryCarousel.ts` manages the carousel, while `hooks/useFactoryGallery.ts` manages the viewer, body-scroll lock, and focus return without scrolling. Escape closes it; arrows and buttons move between images.

`Reveal.tsx` uses IntersectionObserver to fade content once as it enters view. Only opacity/transform change, preserving layout. Reduced-motion users see content immediately; unsupported observers leave content visible. No animation dependency was added.

Language navigation sets `resetScroll: false` and disables hash scrolling for that transition, while retaining query/hash. Product-card links also disable scroll reset and hash scrolling; the old mobile scroll-to-details callback was removed. Existing page navigation, explicit anchor links, and the back-to-top control retain their intended destinations. Gallery close restores focus without scrolling.

Window menus now expose Home, Products, and Quote in both desktop and mobile layouts. Both inquiry forms omit the standalone email link beneath the privacy note; verified contact details remain in the footer.

Video cards request the actual YouTube thumbnail from `i.ytimg.com`, fall back to an existing category photo on image failure, and retain the poster while the player loads. A single user click mounts the privacy-enhanced iframe with `autoplay=1` and the autoplay permission. No player or playback is started before that click. The narrow image host is included in Netlify CSP; YouTube playback is still subject to provider availability and browser policies.

Footer contact rows have a shared 44px minimum height, aligned icons/text, and an 8px gap so plain-text address rows match linked rows. CompanyContact retains the project-discussion CTA and removes the email/phone shortcuts. The Traditional Chinese hero headline now reads 「打造符合您營運需求的廠房。」.

Email wiring, separate business templates, sender-domain prerequisites, and generated client/team previews are documented in [inquiry-email-review.md](../inquiry-email-review.md).

## Distinct factory homepage and Services content

Home follows this order: hero → photo gallery → “How we begin” → About HISSUS → contact. The combined company section explains the team’s construction experience and approach, with a planning-workspace illustration softly faded into white. Desktop copy sits over the image’s calm left side; mobile copy and image stack with softened edges. About has no outbound CTA; its short closing line introduces the single coordination point. The three steps (“Share your needs”, “Define the scope”, “Discuss the approach”) link onward to Services for the full construction approach. The homepage contact band contains just its own short heading and the existing project-discussion button. Services keeps the original full contact section; Services retains the complete Experience/GMP sections and contractual caveats. All new copy and metadata are bilingual JSON keys, with no em dashes, invented projects or additional service claims.

## Canonical routes and matched heroes

Public routes are grouped under `/factory` and `/windows`, with `/factory/home` as the default. Shared `lib/siteRoutes.ts` defines destinations; header navigation, business switches, footer links, CTAs, product selection, language switching and metadata use the new namespace. Traditional Chinese still prepends `/tw`. Client and prepared Netlify HTTP redirects keep legacy bookmarks usable; client redirects retain search/hash. Both hero sections are 520px below 640px viewport width and 600px above it, verified in both languages at the supported test widths. The factory heading/copy spacing is kept compact so the section does not grow beyond those heights.

The company story lives at `/factory/home#about` (or `/tw/factory/home#about`). The old `/factory/about` and `/about` addresses redirect there in the client, retaining language/query and any existing hash. With no supplied hash, they use `#about`. The generated scene contains no people or identifiable client project; it remains separate from all six real gallery images. Responsive 640/1200/1672px WebPs are lazy-loaded and total 168,370 bytes; CSS gradients provide the blending without changing the source image.

## One-stop factory coordination

Home introduces planning-to-operations support in its hero subtitle and explains the single coordination point in About HISSUS. Services expands the user-provided scope through `FactoryServices.tsx`: planning/permits (site selection and government permit communication), design/construction (architectural design and engineering construction), and operations/people (factory operations, quality systems and human resources). Seven concise labeled descriptions keep the full scope scannable without duplicating it on Home. The existing defined-scope note, hospital/cleanroom experience and GMP explanation remain. All copy and metadata are localized in English and Traditional Chinese.

The gallery order is entrance IMG_1801, open factory floor IMG_1555, bright room IMG_1821, then IMG_1771, IMG_1811 and IMG_1366. Services selects IMG_1801 by ID so gallery reordering does not change its hero photograph.
