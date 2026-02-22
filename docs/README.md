# Telecom Forensic Management System

A production-ready Django project for Telecom Call Data Record (CDR) management, analysis, and digital forensics. Designed with a clean architecture and a stunning Dark Cyber Forensic UI theme.

## 🚀 Architecture Structure

This application follows a modular monolith architecture, separating concerns into distinct Django apps and business logic into service layers:

- **`accounts/`**: Handles Custom User Model, Role-Based Access Control (Admin, Investigator, Analyst), and global activity logging.
- **`dashboard/`**: Coordinates the master dashboard with high-level summary statistics and Chart.js endpoints.
- **`cdr/`**: Manages the core Call Detail Records. Contains the `services/` layer that runs the dummy data generator and file upload parsers (CSV, XML, JSON).
- **`analysis/`**: The forensic brain of the system. Its `services/engine.py` runs algorithms to detect frequent contacts, long durations, and night-time activity, while compiling a communication timeline.
- **`reports/`**: Gathers data across modules to generate daily trends, summaries by source, flags by severity, and CSV data exports.

The separation explicitly uses **Services** rather than keeping heavy logic in views or models. This makes the application highly testable and scalable.

## 🛠️ Tech Stack
- Frontend: HTML5, CSS3 (Custom Dark Cyber Variable Theme), Bootstrap 5, Chart.js
- Backend: Django 6.x (Python)
- Database: MySQL
- Data Generation: Custom Python procedural generation

## 📋 Setup Instructions

1. **Install Dependencies:**
   ```bash
   pip install django mysqlclient
   ```

2. **Configure Database (MySQL):**
   Ensure your MySQL server (via XAMPP, WAMP, or standalone) is running.
   Create the database in MySQL:
   ```sql
   CREATE DATABASE telecom_forensic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   *(If your MySQL uses a password for `root`, update it in `telecom_forensic/settings.py` under the `DATABASES` configuration).*

3. **Run Migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Seed Default Users:**
   We have provided a custom management command to set up default accounts (Admin, Investigator, Analyst):
   ```bash
   python manage.py seed_users
   ```
   *Default Admin login is `admin` / `admin123`*

5. **Start the Local Server:**
   ```bash
   python manage.py runserver
   ```

6. **Access the System:**
   Navigate to `http://localhost:8000` to be directed to the cyber dashboard login page.

## 🔒 Security Summary
- Password enforcement through Django `AUTH_PASSWORD_VALIDATORS`
- Session cookie protections enabled
- Role decorators applied globally mapping `admin`, `investigator`, and `analyst` capabilities natively.
- SQL Injection and XSS are protected out of the box via Django ORM and Template Engine. CSRF explicitly required on all forms.

## 💡 How to Demo Features
1. Login as the `admin` account.
2. Go to **CDR Management > Generate Calls** and generate 1,000 randomized records with suspicious patterns checked.
3. Once generated, go to **Forensics > Analysis** and hit **Run Auto-Flag** to have the engine detect suspicious footprints.
4. Navigate through the detailed Dashboards and Timeline reconstruction tables.
