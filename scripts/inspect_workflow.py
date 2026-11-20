import sqlite3
import json

db_path = r"C:\Users\FINE LAPTOP\.n8n\database.sqlite"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

columns = [col[1] for col in cursor.execute("PRAGMA table_info(workflow_entity)").fetchall()]
print("Columns:", columns)

sample = cursor.execute("SELECT id, name, active, nodes, connections, settings FROM workflow_entity LIMIT 1").fetchone()
if sample:
    print("Existing workflow name:", sample[1])
    print("Existing workflow active:", sample[2])
    print("Existing workflow settings:", sample[5])

conn.close()

