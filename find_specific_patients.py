import pymysql

password = '900113Acps@'

target_names = ['Anderson', 'Elizabeth', 'Angela']

try:
    conn = pymysql.connect(host='localhost', user='root', password=password)
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES")
    databases = [d[0] for d in cursor.fetchall()]
    
    found_any = False
    
    for db in databases:
        if db in ['information_schema', 'mysql', 'performance_schema', 'sys']:
            continue
            
        try:
            cursor.execute(f"USE {db}")
            cursor.execute("SHOW TABLES")
            tables = [t[0] for t in cursor.fetchall()]
            
            for table in tables:
                # Find tables that might hold patient names
                cursor.execute(f"DESCRIBE {table}")
                cols = [c[0] for c in cursor.fetchall()]
                
                name_col = next((c for c in cols if any(n in c.lower() for n in ['name', 'nome', 'full'])), None)
                if name_col:
                    for name in target_names:
                        query = f"SELECT {name_col} FROM {table} WHERE {name_col} LIKE %s"
                        cursor.execute(query, (f"%{name}%",))
                        results = cursor.fetchall()
                        if results:
                            print(f"[FOUND] Name: '{name}' in DB: {db} | TABLE: {table} | Match: {results[0][0]}")
                            found_any = True
        except: pass
        
    if not found_any:
        print("No matches found for Anderson, Elizabeth, or Angela in any database.")
    
    conn.close()
except Exception as e:
    print(f"Global Error: {e}")
