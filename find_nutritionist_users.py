import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

ids = [1, 11, 33, 43, 46, 49, 71, 73]

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # Check users with these IDs
    placeholders = ', '.join(['%s'] * len(ids))
    cursor.execute(f"SELECT id, email FROM users_user WHERE id IN ({placeholders})", ids)
    users = cursor.fetchall()
    print("--- Users in nutrixpert_db ---")
    for u in users:
        print(f"ID: {u[0]} | Email: {u[1]}")
    
    # Let's specifically check if Anderson exists with ID 1
    cursor.execute("SELECT id, email FROM users_user WHERE email LIKE '%anderson%'")
    andersons = cursor.fetchall()
    print("\n--- All Andersons in nutrixpert_db ---")
    for a in andersons:
        print(f"ID: {a[0]} | Email: {a[1]}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
