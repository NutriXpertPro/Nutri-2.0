import pymysql
import os

password = '900113Acps@'
db = 'nutrixpert_db'
anderson_pid = 14

def check_data():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        
        # 1. Inspect anamnesis_anamnesis
        cursor.execute("DESCRIBE anamnesis_anamnesis")
        acols = [c[0] for c in cursor.fetchall()]
        print(f"Columns in anamnesis_anamnesis: {acols}")
        
        cursor.execute("SELECT * FROM anamnesis_anamnesis WHERE patient_id = %s", (anderson_pid,))
        anam_records = cursor.fetchall()
        print(f"Anamnesis records for Anderson: {len(anam_records)}")
        for r in anam_records:
            print(dict(zip(acols, r)))

        # 2. Inspect progress_photos
        cursor.execute("DESCRIBE progress_photos")
        phcols = [c[0] for c in cursor.fetchall()]
        print(f"\nColumns in progress_photos: {phcols}")
        
        cursor.execute("SELECT * FROM progress_photos WHERE patient_id = %s", (anderson_pid,))
        photos = cursor.fetchall()
        print(f"Photos for Anderson: {len(photos)}")
        for p in photos:
            p_dict = dict(zip(phcols, p))
            print(f"  ID: {p_dict.get('id')} | Path: {p_dict.get('photo')}")

        # 3. Inspect user profile pics
        cursor.execute("DESCRIBE users_userprofile")
        upcols = [c[0] for c in cursor.fetchall()]
        print(f"\nColumns in users_userprofile: {upcols}")
        
        target_pids = [14, 19, 22] 
        for pid in target_pids:
            cursor.execute("SELECT user_id FROM patient_profiles WHERE id = %s", (pid,))
            uid = cursor.fetchone()
            if uid:
                cursor.execute("SELECT * FROM users_userprofile WHERE user_id = %s", (uid[0],))
                up = cursor.fetchone()
                if up:
                    up_dict = dict(zip(upcols, up))
                    print(f"PatientID: {pid} | UserProfile: {up_dict}")
                else:
                    print(f"PatientID: {pid} | No UserProfile found for UserID: {uid[0]}")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")

check_data()
