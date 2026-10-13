# PROGRESS LOG

---

### [FEAT-009] Quote Form Resend Integration & Validation (2026-05-01)

- **Summary**: Completely overhauled the Quote Page to use a Netlify Serverless Function and the Resend API instead of relying on local mail clients (`mailto:`). Implemented bilingual HTML email templates for both the admin notification and a user confirmation copy, dynamically selecting the language based on the frontend's current locale. Embedded the Hissus logo directly into the email HTML as a base64 data URI to ensure it renders correctly across all email clients. Configured the sender address to use the newly verified `hissus.com` domain (`quotes@hissus.com`). Added strict UI validation to the phone number field (numbers only, exactly 10 digits).
- **Affected Files**:
  - `frontend/netlify/functions/quote.ts` (new)
  - `frontend/netlify.toml` (configured esbuild and included logo file)
  - `frontend/src/pages/QuotePage.tsx` (added POST fetch, phone validation, strict input masking)
  - `frontend/src/locales/en.json` & `zh-TW.json` (added email template strings and phone validation errors)
  - `frontend/public/logo.png` & `frontend/netlify/functions/logo.png`
- **Verification**:
  - **Action 1**: Submit a valid quote request on the frontend.
  - **Expected**: A success message appears. Two HTML-formatted emails are sent from `quotes@hissus.com`: one to the admin, and one confirmation copy to the user's email, correctly localized.
  - **Action 2**: Attempt to type letters into the phone number field.
  - **Expected**: The input strips non-numeric characters automatically and requires exactly 10 digits before allowing submission.

---

### [FIX-002] Quote Email Flow Hardening (2026-05-01)

- **Summary**: Fixed the frontend quote submission flow so Netlify Dev loads the correct local function directory and local env file, the quote page handles non-JSON error responses safely, and the email function reads secrets only at request time. Local secret files are ignored so the setup is safe to keep in a public GitHub repo.
- **Affected Files**:
  - `frontend/netlify.toml`
  - `frontend/netlify/functions/quote.ts`
  - `frontend/src/pages/QuotePage.tsx`
  - `frontend/.gitignore`
  - `frontend/package.json`
  - `frontend/pnpm-lock.yaml`
  - `frontend/tsconfig.app.json`
  - `frontend/tsconfig.json`
  - `frontend/deno.lock`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Run the production frontend build.
  - **Expected**: TypeScript and Vite complete without errors.
  - **Command/URL**: `cd frontend && pnpm build`
  - **Action**: Start Netlify Dev and submit the quote form once.
  - **Expected**: The request reaches `/.netlify/functions/quote` and returns a success response instead of a 404 or missing-env failure.
  - **Command/URL**: `cd frontend && npx netlify dev` then open `http://localhost:8888/quote`
  - **Fail Case**: Remove `RESEND_API_KEY` from `frontend/.env.local` and submit the form.
  - **Expected**: The function returns a 500 response with `RESEND_API_KEY not configured`.

### [INIT-001] Project Setup & Groundwork (2026-03-08)

- **Summary**: Full monorepo initialization covering Git quality controls (Husky + Commitlint), Docker infrastructure (PostgreSQL PostGIS + Spring Boot + Nginx), Spring Boot backend skeleton (BaseEntity, Result<T>, GlobalExceptionHandler, TraceIdFilter, Flyway V1 migration), and React frontend skeleton (Vite + TanStack Router + TanStack Query v5 + react-i18next + Zustand + Tailwind).

- **Affected Files**:
  - `package.json` (root — Husky + Commitlint)
  - `.commitlintrc.json`
  - `.husky/commit-msg`
  - `.husky/pre-commit`
  - `.gitignore` (updated)
  - `infra/docker-compose.yml`
  - `infra/docker-compose.override.yml` (Apple Silicon ARM64 fix)
  - `infra/nginx/nginx.conf`
  - `backend/pom.xml`
  - `backend/Dockerfile`
  - `backend/docker-entrypoint.sh`
  - `backend/src/main/java/com/hissus/HissusApplication.java`
  - `backend/src/main/java/com/hissus/common/audit/BaseEntity.java`
  - `backend/src/main/java/com/hissus/common/result/Result.java`
  - `backend/src/main/java/com/hissus/common/exception/ErrorCode.java`
  - `backend/src/main/java/com/hissus/common/exception/BusinessException.java`
  - `backend/src/main/java/com/hissus/common/exception/GlobalExceptionHandler.java`
  - `backend/src/main/java/com/hissus/common/logging/TraceIdFilter.java`
  - `backend/src/main/java/com/hissus/config/WebConfig.java`
  - `backend/src/main/java/com/hissus/config/SecurityConfig.java`
  - `backend/src/main/resources/application.yml`
  - `backend/src/main/resources/logback-spring.xml`
  - `backend/src/main/resources/db/migration/V20260308000000__Initial_Schema.sql`
  - `frontend/vite.config.ts`
  - `frontend/src/main.tsx`
  - `frontend/src/i18n.ts`
  - `frontend/src/api/axios.ts`
  - `frontend/src/router/index.tsx`
  - `frontend/src/store/uiStore.ts`
  - `frontend/src/components/layout/MainLayout.tsx`
  - `frontend/src/layouts/AuthLayout.tsx`
  - `frontend/src/hooks/useLocale.ts`
  - `frontend/src/hooks/index.ts`
  - `frontend/src/locales/config.ts`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/src/locales/en.json`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/LoginPage.tsx`
  - `frontend/src/pages/ProductsPage.tsx`
  - `frontend/src/constants/regex.ts`
  - `frontend/scripts/sort-locales.mjs`
  - `frontend/scripts/check-locales.mjs`
  - `README.md`

- **Verification**:
  - **Action 1**: Start infrastructure and check backend health.
  - **Expected**: JSON `{"status":"UP"}`.
  - **Command**:

    ```bash
    cd infra && docker compose --profile local up -d
    curl http://localhost:8080/api/actuator/health
    ```

  - **Action 2**: Verify PostGIS extension is active.
  - **Expected**: PostGIS version string output.
  - **Command**:

    ```bash
    docker exec hissus_db psql -U hissus -d hissus -c "SELECT PostGIS_version();"
    ```

  - **Action 3**: Verify Flyway migration executed successfully.
  - **Expected**: V20260308000000 with status `SUCCESS`.
  - **Command**:

    ```bash
    curl http://localhost:8080/api/actuator/flyway
    ```

  - **Action 4**: Verify frontend starts and redirects to English default.
  - **Expected**: Browser navigates to `/home` (no country suffix = English default).
  - **URL**: `http://localhost:5173`

  - **Action 5**: Verify i18n routing works.
  - **Expected**: UI text changes to Traditional Chinese.
  - **URL**: `http://localhost:5173/home/tw`

  - **Action 6**: Verify Docker Secrets are not leaked into environment.
  - **Expected**: No output (password is read from file, not env var).
  - **Command**:

    ```bash
    docker exec hissus_backend env | grep -iE "password|secret|jwt"
    ```

  - **Action 7**: Verify uploads volume persistence.
  - **Expected**: File appears in `infra/data/uploads/` on host.
  - **Command**:

    ```bash
    docker exec hissus_backend touch /app/uploads/test.txt
    ls infra/data/uploads/test.txt
    ```

  - **Action 8**: Verify GIS permission is active.
  - **Expected**: Table created without error.
  - **Command**:

    ```bash
    docker exec hissus_db psql -U hissus -d hissus -c "CREATE TABLE gis_test (loc GEOGRAPHY); DROP TABLE gis_test;"
    ```

  - **Fail Case**: Submit an invalid commit message.
  - **Expected**: commitlint blocks the commit with a scope error.
  - **Command**:
    ```bash
    git commit -m "bad commit message"  # should fail
    ```

---

### [INIT-002] Backend Infrastructure Fixes (2026-03-08)

- **Summary**: Fixed three gaps discovered during first-run verification: (1) Docker Secrets were mounted but never read by Spring Boot — added `docker-entrypoint.sh` to export secret files as env vars before JVM starts. (2) Spring Security blocked `/actuator/flyway` with 401 — added `SecurityConfig` to permit actuator and Swagger in all profiles. (3) Backend port 8080 was not published to host — added `ports: "8080:8080"` to `docker-compose.yml`.

- **Affected Files**:
  - `backend/docker-entrypoint.sh` (new)
  - `backend/Dockerfile` (updated ENTRYPOINT)
  - `backend/src/main/java/com/hissus/config/SecurityConfig.java` (new)
  - `infra/docker-compose.yml` (added `ports: "8080:8080"` to backend service)

- **Verification**:
  - **Action 1**: Verify Flyway endpoint is accessible without auth.
  - **Expected**: JSON with migration list, state `SUCCESS`.
  - **Command**: `curl http://localhost:8080/api/actuator/flyway`

  - **Action 2**: Verify backend port is reachable directly.
  - **Expected**: `{"status":"UP"}`.
  - **Command**: `curl http://localhost:8080/api/actuator/health`

  - **Action 3**: Verify password is not leaked as env var.
  - **Expected**: No output (secret is read from file via entrypoint script, not env var).
  - **Command**: `docker exec hissus_backend env | grep -iE "password|datasource_password"`

  - **Fail Case**: Remove `db_password.txt` content and restart.
  - **Expected**: `hissus_db` container becomes unhealthy; backend refuses to start.

---

### [INIT-003] i18n URL Routing Refactor (2026-03-08)

- **Summary**: Changed URL routing pattern from `/$lang/page` (language prefix) to `/page/$country` (country suffix). English (US) is now the default with no suffix (`/home`). Other locales append a 2-letter country code (`/home/tw`). Added `useLocale()` and `useLocaleSwitcher()` hooks for URL-driven language detection and switching. Language switcher added to `MainLayout` header.

- **Affected Files**:
  - `frontend/src/router/index.tsx` (renamed from `.ts`, restructured with layout routes)
  - `frontend/src/locales/config.ts` (new — `COUNTRY_TO_LOCALE` mapping, source of truth)
  - `frontend/src/hooks/useLocale.ts` (new — reads `$country` param, syncs `i18n.changeLanguage()`)
  - `frontend/src/hooks/index.ts` (updated barrel export)
  - `frontend/src/i18n.ts` (simplified — removed `LanguageDetector`, detection via hook)
  - `frontend/src/components/layout/MainLayout.tsx` (added `useLocale()`, language switcher UI)
  - `frontend/src/layouts/AuthLayout.tsx` (added `useLocale()` call)
  - `frontend/src/pages/HomePage.tsx` (new)
  - `frontend/src/pages/LoginPage.tsx` (new)
  - `frontend/src/pages/ProductsPage.tsx` (new)

- **Verification**:
  - **Action 1**: Verify English default (no suffix).
  - **Expected**: Page loads in English, URL stays `/home`.
  - **URL**: `http://localhost:5173/home`

  - **Action 2**: Verify localized route.
  - **Expected**: Page text switches to Traditional Chinese.
  - **URL**: `http://localhost:5173/home/tw`

  - **Action 3**: Verify language switcher button.
  - **Expected**: Clicking `TW` navigates from `/home` → `/home/tw`.
  - **URL**: `http://localhost:5173/home` → click TW button in header

  - **Action 4**: Verify root redirect.
  - **Expected**: `http://localhost:5173/` redirects to `/home`.

  - **Fail Case**: Visit `/home/xx` (unknown country code).
  - **Expected**: Page loads but falls back to English (no crash).

---

### [INIT-004] Locale Quality Tooling (2026-03-08)

- **Summary**: Added two scripts to enforce locale consistency. `sort-locales.mjs` deep-sorts all JSON keys alphabetically and is run automatically by lint-staged on every commit for `src/locales/*.json` files. `check-locales.mjs` compares all locale files against `en.json` and warns on missing or extra keys; runs in the pre-commit hook (non-blocking by default — change `process.exit(0)` to `process.exit(1)` to enforce).

- **Affected Files**:
  - `frontend/scripts/sort-locales.mjs` (new)
  - `frontend/scripts/check-locales.mjs` (new)
  - `frontend/package.json` (added `check-locales` script; updated `lint-staged` config)
  - `.husky/pre-commit` (added `pnpm check-locales` step)

- **Verification**:
  - **Action 1**: Verify sort runs on commit.
  - **Expected**: Locale files are re-sorted before commit; no diff if already sorted.
  - **Command**: `node scripts/sort-locales.mjs src/locales/en.json`

  - **Action 2**: Verify completeness check passes with all keys present.
  - **Expected**: `✓  zh-TW.json`.
  - **Command**: `cd frontend && pnpm check-locales`

  - **Fail Case**: Remove a key from `zh-TW.json` and run check.
  - **Expected**: Warning listing the missing key(s).
  - **Command**: `cd frontend && pnpm check-locales`

---

### [FEAT-001] Homepage Feature (2026-03-12)

- **Summary**: Implemented the Homepage as a thin orchestration page consuming three independent feature modules: `homepage` (HeroSection + TrustSection), `products` (FeaturedCatalogGrid with 3 static products), and `inquiry` (static contact display). Installed Shadcn UI and created Button/Card/Badge thin wrappers. All UI strings are fully i18n-keyed in English and Traditional Chinese.
- **Affected Files**:
  - `frontend/tsconfig.json` (added root-level `@/*` alias for Shadcn init)
  - `frontend/components.json` (Shadcn config, generated)
  - `frontend/src/index.css` (Shadcn CSS variables)
  - `frontend/src/components/ui-wrapper/Button/` (Button wrapper + cta variant, 48px h, #0056b3)
  - `frontend/src/components/ui-wrapper/Card/` (Card thin wrapper)
  - `frontend/src/components/ui-wrapper/Badge/` (Badge thin wrapper + realLifeInstall style)
  - `frontend/src/components/ui-wrapper/index.ts` (updated barrel)
  - `frontend/src/locales/en.json` (added `homepage`, `inquiry`, `products.featured`, `products.spec`, product name keys)
  - `frontend/src/locales/zh-TW.json` (mirrored all new keys in Traditional Chinese)
  - `frontend/src/features/products/types/product.ts` (Zod schema + Product type)
  - `frontend/src/features/products/hooks/useFeaturedProducts.ts` (static 3-product hook)
  - `frontend/src/features/products/components/ProductCard.tsx`
  - `frontend/src/features/products/components/FeaturedCatalogGrid.tsx`
  - `frontend/src/features/homepage/components/HeroSection.tsx` (full-bleed, overlay, CTA)
  - `frontend/src/features/homepage/components/TrustSection.tsx` (3 pillars + brand narrative)
  - `frontend/src/features/inquiry/components/ContactFooter.tsx` (phone, email, social — 44px targets)
  - `frontend/src/features/inquiry/components/InquiryForm.tsx`
  - `frontend/src/pages/HomePage.tsx` (replaced stub with orchestrator)
  - `frontend/src/components/layout/MainLayout.tsx` (removed max-w-7xl from main for full-bleed hero)
- **Verification**:
  - **Action 1**: Start dev server and visit English homepage.
  - **Expected**: Full-bleed hero image with "Modern Retractable Screens" title, 3 product cards with "Real-life Install" badges, 3 trust pillars, contact section with phone and email.
  - **Command**: `cd frontend && pnpm dev` → `http://localhost:5173/home`

  - **Action 2**: Verify TW locale renders in Chinese.
  - **Expected**: All visible strings in Traditional Chinese.
  - **URL**: `http://localhost:5173/tw/home`

  - **Action 3**: Verify i18n completeness.
  - **Expected**: `✓ zh-TW.json`
  - **Command**: `cd frontend && pnpm check-locales`

  - **Action 4**: Verify clean production build.
  - **Expected**: Exit code 0, all 3 product images bundled.
  - **Command**: `cd frontend && pnpm build`

  - **Fail Case**: Switch language from TW to EN via header button.
  - **Expected**: URL changes from `/tw/home` → `/home`, all strings revert to English.

---

### [FEAT-002] MainLayout Refactor — Header, Footer & Console Route (2026-03-14)

- **Summary**: Decomposed the monolithic `MainLayout` into three dedicated components: `Header` (sticky 3-zone nav with Console link + Login CTA), `Footer` (dark theme with contact info from `SITE_CONFIG`, social links, language switcher), and a thin `MainLayout` orchestrator. Added `/console` and `/$country/console` routes. Language switcher moved from header to footer.
- **Affected Files**:
  - `frontend/src/components/layout/Header/index.tsx` (new)
  - `frontend/src/components/layout/Footer/index.tsx` (new)
  - `frontend/src/components/layout/MainLayout.tsx` (new)
  - `frontend/src/components/layout/MainLayout.tsx` (replaced with re-export)
  - `frontend/src/router/index.tsx` (added console routes)
  - `frontend/src/locales/en.json` (added `nav.console`, `footer.*` keys)
  - `frontend/src/locales/zh-TW.json` (added mirrored keys)
- **Verification**:
  - **Action 1**: Start dev server and inspect header layout.
  - **Expected**: 3-zone flex header — "Hissus" brand left, Home/Products/Console nav center (Console has lock icon), Login button right. Header is sticky on scroll with blur effect.
  - **Command**: `cd frontend && pnpm dev` → `http://localhost:5173/home`

  - **Action 2**: Verify footer renders contact info from `SITE_CONFIG`.
  - **Expected**: Phone, Email, Line, WeChat entries with icons. Facebook link opens `https://www.facebook.com/hiss.eagle.2025/` in a new tab.
  - **URL**: `http://localhost:5173/home` (scroll to bottom)

  - **Action 3**: Switch locale via footer language toggle.
  - **Expected**: Clicking `TW` changes URL from `/home` → `/tw/home` and all UI strings switch to Traditional Chinese.
  - **URL**: `http://localhost:5173/home` → click TW button in footer

  - **Action 4**: Verify Console route resolves.
  - **Expected**: Page renders "Console — coming soon" placeholder without 404.
  - **URL**: `http://localhost:5173/console` and `http://localhost:5173/tw/console`

  - **Action 5**: Verify i18n completeness.
  - **Expected**: `✓ zh-TW.json` (zero missing keys).
  - **Command**: `cd frontend && pnpm check-locales`

  - **Fail Case**: Visit `/console` and inspect Console nav link style.
  - **Expected**: Console link is visually distinct from Home/Products (lock icon visible, muted color).

---

### [FEAT-003] UI Component Architecture Fix (2026-03-14)

- **Summary**: Fixed `Button` component `variant="default"` having no hover effect. Root cause: the generated Shadcn `button.tsx` used `[a]:hover:bg-primary/80` — a Tailwind v4 arbitrary element selector that only fires when the rendered element itself is an `<a>` tag. Since `@base-ui/react` renders a `<button>` element, the hover never triggered. Fixed to standard `hover:bg-primary/80`.
- **Affected Files**:
  - `frontend/src/components/ui/button.tsx` (line 11: `[a]:hover:bg-primary/80` → `hover:bg-primary/80`)
- **Verification**:
  - **Action 1**: Hover over any "Get A Quote" button on the homepage.
  - **Expected**: Button background darkens (primary/80 opacity).
  - **URL**: `http://localhost:5173/home`

---

### [FEAT-004] Homepage CatalogExplorer (2026-03-14)

- **Summary**: Replaced the `products` feature's `FeaturedCatalogGrid` (static product cards) with a self-contained `CatalogExplorer` inside the `homepage` feature. Features tab navigation across 4 product categories, an Embla carousel per tab (infinite loop, glassmorphism arrows), a frameless spec grid, and a locale-aware "Explore Details" CTA. Key engineering fixes: `ensureLoopBuffer()` to pad small image sets for smooth Embla loop; Embla-canonical spacing (`-ml-4 flex` + `pl-4` per slide outer wrapper, separate from `overflow-hidden rounded-2xl` inner container).
- **Affected Files**:
  - `frontend/package.json` (added `embla-carousel-react@8.6.0`)
  - `frontend/src/features/homepage/components/CatalogExplorer/types.ts` (new)
  - `frontend/src/features/homepage/components/CatalogExplorer/useCatalogData.ts` (new)
  - `frontend/src/features/homepage/components/CatalogExplorer/GalleryCarousel.tsx` (new)
  - `frontend/src/features/homepage/components/CatalogExplorer/SpecSection.tsx` (new)
  - `frontend/src/features/homepage/components/CatalogExplorer/CatalogExplorer.tsx` (new)
  - `frontend/src/features/products/components/FeaturedCatalogGrid.tsx` (deleted)
  - `frontend/src/features/products/components/ProductCard.tsx` (deleted)
  - `frontend/src/features/products/hooks/useFeaturedProducts.ts` (deleted)
  - `frontend/src/pages/HomePage.tsx` (updated imports)
  - `frontend/src/locales/en.json` (added `products.windows`, `common.explore_details`)
  - `frontend/src/locales/zh-TW.json` (mirrored)
- **Verification**:
  - **Action 1**: Visit homepage and verify 4 category tabs are rendered.
  - **Expected**: Single Handle / Multi Handle / Double Handle / Windows tabs visible.
  - **URL**: `http://localhost:5173/home`

  - **Action 2**: Switch tabs and verify carousel images change per category.
  - **Expected**: Different images per tab; arrows appear on hover for tabs with > 3 images.

  - **Action 3**: Verify infinite loop scroll works for all tabs.
  - **Expected**: Carousel scrolls continuously without getting stuck.

  - **Action 4**: Click "Explore Details".
  - **Expected**: Navigates to `/products?tab=single-handle` (or whichever tab is active).

  - **Action 5**: Clean build.
  - **Command**: `cd frontend && pnpm build`
  - **Expected**: Exit code 0, zero TS errors.

---

### [FEAT-005] HeroSection Refinement (2026-03-14)

- **Summary**: Added dual CTAs below the hero subtitle ("Get A Quote" + "Explore Products"), tightened headline typography to `text-5xl font-bold tracking-tight`, added gradient overlay (`bg-linear-to-b from-transparent to-black/40`), and image fade-in animation (`animate-in fade-in duration-700`). The "Explore Products" outline button requires `bg-transparent` override since `variant="outline"` defaults to `bg-background` (white), which is invisible on the dark overlay.
- **Affected Files**:
  - `frontend/src/features/homepage/components/HeroSection.tsx`
  - `frontend/src/locales/en.json` (added `homepage.hero.explore`)
  - `frontend/src/locales/zh-TW.json` (added `homepage.hero.explore`)
- **Verification**:
  - **Action 1**: Visit homepage hero.
  - **Expected**: Two buttons visible below subtitle — Hissus Blue "Get A Quote" and white-outline "Explore Products".
  - **URL**: `http://localhost:5173/home`

  - **Action 2**: Verify both buttons are visible before hover (not transparent).
  - **Expected**: "Explore Products" shows white border and white text on the dark overlay without requiring hover.

  - **Action 3**: Click "Get A Quote" on TW locale.
  - **Expected**: Navigates to `/tw/get-a-quote`.
  - **URL**: `http://localhost:5173/tw/home`

### [FEAT-006] Back-to-Top Component (2026-04-29)

- **Summary**: Added a shared `BackToTopButton` UI component and wired it into the global `MainLayout` so the button appears on every page. The button uses the `bg-primary` token (consistent with theme), is positioned bottom-right, and becomes visible after the user scrolls more than 240px. It is implemented as a thin, accessible component in the UI layer.
- **Affected Files**:
  - `frontend/src/components/ui/BackToTopButton.tsx` (new)
  - `frontend/src/components/layout/MainLayout.tsx` (replaced inline button with shared component)
- **Verification**:
  - **Action 1**: Start dev server and visit any page.
  - **Expected**: No back-to-top visible at page load (<= 240px scroll).
  - **Action 2**: Scroll down more than 240px.
  - **Expected**: The round primary-colored button fades in at bottom-right; clicking it scrolls smoothly to top.
  - **Action 3**: Verify mobile behavior.
  - **Expected**: Button appears the same on mobile devices and meets 44x44px tap target.

### [FEAT-007] Quote Page (2026-04-29)

- **Summary**: Added a `QuotePage` that mirrors the product inquiry flow and collects user contact information: first name, last name, email, phone, grouped Texas city selection, selected product, and an optional message. The city selector is split into North Texas, Middle Texas, and South Texas groups, with more cities around Houston and Victoria included. On submit, the page opens the user's mail client with a pre-filled email addressed to `goodexlink@gmail.com` containing the organized information.
- **Affected Files**:
  - `frontend/src/pages/QuotePage.tsx` (new)
  - `frontend/src/router/index.tsx` (wired `QuotePage` for both `/get-a-quote` and `/$country/get-a-quote`)
  - `frontend/src/locales/en.json` (added quote labels, city groups, and expanded city list)
  - `frontend/src/locales/zh-TW.json` (added matching quote labels, city groups, and mixed-format city list)
- **Verification**:
  - **Action 1**: Start dev server and visit `/get-a-quote`.
  - **Expected**: A form asking for First/Last name, Email, Phone, City (Texas) grouped by North/Middle/South Texas, Product wanted, and Message.
  - **Action 2**: Fill required fields and click `Send Quote`.
  - **Expected**: The user's default mail client opens with a pre-filled email to `goodexlink@gmail.com`, subject `Quote Request — {First Last}`, and a clearly organized body containing each field on its own line.

### [FEAT-008] Product Videos Gallery (2026-04-30)

- **Summary**: Added optional YouTube video galleries that render below the image carousel on both the homepage catalog and product detail page. Video cards autoplay muted and loop by default, with a click-to-play overlay that enables audio/controls. The video section is only shown when a product has videos.
- **Affected Files**:
  - `frontend/src/features/homepage/components/CatalogExplorer/types.ts` (added `CatalogVideo`, `videos` on category)
  - `frontend/src/features/homepage/components/CatalogExplorer/GalleryCarousel.tsx` (renders video gallery below images)
  - `frontend/src/features/homepage/components/CatalogExplorer/CatalogExplorer.tsx` (passes videos)
  - `frontend/src/pages/ProductsPage.tsx` (passes videos)
  - `frontend/src/locales/en.json` (added video labels)
  - `frontend/src/locales/zh-TW.json` (added video labels)
- **Verification**:
  - **Action 1**: Add at least one YouTube URL to a product's `videos` list in `catalog.ts`.
  - **Expected**: A “Videos” section appears below the image gallery with a muted looping preview and a “Click to play” overlay.
  - **Action 2**: Click the overlay.
  - **Expected**: The video plays with audio/controls enabled.

### [FEAT-006] TrustSection Typography Alignment (2026-03-14)

- **Summary**: Replaced all hardcoded hex colors in `TrustSection` with Tailwind gray scale and CSS variables, aligning with the typography system established in CatalogExplorer. Heading scaled from `text-2xl` to `text-4xl` for visual consistency with the section above it.
- **Affected Files**:
  - `frontend/src/features/homepage/components/TrustSection.tsx`
- **Verification**:
  - **Action 1**: Inspect TrustSection visually.
  - **Expected**: Section heading matches CatalogExplorer heading size (`text-4xl`); icon color matches primary blue; body text is consistent gray.
  - **URL**: `http://localhost:5173/home` (scroll past CatalogExplorer)

---

### [FEAT-010] Factory & Facility Website with Preserved Screen Business (2026-10-11)

- **Summary**: Repositioned the bilingual company homepage around factory/facility construction and a proposed GMP cooperation model. Preserved the full screen homepage/catalog/media and quote flow, added facility inquiries, hardened the Netlify mail handler, refreshed dependencies within existing major ranges, and prepared hosting controls without deployment.
- **Affected Files**:
  - `README.md`
  - `docs/PROGRESS.md`
  - `docs/factory-website-review.md`
  - `docs/features/homepage.md`
  - `docs/security-review.md`
  - `frontend/eslint.config.js`
  - `frontend/netlify.toml`
  - `frontend/netlify/functions/quote.ts`
  - `frontend/netlify/inquiry.ts`
  - `frontend/package.json`
  - `frontend/pnpm-lock.yaml`
  - `frontend/scripts/browser-regression.mjs`
  - `frontend/scripts/csp-regression.mjs`
  - `frontend/scripts/inquiry-regression.mjs`
  - `frontend/src/api/axios.ts`
  - `frontend/src/assets/images/multi_handle/ML_screendoor_hori-1600.webp`
  - `frontend/src/assets/images/multi_handle/ML_screendoor_hori-800.webp`
  - `frontend/src/assets/index.css`
  - `frontend/src/components/layout/Footer/index.tsx`
  - `frontend/src/components/layout/Header/index.tsx`
  - `frontend/src/components/layout/MainLayout.tsx`
  - `frontend/src/components/ui/BackToTopButton.tsx`
  - `frontend/src/features/homepage/components/CatalogExplorer/CatalogExplorer.tsx`
  - `frontend/src/features/homepage/components/CatalogExplorer/GalleryCarousel.tsx`
  - `frontend/src/features/homepage/components/CompanySections.tsx`
  - `frontend/src/features/homepage/components/index.ts`
  - `frontend/src/features/homepage/index.ts`
  - `frontend/src/features/inquiry/index.ts`
  - `frontend/src/features/inquiry/useInquiry.ts`
  - `frontend/src/hooks/useLocale.ts`
  - `frontend/src/hooks/usePageMetadata.ts`
  - `frontend/src/layouts/AuthLayout.tsx`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/src/pages/AboutPage.tsx`
  - `frontend/src/pages/ContactPage.tsx`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/LoginPage.tsx`
  - `frontend/src/pages/ProductsPage.tsx`
  - `frontend/src/pages/QuotePage.tsx`
  - `frontend/src/pages/ServicesPage.tsx`
  - `frontend/src/pages/WindowScreenPage.tsx`
  - `frontend/src/router/index.tsx`
  - `package.json`
  - `pnpm-lock.yaml`
- **Verification**:
  - **Action**: Build, lint, validate locale parity, and run server regression tests.
  - **Expected**: Build/TypeScript, lint, locale parity pass; all 7 server tests pass (mail stubbed).
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Run a production preview and browser/CSP regressions.
  - **Expected**: 110 browser checks pass across 1440/390/320 widths and both languages; 6 CSP pages report no violations. Real mail and external video playback remain unverified.
  - **Command/URL**: `cd frontend && pnpm preview --host 0.0.0.0 --port 4173`; another terminal: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Action**: Exercise failure cases in the actual bundled function: invalid types/products/cities, malformed JSON, excessive body, untrusted Origin, provider failure, and confirmation failure.
  - **Expected**: 400/413/403/502 as appropriate; no false success on team-mail failure; optional confirmation failure reports team receipt. No messages actually sent.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
  - **Action**: Compare security and content delivery review.
  - **Expected**: One remaining frontend tooling advisory explained; no claim of deployed protections, live email verification, or confirmed factory photography.
  - **Command/URL**: `cat docs/factory-website-review.md docs/security-review.md`; `cd frontend && pnpm audit`

### [FIX-003] pnpm Release-Age Policy and Writable Cache (2026-10-11)

- **Summary**: Replaced too-recent Query, Zod and ip-address resolutions with eligible releases and rebuilt the lockfile under pnpm 11's active safety policy. Added a portable ignored store and explicit install-script permissions so standard install/run commands work in the cloud workspace without bypassing verification.
- **Affected Files**:
  - `frontend/package.json`
  - `frontend/pnpm-lock.yaml`
  - `frontend/pnpm-workspace.yaml`
  - `frontend/.gitignore`
  - `docs/security-review.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Install the frozen lockfile using default pnpm 11 and run normal scripts.
  - **Expected**: Release-age checks pass; no SQLite/cache permission failures; build, lint, locales and seven handler regressions pass.
  - **Command/URL**: `cd frontend && pnpm install --frozen-lockfile && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Repeat production browser/CSP checks against the rebuilt assets.
  - **Expected**: 110 browser checks and six CSP pages pass, with external mail/video stubbed.
  - **Command/URL**: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Resolve a package published inside the configured 1440-minute window in an isolated reproduction.
  - **Expected**: pnpm rejects it. Original user log documented rejection; no production dependency downgrade of protections or age-policy exception was added.

### [FEAT-011] Dedicated Screen Button and Compact Facility Contact (2026-10-11)

- **Summary**: Moved Window & Screen Solutions out of the main navigation list into a button immediately before English/Chinese controls, with a responsive mobile arrangement. Replaced the facility contact page with the screen-quote-style layout and five fields: name/company name, phone, email, inquiry subject, and optional message; preserved screen quote fields and shared mail/error handling.
- **Affected Files**:
  - `frontend/src/components/layout/Header/index.tsx`
  - `frontend/src/pages/ContactPage.tsx`
  - `frontend/src/pages/QuotePage.tsx`
  - `frontend/src/features/inquiry/components/FacilityInquiryForm.tsx`
  - `frontend/src/features/inquiry/components/index.ts`
  - `frontend/src/features/inquiry/index.ts`
  - `frontend/src/features/inquiry/useInquiry.ts`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/netlify/inquiry.ts`
  - `frontend/netlify/functions/quote.ts`
  - `frontend/scripts/inquiry-regression.mjs`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/factory-website-review.md`
  - `docs/security-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build, lint, check locale parity and run bundled function regressions.
  - **Expected**: TypeScript/build, lint, locales and all 8 function tests pass. Facility inquiries accept name/subject without city/product; old screen requests still work. Missing/oversized/injected facility inputs produce 400 before any mail call.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Run production browser and CSP checks.
  - **Expected**: 118 browser checks pass in EN/zh-TW at 1440/390/320px. Screen button precedes language controls and opens the complete section; compact contact form has five visible fields and sends only relevant fields. Screen form and media remain functional. Six CSP pages have no violations; mail/player are stubbed.
  - **Command/URL**: Run `cd frontend && pnpm preview --host 0.0.0.0 --port 4173`; in another terminal: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Submit a facility payload with an empty subject, array name, control-character subject, or invalid phone/email.
  - **Expected**: Server rejects with 400 and sends no email; provider failures still produce truthful localized errors.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
- **Photo access**: Google Photos retry returned a proxy 403. Google Photos/redirect/image domains were saved in the environment network draft; review/save/publication is still needed before runtime access can be rechecked. No album images were viewed or substituted.

### [FEAT-012] Separate Business Navigation and Original Screen Styling (2026-10-11)

- **Summary**: Simplified factory navigation to Home/Services/Contact and screen navigation to Home/Products, with 18px links and a context-sensitive switch to the other business on the same hostname. Restored the original icon-based footer and circular back-to-top control; removed the contact quote link, homepage cross-promotion, and visible/emailable em dashes.
- **Affected Files**:
  - `frontend/src/hooks/useSiteSection.ts`
  - `frontend/src/hooks/index.ts`
  - `frontend/src/components/layout/Header/index.tsx`
  - `frontend/src/components/layout/Footer/index.tsx`
  - `frontend/src/components/ui/BackToTopButton.tsx`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/ContactPage.tsx`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/netlify/functions/quote.ts`
  - `frontend/scripts/browser-regression.mjs`
  - `frontend/scripts/inquiry-regression.mjs`
  - `frontend/src/assets/images/multi_handle/ML_screendoor_hori-800.webp` (removed unused derivative)
  - `frontend/src/assets/images/multi_handle/ML_screendoor_hori-1600.webp` (removed unused derivative)
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build and run lint, locale parity and mail regressions.
  - **Expected**: Build/TypeScript, lint/locales and 8 handler tests pass; screen inquiry requirements remain intact, and email subjects contain no em dashes.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Run browser and CSP checks with a production preview on port 4173.
  - **Expected**: 178 browser checks pass in EN/zh-TW at 1440/390/320px. Exact factory/window link sets, 18px font size, both switch directions, section-aware logo/home destination, footer contact icons/business links, removed contact/home links, and original 56px circular back-to-top behavior are verified. Existing screen products/media/form behavior still passes. Six CSP pages have zero violations; external mail/video are stubbed.
  - **Command/URL**: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Navigate directly to `/products` or `/tw/get-a-quote` and use Home, language switching, and the business switch.
  - **Expected**: Window navigation stays within the screen section; factory button returns to the corresponding localized company homepage. Product query selection survives language switching.
- **External blocker**: The uploaded ZIP exceeds the tool's 32 MiB transfer limit. No photos or document instructions from it were inspected. Photo selection remains pending smaller archives or individual images.

### [FEAT-013] Factory Photos, Motion, and Scroll-Preserving Language Changes (2026-10-12)

- **Summary**: Replaced factory photo placeholders with six curated user-supplied photos, responsive WebP assets, bilingual captions, and an accessible gallery viewer. Added reduced-motion-aware reveals, retained scroll/query/hash when switching languages, removed standalone email links beneath both forms, added window Quote navigation, and replaced blank video cards with thumbnails and click-initiated playback.
- **Affected Files**:
  - `docs/PROGRESS.md`
  - `docs/factory-website-review.md`
  - `docs/features/homepage.md`
  - `docs/security-review.md`
  - `frontend/netlify.toml`
  - `frontend/scripts/browser-regression.mjs`
  - `frontend/scripts/csp-regression.mjs`
  - `frontend/src/assets/images/factory/1366-1200.webp`
  - `frontend/src/assets/images/factory/1366-1800.webp`
  - `frontend/src/assets/images/factory/1366-640.webp`
  - `frontend/src/assets/images/factory/1555-1200.webp`
  - `frontend/src/assets/images/factory/1555-1800.webp`
  - `frontend/src/assets/images/factory/1555-640.webp`
  - `frontend/src/assets/images/factory/1771-1200.webp`
  - `frontend/src/assets/images/factory/1771-1800.webp`
  - `frontend/src/assets/images/factory/1771-640.webp`
  - `frontend/src/assets/images/factory/1801-1200.webp`
  - `frontend/src/assets/images/factory/1801-1800.webp`
  - `frontend/src/assets/images/factory/1801-640.webp`
  - `frontend/src/assets/images/factory/1811-1200.webp`
  - `frontend/src/assets/images/factory/1811-1800.webp`
  - `frontend/src/assets/images/factory/1811-640.webp`
  - `frontend/src/assets/images/factory/1821-1200.webp`
  - `frontend/src/assets/images/factory/1821-1800.webp`
  - `frontend/src/assets/images/factory/1821-640.webp`
  - `frontend/src/assets/index.css`
  - `frontend/src/components/layout/Header/index.tsx`
  - `frontend/src/features/homepage/components/CatalogExplorer/GalleryCarousel.tsx`
  - `frontend/src/features/homepage/components/CompanySections.tsx`
  - `frontend/src/features/homepage/components/FactoryGallery.tsx`
  - `frontend/src/features/homepage/components/FactoryImage.tsx`
  - `frontend/src/features/homepage/components/Reveal.tsx`
  - `frontend/src/features/homepage/components/index.ts`
  - `frontend/src/features/homepage/constants/factoryPhotos.ts`
  - `frontend/src/features/homepage/constants/index.ts`
  - `frontend/src/features/homepage/hooks/index.ts`
  - `frontend/src/features/homepage/hooks/useFactoryGallery.ts`
  - `frontend/src/features/homepage/index.ts`
  - `frontend/src/features/inquiry/components/FacilityInquiryForm.tsx`
  - `frontend/src/hooks/useLocale.ts`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/src/pages/AboutPage.tsx`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/QuotePage.tsx`
  - `frontend/src/pages/ServicesPage.tsx`

- **Verification**:
  - **Action**: Run frontend build, lint, locale parity, and inquiry handler tests.
  - **Expected**: TypeScript/build, lint/locales, and all 8 inquiry tests pass. No actual email is sent by the tests.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Start production preview, then run browser and CSP regressions.
  - **Expected**: 209 browser checks pass at 1440/390/320px in both languages. Header language changes preserve current scroll even with a hash and product query; footer changes stay near the bottom. Six gallery photos load, arrow controls work, Escape closes, and focus returns. Quote links target the screen quote page; both forms omit their standalone mailto link. Reduced motion displays all reveal content immediately. Video clicks request immediate playback with autoplay permission and retain a poster until the iframe loads. Six production CSP routes have zero violations.
  - **Command/URL**: `cd frontend && pnpm preview --host 0.0.0.0 --port 4173`; in another terminal: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Block YouTube thumbnail requests in browser regression.
  - **Expected**: A same-origin category photo loads in place of the remote thumbnail, preserving the card. External thumbnail/player/mail responses are stubbed elsewhere in the suite; genuine playback and delivery remain unverified.
  - **Command/URL**: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
- **Photo review**: The smaller uploaded archive was successfully downloaded and all 12 images reviewed. Six selected originals are documented in `docs/factory-website-review.md`; originals stay intact outside the checkout, and only 18 optimized derivatives totaling 1,571,818 bytes are committed. No client/location/certification attribution was inferred. Desktop/mobile gallery and portrait-viewer screenshots were inspected in `/tmp/hissus-photos-review`.

### [FEAT-014] Factory Hero, Layout Polish, Product Scroll, and Email Review (2026-10-12)

- **Summary**: Added a labeled generated factory background hero, blended the Services photo, aligned footer contact rows, removed conversation shortcuts and featured-product details links, and made product selection retain scroll on desktop/mobile. Refined the Chinese headline and business-specific emails, with reply addresses and eight no-send previews from the actual handler.
- **Affected Files**:
  - `docs/PROGRESS.md`
  - `docs/email-previews/facility-client-en.html`
  - `docs/email-previews/facility-client-zh-TW.html`
  - `docs/email-previews/facility-team-en.html`
  - `docs/email-previews/facility-team-zh-TW.html`
  - `docs/email-previews/index.html`
  - `docs/email-previews/manifest.json`
  - `docs/email-previews/screen-client-en.html`
  - `docs/email-previews/screen-client-zh-TW.html`
  - `docs/email-previews/screen-team-en.html`
  - `docs/email-previews/screen-team-zh-TW.html`
  - `docs/factory-website-review.md`
  - `docs/features/homepage.md`
  - `docs/inquiry-email-review.md`
  - `docs/security-review.md`
  - `frontend/netlify/functions/quote.ts`
  - `frontend/scripts/browser-regression.mjs`
  - `frontend/scripts/inquiry-regression.mjs`
  - `frontend/scripts/preview-inquiry-emails.mjs`
  - `frontend/src/assets/images/factory/factory-hero-1200.webp`
  - `frontend/src/assets/images/factory/factory-hero-640.webp`
  - `frontend/src/assets/images/factory/factory-hero-full.webp`
  - `frontend/src/assets/index.css`
  - `frontend/src/components/layout/Footer/index.tsx`
  - `frontend/src/features/homepage/components/CatalogExplorer/CatalogExplorer.tsx`
  - `frontend/src/features/homepage/components/CatalogExplorer/GalleryCarousel.tsx`
  - `frontend/src/features/homepage/components/CatalogExplorer/SpecSection.tsx`
  - `frontend/src/features/homepage/components/CompanySections.tsx`
  - `frontend/src/features/homepage/components/FactoryHero.tsx`
  - `frontend/src/features/homepage/components/index.ts`
  - `frontend/src/features/homepage/index.ts`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/ProductsPage.tsx`
  - `frontend/src/pages/ServicesPage.tsx`

- **Verification**:
  - **Action**: Build, lint, check locale parity, and exercise bundled inquiry handler regressions.
  - **Expected**: Build/TypeScript, lint/locales, and all 8 inquiry tests pass. Messages stay escaped; team and client Reply-To addresses are correct; factory mail uses facility wording; window products use readable names. Invalid input, missing keys and provider failures retain explicit responses.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Run production browser and CSP regressions.
  - **Expected**: 233 browser checks pass in both languages at 1440/390/320px, including product-card changes without scroll reset, uniform footer row heights/gaps, removed conversation/details links, language scroll retention, media and form feedback. Six CSP pages have zero violations. External thumbnail/player/mail responses remain stubbed.
  - **Command/URL**: With production preview on port 4173: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Action**: Generate email previews and open the selector in a browser.
  - **Expected**: Eight real-handler HTML previews cover both businesses, both recipients and both languages without sending a message. All eight were inspected at 900/390px with no horizontal overflow; screenshots were reviewed. This does not establish every email client's rendering.
  - **Command/URL**: `cd frontend && node scripts/preview-inquiry-emails.mjs`; then open `docs/email-previews/index.html` from the repository root in your browser.
  - **Fail Case**: Run the regression fixture without an API key or with a returned/thrown provider failure.
  - **Expected**: Missing key returns 503 with no mail calls; notification failure returns 502 without claiming success. Optional customer-copy failure still reports team receipt without encouraging duplicate inquiries.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
- **External readiness**: No API key or Netlify credential exists in this workspace. Live site settings, Resend sender-domain verification and delivery remain unverified. `docs/inquiry-email-review.md` explains how to confirm whether the key/redeploy are the final prerequisites. No real mail, secret, deployment, dashboard or DNS change was made.
- **Visual review**: Factory hero, Services blend, footer, Chinese copy and gallery were inspected in desktop/mobile screenshots under `/tmp/hissus-photos-review`. Hero WebPs are 640/1200/1672px wide and total 304,356 bytes. The original generated PNG and uploaded photos remain intact outside the checkout; the real gallery is separate from the illustrative hero.

### [FEAT-015] Business Route Namespaces, Scrolling Gallery, and Matched Heroes (2026-10-12)

- **Summary**: Grouped public pages under `/factory` and `/windows`, with factory home as the default, localized aliases, preserved search/hash, updated navigation/CTAs/metadata and prepared HTTP redirects. Changed the factory gallery to a horizontal carousel, removed the hero caption and matched both heroes' heights; factory mail retains the window mail shell with business-specific fields and branding.
- **Affected Files**:
  - `README.md`
  - `docs/PROGRESS.md`
  - `docs/email-previews/facility-client-en.html`
  - `docs/email-previews/facility-client-zh-TW.html`
  - `docs/email-previews/facility-team-en.html`
  - `docs/email-previews/facility-team-zh-TW.html`
  - `docs/factory-website-review.md`
  - `docs/features/homepage.md`
  - `docs/inquiry-email-review.md`
  - `docs/security-review.md`
  - `frontend/netlify.toml`
  - `frontend/netlify/functions/quote.ts`
  - `frontend/scripts/browser-regression.mjs`
  - `frontend/scripts/csp-regression.mjs`
  - `frontend/src/components/layout/Footer/index.tsx`
  - `frontend/src/components/layout/Header/index.tsx`
  - `frontend/src/features/homepage/components/CompanySections.tsx`
  - `frontend/src/features/homepage/components/FactoryGallery.tsx`
  - `frontend/src/features/homepage/components/FactoryHero.tsx`
  - `frontend/src/features/homepage/components/HeroSection.tsx`
  - `frontend/src/features/homepage/hooks/index.ts`
  - `frontend/src/features/homepage/hooks/useFactoryCarousel.ts`
  - `frontend/src/hooks/useLocale.ts`
  - `frontend/src/hooks/usePageMetadata.ts`
  - `frontend/src/hooks/useSiteSection.ts`
  - `frontend/src/lib/index.ts`
  - `frontend/src/lib/siteRoutes.ts`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/ProductsPage.tsx`
  - `frontend/src/router/index.tsx`

- **Verification**:
  - **Action**: Build, lint, check locale parity and run the bundled inquiry regressions.
  - **Expected**: Build/TypeScript, lint/locales and all 8 inquiry tests pass. Factory emails share the window HTML layout with their own fields; previews regenerate without sending messages. Page components load lazily, keeping the main production chunk under the default Vite warning threshold.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry && node scripts/preview-inquiry-emails.mjs`
  - **Action**: Run production browser/CSP checks.
  - **Expected**: 269 browser checks pass in EN/zh-TW at 1440/390/320px, including canonical navigation and refresh, legacy/default redirects preserving query/hash, updated hreflang, product/language scroll retention, carousel arrows/keyboard, native viewer focus return, and matching 520px mobile/600px desktop heroes. Six CSP pages have zero violations. External media/mail remain stubbed.
  - **Command/URL**: With a production preview on port 4173: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Action**: Parse and inspect Netlify redirect configuration.
  - **Expected**: 20 prepared HTTP 301 rules point to the correct business routes; API rewrite remains first and SPA fallback last. Live HTTP responses remain unverified until deployment.
  - **Command/URL**: `python -c "import tomllib; from pathlib import Path; c=tomllib.loads(Path('frontend/netlify.toml').read_text()); assert c['redirects'][0]['from']=='/api/*'; assert c['redirects'][-1]['from']=='/*'; assert len([r for r in c['redirects'] if r['status']==301])==20"`
  - **Fail Case**: Open `/products?tab=single-handle#details`, its `/tw` variant, or an unknown path under either business.
  - **Expected**: Old product paths resolve to the correct localized `/windows/products` with query/hash intact. Unknown business paths show a localized link to that business's home. Invalid inquiry payloads still return 400 before mail calls; missing key returns 503.
  - **Command/URL**: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && pnpm test:inquiry`
- **Email and credential status**: Eight actual-handler previews were regenerated; 16 viewport/language renderings were checked without overflow. The supplied credential was not installed or persisted because this workspace has no Netlify account binding. Manual sending requires secure `RESEND_API_KEY` entry in the site's Functions environment and redeployment, plus the previously documented sender-domain verification. No real mail, secret, deployment or DNS change was made.
- **Visual review**: Factory heroes and horizontal gallery were reviewed at desktop/mobile widths in `/tmp/hissus-photos-review`. The gallery retains the six real photos; the generated hero source/provenance remains documented after removing its visible caption.

### [FIX-004] Discoverable Netlify Production Build Configuration (2026-10-12)

- **Summary**: Moved Netlify configuration to the repository root and explicitly selected `frontend` as the build base. This fixes the supplied production log's missing-config/root `pnpm dev` failure while retaining function bundling, redirects and security headers; Node 24 and the tested pnpm version are pinned.
- **Affected Files**:
  - `netlify.toml` (moved from `frontend/netlify.toml`; added build base and Node version)
  - `frontend/netlify.toml` (removed from old location)
  - `frontend/package.json`
  - `frontend/scripts/csp-regression.mjs`
  - `README.md`
  - `docs/factory-website-review.md`
  - `docs/inquiry-email-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Install with the frozen frontend lockfile and run the production build from the configured base.
  - **Expected**: pnpm 11.25.0 verifies the supply-chain policy, preserves the lockfile, and TypeScript/Vite build emits `frontend/dist/index.html` successfully on Node 24.
  - **Command/URL**: `cd frontend && CI=true pnpm install --frozen-lockfile && pnpm build`
  - **Action**: Parse the root config and resolve paths beneath its base.
  - **Expected**: Base is `frontend`, build command is `pnpm build`, publish is `frontend/dist`, and function entry is `frontend/netlify/functions/quote.ts`. All 20 HTTP aliases, API/SPA rewrites, security headers, caching and local-dev settings match the previous config.
  - **Command/URL**: `python -c "import tomllib; from pathlib import Path; c=tomllib.loads(Path('netlify.toml').read_text()); b=c['build']; assert b['base']=='frontend' and b['command']=='pnpm build'; assert (Path(b['base'])/b['publish']/'index.html').is_file(); assert (Path(b['base'])/b['functions']/'quote.ts').is_file()"`
  - **Action**: Run bundled inquiry regressions, scoped lint and CSP checks against a production preview.
  - **Expected**: Eight inquiry tests pass, scoped script lint passes, and six canonical production pages have zero CSP violations using the relocated config. Mail and external player responses remain stubbed.
  - **Command/URL**: `cd frontend && pnpm test:inquiry && pnpm exec eslint scripts/csp-regression.mjs && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Configure the Netlify UI with root base, root `dist`, and `pnpm dev` on a branch without the root config.
  - **Expected**: The supplied log's `Command "dev" not found` failure is reproducible from the root package manifest. Deploy the branch containing the root config and align dashboard fields with it; the next log should discover `netlify.toml` and run `pnpm build` from `frontend`.
- **Deployment status**: This workspace cannot edit the live Netlify site. Source configuration and local build are verified; the next live build remains unverified. The supplied log lists Resend variable names, but this failure occurs before Functions execute and does not establish key validity or delivery.

### [FIX-005] Inquiry Deploy Origins and Safe Failure Diagnostics (2026-10-12)

- **Summary**: Included Netlify's exact deploy permalink in the trusted inquiry origins to address a possible pre-Resend 403 on the supplied deploy address. Added request IDs and safe failure categories for diagnosing remaining provider/configuration errors without logging submitted fields or credentials.
- **Affected Files**:
  - `frontend/netlify/functions/quote.ts`
  - `frontend/netlify/inquiryDiagnostics.ts`
  - `frontend/netlify/index.ts`
  - `frontend/scripts/inquiry-regression.mjs`
  - `docs/inquiry-email-review.md`
  - `docs/security-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build the application, lint and exercise the bundled handler with a stub sender.
  - **Expected**: TypeScript/Vite build and lint pass; all 12 inquiry tests pass. The supplied immutable deploy origin is accepted; trusted server URLs are normalized without adding a wildcard. No real mail is sent.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm test:inquiry`
  - **Action**: Simulate Resend rejecting an unverified sender domain, with sensitive text in the synthetic provider message.
  - **Expected**: HTTP 502 `SEND_FAILED` includes a request ID matching the response header/log. The log records `sender_domain_unverified`, provider code/status and phase; raw messages, credentials and form fields are absent.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
  - **Fail Case**: Simulate an unrelated Netlify origin, invalid server URL, or GET request.
  - **Expected**: Unrelated origins return 403 `ORIGIN_DENIED` before mail; malformed/non-HTTP settings add no origins; GET returns 405 `METHOD_NOT_ALLOWED` with `Allow: POST`. Existing missing-key, invalid-input, notification-failure and partial-success behavior remains covered.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
- **Live status**: The user's deploy URL fits the missing-origin case, but its exact response JSON was not supplied. The environment proxy blocked a read-only request, so live HTTP behavior and real sending remain unverified. Test the newest deployment or main site address after redeploying; older immutable permalinks retain their old code. No actual email, live secret, dashboard or DNS change was made.

### [FIX-006] Bundle Inquiry Origins from the Netlify Build (2026-10-12)

- **Summary**: The user's updated deployment returned `ORIGIN_DENIED`, confirming rejection before Resend. Capture the exact public Netlify origins during the build and statically bundle them into the function so runtime URL variable availability cannot prevent same-deploy submissions.
- **Affected Files**:
  - `README.md`
  - `frontend/package.json`
  - `frontend/netlify/functions/quote.ts`
  - `frontend/netlify/inquiryDiagnostics.ts`
  - `frontend/scripts/prepare-inquiry-origins.mjs`
  - `frontend/scripts/inquiry-regression.mjs`
  - `frontend/scripts/preview-inquiry-emails.mjs`
  - `docs/inquiry-email-review.md`
  - `docs/security-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build and lint; run bundled inquiry tests.
  - **Expected**: Build/TypeScript and lint pass; all 13 tests pass. The build prepares ignored `.netlify/inquiry-origins.json` with only normalized public origins. No other environment data is bundled, no wildcard is added, and no real mail is sent.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm test:inquiry`
  - **Action**: Bundle the actual default handler with the supplied deploy address, then remove runtime URL variables and the sending key.
  - **Expected**: Both forms accept the deploy/main/custom origin and reach missing-key validation (503 `UNAVAILABLE`) instead of origin denial. A synthetic secret in the generator's environment is absent from the generated file and function bundle.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
  - **Action**: Render email previews from the handler on a local checkout.
  - **Expected**: The preview script prepares its ignored origins file and renders all eight previews to a temporary output folder without sending messages.
  - **Command/URL**: `cd frontend && node scripts/preview-inquiry-emails.mjs /tmp/hissus-origin-fix-previews`
  - **Fail Case**: Submit the test fixture with an unrelated Netlify origin while runtime URL variables are absent.
  - **Expected**: HTTP 403 before any mail call; existing input/method/provider errors and diagnostic privacy tests still pass.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
- **Live status**: The prior rejection is confirmed by the user's response JSON. Real delivery after this change requires deploying the latest commit and testing its new address; no live key, DNS, dashboard or email was changed here.

### [FIX-007] Consistent Business-Specific Inquiry Emails (2026-10-12)

- **Summary**: Standardized team and customer subject prefixes for factory inquiries and window quotes, including the submitted topic or readable product name. Both email types share one layout with prominent business labels and highlighted request details; factory uses teal accents and windows uses blue, with matching English/Traditional Chinese copy.
- **Affected Files**:
  - `frontend/netlify/functions/quote.ts`
  - `frontend/scripts/inquiry-regression.mjs`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `docs/inquiry-email-review.md`
  - `docs/email-previews/facility-team-en.html`
  - `docs/email-previews/facility-team-zh-TW.html`
  - `docs/email-previews/facility-client-en.html`
  - `docs/email-previews/facility-client-zh-TW.html`
  - `docs/email-previews/screen-team-en.html`
  - `docs/email-previews/screen-team-zh-TW.html`
  - `docs/email-previews/screen-client-en.html`
  - `docs/email-previews/screen-client-zh-TW.html`
  - `docs/email-previews/manifest.json`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build, lint, check locale parity and exercise the bundled handler.
  - **Expected**: Build/TypeScript, lint/locales and all 13 inquiry tests pass. Both recipients use `[HISS US FACILITY INQUIRY]` or `[HISS US WINDOWS QUOTE]`, the appropriate topic/product and localized request/receipt wording. Team subjects include the sender name. Dynamic subjects remain one line, and email HTML escapes submitted text.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Regenerate and inspect the eight actual-handler previews and their subject manifest.
  - **Expected**: Both businesses/recipients/languages use matching layouts, clear text labels and distinct accents. Sixteen browser renderings at 900/390px have no horizontal overflow; screenshots under `/tmp/hissus-email-label-review` were visually inspected. Browser preview rendering does not establish compatibility with every mail client.
  - **Command/URL**: `cd frontend && node scripts/preview-inquiry-emails.mjs`; open `docs/email-previews/index.html` and inspect `docs/email-previews/manifest.json`.
  - **Fail Case**: Submit the existing fixture with HTML markup in the name/topic/message or a returned/thrown notification error.
  - **Expected**: Markup is displayed as text in email bodies; subject text remains a single line with the correct business prefix. Notification failure still returns 502 without claiming success; optional customer-confirmation failure retains team-receipt success.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
- **Sending status**: Previews and handler checks use stub senders. No real email, secret, dashboard or deployment was changed. Deploy the latest branch commit for the revised email templates.

### [FIX-008] Discoverable Netlify Inquiry Rate-Limit Metadata (2026-10-12)

- **Summary**: Reproduced Netlify omitting inline rate-limit metadata for the legacy `handler` entry, even with the user's explicit endpoint path. Migrated only the public entry to the modern default Request/Response API using an adapter over the existing inquiry core; actual Netlify bundling now emits API v2, the unchanged endpoint and the required IP/domain rule.
- **Affected Files**:
  - `frontend/netlify/functions/quote.ts`
  - `frontend/scripts/inquiry-regression.mjs`
  - `frontend/scripts/verify-netlify-function.mjs`
  - `docs/netlify-rate-limit-review.md`
  - `docs/inquiry-email-review.md`
  - `docs/security-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript, lint, check locale parity and run inquiry regressions.
  - **Expected**: All checks and 16 inquiry tests pass. The actual default export accepts native Request/Response; 400/405/413/415/403, no-store responses and request IDs remain correct. Valid mocked submissions produce identical team/customer emails for both businesses/languages; provider failures and partial success remain truthful.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Bundle the real function with Netlify's published bundler and inspect its generated manifest and compiled exports.
  - **Expected**: Exactly one endpoint, API version 2, a default export plus named config, and a `rate_limit` traffic rule with sliding window 5/60 and IP/domain keys. Before migration, the same bundler emitted API version 1 with no traffic rule. Generated Lambda bootstrap exports are expected. This verifies local discovery, not live registration/enforcement.
  - **Command/URL**: `cd frontend && NETLIFY_BUNDLER_MODULE=/tmp/hissus-netlify-rate-tooling/node_modules/@netlify/zip-it-and-ship-it/dist/main.js node scripts/verify-netlify-function.mjs`
  - **Action**: Run existing production browser/CSP checks and generate temporary mail previews.
  - **Expected**: 269 browser checks pass; six CSP pages have zero violations. Eight email templates, selector and subject manifest remain byte-identical to tracked previews; mail/media are stubbed. Temporary comparison output is `/tmp/hissus-rate-email-previews`.
  - **Command/URL**: With production preview on port 4173: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp && node scripts/preview-inquiry-emails.mjs /tmp/hissus-rate-email-previews`
  - **Fail Case**: Pass the modern entry an oversized streaming body, invalid origin, unsupported method or empty JSON submission.
  - **Expected**: Oversized streams are cancelled before further consumption and return 413; invalid origins return 403; unsupported methods return 405 with Allow: POST; empty JSON returns 400. No mail is sent in these cases.
  - **Command/URL**: `cd frontend && pnpm test:inquiry`
- **Evidence and limits**: Current maintained official Netlify source/fixture and published bundler 16.3.0 were inspected; direct documentation requests were proxy-blocked. Temporary tooling retained release-age/checksum/lockfile verification and added no repository dependency. The user's remote path-only commit `d48f899` was fetched and preserved before editing. No push, deployment, real email or secret change was performed. Netlify account access is unavailable; deployed rule registration and HTTP 429 remain unverified. The review document provides exact registration checks and a bounded invalid-input Console test for manual production verification.
- **Publication update**: The user subsequently authorized committing and pushing this fix to `factory-website`. No Netlify deployment was started or inspected from this environment; live rule registration and HTTP 429 still require the documented verification.

### [FIX-009] Looping Factory Gallery with Window-Style Side Arrows (2026-10-12)

- **Summary**: Matched the factory gallery to the window gallery's continuous looping and translucent circular side arrows. All six original photos, bilingual captions, touch dragging, reduced-motion behavior and native full-size viewer remain available; the user selected the requested gallery changes without the optional photo counter.
- **Affected Files**:
  - `frontend/src/features/homepage/components/FactoryGallery.tsx`
  - `frontend/src/features/homepage/hooks/useFactoryCarousel.ts`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript and lint the gallery and updated regression script.
  - **Expected**: Production build and lint pass. Existing Embla is reused with loop enabled; no dependency or asset changes are needed. Both controls remain active and occupy the left/right sides of the photos, with 44px touch targets.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint`
  - **Action**: Run the production browser and CSP regressions.
  - **Expected**: 275 browser checks pass in both languages at 1440/390/320px, including a complete forward six-photo cycle and backward wrapping, keyboard wrapping, reduced motion, side-arrow placement and page-position retention. Six CSP pages have zero violations; external player/mail responses are stubbed.
  - **Command/URL**: With production preview on port 4173: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Move backward from the first photo and forward from the last, then open and close a photo viewer.
  - **Expected**: The carousel wraps without disabling either arrow; the viewer retains keyboard navigation/Escape and restores focus without scrolling. No duplicate photo nodes or page overflow are introduced. Controls remain visible on mobile and appear on desktop hover or keyboard focus.
  - **Command/URL**: `/factory/home#factory-gallery` and `/tw/factory/home#factory-gallery`; `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
- **Visual review**: Desktop/mobile screenshots in `/tmp/hissus-factory-loop-review` were inspected. After local verification, the user authorized committing and pushing this gallery update to `factory-website` for Netlify testing. No Netlify deployment was started or inspected from this environment.

### [FIX-010] Distinct and Concise Factory Homepage (2026-10-12)

- **Summary**: Replaced the duplicated homepage Experience/GMP sections with the approved visual introduction: stronger hero copy and one CTA, a brief company introduction, the gallery higher on the page, three starting steps and a compact contact invitation. Services retains the full experience, scope and GMP explanations; English/Traditional Chinese copy and homepage metadata follow the revised narrative.
- **Affected Files**:
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/features/homepage/components/FactoryHero.tsx`
  - `frontend/src/features/homepage/components/FactorySteps.tsx`
  - `frontend/src/features/homepage/components/CompanySections.tsx`
  - `frontend/src/features/homepage/components/index.ts`
  - `frontend/src/features/homepage/index.ts`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript, lint, check locale parity and run inquiry tests.
  - **Expected**: All checks and 16 inquiry tests pass. New copy is bilingual with no em dashes; email behavior remains unchanged and tests use stub senders. Existing dependencies and photo assets are reused.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Run production browser and CSP regressions.
  - **Expected**: 287 checks pass in both languages at 1440/390/320px. Home has the approved section order, one hero CTA, About/Services links and a compact closing invitation; Services retains Experience/GMP and its existing contact copy. Gallery looping, matched hero heights, language/product scroll retention, routes and form feedback pass. Six CSP pages have zero violations; external media/mail responses are stubbed.
  - **Command/URL**: With production preview on port 4173: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Switch languages while scrolled into the gallery, cycle through all photos, or follow the new About/Services links in Traditional Chinese.
  - **Expected**: Page position is retained, all six photos remain in the loop, and links keep the `/tw` locale. Home contains neither full Experience nor GMP sections; both remain accessible on Services. No horizontal overflow appears at narrow widths.
  - **Command/URL**: `/factory/home`, `/tw/factory/home`, `/factory/services`, `/tw/factory/services`; `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
- **Visual review and publication**: Full-page homepage screenshots in both languages at 1440/390px were inspected under `/tmp/hissus-home-story-review`. This verified update is published to the existing `factory-website` branch for the user's established Netlify testing workflow. No Netlify deployment was started or inspected from this environment, and no real email was sent.

### [FIX-011] Integrated Homepage About Story with Blended Illustration (2026-10-12)

- **Summary**: Combined “Who we are” and the former About page into one stronger bilingual company story directly after the homepage hero. Added a generated planning-workspace illustration that fades into white behind desktop copy and stacks softly beneath mobile copy; About bookmarks now redirect to the homepage section instead of repeating the content on a separate page.
- **Affected Files**:
  - `README.md`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/AboutPage.tsx` (removed; bookmarks remain supported)
  - `frontend/src/router/index.tsx`
  - `frontend/src/features/homepage/components/CompanyAbout.tsx`
  - `frontend/src/features/homepage/components/index.ts`
  - `frontend/src/features/homepage/index.ts`
  - `frontend/src/assets/index.css`
  - `frontend/src/assets/images/factory/company-about-640.webp`
  - `frontend/src/assets/images/factory/company-about-1200.webp`
  - `frontend/src/assets/images/factory/company-about-full.webp`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript, lint, check locale parity and run inquiry regressions.
  - **Expected**: All checks and 16 inquiry tests pass. New About copy/image alt text is bilingual; explicit headline breaks preserve natural reading. Email behavior is unchanged and tested with stub senders. No dependency or external CSP origin was added.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && pnpm test:inquiry`
  - **Action**: Run production browser/CSP regressions and inspect the About section.
  - **Expected**: 279 checks pass across both languages at 1440/390/320px, covering the combined About copy, section order, single generated image with gradient blending, Services link, direct/legacy About redirects, query/hash preservation, gallery looping and scroll retention. Six CSP pages have zero violations. Separate About-page checks are replaced by redirect checks; media/email externals remain stubbed.
  - **Command/URL**: With production preview on port 4173: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser && CHROMIUM_PATH=/usr/bin/chromium pnpm test:csp`
  - **Fail Case**: Open `/factory/about?campaign=about`, `/about?campaign=about` or their `/tw` variants, including a supplied hash.
  - **Expected**: Client routing resolves to the correct localized homepage, retains the query and existing hash, and defaults to `#about` when no hash is supplied. The default About anchor appears 112px below the viewport top in desktop/mobile checks. There is no second company-content page or redirect loop.
  - **Command/URL**: `/factory/about?campaign=about`, `/tw/about?campaign=about`, `/factory/about?campaign=about#factory-gallery`; `cd frontend && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
- **Image and visual review**: The generated original remains at `/workspace/generated_images/exec-9bb141fb-9017-4787-a339-fc551c776248.png`. Three optimized 640/1200/1672px WebPs total 168,370 bytes. The fictional scene depicts no staff or identifiable client project; all six real gallery photos remain separate. Desktop/mobile/narrow screenshots in both languages were inspected under `/tmp/hissus-company-about-review`.
- **Publication**: Publish the verified changes to the existing `factory-website` branch for the established Netlify testing workflow. No Netlify deployment was started or inspected from this environment, and no real email was sent.

### [FIX-012] Separate Homepage Image Sections with Starting Steps (2026-10-12)

- **Summary**: Moved “How we begin” between About HISSUS and the factory gallery, giving the homepage a text section between its company illustration and project photos. The same order applies in both languages.
- **Affected Files**:
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript and lint, then run the existing production browser regression suite.
  - **Expected**: Build and lint pass; 279 browser checks pass across English and Traditional Chinese at 1440/390/320px. Section order is hero, About HISSUS, starting steps, gallery, contact.
  - **Command/URL**: With production preview on port 4173: `cd frontend && pnpm build && pnpm lint && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
  - **Fail Case**: Visit the localized homepage at narrow widths, follow an About bookmark, or switch languages while scrolled into the gallery.
  - **Expected**: Starting steps still separate About and the gallery; no horizontal overflow appears, About bookmarks retain their destination, and language switching preserves page position. Gallery cycling and side arrows keep working.
  - **Command/URL**: `/factory/home`, `/tw/factory/home`, `/factory/about`, `/tw/factory/about`
- **Publication**: Push the verified update to `factory-website` for Netlify testing. No live Netlify deployment was inspected and no real email was sent.

### [FIX-013] Keep Gallery High and Move About Away from Hero (2026-10-12)

- **Summary**: Applied the clarified homepage order: hero, gallery, “How we begin,” About HISSUS, contact. The gallery remains prominent near the top, while the About illustration and company story move below the starting steps. The existing gallery scroll test now centers its arrow clear of the sticky header before measuring, avoiding Playwright's automatic scrolling of an obscured click target.
- **Affected Files**:
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript and lint, then run the existing production browser suite.
  - **Expected**: Build and lint pass; 279 browser checks pass in both languages at 1440/390/320px, including the clarified section order.
  - **Command/URL**: With production preview on port 4173: `cd frontend && pnpm build && pnpm lint && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
  - **Fail Case**: Open localized About bookmarks or switch languages while scrolled into the reordered gallery.
  - **Expected**: About redirects still target `#about` in its new position, language switching preserves scroll, and gallery looping and arrows work without narrow-screen overflow.
  - **Command/URL**: `/factory/home`, `/tw/factory/home`, `/factory/about`, `/tw/factory/about`
- **Publication**: Push the verified update to `factory-website` for the established Netlify testing workflow. No live deployment was inspected and no real email was sent.

### [FEAT-014] Bilingual One-Stop Factory Services and Curated Gallery Order (2026-10-12)

- **Summary**: Removed the About HISSUS Services link and introduced the user-provided one-stop service scope through short homepage positioning and a three-stage Services overview. Reordered the gallery to start with the entrance, open factory floor and bright interior, and selected the Services entrance photograph by ID rather than gallery position.
- **Affected Files**:
  - `frontend/src/features/homepage/components/CompanyAbout.tsx`
  - `frontend/src/features/homepage/components/FactoryServices.tsx`
  - `frontend/src/features/homepage/components/index.ts`
  - `frontend/src/features/homepage/constants/factoryPhotos.ts`
  - `frontend/src/features/homepage/index.ts`
  - `frontend/src/pages/ServicesPage.tsx`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript, lint and check translation parity.
  - **Expected**: Checks pass. All new service headings, descriptions, homepage positioning and metadata are available in English and Traditional Chinese. The obsolete About link key is removed in both dictionaries.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint && pnpm check-locales`
  - **Action**: Run the existing production browser suite and review homepage/Services screenshots.
  - **Expected**: 279 checks pass in both languages at 1440/390/320px. About has no outbound link. Services groups site selection and permits, design and construction, and operations, quality systems and human resources. The entrance remains its hero image; Experience/GMP and the agreed-scope note remain intact. The gallery’s first three captions match the requested order.
  - **Command/URL**: With production preview on port 4173: `cd frontend && CHROMIUM_PATH=/usr/bin/chromium SCREENSHOT_DIR=/tmp/hissus-one-stop-review pnpm test:browser`
  - **Fail Case**: View the three-stage service list in Traditional Chinese at 320px, then cycle the gallery through the first and last photos or switch language while scrolled.
  - **Expected**: All seven services remain readable without overflow. Gallery looping, viewer focus and language scroll retention continue to work; both locales use the same photo sequence. Quality-system support stays distinct from the Guaranteed Maximum Price construction model.
  - **Command/URL**: `/factory/home`, `/tw/factory/home`, `/factory/services`, `/tw/factory/services`
- **Publication**: Push verified changes to `factory-website` for the established Netlify testing workflow. Screenshots are stored under `/tmp/hissus-one-stop-review`; no live deployment was inspected and no real email was sent.

### [FIX-015] Balance Service Stages with Two Items Each (2026-10-12)

- **Summary**: Combined factory operations and quality systems into “工廠營運與品質” / “Factory operations & quality,” preserving both capabilities in one concise description. Human resources remains the second item, so every service stage has two items in both languages.
- **Affected Files**:
  - `frontend/src/features/homepage/components/FactoryServices.tsx`
  - `frontend/src/locales/en.json`
  - `frontend/src/locales/zh-TW.json`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript, lint, check locale parity and run production browser regressions.
  - **Expected**: Checks pass; 279 browser checks verify both languages at 1440/390/320px. Each service stage has exactly two items, with the merged operations/quality description localized and human resources retained.
  - **Command/URL**: With production preview on port 4173: `cd frontend && pnpm build && pnpm lint && pnpm check-locales && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
  - **Fail Case**: Open Traditional Chinese Services at 320px, then switch languages while scrolled into the service overview.
  - **Expected**: Both versions display the same two-item grouping without missing translation keys or overflow. Quality-system support remains part of the merged item, separately from the GMP pricing explanation.
  - **Command/URL**: `/factory/services`, `/tw/factory/services`
- **Publication**: Push verified changes to `factory-website` for Netlify testing. No live deployment was inspected and no real email was sent.

### [FIX-016] Shorten Chinese Operations Description (2026-10-12)

- **Summary**: Changed the Traditional Chinese operations/quality description to “協助營運規劃與品質系統建立，銜接設施建置與生產。” as requested. English copy is unchanged.
- **Affected Files**:
  - `frontend/src/locales/zh-TW.json`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Check locale parity and inspect the scoped diff.
  - **Expected**: Locale parity passes; the only website change removes “日常” from the requested Chinese sentence.
  - **Command/URL**: `cd frontend && pnpm check-locales`; `git diff -- frontend/src/locales/zh-TW.json frontend/src/locales/en.json`
  - **Fail Case**: Switch from Traditional Chinese Services to English.
  - **Expected**: Chinese shows the requested sentence; English retains its existing operations/quality description.
  - **Command/URL**: `/tw/factory/services`, `/factory/services`
- **Publication**: Push to `factory-website` for Netlify testing. No live deployment was inspected.

### [FIX-017] Give the Cooperation Model a Distinct Layout (2026-10-12)

- **Summary**: Replaced the GMP section’s numbered three-column cards with a navy summary panel and three vertical icon-led benefit rows on a soft blue background. Desktop displays the summary and benefits side by side; mobile stacks them, distinguishing this section from one-stop service coordination.
- **Affected Files**:
  - `frontend/src/features/homepage/components/CompanySections.tsx`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript, lint and run production browser regressions with layout screenshots.
  - **Expected**: Build and lint pass; 279 browser checks pass in both languages at 1440/390/320px. All three GMP principle headings/descriptions, model introduction and contract/certification clarification remain intact. No dependency, image or translation change is introduced.
  - **Command/URL**: With production preview on port 4173: `cd frontend && pnpm build && pnpm lint && CHROMIUM_PATH=/usr/bin/chromium SCREENSHOT_DIR=/tmp/hissus-gmp-layout-review pnpm test:browser`
  - **Fail Case**: View Traditional Chinese Services at 320px and switch languages while scrolled into the GMP section.
  - **Expected**: The summary and three benefits remain readable without horizontal overflow; the original locale scroll-retention behavior and contractual caveats remain. The GMP section uses vertical benefit rows, while service coordination retains three stages with two items each.
  - **Command/URL**: `/factory/services#gmp`, `/tw/factory/services#gmp`
- **Publication**: Push verified changes to `factory-website` for Netlify testing. Layout screenshots are stored under `/tmp/hissus-gmp-layout-review`; no live deployment was inspected and no real email was sent.

### [FIX-018] Soften the GMP Section Palette (2026-10-12)

- **Summary**: Replaced the prominent navy/blue GMP palette with a white section, a light-gray summary panel and subtle gray borders, text and icons. The two-column summary/vertical-benefits layout and all bilingual content remain intact.
- **Affected Files**:
  - `frontend/src/features/homepage/components/CompanySections.tsx`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript and lint.
  - **Expected**: Both checks pass; changes are limited to color classes and documentation.
  - **Command/URL**: `cd frontend && pnpm build && pnpm lint`
  - **Action**: Check the production GMP section and inspect screenshots in English and Traditional Chinese at 1440/390/320px.
  - **Expected**: Six page checks pass with all principle headings/descriptions, model introduction and contract clarification intact, no horizontal overflow and no browser errors. The neutral panel blends with the existing page; mobile still stacks the summary above the benefits.
  - **Command/URL**: `/factory/services#gmp`, `/tw/factory/services#gmp`; screenshots under `/tmp/hissus-gmp-neutral-review`.
  - **Fail Case**: View Services at 320px in either language.
  - **Expected**: Text stays legible on the light backgrounds and the summary/benefits stay within the viewport.
  - **Command/URL**: `/factory/services#gmp`, `/tw/factory/services#gmp`
- **Publication**: Push verified changes to `factory-website` for Netlify testing. No live deployment was inspected and no real email was sent.

### [FEAT-019] Scroll Mobile Product Selection to the Overview (2026-10-12)

- **Summary**: Ordinary window product-card selections below 768px now scroll to the rendered overview, accounting for the sticky header and respecting reduced motion. The overview section owns the existing anchor; desktop selection, direct visits, modified clicks and language switching do not request this scroll.
- **Affected Files**:
  - `frontend/src/features/homepage/hooks/useProductOverviewScroll.ts`
  - `frontend/src/features/homepage/hooks/index.ts`
  - `frontend/src/features/homepage/index.ts`
  - `frontend/src/pages/ProductsPage.tsx`
  - `frontend/scripts/browser-regression.mjs`
  - `docs/features/homepage.md`
  - `docs/factory-website-review.md`
  - `docs/PROGRESS.md`
- **Verification**:
  - **Action**: Build/TypeScript, lint and run production browser regressions.
  - **Expected**: Build and lint pass; 279 browser checks pass in both languages at 1440/390/320px. Selecting each of the four categories on mobile brings the overview heading into view below the header; desktop retains scroll, and the selected product’s media and details still match its query.
  - **Command/URL**: With production preview on port 4173: `cd frontend && pnpm build && pnpm lint && CHROMIUM_PATH=/usr/bin/chromium pnpm test:browser`
  - **Action**: Check the breakpoint and reduced-motion behavior at 767/768px in both languages.
  - **Expected**: Four focused cases pass: direct visits do not jump, selecting the active product or another product scrolls only below 768px, language switching retains position, and no horizontal overflow appears. Screenshots are under `/tmp/hissus-product-overview-review`.
  - **Command/URL**: `/windows/products?tab=windows`, `/tw/windows/products?tab=windows`
  - **Fail Case**: Enable reduced motion on mobile and select the current product again; then switch language while viewing its overview.
  - **Expected**: The overview is reached without a smooth-scroll animation; language switching retains the current position. At 768px and above, product selection does not trigger an overview jump.
  - **Command/URL**: `/windows/products`, `/tw/windows/products`
- **Publication**: Push verified changes to `factory-website` for Netlify testing. No live deployment was inspected and no real email was sent.
