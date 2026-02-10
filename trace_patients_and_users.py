import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    targets = ['%Anderson%', '%Angela%', '%Elizabeth%', '%Elisabeth%']
    print("--- Searching for Patients in patient_profiles ---")
    for t in targets:
        # We need to find the profile first, then the user.
        # But wait, patient_profiles.user_id points to users_user.id.
        # Let's find patients by their name in users_user via the user_id link.
        cursor.execute("""
            SELECT p.id, u.name, u.email, p.user_id, p.nutritionist_id, p.is_active 
            FROM patient_profiles p 
            JOIN users_user u ON p.user_id = u.id 
            WHERE u.name LIKE %s
        """, (t,))
        rows = cursor.fetchall()
        for r in rows:
            print(f"PatientID: {r[0]} | Name: {r[1]} | Email: {r[2]} | LinkUserID: {r[3]} | NutriID: {r[4]} | Active: {r[5]}")

    print("\n--- Searching for ALL Users with these names (to catch unlinked ones) ---")
    for t in targets:
        cursor.execute("SELECT id, name, email FROM users_user WHERE name LIKE %s", (t,))
        rows = cursor.fetchall()
        for r in rows:
            # Check if this user has a profile picture
            cursor.execute("SELECT profile_picture FROM users_userprofile WHERE user_id = %s", (r[0],))
            pic = cursor.fetchone()
            print(f"UserID: {r[0]} | Name: {r[1]} | Email: {r[2]} | Profile Pic: {pic[0] if pic else 'None'}")

    conn.close()
except Exception as e:
    print(f"Error: {e}")
