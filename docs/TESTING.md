# 🧪 Testing Strategy: Telecom Forensic Management System

This document outlines the testing methodologies used to ensure the reliability, accuracy, and security of the forensic analysis platform.

---

## 🛠️ 1. Testing Methodology Overview

The system is validated through a combination of **Automated Unit Tests**, **Manual Functional Testing**, and **Forensic Accuracy Verification**.

### Running Automated Tests
To execute the built-in Django test suite:
```bash
python manage.py test
```

---

## 🧪 2. Functional & Manual Test Cases

| Feature | Test Scenario | Expected Result |
| :--- | :--- | :--- |
| **Authentication** | Login with invalid credentials. | System shows "Invalid username or password" alert. |
| **RBAC** | Attempt to access `/accounts/user-list/` as an Analyst. | User is redirected or receives a 403 Forbidden error. |
| **Dummy Generator** | Generate 10 records with "Suspicious Patterns" off. | 10 records created with `is_suspicious=False` and no flags. |
| **File Upload** | Upload a CSV with mismatched headers (e.g., `From_Num`). | System correctly maps to `caller_number` via fuzzy logic. |
| **Timeline** | Search for a number with zero call history. | System displays "No records found for this number" message. |

---

## ⚡ 3. Edge Case Testing

These tests ensure the system doesn't crash during unexpected data scenarios:
-   **Zero Duration Calls**: Ensuring the parser handles calls that start and end at the same second without math errors.
-   **Future Timestamps**: Records with `start_time` set in the future are flagged or rejected during ingestion.
-   **Cross-Year CDRs**: Testing boundary scenarios where a call starts on Dec 31st and ends on Jan 1st.
-   **Special Characters**: Injecting phone numbers with symbols (e.g., `+`, `-`, `( )`) to ensure the cleaning logic works correctly.
-   **Empty Files**: Uploading an empty CSV should return a graceful "No records found" error rather than a server crash.

---

## ✅ 4. Data Validation Tests

-   **Schema Constraints**: Verification that the database rejects null values for mandatory fields like `caller_number` and `start_time`.
-   **Business Logic Validation**: 
    -   `duration` must equal `end_time - start_time`.
    -   `receiver_number` cannot be identical to `caller_number` (Loopback detection).
-   **Role Integrity**: Ensuring a user cannot escalate their own role through profile updates.

---

## 📈 5. Performance & Load Testing

Forensic systems must handle large datasets without UI lag.
-   **Bulk Ingestion**: Tested with 10,000+ records in a single CSV to verify `bulk_create` performance and memory usage.
-   **Query Optimization**: Using Django's `Silk` or `Debug Toolbar` to ensure the Dashboard doesn't perform "N+1" queries when listing Analysis Flags.
-   **Index Validation**: Running `EXPLAIN` on MySQL queries for the **Timeline** reconstruction to ensure it uses the B-Tree index on `caller_number`.

---

## 🛡️ 6. Security Testing

-   **SQL Injection**: Manual testing by injecting `' OR '1'='1` into search bars to verify ORM parameterization.
-   **CSRF Verification**: Attempting to post data via an external tool (like Postman) without a token to ensure the request is blocked.
-   **Session Hijacking**: Verification that the `sessionid` cookie is marked as `HttpOnly` and `SameSite=Lax`.
-   **Path Traversal**: Testing file upload paths to ensure users cannot upload files outside the designated `media/uploads/` directory.
-   **Password Strength**: Verifying that common passwords like `password123` are rejected during user creation.
