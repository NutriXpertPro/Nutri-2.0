import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

def cleanup():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        
        # Names to search and delete
        targets = ['%Anderson%', '%Angela%', '%Elizabeth%', '%Elisabeth%']
        
        user_ids = []
        patient_ids = []
        
        for t in targets:
            # Get User IDs
            cursor.execute("SELECT id, name, email FROM users_user WHERE name LIKE %s OR email LIKE %s", (t, t))
            users = cursor.fetchall()
            for u in users:
                print(f"Found User to delete: ID={u[0]}, Name={u[1]}, Email={u[2]}")
                user_ids.append(u[0])
            
            # Get Patient IDs (specifically those in profiles)
            cursor.execute("""
                SELECT p.id, u.name 
                FROM patient_profiles p 
                JOIN users_user u ON p.user_id = u.id 
                WHERE u.name LIKE %s OR u.email LIKE %s
            """, (t, t))
            patients = cursor.fetchall()
            for p in patients:
                print(f"Found Patient Profile to delete: ID={p[0]}, Name={p[1]}")
                patient_ids.append(p[0])

        # Delete in order to satisfy constraints (best effort)
        # Note: If Django signals are needed, this won't trigger them, but user asked for "delete from DB".
        
        if patient_ids:
            p_ids_str = ",".join(map(str, set(patient_ids)))
            print(f"Deleting patient profiles: {p_ids_str}")
            cursor.execute(f"DELETE FROM patient_profiles WHERE id IN ({p_ids_str})")
            
        if user_ids:
            u_ids_str = ",".join(map(str, set(user_ids)))
            print(f"Deleting users: {u_ids_str}")
            # Try to delete from userprofiles first if exists
            cursor.execute(f"DELETE FROM users_userprofile WHERE user_id IN ({u_ids_str})")
            cursor.execute(f"DELETE FROM users_user WHERE id IN ({u_ids_str})")
            
        conn.commit()
        print("Cleanup completed successfully.")
        conn.close()
    except Exception as e:
        print(f"Error during cleanup: {e}")

cleanup()
