import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()

    print("=== ANALYZING DATABASE RELATIONSHIPS ===\n")

    # 1. Find Anderson's user ID (both possible emails)
    print("1. Finding Anderson's user ID...")
    cursor.execute("SELECT id, name, email FROM users_user WHERE email IN ('andersoncarlosvp@gmail.com', 'anderson_28vp@hotmail.com')")
    anderson_users = cursor.fetchall()
    
    anderson_id = None
    for user in anderson_users:
        print(f"   Found Anderson user: ID={user[0]}, Name={user[1]}, Email={user[2]}")
        anderson_id = user[0]  # Store the ID for later use
    
    if not anderson_users:
        print("   Anderson user not found with either email")
        
        # Let's try searching by name instead
        cursor.execute("SELECT id, name, email FROM users_user WHERE name LIKE '%Anderson%'")
        anderson_by_name = cursor.fetchall()
        for user in anderson_by_name:
            print(f"   Found Anderson by name: ID={user[0]}, Name={user[1]}, Email={user[2]}")
            anderson_id = user[0]

    # 2. Find Angela Cristina Portes de Sant Ana's patient ID
    print("\n2. Finding Angela Cristina Portes de Sant Ana's patient ID...")
    # Since patient names are in users_user table, we need to join with patient_profiles
    cursor.execute("""
        SELECT pp.id, uu.name 
        FROM patient_profiles pp
        JOIN users_user uu ON pp.user_id = uu.id
        WHERE uu.name LIKE '%Angela Cristina Portes de Sant ana%'
    """)
    angela_patients = cursor.fetchall()
    
    angela_patient_id = None
    for patient in angela_patients:
        print(f"   Found Angela patient: ID={patient[0]}, Name={patient[1]}")
        angela_patient_id = patient[0]
    
    if not angela_patients:
        print("   Angela patient not found by exact name")
        
        # Try alternative search
        cursor.execute("""
            SELECT pp.id, uu.name 
            FROM patient_profiles pp
            JOIN users_user uu ON pp.user_id = uu.id
            WHERE uu.name LIKE '%Angela%Cristina%Sant%'
        """)
        alt_angela = cursor.fetchall()
        for patient in alt_angela:
            print(f"   Found Angela by alternative search: ID={patient[0]}, Name={patient[1]}")
            angela_patient_id = patient[0]

    # 3. Check the relationship between nutritionists and patients
    print("\n3. Checking nutritionist-patient relationships...")
    
    # First, let's see the structure of patient_profiles
    cursor.execute("DESCRIBE patient_profiles")
    columns = cursor.fetchall()
    print(f"   Columns in patient_profiles: {[col[0] for col in columns]}")
    
    # Check all patient records to understand the relationship
    cursor.execute("SELECT id, user_id, nutritionist_id FROM patient_profiles LIMIT 10")
    sample_patients = cursor.fetchall()
    print("   Sample patient records (ID, user_id, nutritionist_id):")
    for patient in sample_patients:
        # Get the patient's name from the users_user table
        cursor.execute("SELECT name FROM users_user WHERE id = %s", (patient[1],))
        user_name = cursor.fetchone()
        name = user_name[0] if user_name else "N/A"
        print(f"     ID:{patient[0]}, User_ID:{patient[1]}, Nutritionist_ID:{patient[2]}, Name:{name}")
    
    # If we found Anderson's ID, show his patients
    if anderson_id:
        print(f"\n   Patients associated with Anderson (ID: {anderson_id}):")
        cursor.execute("SELECT id, user_id FROM patient_profiles WHERE nutritionist_id = %s", (anderson_id,))
        anderson_patients = cursor.fetchall()
        for patient in anderson_patients:
            # Get the patient's name from the users_user table
            cursor.execute("SELECT name FROM users_user WHERE id = %s", (patient[1],))
            user_name = cursor.fetchone()
            name = user_name[0] if user_name else "N/A"
            print(f"     Patient ID: {patient[0]}, User ID: {patient[1]}, Name: {name}")
            
            # Check if Angela is among Anderson's patients
            if angela_patient_id and patient[0] == angela_patient_id:
                print(f"       ^^^ Angela is associated with Anderson!")
    
    # 4. Check why patient might not appear in list despite being associated
    print("\n4. Investigating why patient might not appear in list...")
    
    # Check if there are any active/inactive flags
    cursor.execute("SHOW COLUMNS FROM patient_profiles LIKE 'is_active'")
    is_active_col = cursor.fetchone()
    if is_active_col:
        print("   Found is_active column in patient_profiles")
        cursor.execute("SELECT id, user_id, is_active FROM patient_profiles WHERE is_active = 0")
        inactive_patients = cursor.fetchall()
        if inactive_patients:
            print("   Inactive patients:")
            for patient in inactive_patients:
                # Get the patient's name from the users_user table
                cursor.execute("SELECT name FROM users_user WHERE id = %s", (patient[1],))
                user_name = cursor.fetchone()
                name = user_name[0] if user_name else "N/A"
                print(f"     ID: {patient[0]}, Name: {name}, Active: {patient[2]}")
    
    # Check if there are any deleted_at or similar soft-delete fields
    cursor.execute("SHOW COLUMNS FROM patient_profiles LIKE 'deleted_at'")
    deleted_at_col = cursor.fetchone()
    if deleted_at_col:
        print("   Found deleted_at column in patient_profiles")
    
    # Check if Angela exists but isn't associated with Anderson
    if angela_patient_id:
        cursor.execute("SELECT id, user_id, nutritionist_id FROM patient_profiles WHERE id = %s", (angela_patient_id,))
        angela_details = cursor.fetchone()
        if angela_details:
            # Get the patient's name from the users_user table
            cursor.execute("SELECT name FROM users_user WHERE id = %s", (angela_details[1],))
            user_name = cursor.fetchone()
            patient_name = user_name[0] if user_name else "N/A"
            
            print(f"\n   Angela's details: ID={angela_details[0]}, User_ID={angela_details[1]}, Nutritionist_ID={angela_details[2]}, Name={patient_name}")
            
            # Check if she's associated with a different nutritionist
            if anderson_id and angela_details[2] != anderson_id:
                cursor.execute("SELECT name, email FROM users_user WHERE id = %s", (angela_details[2],))
                other_nutri = cursor.fetchone()
                if other_nutri:
                    print(f"   Angela is associated with different nutritionist: {other_nutri[0]} ({other_nutri[1]})")
                else:
                    print(f"   Angela's nutritionist_id ({angela_details[2]}) doesn't match any user")
            elif anderson_id:
                print(f"   Angela IS associated with Anderson (ID: {anderson_id})")
    
    # Check if there's a user record for Angela
    print("\n   Looking for Angela in users_user table...")
    cursor.execute("SELECT id, name, email FROM users_user WHERE name LIKE '%Angela%Cristina%'")
    angela_users = cursor.fetchall()
    for user in angela_users:
        print(f"     Found user: ID={user[0]}, Name={user[1]}, Email={user[2]}")
        
        # Check if this user has a patient profile
        cursor.execute("SELECT id, nutritionist_id FROM patient_profiles WHERE user_id = %s", (user[0],))
        profile = cursor.fetchone()
        if profile:
            print(f"       Has patient profile: ID={profile[0]}, Nutritionist_ID={profile[1]}")
        else:
            print(f"       No patient profile found for this user")
    
    conn.close()
    print("\n=== ANALYSIS COMPLETE ===")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()