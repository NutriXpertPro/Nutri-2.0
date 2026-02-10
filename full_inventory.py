import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # 1. Patients with Anamnesis
    print("--- Patients with Anamnesis in nutrixpert_db ---")
    cursor.execute("""
        SELECT a.patient_id, u.name, u.email
        FROM anamnesis_anamnesis a
        JOIN patient_profiles p ON a.patient_id = p.id
        JOIN users_user u ON p.user_id = u.id
    """)
    rows = cursor.fetchall()
    for r in rows:
        print(f"PatientID: {r[0]} | Name: {r[1]} | Email: {r[2]}")

    # 2. Patients with Progress Photos
    print("\n--- Patients with Progress Photos in nutrixpert_db ---")
    cursor.execute("""
        SELECT DISTINCT ph.patient_id, u.name
        FROM progress_photos ph
        JOIN patient_profiles p ON ph.patient_id = p.id
        JOIN users_user u ON p.user_id = u.id
    """)
    rows = cursor.fetchall()
    for r in rows:
        print(f"PatientID: {r[0]} | Name: {r[1]}")

    conn.close()
except Exception as e:
    print(f"Error: {e}")
