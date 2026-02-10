import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

def update():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        
        # 1. Update Angela (PatientID: 19) to use UserID: 51 (Angela Cristina)
        print("Updating Angela (PatientID 19) to UserID 51...")
        cursor.execute("UPDATE patient_profiles SET user_id = 51, nutritionist_id = 33, is_active = 1 WHERE id = 19")
        
        # 2. Ensure Anderson (PatientID: 14) is linked to Nutri 33 and active
        print("Updating Anderson (PatientID 14) linkage...")
        cursor.execute("UPDATE patient_profiles SET nutritionist_id = 33, is_active = 1 WHERE id = 14")

        # 3. Ensure Elizabeth (PatientID: 22) is linked to Nutri 33 and active
        print("Updating Elizabeth (PatientID 22) linkage...")
        cursor.execute("UPDATE patient_profiles SET nutritionist_id = 33, is_active = 1 WHERE id = 22")
        
        conn.commit()
        print("Updates committed successfully.")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

update()
