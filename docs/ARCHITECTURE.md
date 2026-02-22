# 🏗️ System Architecture: Telecom Forensic Management System

This document outlines the high-level design, data flow, and architectural principles of the Telecom Forensic Management System.

---

## 🏛️ High-Level Design

The system follows a **Modular Monolith** pattern. While all code resides in a single repository, the business logic is strictly separated into specific Django applications with a dedicated **Service Layer** for complex operations.

### App Structure
- **`telecom_forensic/`**: Project root containing global settings, URL routing, and WSGI/ASGI configurations.
- **`accounts/`**: Authentication, Custom User Model (RBAC), and global Activity Logging.
- **`cdr/`**: Core data ingestion. Home to `services/file_parser.py` and `services/generator.py`.
- **`analysis/`**: The "Forensic Brain". Contains `services/engine.py` which implements pattern recognition algorithms.
- **`dashboard/`**: Orchestration layer for visualizing cross-app data via AJAX and Chart.js.
- **`reports/`**: Data aggregation and export service.

---

## 🔄 Data Flow

1. **Ingestion**: Raw CDR data enters via the `cdr` app (File Upload, API, or Manual Entry).
2. **Normalization**: The `file_parser` service maps heterogeneous file headers to a unified `CallDetailRecord` model.
3. **Storage**: Data is committed to the MySQL database with optimized indexing on numbers and timestamps.
4. **Analysis**: The `analysis` engine reads stored records to detect anomalies, creating entries in the `AnalysisFlag` table.
5. **Visualization**: The `dashboard` and `reports` apps query both the `CallDetailRecord` and `AnalysisFlag` tables to generate insights.

---

## ⚡ Request Lifecycle (Forensic Analysis Example)

1. **Client**: Investigator clicks "Run Auto-Flag" in the UI.
2. **View**: `analysis.views.run_analysis` receives the POST request.
3. **Service**: The view delegatesto `engine.auto_flag_suspicious()`.
4. **ORM**: The engine executes complex queries (Aggregation, Hour Extraction) via the Django ORM.
5. **Mutation**: Suspicious records are updated, and new `AnalysisFlag` objects are created.
6. **Logging**: The `accounts` app's `ActivityLog` records the investigation action.
7. **Response**: A JSON or Redirect response updates the UI with the result count.

---

## 🛠️ Tech Stack & Reasoning

- **Python / Django**: Chosen for its robust ORM, built-in security features, and "batteries-included" approach to rapid development.
- **MySQL**: Relational database selected for ACID compliance and efficient handling of large-scale structured CDR tables (up to millions of records with proper indexing).
- **Service Layer Pattern**: By moving logic from `views.py` to `services/`, we ensure the code is dry, testable, and reusable across different interfaces (Web vs. Management Commands).
- **Chart.js**: Client-side rendering for performance; only raw JSON data is sent over the wire, reducing server load.

---

## 📈 Scalability Considerations

- **Database Indexing**: Crucial fields (`caller_number`, `receiver_number`, `start_time`, `is_suspicious`) are multi-indexed to ensure fast search even as the database grows.
- **Bulk Operations**: Parsers and generators use `bulk_create` to minimize database hits, supporting tens of thousands of records in seconds.
- **Async Processing (Future)**: The service-oriented design allows for easy migration of heavy analysis tasks to Celery/Redis background workers if the data volume exceeds synchronous request limits.
- **Stateless Design**: The application follows standard Django practices allowing it to be horizontally scaled behind a load balancer easily.
