import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # 1. Get the names of ALL 23 patients in patient_profiles
    cursor.execute("DESCRIBE patient_profiles")
    cols = [c[0] for c in cursor.fetchall()]
    name_col = next((c for c in cols if any(n in c.lower() for n in ['name', 'nome', 'full'])), None)
    
    if name_col:
        cursor.execute(f"SELECT id, {name_col}, user_id FROM patient_profiles")
        pts = cursor.fetchall()
        print(f"--- Patients in {db}.patient_profiles ({len(pts)}) ---")
        for p in pts:
            print(f"ID: {p[0]} | Name: {p[1]} | User_ID: {p[2]}")
    else:
        print("No name column in patient_profiles")
        
    # 2. Check users_user to see the IDs of Anderson, Elizabeth, Angela
    cursor.execute("SELECT id, email, first_name, last_name FROM users_user WHERE email LIKE '%anderson%' OR first_name LIKE '%Elizabeth%' OR first_name LIKE '%Angela%' OR last_name LIKE '%Angela%'")
    users = cursor.fetchall()
    print(f"\n--- Users in {db}.users_user ---")
    for u in users:
        print(f"ID: {u[0]} | Email: {u[1]} | Name: {u[2]} {u[3]}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
