# 🛠️ Setup Guide: Telecom Forensic Management System

This guide provides step-by-step instructions to get the **Telecom Forensic Management System** up and running on a new local environment.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.10+**
- **MySQL Server** (XAMPP, WAMP, or standalone MySQL)
- **Git** (optional, for cloning)

---

## 🚀 Installation Steps

### 1. Clone or Extract the Project
If you haven't already, clone the repository or extract the project files into a folder.
```bash
cd "Telecom Management System with Forensic Call Log"
```

### 2. Create a Virtual Environment (Recommended)
Isolating your dependencies is best practice.
```powershell
# Create venv
python -m venv venv

# Activate venv (Windows)
.\venv\Scripts\activate

# Activate venv (Mac/Linux)
source venv/bin/activate
```

### 3. Install Dependencies
Use the `requirements.txt` file to install all necessary Python packages.
```bash
pip install -r requirements.txt
```

---

## 🗄️ Database Configuration

### 1. Create the MySQL Database
Open your MySQL terminal or phpMyAdmin and run:
```sql
CREATE DATABASE telecom_forensic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Settings
Open `telecom_forensic/settings.py` and verify the `DATABASES` section. 
Update your MySQL `USER`, `PASSWORD`, `HOST`, and `PORT` if they differ from the defaults:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'telecom_forensic_db',
        'USER': 'root',       # Your MySQL username
        'PASSWORD': '',       # Your MySQL password
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

---

## ⚙️ Project Initialization

### 1. Run Migrations
Generate the database schema.
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Seed Default Users
We've included a script to create default accounts for testing:
- **Admin**: `admin` / `admin123`
- **Investigator**: `investigator1` / `investigator123`
- **Analyst**: `analyst1` / `analyst123`

```bash
python manage.py seed_users
```

---

## 🖥️ Running the Application

Start the Django development server:
```bash
python manage.py runserver
```

Open your browser and navigate to:
[**http://localhost:8000**](http://localhost:8000)

---

## 💡 Quick Demo Flow
1. **Login** as the `admin`.
2. Navigate to **CDR Management > Generate Calls**.
3. Generate **1,000+ records** to see the dashboards in action.
4. Go to **Forensics > Analysis** and click **Run Auto-Flag**.
5. Explore the **Timeline** and **Reports** tabs to see the results.

---

## ⚠️ Troubleshooting
- **mysqlclient install error:** Ensure you have the [MySQL Connector/C](https://dev.mysql.com/downloads/connector/c/) installed or use a pre-compiled binary for Windows.
- **Migration errors:** Ensure the database `telecom_forensic_db` was created before running `migrate`.
