# 🧠 Forensic Analysis Engine: Detection Logic & Algorithms

The **Forensic Analysis Engine** is the core intelligence layer of the system. It processes raw Call Data Records (CDR) to identify non-obvious patterns of suspicious activity using heuristic algorithms and statistical analysis.

---

## 🔍 Suspicious Detection Rules

The engine currently implements three primary detection heuristics in `analysis/services/engine.py`. These rules are designed to mimic real-world forensic triggers used in telecommunications investigations.

### 1. The "Night Owl" Heuristic (Late Night Activity)
- **Logic**: Identifies communication events occurring during high-risk hours.
- **Algorithm**: 
    - Extracts the `Hour` component from the `start_time` field.
    - Filters records where `Hour` >= 0 and `Hour` < 5.
- **Forensic Rationale**: Most legitimate business and personal communication occurs during daylight or evening hours. Sustained activity between midnight and 5 AM is often associated with clandestine operations or automated coordination.

### 2. The "Long Duration" Outlier Rule
- **Logic**: Identifies calls that exceed a specific time threshold (default: 1,800 seconds / 30 minutes).
- **Algorithm**:
    - Executes a direct duration query: `CallDetailRecord.objects.filter(duration__gte=THRESHOLD)`.
- **Forensic Rationale**: While long calls can be legitimate, unusually long durations (especially when paired with frequent night activity) can indicate "tethering," data exfiltration over voice channels, or continuous coordination between nodes.

### 3. The "Frequent Contact" Hub Detection
- **Logic**: Identifies "Hub-and-Spoke" patterns where two nodes communicate with extreme frequency.
- **Algorithm**:
    - Groups records by a composite key: `(caller_number, receiver_number)`.
    - Annotates groups with `Count('id')`.
    - Filters groups where `count >= THRESHOLD` (default: 10 calls in the analysis window).
- **Forensic Rationale**: High-frequency short bursts between the same two numbers often indicate a command-and-control relationship or a dedicated communication link between co-conspirators.

---

## ⚠️ Severity Logic

When a pattern is detected, the engine assigns a **Severity Level** based on the perceived risk of the detection rule:

| Detection Rule | Assigned Severity | Rationale |
| :--- | :--- | :--- |
| **Late Night Activity** | `High` | Highly correlated with suspicious tactical coordination. |
| **Frequent Contacts** | `High` | Indicates an established, high-utilization link between suspects. |
| **Long Duration Call** | `Medium` | Notable, but could be personal; requires human review. |
| **Manual Entry** | `Low` | Default for user-entered records unless overridden. |

---

## 🚩 The Flagging System

The flagging system acts as a persistent link between a raw record and a forensic finding.

1.  **Marking**: The `is_suspicious` boolean on the `CallDetailRecord` is set to `True`. This allows for fast global filtering in dashboards.
2.  **Detailing**: An `AnalysisFlag` object is created and linked to the call. 
    - This object stores the **Reason Code** (e.g., "Late night communication activity").
    - It stores the **Details** (e.g., "Call at 02:45 AM").
3.  **Audit**: Every flag records `flagged_at` and `flagged_by` (if triggered manually by an investigator).

---

## ⏳ Timeline Reconstruction Algorithm

The timeline tool (`analysis:timeline`) uses a chronological reconstruction algorithm to map a suspect's digital footprint.

- **Objective**: Build a 100% accurate sequence of events for a single phone number.
- **Process**:
    1.  User provides a target number.
    2.  The engine performs a bi-directional query: `WHERE caller_number = X OR receiver_number = X`.
    3.  **Sorting**: The resulting set is ordered strictly by `start_time ASC`.
    4.  **Enrichment**: Each point in the timeline is cross-referenced with the `AnalysisFlag` table.
    5.  **Output**: A mapped sequence showing who the suspect talked to, for how long, from which location, and if any specific event was flagged as suspicious.

---

## 📈 Scalability of Analysis

To ensure the engine can process millions of records:
- **Database Indexing**: The engine relies on B-Tree indexes on `start_time` and `duration` to avoid full table scans.
- **Query Optimization**: Heuristics are written as **set-based operations** (letting the MySQL engine do the math) rather than looping through records in Python, which would be 100x slower.
- **Bulk Flagging**: When running the auto-flag engine, flags are collected in a list and committed using `bulk_create`.
