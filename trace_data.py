import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # 1. Check Photos
    print("--- Photos in nutrixpert_db ---")
    cursor.execute("SELECT id, patient_id, photo FROM progress_photos")
    photos = cursor.fetchall()
    for ph in photos:
        # Get patient name
        cursor.execute("SELECT user_id FROM patient_profiles WHERE id = %s", (ph[1],))
        uid = cursor.fetchone()
        if uid:
            cursor.execute("DESCRIBE users_user")
            ucols = [c[0] for c in cursor.fetchall()]
            name_col = next((c for c in ucols if any(n in c.lower() for n in ['name', 'full'])), None)
            if name_col:
                cursor.execute(f"SELECT {name_col} FROM users_user WHERE id = %s", (uid[0],))
                uname = cursor.fetchone()
                print(f"Photo ID: {ph[0]} | PatientID: {ph[1]} | Name: {uname[0]} | File: {ph[2]}")
    
    # 2. Check Anamnesis
    print("\n--- Anamnesis in nutrixpert_db ---")
    cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesis'")
    if cursor.fetchone():
        cursor.execute("SELECT id, patient_id FROM anamnesis_anamnesis")
        anams = cursor.fetchall()
        for a in anams:
            cursor.execute("SELECT user_id FROM patient_profiles WHERE id = %s", (a[1],))
            uid = cursor.fetchone()
            if uid:
                name_col = next((c for c in ucols if any(n in c.lower() for n in ['name', 'full'])), None)
                if name_col:
                    cursor.execute(f"SELECT {name_col} FROM users_user WHERE id = %s", (uid[0],))
                    uname = cursor.fetchone()
                    print(f"Anamnesis ID: {a[0]} | PatientID: {a[1]} | Name: {uname[0]}")

    conn.close()
except Exception as e:
    import traceback
    traceback.print_exc()
