import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

def run():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        
        # 1. Anderson Carlos Pereira Soares
        cursor.execute("SELECT id, name, email FROM users_user WHERE name LIKE '%Anderson%'")
        users = cursor.fetchall()
        print("Anderson Users:", users)
        
        # 2. Angela Cristina Portes de Sant Ana
        cursor.execute("SELECT id, name, email FROM users_user WHERE name LIKE '%Angela%'")
        users = cursor.fetchall()
        print("Angela Users:", users)
        
        # 3. Elizabeth Pereira De Brito
        cursor.execute("SELECT id, name, email FROM users_user WHERE name LIKE '%Elizabet%' OR name LIKE '%Elisabet%'")
        users = cursor.fetchall()
        print("Elizabeth Users:", users)
        
        print("\n--- Current patient_profiles linkage ---")
        cursor.execute("SELECT id, user_id, nutritionist_id FROM patient_profiles WHERE id IN (14, 19, 22)")
        links = cursor.fetchall()
        for l in links:
            print(f"PatientID: {l[0]} | Linked to UserID: {l[1]} | NutriID: {l[2]}")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

run()
