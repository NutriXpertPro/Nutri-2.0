import pymysql

password = '900113Acps@'

def check_specific_dbs():
    dbs = ['nutri_xpert_pro', 'nutrixpert']
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password)
        cursor = conn.cursor()
        
        for db in dbs:
            print(f"\n--- Checking DB: {db} ---")
            cursor.execute(f"USE `{db}`")
            
            # Find Patients Angela and Elizabeth
            cursor.execute("""
                SELECT p.id, u.name 
                FROM patient_profiles p 
                JOIN users_user u ON p.user_id = u.id 
                WHERE u.name LIKE '%Angela%' OR u.name LIKE '%Elizabeth%'
            """)
            patients = cursor.fetchall()
            for pid, name in patients:
                print(f"  Patient: {name} (ID: {pid})")
                
                # Anamnesis
                cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
                if cursor.fetchone():
                    cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesis WHERE patient_id = %s", (pid,))
                    print(f"    - Anamnesis count: {cursor.fetchone()[0]}")
                    
                # Photos
                cursor.execute("SHOW TABLES LIKE 'progress_photos'")
                if cursor.fetchone():
                    cursor.execute("SELECT COUNT(*) FROM progress_photos WHERE patient_id = %s", (pid,))
                    print(f"    - Photos count: {cursor.fetchone()[0]}")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")

check_specific_dbs()
