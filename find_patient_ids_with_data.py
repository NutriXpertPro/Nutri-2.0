import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'
targets = ['Anderson', 'Elizabeth', 'Angela']

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    print("--- Searching for specific patient data ---")
    
    # Get columns
    cursor.execute("DESCRIBE users_user")
    ucols = [c[0] for c in cursor.fetchall()]
    uname_col = next((c for c in ucols if any(n in c.lower() for n in ['name', 'full'])), None)
    
    for name in targets:
        print(f"\nSearching for {name}:")
        query = f"""
            SELECT p.id, u.{uname_col}, u.email
            FROM patient_profiles p
            JOIN users_user u ON p.user_id = u.id
            WHERE u.{uname_col} LIKE %s
        """
        cursor.execute(query, (f"%{name}%",))
        pts = cursor.fetchall()
        for p in pts:
            pid = p[0]
            pname = p[1]
            pemail = p[2]
            
            # Check for photos
            cursor.execute("SELECT COUNT(*) FROM progress_photos WHERE patient_id = %s", (pid,))
            ph_count = cursor.fetchone()[0]
            
            # Check for anamnesis
            cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesis WHERE patient_id = %s", (pid,))
            an_count = cursor.fetchone()[0]
            
            print(f"  PatientID: {pid} | Name: {pname} | Email: {pemail} | Photos: {ph_count} | Anamnesis: {an_count}")
            
    conn.close()
except Exception as e:
    print(f"Error: {e}")
