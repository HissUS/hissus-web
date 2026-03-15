# Frontend Implementation Blueprint (SOP)

## 1. Directory Tree & Location Truth

```text
frontend/
├── /src
│   ├── /api            # Global Axios instance & Interceptors
│   ├── /assets         # Global CSS, Images, Fonts
│   ├── /constants      # Global constants (e.g., regex.ts, config.ts)
│   ├── /layouts        # Persistent Page Layouts (e.g., MainLayout, AuthLayout)
│   ├── /components     # Shared stateless components
│   │   └── /ui-wrapper # Shadcn UI Thin Wrappers
│   ├── /features       # Domain-driven modules (Core)
│   │   └── /[feature]  # e.g., auth, products, inquiry
│   │       ├── /components # Feature-specific UI
│   │       ├── /constants  # Module-specific constants (e.g., status-codes.ts)
│   │       ├── /hooks      # TanStack Query (useQuery/useMutation)
│   │       ├── /services   # API endpoint definitions
│   │       └── /types      # Zod schemas & TS interfaces
│   ├── /hooks          # Global utility hooks (useLocale, useLocaleSwitcher, …)
│   ├── /locales        # i18n JSON files (Key-based)
│   │   └── config.ts   # Country→locale mapping (COUNTRY_TO_LOCALE — source of truth)
│   ├── /pages          # Top-level page components (thin — logic stays in hooks)
│   ├── /router         # TanStack Router configuration
│   ├── /store          # Zustand UI state (Store)
│   └── /utils          # Formatters & Validators
├── /scripts
│   ├── sort-locales.mjs   # Deep-sorts locale JSON keys (lint-staged, runs on commit)
│   └── check-locales.mjs  # Warns on missing/extra keys vs en.json (pre-commit)
└── vite.config.ts
```

## 2. Implementation Mapping

| Category | Logical Path | Constraint |
| --- | --- | --- |
| **Atomic UI** | `src/components/ui-wrapper` | Generic components (Button, Input). |
| **Global UI** | `src/components` | Layouts, Navbars, Footers. |
| **Domain UI** | `src/features/[name]/components` | Business-related UI (ProductCard). |
| **Server State** | `src/features/[name]/hooks` | Encapsulate all `useQuery`. No direct calls in UI. |
| **API Endpoints** | `src/features/[name]/services` | Pure axios functions. |
| **Data Logic** | `src/features/[name]/types` | Zod schema is the source of truth. |
| **Client State** | `src/store` | Zustand ONLY for UI states (Dark mode, Sidebar). |

## 3. Core Development Rules

### A. Logic Separation

* **Thin Components**: UI components must not contain `async/await` or complex data transformations.
* **Hook-Based Logic**: All business logic and data fetching must reside in `src/features/[name]/hooks`.

### B. Implementation Rules

* **Barrel Exports**: Use `index.ts` in every shared folder (components, hooks, utils). 
* **Import Style**: Never import from deep paths (e.g., `../components/Button/Button`); always import from the parent index (e.g., `../components`).

### C. Internationalization (i18n)

* **Zero Hardcoding**: All UI strings must use `t('key')`.
* **URL Convention**: English (US) is the default with **no country suffix**. All other locales append a 2-letter country code as the **last path segment**.
  * `/home` → English (default, no suffix)
  * `/tw/home` → Traditional Chinese (Taiwan)
* **Detection**: Language is set via `useLocale()` hook (reads `$country` param from URL, calls `i18n.changeLanguage()`). Do **not** use `i18next-browser-languagedetector` path detection.
* **Config**: `src/locales/config.ts` is the single source of truth for country→locale mapping.
* **Quality**: `pnpm check-locales` checks completeness. JSON files are auto-sorted on commit via lint-staged.

### D. Senior-Friendly UI (A11y)

* **Visual**: Minimum font-size `16px`. High contrast text only.
* **Interaction**: Minimum tap target `44x44px`. All icons must have text labels.
* **Iconography**: No icon-only buttons. All buttons MUST include a text label or a strictly defined ARIA-label.

### E. Security & Auth

* **Cookie-Based**: Do not access JWT in JS. Rely on `HttpOnly` cookies.
* **Error Handling**: Axios interceptors must catch `401` and redirect to login via Zustand/Router.

## 4. Global Components Specification

* **Header** (`src/components/layout/Header/`):
  * 3-zone sticky flex layout: Logo (left) | Nav links (center) | Login CTA (right).
  * Nav: Home, Products, Console (Console has lock icon, muted visual style).
  * **No locale switcher** — locale switching is exclusively in the Footer.
  * Blur backdrop effect on scroll.
* **Footer** (`src/components/layout/Footer/`):
  * Dark theme (`bg-zinc-950`); custom component, not from `inquiry` feature.
  * Contact info sourced from `SITE_CONFIG` (`src/config/site.ts`): phone, email, Facebook URL.
  * Social links: Facebook (Lucide icon), Line (custom SVG), WeChat (custom SVG) — all `target="_blank"`.
  * **Locale Switcher** lives here: language buttons that update the `/$country` URL prefix.
  * `SITE_CONFIG` is the single source of truth for all brand contact data.
* **Accessibility**:
  * All interactive elements in Header/Footer must meet the **44x44px tap target** requirement.
  * Text colors must maintain high contrast against backgrounds.