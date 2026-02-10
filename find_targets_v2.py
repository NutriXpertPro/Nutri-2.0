import pymysql

password = '900113Acps@'
targets = ['Anderson', 'Elizabeth', 'Angela']

def find_targets():
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
                
                db_matches = {name: [] for name in targets}
                
                for table in tables:
                    try:
                        cursor.execute(f"DESCRIBE {table}")
                        cols = [c[0] for c in cursor.fetchall()]
                        name_col = next((c for c in cols if any(n in c.lower() for n in ['name', 'nome', 'full'])), None)
                        
                        if name_col:
                            for name in targets:
                                cursor.execute(f"SELECT {name_col} FROM {table} WHERE {name_col} LIKE %s", (f"%{name}%",))
                                row_matches = [r[0] for r in cursor.fetchall()]
                                if row_matches:
                                    db_matches[name].extend([(table, m) for m in row_matches])
                    except: pass
                
                # Check if this DB has all 3 or most
                match_count = sum(1 for n in targets if db_matches[n])
                if match_count > 0:
                    print(f"\n--- DATABASE: {db} (Matches: {match_count}/{len(targets)}) ---")
                    for name in targets:
                        if db_matches[name]:
                            print(f"  * {name}: Found in {db_matches[name]}")
                        else:
                            print(f"  * {name}: NOT FOUND")
            except: pass
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

find_targets()
