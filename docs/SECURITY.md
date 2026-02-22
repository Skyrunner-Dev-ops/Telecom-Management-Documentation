# 🛡️ Security Architecture: Telecom Forensic Management System

Security is the cornerstone of the **Telecom Forensic Management System**. Given its use in digital forensics and criminal investigations, the system implements multi-layered security controls to ensure data integrity, confidentiality, and accountability.

---

## 🔐 1. Authentication Model

The system uses a session-based authentication model integrated with Django's robust security framework.
- **Passwords**: Enforces standard complexity through `UserAttributeSimilarityValidator`, `MinimumLengthValidator`, `CommonPasswordValidator`, and `NumericPasswordValidator`.
- **Session Security**: 
    - `SESSION_COOKIE_HTTPONLY = True` (Prevents XSS-based session theft).
    - `SESSION_EXPIRE_AT_BROWSER_CLOSE = True` (Reduces risk on shared investigator workstations).
    - `SESSION_COOKIE_AGE = 3600` (Enforces a 1-hour timeout session).

---

## 👥 2. Role-Based Access Control (RBAC)

Access is strictly governed by the user's assigned role (`admin`, `investigator`, or `analyst`).

- **Analyst**: Primarily restricted to "View Only" access for dashboards and reports. Cannot modify or ingest new evidence.
- **Investigator**: Full access to data ingestion (File Uploads), dummy data generation, and forensic analysis engines. Cannot manage other users.
- **Admin**: Complete system oversight, including User Management and system configuration.

**Implementation**: Enforced via custom decorators (e.g., `@investigator_required`) and template-level logic that hides unauthorized UI elements.

---

## 🛡️ 3. Core Protections

### CSRF (Cross-Site Request Forgery)
- **Status**: Enabled Globally.
- Every state-changing request (POST, PUT, DELETE) requires a cryptographically secure CSRF token.
- Forms in the UI must include the `{% csrf_token %}` tag, or the request will be automatically rejected.

### SQL Injection Prevention
- **Status**: Protected by Design.
- The system exclusively uses the **Django ORM** (Object-Relational Mapper) for database interactions.
- Queries are parameterized by default, making the system immune to traditional SQL injection attacks where malicious code is "injected" into query strings.

### XSS (Cross-Site Scripting)
- **Status**: Mitigated via Auto-Escaping.
- The Django Template Engine automatically escapes all variables. For example, a phone number containing `<script>` would be rendered as harmless text rather than executed as code.

---

## 📁 4. Data Protection

### Evidence Integrity
- **Immutability Principle**: The system is designed so that once a `CallDetailRecord` is imported, it is not intended for manual modification in the UI, preserving the "chain of custody" for the digital evidence.
- **Source Tracking**: Every record stores its `source` (Manual, Upload, Dummy) and the `created_by` (the specific user ID who brought the data into the system).

### Database Security
- **Strict Mode**: The MySQL connection is configured with `STRICT_TRANS_TABLES` to prevent data truncation or silent failures during large imports.
- **Indexing**: High-performance indexes prevent "Denial of Service" scenarios caused by slow queries on large datasets.

---

## 📋 5. Audit Logging

Accountability is maintained through the `ActivityLog` module, which records:
1. **The Actor**: Which user performed the action.
2. **The Action**: What was done (e.g., "Triggered Forensic Analysis", "Exported High-Security Dataset").
3. **The Metadata**: IP address of the user and a detailed timestamp.
4. **The Details**: Extra context like the number of records affected or the filename uploaded.

---

## 🚪 6. Access Control Rules

| Endpoint | Required Permission |
| :--- | :--- |
| `/admin/` | Superuser / Admin Role |
| `/accounts/users/` | Admin Role |
| `/cdr/upload/` | Investigator Role |
| `/analysis/run/` | Investigator Role |
| `/dashboard/` | Any Logged-in User |
| `/api/char-data/` | Any Logged-in User |

---

## ⚠️ Security Recommendations for Deployment

1. **HTTPS/TLS**: Always deploy with SSL/TLS (Certbot/Let's Encrypt) to encrypt data in transit.
2. **Firewall**: Restrict MySQL access to `localhost` or specific application server IPs only.
3. **Secrets Management**: Move the `SECRET_KEY` and DB Credentials out of `settings.py` and into environment variables.
4. **Static File Serving**: In production, ensure `DEBUG = False` so that Django does not serve sensitive error tracebacks to end-users.
