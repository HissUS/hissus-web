# API Contract & Data Transfer Protocol

## 1. Request/Response Standard

* **Structure**: All API responses MUST wrap data in the `Result<T>` container.
* **Format**:
```json
{
  "code": "SUCCESS", 
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-03-07T..."
}
```

## 2. Authentication & Handshake

* **Storage**: JWT is strictly stored in `HttpOnly`, `Secure`, `SameSite=Strict` Cookies.
* **Security**: Frontend JS MUST NOT access the token.
* **Interceptor**: Axios must handle `401 Unauthorized` errors by clearing local UI state (Zustand) and redirecting to `/login`.

## 3. Validation Synchronization

* **Strategy**: Parallel validation to ensure "Surgical Stability."
* **Frontend**: **Zod** schema validation before any API call.
* **Backend**: **Jakarta Bean Validation** (`@Valid`) in all REST Controllers.
* **Strict Rule**: Validation constraints (regex, length, nullability) MUST be identical in both layers.

## 4. Data Mapping (DTO/Entity)

* **Tool**: **MapStruct** exclusively for all conversions.
* **Layering**: Entities MUST NOT be exposed to the controller layer. Service layer handles `RequestDTO -> Entity` and `Entity -> ResponseDTO` mapping.

## 5. API Documentation (Swagger)

* **Standard**: OpenAPI 3.0 via SpringDoc.
* **Tiered Rules**:
    * **High Priority (Public/Auth/Financial)**: MUST use `@Tag` and `@Operation` to describe business intent and specific error codes.
    * **Low Priority (Internal CRUD)**: Use minimal annotations. Rely on clean method naming for auto-documentation.
* **Clean Code**: Avoid redundant summaries. If the method is `updateProductPrice()`, do not add `@Operation(summary = "Update product price")`. Use annotations only to add **value** (e.g., security constraints).
* **Accuracy**: The Swagger UI must exactly match the `Result<T>` structure and validation rules defined in this contract.
* **Public Endpoint**: `/swagger-ui.html` (Available in dev/staging).