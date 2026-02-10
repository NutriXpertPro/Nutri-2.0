import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

def update():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        
        # 1. Update PatientID 26 (Angela) to NutriID 33
        print("Linking Angela (PatientID 26) to NutriID 33...")
        cursor.execute("UPDATE patient_profiles SET nutritionist_id = 33, is_active = 1 WHERE id = 26")
        
        # 2. Update PatientID 14 (Anderson) to NutriID 33
        print("Ensuring Anderson (PatientID 14) linked to NutriID 33...")
        cursor.execute("UPDATE patient_profiles SET nutritionist_id = 33, is_active = 1 WHERE id = 14")

        # 3. Update PatientID 22 (Elizabeth) to NutriID 33
        print("Ensuring Elizabeth (PatientID 22) linked to NutriID 33...")
        cursor.execute("UPDATE patient_profiles SET nutritionist_id = 33, is_active = 1 WHERE id = 22")
        
        # 4. If there's a PatientID 19 that was wrong, deactivate it to avoid confusion
        print("Deactivating old PatientID 19...")
        cursor.execute("UPDATE patient_profiles SET is_active = 0 WHERE id = 19")
        
        conn.commit()
        print("Updates committed successfully.")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

update()
