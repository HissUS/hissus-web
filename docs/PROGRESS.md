# PROGRESS LOG

---

### [INIT-001] Project Setup & Groundwork (2026-03-08)

* **Summary**: Full monorepo initialization covering Git quality controls (Husky + Commitlint), Docker infrastructure (PostgreSQL PostGIS + Spring Boot + Nginx), Spring Boot backend skeleton (BaseEntity, Result<T>, GlobalExceptionHandler, TraceIdFilter, Flyway V1 migration), and React frontend skeleton (Vite + TanStack Router + TanStack Query v5 + react-i18next + Zustand + Tailwind).

* **Affected Files**:
  * `package.json` (root — Husky + Commitlint)
  * `.commitlintrc.json`
  * `.husky/commit-msg`
  * `.husky/pre-commit`
  * `.gitignore` (updated)
  * `infra/docker-compose.yml`
  * `infra/docker-compose.override.yml` (Apple Silicon ARM64 fix)
  * `infra/nginx/nginx.conf`
  * `backend/pom.xml`
  * `backend/Dockerfile`
  * `backend/docker-entrypoint.sh`
  * `backend/src/main/java/com/hissus/HissusApplication.java`
  * `backend/src/main/java/com/hissus/common/audit/BaseEntity.java`
  * `backend/src/main/java/com/hissus/common/result/Result.java`
  * `backend/src/main/java/com/hissus/common/exception/ErrorCode.java`
  * `backend/src/main/java/com/hissus/common/exception/BusinessException.java`
  * `backend/src/main/java/com/hissus/common/exception/GlobalExceptionHandler.java`
  * `backend/src/main/java/com/hissus/common/logging/TraceIdFilter.java`
  * `backend/src/main/java/com/hissus/config/WebConfig.java`
  * `backend/src/main/java/com/hissus/config/SecurityConfig.java`
  * `backend/src/main/resources/application.yml`
  * `backend/src/main/resources/logback-spring.xml`
  * `backend/src/main/resources/db/migration/V20260308000000__Initial_Schema.sql`
  * `frontend/vite.config.ts`
  * `frontend/src/main.tsx`
  * `frontend/src/i18n.ts`
  * `frontend/src/api/axios.ts`
  * `frontend/src/router/index.tsx`
  * `frontend/src/store/uiStore.ts`
  * `frontend/src/layouts/MainLayout.tsx`
  * `frontend/src/layouts/AuthLayout.tsx`
  * `frontend/src/hooks/useLocale.ts`
  * `frontend/src/hooks/index.ts`
  * `frontend/src/locales/config.ts`
  * `frontend/src/locales/zh-TW.json`
  * `frontend/src/locales/en.json`
  * `frontend/src/pages/HomePage.tsx`
  * `frontend/src/pages/LoginPage.tsx`
  * `frontend/src/pages/ProductsPage.tsx`
  * `frontend/src/constants/regex.ts`
  * `frontend/scripts/sort-locales.mjs`
  * `frontend/scripts/check-locales.mjs`
  * `README.md`

* **Verification**:

  * **Action 1**: Start infrastructure and check backend health.
  * **Expected**: JSON `{"status":"UP"}`.
  * **Command**:
    ```bash
    cd infra && docker compose --profile local up -d
    curl http://localhost:8080/api/actuator/health
    ```

  * **Action 2**: Verify PostGIS extension is active.
  * **Expected**: PostGIS version string output.
  * **Command**:
    ```bash
    docker exec hissus_db psql -U hissus -d hissus -c "SELECT PostGIS_version();"
    ```

  * **Action 3**: Verify Flyway migration executed successfully.
  * **Expected**: V20260308000000 with status `SUCCESS`.
  * **Command**:
    ```bash
    curl http://localhost:8080/api/actuator/flyway
    ```

  * **Action 4**: Verify frontend starts and redirects to English default.
  * **Expected**: Browser navigates to `/home` (no country suffix = English default).
  * **URL**: `http://localhost:5173`

  * **Action 5**: Verify i18n routing works.
  * **Expected**: UI text changes to Traditional Chinese.
  * **URL**: `http://localhost:5173/home/tw`

  * **Action 6**: Verify Docker Secrets are not leaked into environment.
  * **Expected**: No output (password is read from file, not env var).
  * **Command**:
    ```bash
    docker exec hissus_backend env | grep -iE "password|secret|jwt"
    ```

  * **Action 7**: Verify uploads volume persistence.
  * **Expected**: File appears in `infra/data/uploads/` on host.
  * **Command**:
    ```bash
    docker exec hissus_backend touch /app/uploads/test.txt
    ls infra/data/uploads/test.txt
    ```

  * **Action 8**: Verify GIS permission is active.
  * **Expected**: Table created without error.
  * **Command**:
    ```bash
    docker exec hissus_db psql -U hissus -d hissus -c "CREATE TABLE gis_test (loc GEOGRAPHY); DROP TABLE gis_test;"
    ```

  * **Fail Case**: Submit an invalid commit message.
  * **Expected**: commitlint blocks the commit with a scope error.
  * **Command**:
    ```bash
    git commit -m "bad commit message"  # should fail
    ```

---

### [INIT-002] Backend Infrastructure Fixes (2026-03-08)

* **Summary**: Fixed three gaps discovered during first-run verification: (1) Docker Secrets were mounted but never read by Spring Boot — added `docker-entrypoint.sh` to export secret files as env vars before JVM starts. (2) Spring Security blocked `/actuator/flyway` with 401 — added `SecurityConfig` to permit actuator and Swagger in all profiles. (3) Backend port 8080 was not published to host — added `ports: "8080:8080"` to `docker-compose.yml`.

* **Affected Files**:
  * `backend/docker-entrypoint.sh` (new)
  * `backend/Dockerfile` (updated ENTRYPOINT)
  * `backend/src/main/java/com/hissus/config/SecurityConfig.java` (new)
  * `infra/docker-compose.yml` (added `ports: "8080:8080"` to backend service)

* **Verification**:

  * **Action 1**: Verify Flyway endpoint is accessible without auth.
  * **Expected**: JSON with migration list, state `SUCCESS`.
  * **Command**: `curl http://localhost:8080/api/actuator/flyway`

  * **Action 2**: Verify backend port is reachable directly.
  * **Expected**: `{"status":"UP"}`.
  * **Command**: `curl http://localhost:8080/api/actuator/health`

  * **Action 3**: Verify password is not leaked as env var.
  * **Expected**: No output (secret is read from file via entrypoint script, not env var).
  * **Command**: `docker exec hissus_backend env | grep -iE "password|datasource_password"`

  * **Fail Case**: Remove `db_password.txt` content and restart.
  * **Expected**: `hissus_db` container becomes unhealthy; backend refuses to start.

---

### [INIT-003] i18n URL Routing Refactor (2026-03-08)

* **Summary**: Changed URL routing pattern from `/$lang/page` (language prefix) to `/page/$country` (country suffix). English (US) is now the default with no suffix (`/home`). Other locales append a 2-letter country code (`/home/tw`). Added `useLocale()` and `useLocaleSwitcher()` hooks for URL-driven language detection and switching. Language switcher added to `MainLayout` header.

* **Affected Files**:
  * `frontend/src/router/index.tsx` (renamed from `.ts`, restructured with layout routes)
  * `frontend/src/locales/config.ts` (new — `COUNTRY_TO_LOCALE` mapping, source of truth)
  * `frontend/src/hooks/useLocale.ts` (new — reads `$country` param, syncs `i18n.changeLanguage()`)
  * `frontend/src/hooks/index.ts` (updated barrel export)
  * `frontend/src/i18n.ts` (simplified — removed `LanguageDetector`, detection via hook)
  * `frontend/src/layouts/MainLayout.tsx` (added `useLocale()`, language switcher UI)
  * `frontend/src/layouts/AuthLayout.tsx` (added `useLocale()` call)
  * `frontend/src/pages/HomePage.tsx` (new)
  * `frontend/src/pages/LoginPage.tsx` (new)
  * `frontend/src/pages/ProductsPage.tsx` (new)

* **Verification**:

  * **Action 1**: Verify English default (no suffix).
  * **Expected**: Page loads in English, URL stays `/home`.
  * **URL**: `http://localhost:5173/home`

  * **Action 2**: Verify localized route.
  * **Expected**: Page text switches to Traditional Chinese.
  * **URL**: `http://localhost:5173/home/tw`

  * **Action 3**: Verify language switcher button.
  * **Expected**: Clicking `TW` navigates from `/home` → `/home/tw`.
  * **URL**: `http://localhost:5173/home` → click TW button in header

  * **Action 4**: Verify root redirect.
  * **Expected**: `http://localhost:5173/` redirects to `/home`.

  * **Fail Case**: Visit `/home/xx` (unknown country code).
  * **Expected**: Page loads but falls back to English (no crash).

---

### [INIT-004] Locale Quality Tooling (2026-03-08)

* **Summary**: Added two scripts to enforce locale consistency. `sort-locales.mjs` deep-sorts all JSON keys alphabetically and is run automatically by lint-staged on every commit for `src/locales/*.json` files. `check-locales.mjs` compares all locale files against `en.json` and warns on missing or extra keys; runs in the pre-commit hook (non-blocking by default — change `process.exit(0)` to `process.exit(1)` to enforce).

* **Affected Files**:
  * `frontend/scripts/sort-locales.mjs` (new)
  * `frontend/scripts/check-locales.mjs` (new)
  * `frontend/package.json` (added `check-locales` script; updated `lint-staged` config)
  * `.husky/pre-commit` (added `pnpm check-locales` step)

* **Verification**:

  * **Action 1**: Verify sort runs on commit.
  * **Expected**: Locale files are re-sorted before commit; no diff if already sorted.
  * **Command**: `node scripts/sort-locales.mjs src/locales/en.json`

  * **Action 2**: Verify completeness check passes with all keys present.
  * **Expected**: `✓  zh-TW.json`.
  * **Command**: `cd frontend && pnpm check-locales`

  * **Fail Case**: Remove a key from `zh-TW.json` and run check.
  * **Expected**: Warning listing the missing key(s).
  * **Command**: `cd frontend && pnpm check-locales`
