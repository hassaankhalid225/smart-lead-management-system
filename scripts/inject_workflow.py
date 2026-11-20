import sqlite3
import json
import uuid
import datetime

db_path = r"C:\Users\FINE LAPTOP\.n8n\database.sqlite"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

workflow_id = "smartLeadIntake1"

# Check if already exists
cursor.execute("SELECT id FROM workflow_entity WHERE id = ?", (workflow_id,))
if cursor.fetchone():
    print("Workflow already exists in database. Updating...")
    cursor.execute("DELETE FROM workflow_entity WHERE id = ?", (workflow_id,))
    cursor.execute("DELETE FROM shared_workflow WHERE workflowId = ?", (workflow_id,))

# Load workflow JSON
with open(r"d:\Work\My Work\Web\Ayesha\n8n-workflow-smart-leads.json", "r", encoding="utf-8") as f:
    wf_data = json.load(f)

now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
version_id = str(uuid.uuid4())

cursor.execute("""
INSERT INTO workflow_entity (
    id, name, active, nodes, connections, settings, pinData, versionId, triggerCount, createdAt, updatedAt
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    workflow_id,
    wf_data["name"],
    0, # Start inactive so user can configure credentials safely or activate
    json.dumps(wf_data["nodes"]),
    json.dumps(wf_data["connections"]),
    json.dumps(wf_data.get("settings", {"executionOrder": "v1"})),
    json.dumps(wf_data.get("pinData", {})),
    version_id,
    1,
    now,
    now
))

cursor.execute("""
INSERT INTO shared_workflow (workflowId, projectId, role, createdAt, updatedAt)
VALUES (?, ?, ?, ?, ?)
""", (
    workflow_id,
    "Sejv4MTNHYyR6cBC",
    "workflow:owner",
    now,
    now
))

conn.commit()
print("✅ Successfully injected Smart Lead Management workflow into local n8n database!")

cursor.execute("SELECT id, name, active FROM workflow_entity")
print("Current workflows:", cursor.fetchall())

conn.close()

