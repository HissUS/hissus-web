# Feature Development Workflow

Follow this cycle for every new feature request to ensure logic decoupling and consistency.

## The Cycle

1.  **Spec Review**: Read `docs/features/[feature_name].md`.
2.  **Blueprint Alignment**: Reference `docs/blueprints/` for standard code patterns.
3.  **Database First**: 
    * Write Flyway SQL migrations.
    * Update `docs/database/schema-details.md`.
4.  **Backend Phase**: 
    * Implement `Entity -> Repository -> Service -> Controller`.
    * **Rule**: No business logic in Controllers. No Entities in DTOs.
    * Write Unit Tests (AAA Pattern) for the Service layer.
5.  **Frontend Phase**:
    * Define Zod Schemas and TypeScript Types.
    * Create TanStack Query Hooks in `features/[name]/hooks/`.
    * Build UI Components using Shadcn UI wrappers.
6.  **i18n & Integration**:
    * Add translation keys.
    * Finalize mobile-first responsive check.

## Definition of Done (DoD)
- [ ] Code follows `CLAUDE.md` naming and decoupling rules.
- [ ] No hardcoded strings (all in i18n files).
- [ ] PR passes linting and basic unit tests.