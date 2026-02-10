import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # Check patient_profiles
    cursor.execute("DESCRIBE patient_profiles")
    rows = cursor.fetchall()
    cols = [r[0] for r in rows]
    print(f"COLUMNS in patient_profiles: {cols}")
    
    # Get all patients
    cursor.execute("SELECT * FROM patient_profiles")
    pts = cursor.fetchall()
    print(f"\n--- ALL PATIENTS IN {db}.patient_profiles ({len(pts)}) ---")
    for p in pts:
        p_dict = dict(zip(cols, p))
        # Just show some fields to avoid too much output
        # Print whichever column might be the name or ID
        print(f"ID: {p_dict.get('id')} | UserID: {p_dict.get('user_id')} | Created: {p_dict.get('created_at')}")

    # Check users_user to map UserID to Names
    cursor.execute("DESCRIBE users_user")
    urows = cursor.fetchall()
    ucols = [r[0] for r in urows]
    print(f"\nCOLUMNS in users_user: {ucols}")
    
    cursor.execute("SELECT id, email FROM users_user")
    users = cursor.fetchall()
    user_map = {u[0]: u[1] for u in users}
    
    print("\n--- Mapping Patients to User Emails ---")
    for p in pts:
        p_dict = dict(zip(cols, p))
        uid = p_dict.get('user_id')
        email = user_map.get(uid, "Unknown")
        print(f"PatientID: {p_dict.get('id')} -> UserEmail: {email}")

    conn.close()
except Exception as e:
    print(f"Error: {e}")
