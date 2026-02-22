# 🧩 Project Modules: Telecom Forensic Management System

This document provides a technical breakdown of each application module within the system, detailing their responsibilities, key components, and internal logic.

---

## 🔐 Authentication & Accounts (`accounts/`)
The foundation of the system's security and auditing.

- **Custom User Model**: Implements Role-Based Access Control (RBAC) with three distinct levels: `Admin`, `Investigator`, and `Analyst`.
- **RBAC Decorators**: Custom Python decorators (e.g., `@admin_required`) ensure that sensitive forensic tools are only accessible by authorized personnel.
- **Activity Logging**: A signal-based or view-wrapped service that records every critical action (logins, uploads, analysis runs) to the `ActivityLog` table for legal compliance.
- **Management Commands**: Includes `seed_users` to quickly bootstrap an environment with pre-configured forensic roles.

---

## 📞 CDR Management (`cdr/`)
The primary data handling hub for Call Detail Records.

- **Centralized Model**: The `CallDetailRecord` model is optimized for high-speed indexing and retrieval of millions of rows.
- **Manual Entry**: A secure web form for adding tactical intelligence gathered during field operations.
- **Data Lifecycle**: Manages the transition of records from "Injected" to "Analyzed" and "Flagged".

---

## 📥 File Ingestion Service (`cdr/services/file_parser.py`)
A robust service layer for importing external data.

- **Multi-Format Support**: Native parsers for **CSV**, **JSON**, and **XML**.
- **Header Normalization**: Uses a fuzzy mapping logic to automatically identify columns like `caller_number`, even if they are labeled as `src`, `from`, or `a_number` in the source file.
- **Bulk Processing**: Uses Django's `bulk_create` to import thousands of records in a single database transaction, ensuring atomicity and performance.

---

## 🧪 Dummy Generator Service (`cdr/services/generator.py`)
Simulation engine for training and testing.

- **Procedural Generation**: Generates realistic phone numbers, timestamps, and durations.
- **Pattern Injection**: Includes logic to intentionally create "suspicious" footprints (e.g., long calls, night activity) so investigators can practice using the analysis tools.
- **Configurable Scale**: Allows users to generate anywhere from 10 to 10,000+ records in a few seconds.

---

## 🧠 Forensic Analysis Module (`analysis/`)
The investigative core that transforms raw data into intelligence.

- **Forensic Engine (`engine.py`)**: Implements specific heuristic algorithms:
    - **Night Owl Detection**: Flags calls occurring between 12:00 AM and 5:00 AM.
    - **Duration Analysis**: Identifies statistical outliers in call lengths.
    - **Frequency Mapping**: Detects unusually high contact rates between specific nodes.
- **Timeline Reconstruction**: Aggregates records for a specific number into a chronological view, essential for tracking a suspect's movement and interactions.
- **Auto-Flagging**: A one-click service that scans the entire database and updates the `is_suspicious` status of relevant records.

---

## 📊 Reports & Visualization Module (`reports/` & `dashboard/`)
The interface for executive summary and data export.

- **Interactive Dashboards**: Uses **Chart.js** to visualize trends (e.g., Daily Call Volume, Severity Breakdown).
- **Summary Service (`report_generator.py`)**: Gathers cross-module stats into high-level reports for agency management.
- **Forensic Export**: Generates sanitized CSV files containing filtered forensic findings, ready for use in case documentation or as evidence.
- **Live Activity Feed**: Provides a real-time stream of recent suspicious flags and user actions.
