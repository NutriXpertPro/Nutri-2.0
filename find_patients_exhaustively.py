import pymysql

password = '900113Acps@'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password)
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES")
    databases = [d[0] for d in cursor.fetchall()]
    
    for db in databases:
        if db in ['information_schema', 'mysql', 'performance_schema', 'sys']:
            continue
            
        try:
            cursor.execute(f"USE {db}")
            cursor.execute("SHOW TABLES")
            tables = [t[0] for t in cursor.fetchall()]
            
            for table in tables:
                if 'patient' in table.lower() or 'paciente' in table.lower():
                    cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    count = cursor.fetchone()[0]
                    print(f"DATABASE: {db} | TABLE: {table} | COUNT: {count}")
                    if count > 0:
                        # Try to get columns
                        cursor.execute(f"DESCRIBE {table}")
                        cols = [c[0] for c in cursor.fetchall()]
                        name_col = next((c for c in cols if 'name' in c.lower() or 'nome' in c.lower()), None)
                        if name_col:
                            cursor.execute(f"SELECT {name_col} FROM {table} LIMIT 3")
                            names = cursor.fetchall()
                            print(f"  - Examples: {[n[0] for n in names]}")
        except Exception as e:
            print(f"Error in {db}: {e}")
            
    conn.close()
except Exception as e:
    print(f"Global Error: {e}")
