import sqlite3
import os

db_path = r'C:\Users\ander\Downloads\nutri_backup_extracted\cópia Nutri-3.0\db.sqlite3'

def inspect_sqlite():
    if not os.path.exists(db_path):
        print(f"Error: DB not found at {db_path}")
        return
        
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [t[0] for t in cursor.fetchall()]
        print(f"Tables found: {len(tables)}")
        
        # Check for patients
        p_table = next((t for t in tables if 'patient' in t.lower()), None)
        if p_table:
            print(f"Found patient table: {p_table}")
            try:
                # Check columns to decide how to search
                cursor.execute(f"PRAGMA table_info({p_table})")
                cols = [c[1] for c in cursor.fetchall()]
                print(f"Columns: {cols}")
                
                name_col = 'name' if 'name' in cols else 'user_id' # simplified
                cursor.execute(f"SELECT * FROM {p_table} WHERE {name_col} LIKE '%Angela%' OR {name_col} LIKE '%Elizabeth%' OR {name_col} LIKE '%Elisabeth%'")
                rows = cursor.fetchall()
                print(f"Target patients found in SQLite: {len(rows)}")
                for r in rows:
                    print(dict(zip(cols, r)))
                    
            except Exception as se:
                print(f"Search error in {p_table}: {se}")
        
        # Check for Anamnesis
        a_table = next((t for t in tables if 'anamnesis' in t.lower()), None)
        if a_table:
            print(f"Found anamnesis table: {a_table}")
            cursor.execute(f"SELECT COUNT(*) FROM {a_table}")
            print(f"Total anamnesis records: {cursor.fetchone()[0]}")
            
        # Check for Photos
        ph_table = next((t for t in tables if 'photo' in t.lower()), None)
        if ph_table:
            print(f"Found photo table: {ph_table}")
            cursor.execute(f"SELECT COUNT(*) FROM {ph_table}")
            print(f"Total photos records: {cursor.fetchone()[0]}")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")

inspect_sqlite()
