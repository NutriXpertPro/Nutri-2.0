import pymysql

password = '900113Acps@'
target_email = 'anderson_28vp@hotmail.com'

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
            
            # Find any user table
            user_table = next((t for t in tables if 'user' in t.lower() and 'profile' not in t.lower()), None)
            user_found = False
            if user_table:
                try:
                    cursor.execute(f"SELECT email FROM {user_table} WHERE email = %s", (target_email,))
                    if cursor.fetchone():
                        user_found = True
                except: pass

            # Count patients in ANY patient table
            patient_tables = [t for t in tables if 'patient' in t.lower() or 'paciente' in t.lower()]
            total_patients = 0
            pt_details = []
            for pt in patient_tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {pt}")
                    count = cursor.fetchone()[0]
                    total_patients += count
                    if count > 0:
                        pt_details.append(f"{pt}({count})")
                except: pass
            
            if user_found or total_patients > 0:
                print(f"DB: {db:<25} | User: {'YES' if user_found else 'NO '} | Patients: {total_patients:<3} | Tables: {', '.join(pt_details)}")

        except Exception as e:
            pass
            
    conn.close()
except Exception as e:
    print(f"Global Error: {e}")
