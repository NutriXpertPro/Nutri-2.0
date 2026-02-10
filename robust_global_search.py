import pymysql

password = '900113Acps@'

def search_globally():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password)
        cursor = conn.cursor()
        
        cursor.execute("SHOW DATABASES")
        dbs = [d[0] for d in cursor.fetchall() if d[0] not in ['information_schema', 'mysql', 'performance_schema', 'sys']]
        
        targets = ['%Angela%', '%Elizabeth%', '%Elisabeth%']
        
        for db in dbs:
            print(f"\n--- Scanning Database: {db} ---")
            cursor.execute(f"USE `{db}`")
            
            # Check for patient_profiles (typically has user_id)
            cursor.execute("SHOW TABLES LIKE 'patient_profiles'")
            if cursor.fetchone():
                for t in targets:
                    cursor.execute("""
                        SELECT p.id, u.name 
                        FROM patient_profiles p 
                        JOIN users_user u ON p.user_id = u.id 
                        WHERE u.name LIKE %s
                    """, (t,))
                    patients = cursor.fetchall()
                    for pid, name in patients:
                        print(f"  Found Patient (patient_profiles): {name} (ID: {pid})")
                        
                        # Anamnesis
                        cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
                        if cursor.fetchone():
                            cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesis WHERE patient_id = %s", (pid,))
                            count = cursor.fetchall()[0][0]
                            if count > 0:
                                print(f"    - Has Anamnesis record!")
                                
                        # Photos
                        cursor.execute("SHOW TABLES LIKE 'progress_photos'")
                        if cursor.fetchone():
                            cursor.execute("SELECT COUNT(*) FROM progress_photos WHERE patient_id = %s", (pid,))
                            count = cursor.fetchall()[0][0]
                            if count > 0:
                                print(f"    - Has {count} Progress Photos!")

            # Check for patients_patient (typically used in older versions)
            cursor.execute("SHOW TABLES LIKE 'patients_patient'")
            if cursor.fetchone():
                cursor.execute("DESCRIBE patients_patient")
                cols = [c[0] for c in cursor.fetchall()]
                name_col = 'name' if 'name' in cols else 'user_id' # simplified
                if 'name' in cols:
                    for t in targets:
                        cursor.execute(f"SELECT id, name FROM patients_patient WHERE name LIKE %s", (t,))
                        patients = cursor.fetchall()
                        for pid, name in patients:
                            print(f"  Found Patient (patients_patient): {name} (ID: {pid})")
                            # Check anamnesis/photos in related tables if we can guess names...
                            cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
                            if cursor.fetchone():
                                cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesis WHERE patient_id = %s", (pid,))
                                count = cursor.fetchall()[0][0]
                                if count > 0: print(f"    - Has Anamnesis!")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")

search_globally()
