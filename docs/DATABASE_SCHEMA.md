# 🗄️ Database Schema: Telecom Forensic Management System

This document provides a detailed overview of the MySQL database structure, including tables, relationships, constraints, and optimization strategies.

---

## 🗺️ Entity Relationship Overview

The database is built on top of a relational MySQL engine, optimized for high-volume reads and complex forensic queries.

---

## 📋 Table Definitions

### 1. `users` (Custom User Model)
Extends Django's `AbstractUser` to support Role-Based Access Control (RBAC).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-INC | Unique identifier for the user. |
| `username` | VarChar(150) | Unique, Not Null | Account login name. |
| `role` | VarChar(20) | Default: 'analyst' | `admin`, `investigator`, or `analyst`. |
| `phone` | VarChar(15) | Nullable | Contact number for the investigator. |
| `department` | VarChar(100) | Nullable | Agency or department name. |
| `is_active` | Boolean | Default: True | Account status for system access. |

### 2. `call_detail_records` (CDR)
The core table storing millions of telecom event logs.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-INC | Unique record ID. |
| `caller_number` | VarChar(20) | **Index**, Not Null | Number initiating the call. |
| `receiver_number`| VarChar(20) | **Index**, Not Null | Number receiving the call. |
| `start_time` | DateTime | **Index**, Not Null | Timestamp when call started. |
| `end_time` | DateTime | Not Null | Timestamp when call ended. |
| `duration` | Int | Not Null | duration in seconds. |
| `location` | VarChar(100) | Nullable | Tower location or cell ID. |
| `call_type` | VarChar(20) | | `incoming`, `outgoing`, `missed`, etc. |
| `source` | VarChar(20) | | `dummy`, `manual`, or `upload`. |
| `is_suspicious` | Boolean | **Index**, Default: False| Forensic flag for dashboard filtering. |
| `created_by_id` | BigInt | Foreign Key (`users`) | The user who imported/entered the data. |

### 3. `analysis_flags`
Stores findings from the forensic analysis engine.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-INC | Unique flag ID. |
| `call_id` | BigInt | Foreign Key (`cdr`) | Reference to the specific call. |
| `flag_reason` | VarChar(255) | Not Null | Pattern detected (e.g., "Late Night"). |
| `severity` | VarChar(20) | | `low`, `medium`, `high`, `critical`. |
| `details` | Text | Nullable | Extra context (e.g., "Duration: 45m"). |
| `flagged_at` | DateTime | Auto-Now-Add | When the engine found the pattern. |

### 4. `activity_logs`
Automated audit trail for compliance.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-INC | Log ID. |
| `user_id` | BigInt | Foreign Key (`users`) | The user performing the action. |
| `action` | VarChar(255) | Not Null | Action name (e.g., "Exported CSV"). |
| `details` | Text | Nullable | specific parameters or target IDs. |
| `timestamp` | DateTime | Auto-Now-Add | When the action occurred. |

---

## 🔗 Relationships

- **One-to-Many**: `User` → `CallDetailRecord` (One user can import many records).
- **One-to-Many**: `CallDetailRecord` → `AnalysisFlag` (One call can have multiple forensic flags).
- **One-to-Many**: `User` → `ActivityLog` (Full audit trail per user).

---

## 🚀 Optimization & Indexes

To maintain performance during timeline reconstruction and pattern analysis, the following database indexes are implemented:

1. **`cdr_numbers_idx`**: Composite index on `(caller_number, receiver_number)` for fast network mapping.
2. **`cdr_time_idx`**: Index on `start_time` for fast chronological sorting and trend analysis.
3. **`cdr_suspicion_idx`**: Index on `is_suspicious` for rapid dashboard summary aggregation.
4. **`activity_time_idx`**: Index on `timestamp` for recent activity feed performance.

---

## 🛡️ Constraints

- **Foreign Key Integrity**: `ON DELETE CASCADE` is applied to `AnalysisFlag` (deleting a call removes its flags).
- **Field Validation**: 
    - `duration` must be a positive integer.
    - `start_time` must be chronologically before `end_time` (enforced at the Service Layer).
- **Unique Constraints**: Usernames must be unique across the platform.
