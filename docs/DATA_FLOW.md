# 🔄 Data Flow: Telecom Forensic Management System

This document visualizes how data moves through the various services and modules of the system during key operations.

---

## 🏗️ 1. Dummy Call Generation Flow
**Objective**: Create a large volume of simulated data for training or system testing.

1.  **UI Trigger**: User submits the "Generate Calls" form with a request count (e.g., 5,000).
2.  **View Controller**: `cdr.views.generate_calls` receives the request.
3.  **Service Invocation**: The view calls `generator.generate_dummy_cdrs()`.
4.  **Logic Execution**:
    -   Randomized phone numbers are generated using Indian area codes.
    -   `_generate_normal_call` creates standard usage patterns.
    -   If enabled, `_generate_suspicious_call` injects specific forensic footprints (Late Night, Long Duration).
5.  **Database Commit**:
    -   Normal records are inserted using `bulk_create`.
    -   Suspicious records are created individually to link them immediately with `AnalysisFlag` objects.
6.  **UI Feedback**: A success message displays the count of normal vs. suspicious records created.

---

## 📥 2. File Upload & Ingestion Flow
**Objective**: Import real forensic evidence into the system.

1.  **File Selection**: User uploads a **CSV**, **JSON**, or **XML** file via the "Upload Logs" portal.
2.  **Byte Stream Parsing**: `cdr.services.file_parser` reads the file content into memory.
3.  **Fuzzy Mapping**: The `_normalize_field` function maps variations (e.g., `A_Number`, `Src`, `From`) to the system's `caller_number` field.
4.  **Cleaning & Validation**: 
    -   `_parse_datetime` handles various date formats.
    -   `_build_record` ensures durations are logical and coordinates are formatted.
5.  **Bulk Ingestion**: Every successfully parsed row is added to a list and committed to the database in one batch (`bulk_create`) for maximum performance.
6.  **Error Handling**: Any rows that fail parsing are collected and returned to the user in a detailed error report.

---

## 🧠 3. Forensic Analysis & Flagging Flow
**Objective**: Automatically discover hidden threats in the existing database.

1.  **Analysis Trigger**: The investigator initiates the "Auto-Flag" engine.
2.  **Query Execution**: `analysis.services.engine.py` runs optimized ORM queries:
    -   **Night Check**: Identifies calls where `ExtractHour(start_time)` is between 0 and 5.
    -   **Duration Check**: Filters records where `duration > 1800` seconds.
    -   **Frequency Check**: Aggregates records by `(caller, receiver)` to find high-volume contact pairs.
3.  **Flag Generation**:
    -   The system checks if a record is already marked as `is_suspicious`.
    -   If new, `cdr.is_suspicious` is set to `True`.
    -   A new `AnalysisFlag` record is created with severity (Low/Medium/High) and a specific reason.
4.  **Dashboard Refresh**: The data flow ends with the `dashboard` UI receiving updated counts for cards and charts.

---

## 📊 4. Reporting & Export Flow
**Objective**: Consolidate findings and export them for official use.

1.  **Data Filtering**: User selects filters in the "Reports" or "Call Logs" view (e.g., "All Critical Flags from last 48 hours").
2.  **Aggregation**: `reports.services.report_generator.py` uses Django `aggregate` and `annotate` functions to calculate:
    -   Total Suspicious Volume.
    -   Top 10 most active suspicious numbers.
    -   Hourly volume trends.
3.  **CSV Formatting**:
    -   The `export_cdrs_csv` function opens a memory buffer.
    -   Data is iterated and written row-by-row into a standard CSV format.
4.  **Delivery**: The server sends a `Content-Disposition: attachment` header, forcing the browser to download the file directly to the investigator's computer.
