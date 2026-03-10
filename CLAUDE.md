# Hissus Engineering Architecture Guide

## AI Interaction
* **Workflow**: **Must** ask clarifying questions, outline a detailed implementation plan, and wait for explicit user approval before proceeding with code generation for new features or infrastructure.

* **Implementation Priority (highest first)**:
  * Product Showcase (The Hero): High-clarity catalog using real-world installation photos. Focus on conversion (Get Quote CTA).
  * Logic Decoupling: No direct cross-module dependencies.
  * Observability: Every request must have a traceId and clear logs.
  * Security: RBAC implemented within isolated modules.

## Project Context
* This document defines the architecture and coding standards for the Hissus platform.
* Hissus.com is a SaaS platform where users can browse products and generate automated quotations.

## Core Architectural Context
* **Access Control Strategy**: 
    * **Granular Permission System**: Do not hardcode roles in business logic. Use specific permission keys (e.g., `QUOTATION_VIEW`, `FINANCIAL_EDIT`, `JOB_MANAGE`).
    * **Mapping**: Roles are merely containers for these permissions.
    * **Security Enforcement**: 
        * Backend: Use `@PreAuthorize("hasAuthority('...')")` on Service methods.
        * Frontend: Use a `<PermissionGuard permission="...">` wrapper for UI elements.

## Tech Stack

* **Frontend**: React 19+ (Vite), TS, Tailwind v4, Shadcn UI, TanStack Router/Query v5, **pnpm** (package manager), **react-i18next** (i18n).
* **Backend**: Java 21 (LTS), Spring Boot 3.5+, PostgreSQL 17 + PostGIS, Flyway.
* **Infrastructure**:
    * **Compute**: Oracle Cloud ARM (Docker Compose).
    * **Gateway**: Cloudflare Tunnel (Zero Trust) for Production.
    * **Local Proxy**: Nginx (Local Dev only) for /api routing.
* **Constraints**:
  * No paid APIs
  * No paid cloud services

## Project Structure & Governance

* **Monorepo Strategy**: Feature-based isolation.
* **Frontend**: `src/features/[name]` (Components, Hooks, Services, Types).
* **Backend**: `com.hissus.modules.[name]` (Controller, Service, DTO, Mapper, Entity, Repo).
* **Infra**: All DevOps configs (Docker, Cloudflare Tunnel, Nginx-Dev) in `/infra`.

## Coding Standards

### 1. Naming Conventions

* **PascalCase**: Frontend Components/Types/Interfaces.
* **camelCase**: TS/Java Variables, Functions, Entity Fields.
* **snake_case**: DB Tables/Columns (Plural tables: `users`).
* **kebab-case**: REST API Paths (`/api/v1/user-profiles`).

### 2. Code Size (Soft Limits)

- **Functions ~30 lines** (single responsibility; exceed only if logic is cohesive)
- **Files ~250 lines** (≤400 acceptable if same domain)
- **React Components ~150 lines** → extract **Custom Hooks** for logic
- **Max nesting ~3 levels** → prefer **guard clauses**
- **Max 3 params** → use **DTO / object destructuring**

### 3. Packaging & Modularization

* **Frontend Exports**: Mandatory `index.ts` (Barrel Exports) for all shared directories to ensure clean, shallow imports.
* **Backend Visibility**: Favor standard Java package-private visibility to enforce strict modularity between packages.

### 4. Logic Decoupling (Strict)

* **Frontend**: Components must be "Thin". Move logic to **Custom Hooks**.
* **Backend**: Entity MUST NOT leave Service layer. Use **MapStruct** for DTO conversion.
* **Validation**: Zod (Frontend) + Jakarta Bean Validation (Backend). Sync regex/rules.

### 5. State Management

* **Server State**: TanStack Query (Wrapped in hooks).
* **Global UI State**: Zustand (Atomic, no JWT storage).
* **Form State**: React Hook Form + Zod.

## Security & Infrastructure

* **Auth**: JWT via `HttpOnly`, `Secure`, `SameSite=Strict` Cookies.
* **Protection**: BCrypt, RBAC, Rate Limiting (Bucket4j), CSP.
* **Secrets Management**: **Strictly use Docker Secrets**. Sensitive data (DB passwords, JWT keys) must be mounted as files in `/run/secrets/`.
* **Zero Trust Gateway**: **Cloudflare Tunnel (Zero Trust)** only. All inbound ports (80, 443, 22) on the Oracle VPS must be closed via Security Lists.
* **Health Checks**: Actuator `/actuator/health` (Liveness/Readiness). 

## Database & Storage

* **Migration**: Flyway only. No `ddl-auto=update`.
* **Audit**: All entities extend `BaseEntity` (JPA Auditing).
* **Backup**: Daily `pg_dump` to local mount + encrypted offsite rsync.
* **Naming**: Table names MUST follow the 3-letter prefix convention (sys_, cat_, qte_, fin_, ops_).
* **Encoding**: PostgreSQL native `UTF8` with `en_US.UTF-8` collation. **Never use `utf8mb4`** (MySQL-only encoding, not applicable to PostgreSQL).
* **Account Identifier**: `sys_accounts` uses **`email`** (not `username`) as the unique login identifier.

## Feature Specifications

* **Source of Truth**: `docs/features/*.md`. Must read before any implementation.
* **Ambiguity**: Stop and ask if requirements are missing, conflicting, or unclear.

## i18n & SEO

* **Library**: **react-i18next**. Language detected from URL via `useLocale()` hook (reads `$country` param).
* **URL Convention**: English (US) is the default — **no country code in URL**. All other locales append a 2-letter country code as the **last path segment**.
  * `/home` → `en` (English US, default)
  * `/home/tw` → `zh-TW` (Taiwan Traditional Chinese)
  * `/home/jp` → `ja-JP` (Japan, future)
* **Pattern**: Key-based JSON in `src/locales/` (`en.json` is source of truth). Zero hardcoded UI strings.
* **Config**: Country→locale mapping lives in `src/locales/config.ts`. Adding a new locale requires only: (1) entry in `COUNTRY_TO_LOCALE`, (2) new JSON file, (3) register in `i18n.ts`.
* **Tooling**: `pnpm check-locales` warns on missing keys. `sort-locales.mjs` auto-runs on commit via lint-staged.

## Progress Tracking & Verification
* **Progress Accountability**: After every task, update docs/PROGRESS.md strictly following the template defined in docs/blueprints/verification.md. Each entry MUST contain executable verification steps.