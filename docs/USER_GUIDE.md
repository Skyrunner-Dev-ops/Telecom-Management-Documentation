# 📖 User Guide: Telecom Forensic Management System

Welcome to the **TelForensic Investigation Suite**. This guide will walk you through the system's core features in simple, easy-to-follow steps.

---

## 🔐 1. How to Log In
The system is secure and requires authorized access.

1.  Open your web browser and go to the system address (e.g., `http://localhost:8000`).
2.  Enter your **Username** and **Password**.
    - *Default Admin*: `admin` / `admin123`
3.  Click **Sign In**.
4.  You will be taken to the **Dashboard**, where you can see a high-level overview of all call activity.

---

## 🧪 2. Generating Test Data (For Demos & Training)
If you are new to the system, you can generate "fake" calls to see how the analysis tools work.

1.  On the left-hand menu, go to **CDR Management** > **Generate Calls**.
2.  Enter the number of calls you want to create (e.g., `1000`).
3.  (Optional) Check the **Suspicious Patterns** box to inject anomalies for testing.
4.  Click **Generate Records**.
5.  Wait a few seconds. The system will create the records and update your dashboard instantly.

---

## 📥 3. Uploading Your Own Call Logs
To analyze real evidence, you can upload call files provided by telecom operators.

1.  Go to **CDR Management** > **Upload Logs**.
2.  Choose your file (the system accepts **CSV**, **Excel-style**, **JSON**, or **XML** files).
3.  Click **Process & Upload**.
4.  The system will automatically read the columns (like "Caller" and "Receiver") and save them into the investigation database.

---

## 🔍 4. Filtering & Finding Records
With thousands of calls, finding the right one is easy.

1.  Go to **CDR Management** > **Call Logs**.
2.  Use the **Search Bar** at the top right to search for a specific phone number.
3.  Click the **Filter Icon** to narrow down results by:
    - **Date Range** (e.g., "Calls from last week").
    - **Status** (e.g., "Only show Suspicious calls").
    - **Call Type** (e.g., "Only Incoming").

---

## 🕵️ 5. Running Forensic Analysis
This is the "brain" of the system that finds bad actors for you.

1.  Go to **Forensics** > **Analysis**.
2.  Click the **Run Auto-Flag** button.
3.  The system will scan every call for:
    - **Late Night Calls**: Calls made between midnight and 5 AM.
    - **Long Conversations**: Call durations that are unusually long.
    - **High Frequency**: Numbers that talk to each other far too often.
4.  Found records will now appear with a **Red Warning Flag** in your logs.

---

## ⏳ 6. Building a Suspect Timeline
To see a suspect's full story, use the Timeline tool.

1.  Go to **Forensics** > **Timeline**.
2.  In the search box, enter the **Phone Number** of the person you are investigating.
3.  Click **Reconstruct Timeline**.
4.  You will see a chronological map of every call they made or received, showing you exactly who they talked to and when.

---

## 📄 7. Generating Investigation Reports
Prepare your findings for your team or for court.

1.  Go to **Forensics** > **Reports**.
2.  You will see three sections:
    - **Summary Report**: A bird's-eye view of all suspicious activity.
    - **Export Data**: Click the **Download CSV** button to save filtered logs to your computer.
    - **Trend Analysis**: Visual graphs showing when and where most calls are happening.
3.  Use the **Export** buttons to save or print these as needed.

---

## 💡 Pro Tips
- **Quick Switch**: You can click on any phone number in a table to jump directly to its personal timeline.
- **Alerts**: Check the **Dashboard** regularly for "Critical Severity" flags that need immediate attention.
- **Support**: If you forget your password, please contact your **System Administrator**.
