# Testing Protocol

## 1. Coverage & Scope

* **Exclusions**: No tests for boilerplate (POJOs, simple CRUD, or Shadcn wrappers).
* **Mandatory**:
  * **Logic**: Validation (Zod/Jakarta sync), pricing/distance calculations, and state transitions.
  * **Auth**: RBAC enforcement and JWT filter integrity.
  * **Complexity**: Any logic where a manual fix poses a regression risk.

## 2. Backend (Spring Boot)

* **Strategy**: **AAA Pattern** (Arrange, Act, Assert).
* **Unit**: JUnit 5 + Mockito. Focus on **Service Layer** and **MapStruct**. Mock all external Repositories/APIs.
* **Integration**: **Testcontainers** with `postgis/postgis:17-3.5` (must match production DB version).
* **Prohibition**: H2 database is strictly forbidden.
* **Scope**: Complex Repository (especially GIS/spatial queries) queries and full Controller-to-DB flows.

## 3. Frontend (React/TS)

* **Unit**: **Vitest** + **React Testing Library**.
* **Focus**:
  * **Custom Hooks**: Test all business/data logic extracted from components.
  * **Utilities**: Pure functions only (Calculations, Formatters).
* **UI**: Test only components with complex conditional branching or interactive state logic.

## 4. Execution & Standards

* **Isolation**: All tests must be idempotent; reset database state via Testcontainers after each run.
* **Naming**: Explicit behavioral naming: `should_reject_invalid_price_range()` or `should_redirect_on_401()`.
* **Accountability**: Log test results and coverage gaps in `PROGRESS.md` after critical logic updates.
