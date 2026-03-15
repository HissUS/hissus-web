# Hissus.com

A SaaS platform for browsing products and generating automated quotations.

## Prerequisites

| Tool | Version |
|---|---|
| JDK | 21 |
| Node.js | 22+ |
| pnpm | 10+ |
| Docker & Docker Compose | Latest |
| Maven Wrapper | Included (`./mvnw`) |

## Repository Structure

```
hissus/
├── backend/          # Java 21 / Spring Boot 3.5+
├── frontend/         # React (Vite) / TypeScript
├── infra/            # Docker Compose, Nginx, Cloudflare Tunnel
│   ├── docker-compose.yml
│   ├── nginx/nginx.conf
│   └── secrets/      # (gitignored) Docker Secrets files
└── docs/             # Architecture blueprints and progress log
```

## First-time Setup

### 1. Create Secrets

```bash
mkdir -p infra/secrets
echo "your_db_password_here" > infra/secrets/db_password.txt
```

### 2. Install Root Dev Tools (Husky + Commitlint)

```bash
pnpm install
```

### 3. Start Infrastructure (Local Dev)

```bash
cd infra
docker compose --profile local up -d
```

Services started:
- `hissus_db`: PostgreSQL 17 + PostGIS on port `5432`
- `hissus_backend`: Spring Boot API on port `8080`
- `hissus_nginx`: Local reverse proxy on port `80`

### 4. Start Frontend Dev Server

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend available at: `http://localhost:5173` (auto-redirects to `/home`)

## Building

### Backend

```bash
cd backend
./mvnw clean package -DskipTests
```

### Frontend

```bash
cd frontend
pnpm build
```

## API Endpoints

> Base path: `/api` (via Nginx proxy in local dev)

| Endpoint | Description |
|---|---|
| `GET /api/actuator/health` | Health check (Liveness/Readiness) |
| `GET /api/actuator/flyway` | Flyway migration status |
| `GET /api/swagger-ui.html` | Swagger UI (dev profile only) |

### Swagger UI

Available only when `SPRING_PROFILES_ACTIVE=dev` (default in Docker Compose local):

```
http://localhost:8080/api/swagger-ui.html   # direct to backend
http://localhost/api/swagger-ui.html        # via Nginx (--profile local)
```

> Note: Shows "No operations defined in spec!" until business `@RestController` endpoints are added. This is expected during skeleton phase.

Disabled automatically in `prod` profile.

## Frontend Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/home` |
| `/home` | Homepage — English (US, default) |
| `/$country/home` | Homepage — localized (e.g. `/tw/home`) |
| `/login` | Login page — English |
| `/$country/login` | Login page — localized (e.g. `/tw/login`) |
| `/products` | Product catalog — English |
| `/$country/products` | Product catalog — localized (e.g. `/tw/products`) |

**i18n URL convention**: English (US) has no country code. All other locales prepend a 2-letter country code as the first path segment (`/$country/[page]`).

| Country code | Locale |
|---|---|
| *(none)* | `en` — English (US, default) |
| `tw` | `zh-TW` — Traditional Chinese (Taiwan) |

To add a new locale, see `frontend/src/locales/config.ts`.

## Running Tests

### Backend

```bash
cd backend
# Unit tests
./mvnw test

# Integration tests (requires Docker for Testcontainers)
./mvnw verify
```

### Frontend

> Unit test framework (Vitest) not yet configured. Available locale tooling:

```bash
cd frontend
# Check all locale files for missing/extra keys vs en.json
pnpm check-locales
```

## Commit Convention

All commits must follow **Conventional Commits** with a mandatory scope:

```
feat(backend): add product search endpoint
fix(frontend): resolve login redirect loop
docs(infra): update docker-compose secrets config
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `test`, `perf`, `ci`, `revert`

## Local Backend Development (IDE / Maven direct)

When running the backend outside Docker (e.g., IntelliJ or `./mvnw spring-boot:run`), the DB password must be provided as an environment variable (Docker Secrets are not available outside containers):

```bash
# Start only the database container
cd infra && docker compose up -d db

# Run backend with password env var
cd backend
SPRING_DATASOURCE_PASSWORD=<your_password> ./mvnw spring-boot:run
```

In IntelliJ: **Run Configuration → Environment Variables** → add `SPRING_DATASOURCE_PASSWORD=<your_password>`.

## Verification

```bash
# Backend health (direct or via Nginx)
curl http://localhost:8080/api/actuator/health
curl http://localhost/api/actuator/health

# PostGIS version
docker exec hissus_db psql -U hissus -d hissus -c "SELECT PostGIS_version();"

# Flyway migration status
curl http://localhost:8080/api/actuator/flyway

# Swagger UI (dev profile only)
open http://localhost:8080/api/swagger-ui.html

# Secrets not leaked into container env
docker exec hissus_backend env | grep -iE "password|secret"  # should return nothing

# i18n routing
# English default:    http://localhost:5173/home
# Taiwan (zh-TW):     http://localhost:5173/tw/home
```
