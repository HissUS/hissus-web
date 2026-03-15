# Feature Development Workflow: Backend

## Pre-Development: Context Consolidation

AI **MUST** cross-reference these files before coding:

1. **`CLAUDE.md`**: Global rules & AI interaction.
2. **`blueprints/backend.md`**: SOP & package-private visibility.
3. **`blueprints/database.md`**: PostGIS & Flyway naming.
4. **`api-contract.md`**: `Result<T>` & Validation parity.
5. **`blueprints/verification.md`**: Progress tracking & DoD.

## The Development Cycle

1.  **Spec & Contract Review**: 
    * Read `docs/features/[feature_name].md`.
    * Reference `api-contract.md` for `Result<T>` structure and status codes.
2.  **Database Evolution**: 
    * Write Flyway SQL migrations in `src/main/resources/db/migration`.
    * **Strict Rule**: Use `V[YYYYMMDDHHMMSS]__Desc.sql` naming.
    * Apply PostGIS geography types if location-based.
3.  **Domain Implementation**: 
    * **Layer Flow**: `Entity -> Repository -> Mapper -> Service -> Controller`.
    * **DTO Isolation**: Entities MUST NOT leave the Service layer. Use **MapStruct** for all conversions.
4.  **Security & Validation**:
    * Implement **Jakarta Bean Validation** (@Valid) to match Frontend Zod rules.
    * Apply `@PreAuthorize("hasAuthority('...')")` based on the Granular Permission System.
5.  **Observability & Secrets**:
    * Inject `traceId` via MDC for logging.
    * Ensure sensitive configs use **Docker Secrets** mount points (`/run/secrets/`).

## Definition of Done (DoD)
- [ ] Flyway migration successfully applied.
- [ ] Service logic covers all business constraints with Unit Tests (AAA Pattern).
- [ ] OpenAPI (Swagger) documentation updated and accurate.
