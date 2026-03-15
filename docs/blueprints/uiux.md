# UI/UX Design Standards

## 1. Design Philosophy

* **Influences**: **Apple** (Cleanliness), **Airbnb** (Card-based navigation), **Houzz** (Real-world galleries), **GOV.UK** (Accessibility).
* **Core Foundation**: Mandatory **8px grid system**. All spacing/sizing must be multiples of 8px.
* **Senior-Friendly Focus**: Prioritize legibility, large touch targets, and zero-ambiguity navigation.

## 2. Visual Identity (Design Tokens)

* **Primary (Hissus Blue)**: CSS variable `--primary` (defined as `oklch(...)` in `src/assets/index.css`). Use `text-[--primary]`, `bg-[--primary]` — never hardcode `#0056b3`.
* **Success (Safe Green)**: CSS variable `--success`. Used for "Quote Confirmed" or "Successful Sent" states.
* **Surface**: `bg-white` / `bg-gray-50` (Tailwind). Do not use hex color values for surfaces.
* **Text Hierarchy** (use Tailwind gray scale, not hex):
  * **Primary Text**: `text-gray-900` (near black, max contrast).
  * **Secondary Text**: `text-gray-600`.
  * **Tertiary / Muted Text**: `text-gray-500`.
  * **Strict Prohibition**: Never use text below `text-gray-500` on white surfaces (WCAG AA compliance).
* **Typography**: System Sans-Serif. Base size: **16px**. Line-height: **1.5** for readability.
* **Standard Padding**: Use `p-4` (16px) as the default for all content blocks.
* **Smooth Animations**: Use subtle transitions (around 200ms) with an ease-in-out curve for hover, focus, and UI state changes.

## 3. Product Showcase (CatalogExplorer Pattern)

* **Authenticity**: Use high-quality on-site installation photos only (`src/assets/images/`). No stock photography.
* **Layout**: Tab-based category navigation (not card grid). One active category shown at a time.
* **Gallery**:
  * Embla carousel: 3 visible slides, `loop: true`, glassmorphism prev/next arrows (visible on hover only).
  * Bottom gradient on each image: `bg-linear-to-t from-black/20 to-transparent`.
  * Images use `rounded-2xl` with `overflow-hidden` directly — no surrounding white card border.
* **Specs**: Frameless 3-column grid below the carousel (icon + label). No borders, no backgrounds.
* **CTA**: Single "Explore Details" button per category (right-aligned), links to `/products?tab={id}`.
* **No lightbox**, no "Real-life Install" badge, no per-card "Get Quote" button on the homepage showcase.

## 4. Interaction & Accessibility (A11y+)

* **Targets**: All interactive elements (buttons/links) must be at least **44x44px**.
* **Affordance**: No "icon-only" buttons. Always use **Icon + Text** to ensure clarity for seniors.
* **Form Logic**:
  * Labels must be **persistent** (always visible). Never use placeholders as labels.
  * Error messages must be in plain language and high-contrast red.
* **Feedback**: Every user action must trigger a visual state (Skeleton, Spinner, or Toast).
* **Guardrails**: Destructive or financial actions (Delete/Save) require a confirmation Dialog.

## 5. Responsive Strategy

* **Mobile-First**: Design for small screens first.
* **Navigation Adaptability**: Sidebars **MUST** collapse into a **Bottom Tab Bar** on screens < 768px for easy thumb reach.
* **Data Density**: Use Ant Design-style high-density tables for Admin/Staff only; keep Public views spacious.

## 6. Layout Variations (Context-Aware Styles)

* **Marketing/Gallery View (e.g., Homepage)**:
  * Use **immersive** layout for product galleries (CatalogExplorer): full-bleed images with `rounded-2xl`, no white card borders.
  * Use **Card-based** layout only for list/grid views outside of the carousel context.
* **Informational/Utility View (e.g., About Us, Contact)**:
  * Use **Clean Editorial** layout.
  * Focus on typography and white space; remove card borders for long-form text.
  * Maintain the **8px grid** for all vertical spacing.

## 7.Admin/Staff Dashboard Density

* **Strategy**: Use high-density layouts for internal tools to maximize data visibility.
  * **Table UI**: Override Shadcn defaults with `py-1.5` for cells and `text-sm` for data rows.
  * **Alignment**: Financial columns must be right-aligned with monospaced fonts (`font-mono`).