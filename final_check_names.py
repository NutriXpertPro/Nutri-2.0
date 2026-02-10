import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # Let's find columns that store names in users_user
    cursor.execute("DESCRIBE users_user")
    ucols = [c[0] for c in cursor.fetchall()]
    
    # Try all reasonable email/name combinations
    name_col = next((c for c in ucols if any(n in c.lower() for n in ['name', 'full'])), None)
    
    if name_col:
        query = f"""
            SELECT p.id, u.email, u.{name_col}
            FROM patient_profiles p
            JOIN users_user u ON p.user_id = u.id
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        print(f"--- Patients with Account Names in {db} ---")
        for r in rows:
            print(f"PatientID: {r[0]} | Email: {r[1]} | Name: {r[2]}")
    else:
        # If no name col, just show emails
        query = """
            SELECT p.id, u.email
            FROM patient_profiles p
            JOIN users_user u ON p.user_id = u.id
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        print(f"--- Patients with Account Emails in {db} ---")
        for r in rows:
            print(f"PatientID: {r[0]} | Email: {r[1]}")
            
    conn.close()
except Exception as e:
    import traceback
    traceback.print_exc()
