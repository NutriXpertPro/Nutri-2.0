import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'
targets = ['anderson', 'elizabeth', 'angela']

def safe_scan():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        
        # 1. Get User IDs for targets
        cursor.execute("DESCRIBE users_user")
        ucols = [c[0] for c in cursor.fetchall()]
        uname_col = next((c for c in ucols if any(n in c.lower() for n in ['name', 'full'])), None)
        
        target_map = {} # id -> name
        if uname_col:
            for t in targets:
                cursor.execute(f"SELECT id, {uname_col} FROM users_user WHERE {uname_col} LIKE %s", (f"%{t}%",))
                for r in cursor.fetchall():
                    target_map[r[0]] = r[1]
        
        print(f"Target User IDs map: {target_map}")
        
        # 2. Find Patient IDs for these users
        cursor.execute("DESCRIBE patient_profiles")
        pcols = [c[0] for c in cursor.fetchall()]
        
        patient_map = {} # pid -> name
        if 'user_id' in pcols:
            for uid, name in target_map.items():
                cursor.execute("SELECT id FROM patient_profiles WHERE user_id = %s", (uid,))
                for r in cursor.fetchall():
                    patient_map[r[0]] = name
        
        print(f"Target Patient IDs map: {patient_map}")
        
        # 3. Check Anamnesis for these patients
        print("\n--- Anamnesis ---")
        cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
        if cursor.fetchone():
            cursor.execute("SELECT patient_id FROM anamnesis_anamnesis")
            for r in cursor.fetchall():
                if r[0] in patient_map:
                    print(f"Found Anamnesis for: {patient_map[r[0]]} (PatientID: {r[0]})")
                    
        # 4. Check Photos for these patients
        print("\n--- Photos ---")
        cursor.execute("SHOW TABLES LIKE 'progress_photos'")
        if cursor.fetchone():
            cursor.execute("SELECT patient_id, photo FROM progress_photos")
            for r in cursor.fetchall():
                if r[0] in patient_map:
                    print(f"Found Photo for: {patient_map[r[0]]} (PatientID: {r[0]}) | File: {r[1]}")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

safe_scan()
