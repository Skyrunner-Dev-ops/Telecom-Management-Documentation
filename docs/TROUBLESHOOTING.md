# 🛠️ Troubleshooting Guide: Telecom Forensic Management System

This guide outlines common issues that may arise during installation, configuration, or usage of the system and provides step-by-step solutions to resolve them.

---

## 🗄️ 1. MySQL Connection Errors
The most common issue is the application being unable to communicate with the database.

**Symptom**: `django.db.utils.OperationalError: (2003, "Can't connect to MySQL server on 'localhost'")` or `Access denied for user 'root'@'localhost'`.

- **Check Service**: Ensure your MySQL server (via XAMPP, WAMP, or standalone) is actually running.
- **Verify Credentials**: Check the `DATABASES` section in `telecom_forensic/settings.py`. Ensure the `USER` and `PASSWORD` match your local MySQL configuration.
- **Database Existence**: Ensure you have created the database manually first:
  ```sql
  CREATE DATABASE telecom_forensic_db;
  ```
- **Driver Issue**: If you get an error about `mysqlclient`, ensure you have the C++ build tools installed or try `pip install mysql-connector-python` as an alternative (note: settings may need adjustment).

---

## ⚙️ 2. Migration Errors
Issues occurring when updating the database schema.

**Symptom**: `django.db.utils.ProgrammingError: (1146, "Table 'telecom_forensic_db.users' doesn't exist")`.

- **Missing Migrations**: If you just downloaded the project, run:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```
- **Inconsistent State**: If a migration fails halfway, you may need to "fake" it or rollback. Use `python manage.py showmigrations` to see which ones have been applied.
- **Dependency Order**: Ensure the `accounts` migrations are run before `cdr` and `analysis` since they depend on the Custom User model.

---

## 🖼️ 3. Template & UI Issues
The interface doesn't look like the premium "Dark Cyber" theme or shows raw code.

**Symptom**: Pages look like plain text or formatting is broken.

- **Static Files**: Django needs to know where your CSS/JS is. Run:
  ```bash
  python manage.py collectstatic
  ```
- **Template Not Found**: Ensure the `DIRS` setting in `TEMPLATES` (within `settings.py`) correctly points to the `BASE_DIR / 'templates'` folder.
- **Missing Context**: If variables like `{{ user.username }}` aren't showing, ensure you are logged in and the view is passing the correct context.

---

## 📥 4. File Upload Errors
Errors when importing CSV, JSON, or XML files.

**Symptom**: `Upload failed` or `0 records created`.

- **Field Mapping**: The system uses fuzzy mapping. If your file is very unusual, it might not find the phone numbers. Ensure your CSV has headers like `caller`, `receiver`, or `number`.
- **File Size**: By default, Django limits form fields. For very large files, check `DATA_UPLOAD_MAX_NUMBER_FIELDS` in `settings.py`.
- **Format Errors**: Ensure your JSON is a valid array of objects and your XML follows the `<record>` structure. Check the **Upload Logs** page for specific error messages (e.g., "Missing caller number").

---

## 📊 5. Charts Not Rendering
The dashboard shows empty spaces instead of the interactive graphs.

**Symptom**: "Loading..." text stays forever or a blank box appears.

- **JS Errors**: Open your browser's Developer Tools (F12) > Console. Look for `Chart is not defined` or 404 errors for script files.
- **Internet Connection**: The system uses CDNs for **Chart.js** and **Bootstrap Icons**. If you are offline, these will not load. 
- **API Endpoint**: The charts fetch data from `/dashboard/api/chart-data/`. If this URL returns a 500 error, there is a server-side bug (likely empty data or a math error like division by zero).
- **No Data**: If the database is empty, the charts may look broken or blank. Generate some **Dummy Data** first!

---

## 🔑 6. Login & Permission Denied
You are logged in but can't access certain features.

**Symptom**: `HTTP 403 Forbidden` or redirection to the login page.

- **Role Assignment**: Check the **User Management** section. If your user role is "None" or "Analyst", you cannot access "Upload Logs" or "Analysis".
- **Superuser vs. Role**: Being a "Superuser" doesn't always automatically grant the "Admin" role in our custom logic. Ensure your `role` field is explicitly set to `admin`.
- **Session Timeout**: The session expires after 1 hour of inactivity. Try logging out and back in.
