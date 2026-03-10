# Component Architecture

## 1. The Thin Wrapper Rule

* **Mandatory Layer**: All UI elements MUST be thin wrappers of **Shadcn/UI**.
* **Logic-Free**: No `async`, `useEffect`, or business logic inside wrappers.
* **Prop Forwarding**: Always use `React.forwardRef` and spread attributes to the base Shadcn component.

## 2. Style Isolation (Strict)

* **No Inline Classes**: Never write long Tailwind strings directly in JSX.
* **External Styles**: Define styles in a separate constant (e.g., `const styles = { ... }`) or use `cva` (Class Variance Authority) for variants.
* **Consistency**: All spacing and colors in styles MUST reference the 8px grid and UI/UX tokens.

## 3. Directory Structure

* **Path**: `src/components/ui-wrapper/[ComponentName]/`
* **Contents**:
    * `index.ts` (Barrel Export)
    * `[ComponentName].tsx` (The Wrapper)
    * `styles.ts` or `[ComponentName].styles.ts` (Extracted CSS/Tailwind)