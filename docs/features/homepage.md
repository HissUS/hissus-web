# Feature: Company Homepage & Preserved Screen Homepage

## 🎯 Business Intent

The company homepage now introduces factory/facility setup and construction, attributed team hospital/cleanroom experience, and a proposed Guaranteed Maximum Price model. Its shared sections are in `features/homepage/components/CompanySections.tsx`; HomePage composes them with an illustrative factory background hero and a six-photo gallery and a dedicated business switch in the shared header. Services, About, and Contact pages sit beside existing pages. See `docs/factory-website-review.md` for content, route, security, and verification details.

The original screen homepage is retained in `src/pages/WindowScreenPage.tsx` at `/window-screen-solutions` and `/tw/window-screen-solutions`, using the original HeroSection, CatalogExplorer, and TrustSection. The product catalog and quote URLs remain unchanged. The section below documents those preserved components.

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
  * "Get A Quote" → `${prefix}/get-a-quote` (`variant="default" size="lg"`)
  * "Explore Products" → `${prefix}/products` (`variant="outline" size="lg"`, `border-white bg-transparent text-white`)
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

`FactoryImage.tsx` renders same-origin responsive WebP assets with explicit dimensions, alt text, srcset, and lazy loading. The home hero uses a generated architectural concept through `FactoryHero.tsx`, clearly labeled as illustrative. Real IMG_1555 remains in the gallery. Services uses IMG_1801 with an edge gradient that blends into the page; About uses IMG_1811. `FactoryGallery.tsx` presents six curated photos with bilingual captions and a native modal viewer. `hooks/useFactoryGallery.ts` manages the viewer, body-scroll lock, and focus return without scrolling. Escape closes it; arrows and buttons move between images.

`Reveal.tsx` uses IntersectionObserver to fade content once as it enters view. Only opacity/transform change, preserving layout. Reduced-motion users see content immediately; unsupported observers leave content visible. No animation dependency was added.

Language navigation sets `resetScroll: false` and disables hash scrolling for that transition, while retaining query/hash. Product-card links also disable scroll reset and hash scrolling; the old mobile scroll-to-details callback was removed. Existing page navigation, explicit anchor links, and the back-to-top control retain their intended destinations. Gallery close restores focus without scrolling.

Window menus now expose Home, Products, and Quote in both desktop and mobile layouts. Both inquiry forms omit the standalone email link beneath the privacy note; verified contact details remain in the footer.

Video cards request the actual YouTube thumbnail from `i.ytimg.com`, fall back to an existing category photo on image failure, and retain the poster while the player loads. A single user click mounts the privacy-enhanced iframe with `autoplay=1` and the autoplay permission. No player or playback is started before that click. The narrow image host is included in Netlify CSP; YouTube playback is still subject to provider availability and browser policies.

Footer contact rows have a shared 44px minimum height, aligned icons/text, and an 8px gap so plain-text address rows match linked rows. CompanyContact retains the project-discussion CTA and removes the email/phone shortcuts. The Traditional Chinese hero headline now reads 「從規劃到建置，打造您的理想廠房。」.

Email wiring, separate business templates, sender-domain prerequisites, and generated client/team previews are documented in [inquiry-email-review.md](../inquiry-email-review.md).
