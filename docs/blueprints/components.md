# Component Architecture (Hissus.com)

## 1. The Global Injection Principle (Visuals)

Hissus.com prioritizes **CSS-level styling** over component-level overrides to ensure maximum performance and visual consistency.

* **Theme Inheritance**: All visual tokens (Border-radius, Shadows, Colors) MUST be defined in `src/assets/main.css` using Tailwind v4 `@theme` variables.
* **Automatic Flavoring**: Raw Shadcn components in `@/components/ui` should automatically look like "Hissus Components" (e.g., inheriting `rounded-2xl`) without manual class injection.
* **Token Standard**:
  * `--radius-lg`: 1rem (rounded-2xl) - Standard for Cards, Modals.
  * `--radius-md`: 0.75rem (rounded-xl) - Standard for Buttons, Inputs.

## 2. The Semantic Wrapper Protocol (Logic & Decoupling)

While visuals are global, we use `src/components/ui-wrapper` as a mandatory **Proxy Layer** for three specific reasons:

* **Decoupling**: Features MUST NEVER import directly from `@/components/ui`. They only import from `ui-wrapper`. This allows us to swap the underlying UI library without breaking feature code.
* **Semantic Aliasing**: Encapsulate complex business styles into typed props (e.g., using `isProminent` instead of passing 10+ Tailwind classes).
* **Behavioral Enhancement**: Inject shared behaviors such as custom transitions, `data-analytics` tags, or global Loading/Error states.

## 3. Implementation Standards

* **Thin & Pure**: Wrappers must be "thin." No `useEffect`, `async` calls, or business state.
* **Prop Forwarding**: Always use `React.forwardRef` and ensure all attributes are spread to the base component using the `cn()` utility.
* **The Proxy Utility**: Use `withHissusDefaults` for simple styling injections to keep wrapper files minimal.
* **Inline Styles Object**: Feature components use a `const styles = { key: 'tailwind classes' }` object at the top of the file — there is no `.styles.ts` side-file pattern. Do not create separate style files.
* **Hover Selectors**: When writing hover utilities for Shadcn base components, use standard `hover:` — not `[a]:hover:` or other element-scoped variants, which only fire when the rendered element IS that tag (e.g., `@base-ui/react` renders `<button>`, so `[a]:hover:` never fires).

## 4. Directory & Export Structure

Each component in the wrapper layer follows a strict structure to facilitate IDE auto-completion and readability.

* **Path**: `src/components/ui-wrapper/[ComponentName]/`
* **Files**:
  * `index.ts`: Barrel export: `export * from './[ComponentName]';`
  * `[ComponentName].tsx`: The enhanced component logic.