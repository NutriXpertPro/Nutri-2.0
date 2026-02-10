import pymysql

password = '900113Acps@'

def scan_db(db_name):
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db_name)
        cursor = conn.cursor()
        print(f"\n--- SCANNING DATABASE: {db_name} ---")
        
        cursor.execute("SHOW TABLES")
        tables = [t[0] for t in cursor.fetchall()]
        
        for table in tables:
            if any(x in table.lower() for x in ['patient', 'paciente', 'anamne', 'photo', 'foto']):
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                if count > 0:
                    print(f"  TABLE: {table} | COUNT: {count}")
                    # Try to get specific info
                    cursor.execute(f"DESCRIBE {table}")
                    cols = [c[0] for c in cursor.fetchall()]
                    name_col = next((c for c in cols if any(n in c.lower() for n in ['name', 'nome', 'full_name'])), None)
                    if name_col:
                        cursor.execute(f"SELECT {name_col} FROM {table} LIMIT 5")
                        names = [n[0] for n in cursor.fetchall()]
                        print(f"    DATA: {names}")
                    else:
                        cursor.execute(f"SELECT * FROM {table} LIMIT 1")
                        print(f"    SNEAK PEEK: {cursor.fetchone()}")
        conn.close()
    except Exception as e:
        print(f"Error scanning {db_name}: {e}")

scan_db('nutrixpert')
scan_db('nutri_xpert_pro')
scan_db('nutri_db')
