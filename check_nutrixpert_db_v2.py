import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    print(f"--- Data in {db} ---")
    
    # Check Patients
    cursor.execute("DESCRIBE patient_profiles")
    cols = [c[0] for c in cursor.fetchall()]
    print(f"Columns in patient_profiles: {cols}")
    
    name_col = next((c for c in cols if 'name' in c.lower() or 'nome' in c.lower() or 'full_name' in c.lower()), None)
    
    if name_col:
        cursor.execute(f"SELECT id, {name_col} FROM patient_profiles ORDER BY id DESC LIMIT 25")
        patients = cursor.fetchall()
        print(f"\nPATIENTS ({len(patients)}):")
        for p in patients:
            print(f"  - {p[1]} (ID: {p[0]})")
    else:
        print("\nNo name column found in patient_profiles.")
        cursor.execute("SELECT * FROM patient_profiles LIMIT 3")
        rows = cursor.fetchall()
        for r in rows:
            print(f"  - Row: {r}")
        
    # Check Anamnesis
    cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
    if cursor.fetchone():
        cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesis")
        count = cursor.fetchone()[0]
        print(f"\nANAMNESIS COUNT: {count}")
        if count > 0:
            cursor.execute("DESCRIBE anamnesis_anamnesis")
            print(f"Anamnesis cols: {[c[0] for c in cursor.fetchall()]}")
            
    # Check Photos
    cursor.execute("SHOW TABLES LIKE 'progress_photos'")
    if cursor.fetchone():
        cursor.execute("DESCRIBE progress_photos")
        pcols = [c[0] for c in cursor.fetchall()]
        print(f"\nPhotos cols: {pcols}")
        
        cursor.execute("SELECT COUNT(*) FROM progress_photos")
        pcount = cursor.fetchone()[0]
        print(f"PHOTO COUNT: {pcount}")
        
        if pcount > 0:
            cursor.execute("SELECT * FROM progress_photos LIMIT 5")
            for ph in cursor.fetchall():
                print(f"  - Photo row: {ph}")
            
    conn.close()
except Exception as e:
    print(f"Error: {e}")
