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
            
            # Find Patients first
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
                        print(f"  Found Patient: {name} (ID: {pid})")
                        
                        # Check Anamnesis
                        cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
                        if cursor.fetchone():
                            cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesis WHERE patient_id = %s", (pid,))
                            count = cursor.fetchone()[0]
                            if count > 0:
                                print(f"    - Has Anamnesis record in this DB!")
                                
                        # Check Photos
                        cursor.execute("SHOW TABLES LIKE 'progress_photos'")
                        if cursor.fetchone():
                            cursor.execute("SELECT COUNT(*) FROM progress_photos WHERE patient_id = %s", (pid,))
                            count = cursor.fetchone()[0]
                            if count > 0:
                                print(f"    - Has {count} Progress Photos in this DB!")

            # Also check patients_patient table (alternative naming)
            cursor.execute("SHOW TABLES LIKE 'patients_patient'")
            if cursor.fetchone():
                for t in targets:
                    cursor.execute("SELECT id, name FROM patients_patient WHERE name LIKE %s", (t,))
                    patients = cursor.fetchall()
                    for pid, name in patients:
                        print(f"  Found Patient (patients_patient): {name} (ID: {pid})")
                        # Check photos/anamnesis in related tables if possible...
                        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

search_globally()
