# UI/UX Design Standards

## 1. Design Philosophy

* **Influences**: **Apple** (Cleanliness), **Airbnb** (Card-based navigation), **Houzz** (Real-world galleries), **GOV.UK** (Accessibility).
* **Core Foundation**: Mandatory **8px grid system**. All spacing/sizing must be multiples of 8px.
* **Senior-Friendly Focus**: Prioritize legibility, large touch targets, and zero-ambiguity navigation.

## 2. Visual Identity (Design Tokens)

* **Palette**: High-contrast blue (Primary). Target WCAG AA compliance. No light-grey text on white backgrounds.
* **Typography**: System Sans-Serif. Base size: **16px**. Line-height: **1.5** for readability.
* **Containers**: Since photos are real-world (e.g., `SH_front_screendoor.jpg`), they **MUST** sit in white cards with `border-gray-200` and `shadow-sm` to isolate busy backgrounds from the UI.
* **Standard Padding**: Use `p-4` (16px) as the default for all content blocks.

## 3. Product Showcase (The "Hero" Experience)

* **Authenticity**: Use high-quality on-site installation photos only. Badge photos as **"Real-life Install"** to build trust.
* **Interaction**:
  * **Lightbox**: Clicking any product photo must trigger a full-screen zoom with high-contrast controls.
  * **CTA**: Every product card must feature a distinct, high-visibility **"Get Quote"** button.
* **Visual Hierarchy**: Product image occupies 60-70% of the card area; text/specs occupy the remainder.

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