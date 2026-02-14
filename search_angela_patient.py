import pymysql
import sys
import os

# Add the backend directory to the path so we can import Django models
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

password = '900113Acps@'

# Target patient name
target_name = 'Angela Cristina Portes de Santana'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password)
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES")
    databases = [d[0] for d in cursor.fetchall()]

    found_records = []

    for db in databases:
        if db in ['information_schema', 'mysql', 'performance_schema', 'sys']:
            continue

        try:
            cursor.execute(f"USE {db}")
            cursor.execute("SHOW TABLES")
            tables = [t[0] for t in cursor.fetchall()]

            for table in tables:
                # Find tables that might hold patient names
                try:
                    cursor.execute(f"DESCRIBE {table}")
                    cols = [c[0] for c in cursor.fetchall()]

                    # Look for name-related columns
                    name_cols = [c for c in cols if any(n in c.lower() for n in ['name', 'nome', 'full', 'first', 'last', 'user'])]
                    
                    for col in name_cols:
                        query = f"SELECT * FROM {table} WHERE {col} LIKE %s"
                        cursor.execute(query, (f"%{target_name}%",))
                        results = cursor.fetchall()
                        
                        if results:
                            for row in results:
                                found_records.append({
                                    'database': db,
                                    'table': table,
                                    'column': col,
                                    'row': row
                                })
                                print(f"[FOUND] Name: '{target_name}' in DB: {db} | TABLE: {table} | COLUMN: {col} | ROW: {row}")
                
                    # Also check for partial matches in case the name is split across fields
                    if 'first_name' in cols and 'last_name' in cols:
                        parts = target_name.split()
                        if len(parts) >= 2:
                            first_name = parts[0]
                            last_name = ' '.join(parts[1:])
                            
                            query = f"SELECT * FROM {table} WHERE first_name LIKE %s AND last_name LIKE %s"
                            cursor.execute(query, (f"%{first_name}%", f"%{last_name}%"))
                            results = cursor.fetchall()
                            
                            if results:
                                for row in results:
                                    found_records.append({
                                        'database': db,
                                        'table': table,
                                        'column': 'first_name/last_name',
                                        'row': row
                                    })
                                    print(f"[FOUND] Name: '{target_name}' in DB: {db} | TABLE: {table} | COLUMNS: first_name/last_name | ROW: {row}")
                                    
                except Exception as e:
                    # Skip tables that cause errors
                    continue
                    
        except Exception as e:
            # Skip databases that cause errors
            continue

    if not found_records:
        print(f"No records found for '{target_name}' in any database.")
        
        # Let's also try searching for partial matches
        print("\nTrying partial name searches...")
        
        name_parts = target_name.split()
        for db in databases:
            if db in ['information_schema', 'mysql', 'performance_schema', 'sys']:
                continue

            try:
                cursor.execute(f"USE {db}")
                cursor.execute("SHOW TABLES")
                tables = [t[0] for t in cursor.fetchall()]

                for table in tables:
                    try:
                        cursor.execute(f"DESCRIBE {table}")
                        cols = [c[0] for c in cursor.fetchall()]

                        # Look for name-related columns
                        name_cols = [c for c in cols if any(n in c.lower() for n in ['name', 'nome', 'full', 'first', 'last', 'user'])]
                        
                        for col in name_cols:
                            for part in name_parts:
                                if len(part) > 2:  # Only search for parts longer than 2 chars
                                    query = f"SELECT * FROM {table} WHERE {col} LIKE %s LIMIT 5"
                                    cursor.execute(query, (f"%{part}%",))
                                    results = cursor.fetchall()
                                    
                                    if results:
                                        for row in results:
                                            print(f"[PARTIAL FOUND] Part: '{part}' in DB: {db} | TABLE: {table} | COLUMN: {col} | ROW: {row}")
                    except Exception:
                        continue
            except Exception:
                continue

    conn.close()
    
except Exception as e:
    print(f"Global Error: {e}")