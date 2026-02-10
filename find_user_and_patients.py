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
            
            user_table = next((t for t in tables if t == 'users_user'), None)
            if user_table:
                cursor.execute(f"SELECT id, email, is_active FROM {user_table} WHERE email = %s", (target_email,))
                user = cursor.fetchone()
                if user:
                    print(f"DATABASE: {db} | USER FOUND: {user[1]} (ID: {user[0]})")
                    
                    # Check patients for THIS user (Django often uses a foreign key)
                    # Let's see if patients_patient exists in this DB
                    if 'patients_patient' in tables:
                        cursor.execute("SELECT id, name FROM patients_patient")
                        pts = cursor.fetchall()
                        print(f"  - Patients in 'patients_patient': {len(pts)}")
                        for p in pts:
                            print(f"    * {p[1]} (ID: {p[0]})")
                    
                    # Also check patient_profiles if it exists
                    if 'patient_profiles' in tables:
                        cursor.execute("SELECT id, name FROM patient_profiles")
                        pts = cursor.fetchall()
                        print(f"  - Patients in 'patient_profiles': {len(pts)}")
                        for p in pts:
                            print(f"    * {p[1]} (ID: {p[0]})")
                else:
                    # print(f"DATABASE: {db} | User not found")
                    pass
        except Exception as e:
            # print(f"Error in {db}: {e}")
            pass
            
    conn.close()
except Exception as e:
    print(f"Global Error: {e}")
