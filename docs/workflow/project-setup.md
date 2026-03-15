# Project Setup & Groundwork SOP

This document defines the mandatory steps to initialize the **Hissus.com** repository. All implementations **MUST** align with the principles in `CLAUDE.md` and follow the technical specifications in `docs/blueprints/frontend.md` and `docs/blueprints/backend.md`.

## Phase 1: Git & Quality Control (The Guardrails)

### 1. Commit Message Validation (Husky + Commitlint)

* **Rule**: All commit messages must follow **Conventional Commits** (feat, fix, docs, style, refactor, chore, test).
* **Scope**: Commits must include a scope representing the affected module (e.g., `feat(backend): ...`, `fix(infra): ...`).
* **Setup**: Configure **Husky** with a `commit-msg` hook to execute `commitlint` on every commit.

### 2. Pre-commit Hooks & Formatting

* **Backend (Java)**: Integrate the **Spotless** plugin to enforce Google Java Style. The `.husky/pre-commit` hook must execute `./mvnw spotless:apply` to ensure all AI-generated code is formatted before commiFtting.
* **Frontend (React/TS)**: Use `lint-staged` to run `eslint --fix` and `prettier --write` on staged files to maintain code health.

### Phase 2: Infrastructure Initialization

* **Containerization**: Create `infra/docker-compose.yml` defining:
  * **Database**: `postgis/postgis:16-3.4` (PostgreSQL 16 with GIS extensions).
  * **Backend**: Spring Boot 3.x image.
  * **Tunnel**: `cloudflare/cloudflared` (Production Gateway).
  * **Local Proxy**: `nginx:alpine` (Mapped for **Local Dev** only).

* **Database Configuration**:
  * **Encoding**: Set `POSTGRES_INITDB_ARGS` to `--encoding=UTF-8 --lc-collate=en_US.UTF-8`.
  * **Persistence**: Map `./data/postgres` to `/var/lib/postgresql/data`.

* **Networking**:
  * **Production**: Cloudflare Tunnel targets `backend:8080` directly.
  * **Local**: Nginx routes `localhost/api` to `backend:8080`.

## Phase 3: Backend Groundwork (Java 21 / Spring Boot 3.x)

> **Constraint**: Architecture must strictly follow the directory tree defined in `docs/blueprints/backend.md`.
1. **Dependencies**: Initialize `pom.xml` with **Flyway**, **MapStruct**, **Lombok**, **Spring Security**, and **Actuator**.
2. **Core Classes**:
* **Auditing**: Implement `com.hissus.common.audit.BaseEntity` utilizing JPA Auditing (`@CreatedDate`, `@LastModifiedDate`).
* **Unified Result**: Implement `com.hissus.common.result.Result<T>` as the standard API wrapper for all responses.
* **Error Handling**: Implement a `GlobalExceptionHandler` to catch `MethodArgumentNotValidException` and business exceptions.
3. **DB Migration**: Create `src/main/resources/db/migration/V1__Initial_Schema.sql` to initialize `users`, `roles`, and `audit_log` tables.

## Phase 4: Frontend Groundwork (Vite / React / TS)

> **Constraint**: Architecture must strictly follow the Feature-Based structure in `docs/blueprints/frontend.md`.
1. **Scaffolding**: Initialize a Vite + TypeScript project. Pre-create the `features/`, `components/ui-wrapper/`, `api/`, and `layouts/` directories.
2. **Global Configuration**:
* **Axios**: Setup interceptors for automatic `HttpOnly` cookie handling and `401 Unauthorized` redirection.
* **Router**: Configure **TanStack Router** with language-prefixed paths (e.g., `/$country/home`).
* **UI System**: Install **Tailwind CSS** and **Shadcn UI**, ensuring all Shadcn components are stored in `src/components/ui-wrapper`.
3. **i18n Setup**: Initialize `src/locales/` with `zh-TW.json` and `en.json` using the **Key-Based** JSON format.

## Phase 5: Documentation Maintenance (Mandatory)

> **Action**: As Claude completes each phase of the setup, the root `README.md` **MUST** be updated to reflect the current state of the project.
* **Requirements**:
1. Update the **Prerequisites** (JDK version, Node version, Docker).
2. Provide clear instructions on how to **Build and Run** the newly created services.
3. Document available **API endpoints** and **Frontend routes**.
4. List steps to execute newly implemented tests.
* **Goal**: The `README.md` should be a "living" document that allows any developer to get the environment running immediately.

## Phase 6: Verification

* Confirm the Backend Actuator `/actuator/health` returns `UP`.
* Verify that Flyway successfully executed the `V1` migration (including `CREATE EXTENSION postgis`) in the PostgreSQL container.
* Confirm the Frontend correctly toggles language content based on the URL path.

