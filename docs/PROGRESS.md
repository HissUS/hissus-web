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
