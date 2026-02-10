import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    print(f"--- Data in {db} ---")
    
    # Check Patients
    cursor.execute("SELECT id, name FROM patient_profiles ORDER BY id DESC LIMIT 25")
    patients = cursor.fetchall()
    print(f"\nPATIENTS ({len(patients)}):")
    for p in patients:
        print(f"  - {p[1]} (ID: {p[0]})")
        
    # Check Anamnesis
    cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
    if cursor.fetchone():
        cursor.execute("SELECT id, patient_id FROM anamnesis_anamnesis")
        anams = cursor.fetchall()
        print(f"\nANAMNESIS ({len(anams)}):")
        for a in anams:
            print(f"  - Anamnesis ID: {a[0]} for Patient ID: {a[1]}")
            
    # Check Photos
    cursor.execute("SHOW TABLES LIKE 'progress_photos'")
    if cursor.fetchone():
        cursor.execute("SELECT id, patient_id, photo FROM progress_photos")
        photos = cursor.fetchall()
        print(f"\nPROGRESS PHOTOS ({len(photos)}):")
        for ph in photos:
            print(f"  - Photo ID: {ph[0]} for Patient ID: {ph[1]} | File: {ph[2]}")
            
    conn.close()
except Exception as e:
    print(f"Error: {e}")
