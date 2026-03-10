# Verification Blueprint

## 1. Mandatory Template

*Claude must populate this for every entry in `docs/PROGRESS.md`.*

```markdown
### [ID-XXX] Feature Name (YYYY-MM-DD)
* **Summary**: 1-2 sentences on logic/goal.
* **Affected Files**: 
    * `path/to/file`
* **Verification**:
    * **Action**: [Steps to take]
    * **Expected**: [What to see]
    * **Command/URL**: [Executable command or specific link]
```

## 2. Standards

* **IDs**: `[INIT-###]` (Setup), `[FEAT-###]` (Feature), `[FIX-###]` (Bug), `[INFRA-###]` (Infrastructure).
* **Files**: List all created/modified paths for `git status` audit.
* **Verification Methods**:
  * **Backend**: Provide `curl` commands or `/actuator` endpoints.
  * **Frontend**: Provide specific URL paths (e.g., `/en/login`) and visual cues.
  * **Database**: List Flyway script names or SQL queries for state verification.
  * **Edge Cases**: Always include a "Fail Case" (e.g., how to trigger a `400 Bad Request`).

## 3. Reference Example

### [INIT-001] Backend Core (2026-03-07)
* **Summary**: Implemented `BaseEntity` auditing and `Result` wrapper.
* **Affected Files**:
  * `backend/src/main/java/com/hissus/common/audit/BaseEntity.java`
  * `backend/src/main/java/com/hissus/common/result/Result.java`
* **Verification**:
  * **Action**: Run app and check health endpoint.
  * **Expected**: JSON `{"status": "UP"}`.
  * **Command**: `curl http://localhost:8080/actuator/health`
