import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

n_ids = [1, 11]

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # Get columns for users_user
    cursor.execute("DESCRIBE users_user")
    ucols = [c[0] for c in cursor.fetchall()]
    name_col = next((c for c in ucols if any(n in c.lower() for n in ['name', 'full'])), None)
    
    for nid in n_ids:
        print(f"\n--- Patients for Nutritionist ID {nid} ---")
        if name_col:
            query = f"""
                SELECT p.id, u.{name_col}, u.email
                FROM patient_profiles p
                JOIN users_user u ON p.user_id = u.id
                WHERE p.nutritionist_id = %s
            """
            cursor.execute(query, (nid,))
            rows = cursor.fetchall()
            for r in rows:
                print(f"PatientID: {r[0]} | Name: {r[1]} | Email: {r[2]}")
        else:
            query = """
                SELECT p.id, u.email
                FROM patient_profiles p
                JOIN users_user u ON p.user_id = u.id
                WHERE p.nutritionist_id = %s
            """
            cursor.execute(query, (nid,))
            rows = cursor.fetchall()
            for r in rows:
                print(f"PatientID: {r[0]} | Email: {r[1]}")
                
    conn.close()
except Exception as e:
    print(f"Error: {e}")
