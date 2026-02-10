import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'
user_id = 33 # Anderson in nutrixpert_db

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    print(f"--- Linking User {user_id} to data in {db} ---")
    
    # Check Patients linked to this user
    # Need to find which table has the link. Usually patients_patient or similar.
    cursor.execute("SHOW TABLES")
    tables = [t[0] for t in cursor.fetchall()]
    
    for table in tables:
        if 'patient' in table.lower():
            cursor.execute(f"DESCRIBE {table}")
            cols = [c[0] for c in cursor.fetchall()]
            if 'user_id' in cols:
                cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE user_id = %s", (user_id,))
                count = cursor.fetchone()[0]
                print(f"TABLE: {table} | COUNT for User {user_id}: {count}")
                if count > 0:
                    # Try to get names if 'name' exists
                    name_col = next((c for c in cols if 'name' in c.lower()), None)
                    if name_col:
                        cursor.execute(f"SELECT {name_col} FROM {table} WHERE user_id = %s LIMIT 5", (user_id,))
                        names = [n[0] for n in cursor.fetchall()]
                        print(f"  Names: {names}")
            
    conn.close()
except Exception as e:
    print(f"Error: {e}")
