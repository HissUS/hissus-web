# Feature Development Workflow: Frontend

## Pre-Development: Context Check

AI **MUST** cross-reference these files before coding:

1. **`CLAUDE.md`**: Global project rules & AI interaction protocol.
2. **`blueprints/frontend.md`**: SOP, TanStack implementation & i18n routing.
3. **`blueprints/uiux.md`**: **8px grid**, Hissus Blue & **Senior-Friendly** A11y standards.
4. **`blueprints/components.md`**: Shared UI patterns & modular section orchestration.
5. **`blueprints/verification.md`**: Progress tracking protocol & **DoD** criteria.

## The Development Cycle

### 1. Spec & UI/UX Alignment

* Read the target feature spec (e.g., `docs/features/homepage.md`).
* Determine the **Layout Container** (Card-based vs. Clean Editorial) based on `uiux.md`.
* Identify required shared components from `components.md`.

### 2. Type & Schema Definition

* Define **Zod schemas** in `features/[name]/types/`.
* Ensure validation rules (regex, length) are strictly synchronized with the Backend/API Contract.

### 3. Data Layer (Server State)

* Implement API services and TanStack Query hooks in `features/[name]/hooks/`.
* **Strict Rule**: UI components must remain "Thin"—no direct data fetching.

### 4. UI Construction & Assembly

* Build UI using **Shadcn UI** wrappers in `src/components/ui-wrapper`.
* Apply the **8px grid system** and ensure all tap targets are **44x44px**.
* Implement the mobile-first **Bottom Tab Bar** if screens are < 768px.

### 5. i18n & Routing

* Extract all strings to `src/locales/` using the feature namespace.
* Set up routing via **TanStack Router** using the `/$country/home` pattern for localized routes (English default uses `/home` with no country segment).

## Verification & Handover

* Update **`docs/PROGRESS.md`** strictly following the format in `verification.md`.
* Each task entry **MUST** contain executable verification steps (e.g., "Run `pnpm check-locales`").

## Definition of Done (DoD)

* [ ] No hardcoded strings; all keys exist in `en.json` and `zh-TW.json`.
* [ ] Accessibility: All icons have text labels or ARIA labels.
* [ ] Navigation: Locale prefix is preserved across all route transitions.
* [ ] Documentation: Progress recorded with verification evidence.
