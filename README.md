# Hissus.com

HISSUS company website for factory/facility setup and construction services, alongside the preserved window and screen product catalog and inquiries. The repository also contains a Spring Boot platform scaffold. See [factory website delivery](docs/factory-website-review.md) and [security review](docs/security-review.md) for route mapping, validation, outstanding photography, and deployment steps.

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

Frontend available at: `http://localhost:5173` (auto-redirects to `/factory/home`)

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
| `/` | Redirects to `/factory/home` |
| `/factory/home`, `/tw/factory/home` | Factory homepage, English / Traditional Chinese |
| `/factory/services`, `/tw/factory/services` | Factory/facility services, experience and GMP |
| `/factory/home#about`, `/tw/factory/home#about` | Company story; old About addresses redirect here |
| `/factory/contact`, `/tw/factory/contact` | Facility inquiry form |
| `/windows/home`, `/tw/windows/home` | Window and screen homepage |
| `/windows/products`, `/tw/windows/products` | Full product catalog; `?tab=...` retains category selection |
| `/windows/quote`, `/tw/windows/quote` | Window/screen quote form |
| `/login`, `/tw/login` | Shared login page |
| `/console`, `/tw/console` | Shared console placeholder |

Business roots (`/factory`, `/windows`) lead to their homepages. Old public paths (`/home`, `/services`, `/about`, `/contact`, `/window-screen-solutions`, `/products`, `/get-a-quote`) redirect to the corresponding business routes. Their `/tw` variants redirect as well. Client redirects retain query selections and hashes; Netlify is configured with HTTP 301 aliases before the SPA fallback. Production redirect behavior must be verified after deployment.

For Netlify deployment, the repository-root `netlify.toml` selects base directory `frontend`, build command `pnpm build`, publish directory `dist`, and functions directory `netlify/functions`. These directories resolve beneath `frontend`. Keep dashboard settings consistent with the file and deploy the branch containing it. Node 24 and pnpm 11.25.0 are pinned for the build. `pnpm dev` is for local development only.

Both forms require server-verified Cloudflare Turnstile proof before the existing Netlify quote function sends mail. Configure `VITE_TURNSTILE_SITE_KEY` for Builds and `TURNSTILE_SECRET_KEY` for Functions in Netlify, then redeploy. Keep `INQUIRY_EMAIL_ENABLED=false` to pause sending during setup. See [abuse controls and Turnstile setup](docs/netlify-rate-limit-review.md#turnstile-setup-and-verification-2026-10-12). Both forms use the existing Netlify quote function. See [email previews and Resend setup](docs/inquiry-email-review.md) before testing delivery. A plain Vite development server does not run Netlify Functions.

`pnpm build` prepares the function's allowed origins from Netlify's public build URL variables before compiling. The generated `.netlify/inquiry-origins.json` stays ignored and is bundled only into the server function; API keys remain runtime-only. Deploy the latest commit and test its newest deployment address because older deploy permalinks retain their old code.

**i18n URL convention**: English (US) has no country code. All other locales prepend a 2-letter country code as the first path segment (`/$country/[business]/[page]` for public business pages).

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

> Vitest is not configured. Focused server regressions use Node test; browser and CSP regressions use Playwright:

```bash
cd frontend
# Check all locale files for missing/extra keys vs en.json
pnpm check-locales
pnpm test:inquiry
# Build with your site key, or the public Cloudflare testing key for stubbed tests only:
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA pnpm build
# Start production preview in another terminal: pnpm preview --host 0.0.0.0 --port 4173
# Install Chromium if needed: pnpm exec playwright install chromium
pnpm test:browser
pnpm test:csp
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
# English default:    http://localhost:5173/factory/home
# Taiwan (zh-TW):     http://localhost:5173/tw/factory/home
```
