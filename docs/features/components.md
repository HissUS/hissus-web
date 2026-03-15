# Feature: UI Component Inventory

## ui-wrapper Components (`src/components/ui-wrapper/`)

All feature code MUST import from `@/components/ui-wrapper`, never directly from `@/components/ui`.

| Component | Path | Key Enhancements |
|-----------|------|-----------------|
| `Button` | `ui-wrapper/Button/` | `React.forwardRef`; fixed hover: `hover:bg-primary/80` (not `[a]:hover:...`); all Shadcn variants pass-through |
| `Card` | `ui-wrapper/Card/` | Thin proxy; inherits `--radius-lg` (`rounded-2xl`) automatically from `@theme` |

## Architecture Rules

* **Import boundary**: Features import from `@/components/ui-wrapper` only. Never from `@/components/ui`.
* **forwardRef**: Every wrapper component must use `React.forwardRef`.
* **Props**: All native HTML attributes and Shadcn props must be spread to the base component.
* **Class merging**: Use `cn()` utility for merging classNames.
* **No side effects**: No `useEffect`, `useState`, `async`, or business logic inside wrappers.

## Adding a New Wrapper

1. Create `src/components/ui-wrapper/[ComponentName]/[ComponentName].tsx`
2. Create `src/components/ui-wrapper/[ComponentName]/index.ts` with `export * from './[ComponentName]'`
3. Re-export from `src/components/ui-wrapper/index.ts`

For simple class-injection-only wrappers, use the `withHissusDefaults` utility to minimize boilerplate.
