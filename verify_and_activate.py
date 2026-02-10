import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'
pids = [14, 19, 22]

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # 1. Check Activity and Nutritionist Linkage
    print("--- Verifying Patients ---")
    for pid in pids:
        cursor.execute("SELECT id, is_active, nutritionist_id FROM patient_profiles WHERE id = %s", (pid,))
        row = cursor.fetchone()
        if row:
            print(f"PatientID: {row[0]} | Active: {row[1]} | NutritionistID: {row[2]}")
        else:
            print(f"PatientID: {pid} NOT FOUND")
            
    # 2. Set all to Active Just in Case
    print("\nSetting all target patients to active and linked to ID 33...")
    cursor.execute("UPDATE patient_profiles SET is_active = 1, nutritionist_id = 33 WHERE id IN (14, 19, 22)")
    conn.commit()
    print(f"Updated {cursor.rowcount} patients.")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
