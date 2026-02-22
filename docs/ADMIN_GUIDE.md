# ⚒️ Admin Guide: Telecom Forensic Management System

This guide is intended for **System Administrators**. it covers user governance, database maintenance, monitoring, and troubleshooting procedures.

---

## 👥 1. User & Role Management

### Creating & Managing Users
Administrators can manage users via the **Admin > User Management** section in the main dashboard or via the Django Admin panel (`/admin/`).

*   **To Create a User**: Navigate to User Management > "Add New User". Assign a username, password, and specific forensic role.
*   **Deactivating Accounts**: For security, avoid deleting users. Instead, uncheck the **Active** status. This preserves their `ActivityLog` history for audit purposes.
*   **Password Resets**: Admins can force a password change for any investigator through the user edit screen.

### Role Permission Matrix
| Capabilities | Admin | Investigator | Analyst |
| :--- | :---: | :---: | :---: |
| Manage Users | ✅ | ❌ | ❌ |
| Generate Dummy Data | ✅ | ✅ | ❌ |
| Upload/Edit CDRs | ✅ | ✅ | ❌ |
| Run Forensic Analysis | ✅ | ✅ | ❌ |
| View Dashboards | ✅ | ✅ | ✅ |
| Export Data (CSV) | ✅ | ✅ | ✅ |

---

## 🧹 2. Data Maintenance & Cleanup

### Clearing Old Records
Historical CDR data can grow significantly. To maintain performance:
-   **Periodic Archiving**: Export old records to CSV via the **Reports** module before deletion.
-   **Manual Cleanup**: Currently, deletions should be handled through the Django Admin interface to ensure cascading deletions of associated flags.

### Database Migrations
If the schema changes, ensure you follow the migration workflow:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Activity Log Rotations
The `activity_logs` table tracks all forensic actions. It is recommended to clear logs older than 1 year to keep the database responsive.

---

## 📈 3. System Monitoring

### The Activity Audit Trail
Monitor the **Global Activity Log** (available on the Dashboard footer or Admin panel) to track:
-   Who uploaded specific forensic evidence.
-   When analysis engines were triggered.
-   Unauthorized attempts to access restricted modules.

### Database Health
Check the **Dashboard Indicators**. A sudden drop in record counts or failure of the "Average Duration" cards may indicate database connection latency or table corruption.

---

## 🛠️ 4. Troubleshooting

| Symptom | Potential Cause | Resolution |
| :--- | :--- | :--- |
| **"OperationalError" at Login** | MySQL Service is down. | Ensure XAMPP/WAMP or your MySQL service is running. |
| **Upload Fails (Large Files)** | Django/Server limit exceeded. | Check `DATA_UPLOAD_MAX_NUMBER_FIELDS` in `settings.py`. Default is 10,000. |
| **Style/CSS looks broken** | Static files not collected. | Run `python manage.py collectstatic`. |
| **Roles don't work** | User has no role assigned. | Check User Management; ensure role is not "None". |
| **Analysis engine slow** | Missing database indexes. | Ensure migrations were applied fully; indexes are defined in `cdr/models.py`. |

---

## 🔒 5. Security Best Practices

1.  **Enforce Strong Passwords**: The system uses Django's default validators. Do not disable these in production.
2.  **IP Monitoring**: Regularly audit the `ip_address` field in the Activity Logs for suspicious login locations.
3.  **Database Backups**: Schedule weekly `mysqldump` backups of the `telecom_forensic_db`.
4.  **Environment Variables**: In production, move the `SECRET_KEY` and database credentials from `settings.py` to a `.env` file.
