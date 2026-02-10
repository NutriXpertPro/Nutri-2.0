import pymysql

password = '900113Acps@'
dbs = ['nutrixpert_db', 'nutri_xpert_pro', 'nutrixpert']

for db in dbs:
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        print(f"\n--- {db} ---")
        
        cursor.execute("SHOW TABLES")
        tables = [t[0] for t in cursor.fetchall()]
        
        target_tables = [t for t in tables if 'patient' in t.lower()]
        for table in target_tables:
            cursor.execute(f"DESCRIBE {table}")
            cols = [c[0] for c in cursor.fetchall()]
            print(f"  TABLE: {table} | COLUMNS: {cols}")
            
            # If any typical name column exists, print data
            name_col = next((c for c in cols if 'name' in c.lower() or 'nome' in c.lower() or 'full_name' in c.lower()), None)
            if name_col:
                cursor.execute(f"SELECT {name_col} FROM {table}")
                rows = cursor.fetchall()
                print(f"    DATA ({len(rows)}): {[r[0] for r in rows[:10]]}")
            else:
                # Print a few rows of all columns if no name col
                cursor.execute(f"SELECT * FROM {table} LIMIT 2")
                rows = cursor.fetchall()
                for r in rows:
                    print(f"    SNEAK PEEK: {r}")
                
        conn.close()
    except Exception as e:
        print(f"Error in {db}: {e}")
