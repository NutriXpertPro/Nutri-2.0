import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # Anderson's ID is 33 in nutrixpert_db
    anderson_id = 33
    
    # Check patients linked to nutritionist_id 33
    cursor.execute("SELECT COUNT(*) FROM patient_profiles WHERE nutritionist_id = %s", (anderson_id,))
    count = cursor.fetchone()[0]
    print(f"Total patients for nutritionist Anderson (ID: {anderson_id}): {count}")
    
    if count > 0:
        # Get patient names by joining with users_user
        cursor.execute("DESCRIBE users_user")
        ucols = [c[0] for c in cursor.fetchall()]
        name_col = next((c for c in ucols if any(n in c.lower() for n in ['name', 'full'])), None)
        
        if name_col:
            query = f"""
                SELECT p.id, u.{name_col}, u.email
                FROM patient_profiles p
                JOIN users_user u ON p.user_id = u.id
                WHERE p.nutritionist_id = %s
            """
            cursor.execute(query, (anderson_id,))
            pts = cursor.fetchall()
            for p in pts:
                print(f"Patient ID: {p[0]} | Name: {p[1]} | Email: {p[2]}")
        else:
            query = """
                SELECT p.id, u.email
                FROM patient_profiles p
                JOIN users_user u ON p.user_id = u.id
                WHERE p.nutritionist_id = %s
            """
            cursor.execute(query, (anderson_id,))
            pts = cursor.fetchall()
            for p in pts:
                print(f"Patient ID: {p[0]} | Email: {p[1]}")
    
    # What about patients with nutritionist_id = NULL or other values?
    cursor.execute("SELECT COUNT(*), nutritionist_id FROM patient_profiles GROUP BY nutritionist_id")
    print("\nGlobal distribution of nutritionist_id:")
    for r in cursor.fetchall():
        print(f"Nutritionist ID: {r[1]}, Count: {r[0]}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
