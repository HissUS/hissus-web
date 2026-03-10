# Backend Implementation Blueprint (SOP)

## 1. Directory Tree & Package Truth

```text
backend/
├── /src/main/java/com/hissus
│   ├── /common         # Cross-cutting concerns (Global)
│   │   ├── /constant   # Global constants (e.g., AppConstants.java)
│   │   ├── /exception  # Global error handling & ErrorCode.java (Enum)
│   │   ├── /logging    # MDC TraceId Filter & Logging Interceptors
│   │   ├── /audit      # BaseEntity & JPA Auditing listeners
│   │   └── /utils      # System-wide utilities (Date, String, Crypto)
│   ├── /config         # Infrastructure & Framework configurations
│   │   ├── WebConfig.java      # Registering Filters, CORS, and Interceptors
│   │   └── SecurityConfig.java # Spring Security filter chain (permitAll for actuator/swagger in dev)
│   └── /modules        # Domain-driven modules (Business Logic)
│       └── /[module]   # e.g., auth, product, inquiry
│           ├── /constant   # Module-specific constants
│           ├── /controller # REST API Entry points
│           ├── /service    # Business logic & Transaction management (@Transactional)
│           ├── /dto        # RequestDTO & ResponseDTO
│           ├── /mapper     # MapStruct interfaces (Object conversion)
│           ├── /entity     # JPA Entities (Database mapping)
│           └── /repository # Data access (Spring Data JPA)
├── /src/main/resources
│   ├── /db/migration   # Flyway SQL migration scripts (Source of Truth)
│   ├── application.yml # Environment configurations
│   └── logback-spring.xml # Logging patterns (JSON for Prod, Color for Local)
├── docker-entrypoint.sh  # Reads /run/secrets/db_password → exports SPRING_DATASOURCE_PASSWORD
└── pom.xml               # Dependency management (Java 21 target, Spring Boot 3.5+, Lombok 1.18.38+)

```

## 2. Layered Architecture & Data Flow

| Layer | Responsibility | Input/Output |
| --- | --- | --- |
| **Controller** | Route matching, **Param Validation (@Valid)**, call Service. | `RequestDTO` → `ResponseDTO` |
| **Service** | **Business Logic**, **Transactions (@Transactional)**, Mapping. | `DTO` ↔ `Entity` |
| **Repository** | Pure Database CRUD. No business logic. | `Entity` |
| **Mapper** | Automated object conversion via **MapStruct**. | `Entity` ↔ `DTO` |

## 3. Core Development Rules

### A. Data Integrity & Mapping

* **DTO Isolation**: **Never** return JPA Entities to Frontend. Use `ResponseDTO` to encapsulate fields.
* **Auditing**: All domain entities must extend `BaseEntity` (contains `createdAt`, `updatedAt`, `createdBy`, `updatedBy`).
* **Mapping**: Use **MapStruct** for all conversions. No manual `set/get` for object mapping.

### B. Validation & Exceptions

* **Fail-Fast**: Mandatory `@Valid` on Controller methods using **Jakarta Bean Validation**.
* **Global Handler**: All exceptions must be caught by `@RestControllerAdvice` and returned as a **Uniform JSON Error Format** (code, message, details, timestamp).

### C. Database & Migrations (Flyway)

* **Evolution**: Schema changes **must** use Flyway scripts in `db/migration`.
* **Naming**: Scripts follow `V[YYYYMMDDHHMMSS]__Description.sql` (e.g., `V20260308000000__Initial_Schema.sql`).
* **Encoding**: PostgreSQL native `UTF8` with `en_US.UTF-8` collation. (`utf8mb4` is a MySQL-only concept and does NOT apply here.)

### D. Security & Logs

* **Auth**: Rely on **Spring Security** for RBAC and JWT-in-Cookie validation.
* **SecurityConfig**: `SecurityConfig.java` defines the `SecurityFilterChain`. Actuator and Swagger endpoints are `permitAll` (protected by network/firewall in prod). All other endpoints require authentication.
* **Docker Secrets**: Sensitive values (DB password, JWT key) are mounted as files in `/run/secrets/`. `docker-entrypoint.sh` reads each secret file and exports it as the corresponding environment variable before the JVM starts. **Never pass secrets as plain environment variables in `docker-compose.yml`.**
* **Local Dev**: When running outside Docker, set `SPRING_DATASOURCE_PASSWORD` as an IDE/shell env var pointing to the same password as `infra/secrets/db_password.txt`.
* **MDC**: Every request must inject a `traceId` into **MDC** for end-to-end log tracking.
* **Async**: Use `@Async` for non-blocking tasks (e.g., Email, PDF generation).
* **JDK Compatibility**: Build target is Java 21 (`<java.version>21</java.version>`). Local JDK can be 21 or 25. Lombok **1.18.38+** is required if the local JDK is 25 (fixes `TypeTag :: UNKNOWN` error).

## API Documentation Implementation
* **Library**: `springdoc-openapi-starter-webmvc-ui`.
* **Security**: Configure Swagger to support JWT via Cookies (OpenAPI `SecurityScheme`).
* **Environment**: Enable Swagger in `dev` and `test` profiles; disable in `prod`.