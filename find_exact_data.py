import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'
targets = ['anderson', 'elizabeth', 'angela']

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # 1. Inspect users_user
    cursor.execute("DESCRIBE users_user")
    ucols = [c[0] for c in cursor.fetchall()]
    print(f"Columns in users_user: {ucols}")
    
    uname_cols = [c for c in ucols if any(n in c.lower() for n in ['name', 'full'])]
    
    # Search for target users
    where_clauses = []
    for c in uname_cols:
        where_clauses.append(f"{c} LIKE %s")
    if 'email' in ucols:
        where_clauses.append("email LIKE %s")
        
    query = f"SELECT * FROM users_user WHERE {' OR '.join(where_clauses)}"
    
    found_users = []
    for t in targets:
        params = [f"%{t}%"] * len(where_clauses)
        cursor.execute(query, params)
        rows = cursor.fetchall()
        for r in rows:
            user_info = dict(zip(ucols, r))
            print(f"FOUND USER: {user_info}")
            found_users.append(user_info)

    # 2. Inspect patient_profiles
    cursor.execute("DESCRIBE patient_profiles")
    pcols = [c[0] for c in cursor.fetchall()]
    print(f"\nColumns in patient_profiles: {pcols}")
    
    # Check if any patient is linked to these users
    user_ids = [u['id'] for u in found_users if 'id' in u]
    if user_ids and 'user_id' in pcols:
        placeholders = ', '.join(['%s'] * len(user_ids))
        cursor.execute(f"SELECT * FROM patient_profiles WHERE user_id IN ({placeholders})", user_ids)
        pts = cursor.fetchall()
        print(f"\nPATIENTS linked to these users ({len(pts)}):")
        for p in pts:
            print(dict(zip(pcols, p)))

    conn.close()
except Exception as e:
    import traceback
    traceback.print_exc()
