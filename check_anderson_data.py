import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'
anderson_pid = 14

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    print(f"--- Checking Anamnesis for Anderson (PatientID: {anderson_pid}) ---")
    cursor.execute("SELECT id FROM anamnesis_anamnesis WHERE patient_id = %s", (anderson_pid,))
    anam = cursor.fetchone()
    if anam:
        anam_id = anam[0]
        print(f"Found Anamnesis record ID: {anam_id}")
        
        # Check for responses
        cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesisresponse'")
        if cursor.fetchone():
            cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesisresponse WHERE anamnesis_id = %s", (anam_id,))
            resp_count = cursor.fetchone()[0]
            print(f"Anamnesis Responses: {resp_count}")
        else:
            print("anamnesis_anamnesisresponse table not found.")
    else:
        print("No Anamnesis record found for Anderson.")

    print(f"\n--- Checking Progress Photos for Anderson (PatientID: {anderson_pid}) ---")
    cursor.execute("SELECT id, photo FROM progress_photos WHERE patient_id = %s", (anderson_pid,))
    photos = cursor.fetchall()
    print(f"Total Photos: {len(photos)}")
    for p in photos:
        print(f"  ID: {p[0]} | Path: {p[1]}")

    print(f"\n--- Identifying missing profile photos for all target patients ---")
    target_pids = [14, 19, 22] # Anderson, Angela, Elizabeth
    for pid in target_pids:
        cursor.execute("SELECT user_id FROM patient_profiles WHERE id = %s", (pid,))
        uid = cursor.fetchone()
        if uid:
            cursor.execute("SELECT profile_picture FROM users_userprofile WHERE user_id = %s", (uid[0],))
            picture = cursor.fetchone()
            print(f"PatientID: {pid} | UserID: {uid[0]} | Profile Picture Path: {picture[0] if picture else 'None'}")

    conn.close()
except Exception as e:
    print(f"Error: {e}")
