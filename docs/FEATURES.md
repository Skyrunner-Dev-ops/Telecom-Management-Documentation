# 🕵️ Telecom Forensic Management System: Features & Capabilities

The **Telecom Forensic Management System** is a specialized platform designed for digital forensic investigators and telecommunications analysts. It streamlines the processing, analysis, and visualization of Call Data Records (CDR) to uncover suspicious activities and communication networks.

---

## 🚀 Key Features

- **Automated Pattern Detection**: Intelligent engine that flags suspicious calls based on duration, frequency, and time-of-day.
- **Dynamic Visual Dashboards**: Real-time analytics with Chart.js, providing insights into call volumes, severity trends, and source distribution.
- **Timeline Reconstruction**: Chronological view of all activities associated with a specific target number.
- **Multi-Format Data Ingestion**: Robust parsers for CSV, XML, and JSON data formats.
- **Cyber-Themed UI**: A stunning, premium dark interface designed for focus and clarity during intense forensic investigations.
- **Activity Auditing**: Detailed logging of all user actions for legal and compliance requirements.

---

## 📦 Modules Overview

### 👤 Accounts & Access
- **Role-Based Access Control (RBAC)**: Custom roles for precision permission management.
- **Audit Logs**: Transparent tracking of investigations and data access.

### 📊 Dashboard & Analytics
- **Forensic Overview**: Summary cards showing total flags, active investigations, and suspicious call trends.
- **Live Distribution**: Interactive charts showing call types (Incoming vs. Outgoing) and data source breakdown.

### 📞 CDR Management
- **Bulk Generator**: Procedural generation of thousands of realistic call records with configurable "suspicious" patterns for training or demo.
- **File Upload Engine**: Handles high-volume data imports with automatic field mapping.
- **Manual Entry**: Secure interface for adding single case-related records.

### 🧠 Forensic Analysis Engine
- **Flagging System**: Automatic detection of late-night activity (12 AM - 5 AM), outlier call durations, and hub-to-hub frequent contacts.
- **Network Analysis**: Maps the common contacts and interaction frequency for any given subscriber.

### 📄 Reports & Exports
- **Summary Generation**: Curates periodic reports on system-wide suspicious activity.
- **CSV Data Export**: One-click export of filtered datasets for offline analysis or court presentation.

---

## 👥 User Roles

| Role | Capabilities |
| :--- | :--- |
| **Admin** | Full system control, user management, and manual database oversight. |
| **Investigator**| Can upload logs, run forensic analysis, and generate suspicious activity flags. |
| **Analyst** | Primarily read-only access to dashboards, reports, and timeline views. |

---

## ⚡ Core Workflows

### 1. The Investigation Lifecycle
1. **Data Ingestion**: Investigator uploads a batch of CDR files (CSV/JSON/XML).
2. **Parsing**: The system maps raw headers (like `A-Number`, `B-Number`) to internal models.
3. **Analysis**: Investigator triggers the `Auto-Flag` engine to scan for anomalies.
4. **Verification**: Investigator reviews "Flagged" records in the Detailed View.
5. **Timeline**: Analyst builds a chronological timeline for key suspects.
6. **Reporting**: Findings are exported via the Reports module.

### 2. Training & Simulation
1. **admin** uses the **Call Generator** to inject 5,000 randomized records.
2. **analyst** uses the **Dashboard** to identify the spike in "Suspicious" activity.
3. **investigator** uses **Forensic Timeline** to map the simulated network.
